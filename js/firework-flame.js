/**
 * 烈焰绘花烟花粒子系统
 * 模拟带有火焰效果的烟花，火花从中心爆发并留下火焰痕迹
 */
class FlameBlossomFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.gravity = 0.3;
        this.flameTrails = [];
        
        // 火焰特效的特殊属性
        this.flameParticles = [];
        this.flameCount = Math.floor(count / 2); // 火焰粒子数量
        
        // 火焰颜色 (热度渐变)
        this.flameColors = [
            '#ffffff', // 白色 (最热)
            '#ffdd00', // 黄色
            '#ff9500', // 橙色
            '#ff5500', // 橙红
            '#ff0000'  // 红色 (较冷)
        ];
        
        // 在原始颜色基础上生成更多火焰颜色
        this.initializeFlameColors(color);
    }
    
    initializeFlameColors(baseColor) {
        // 提取基础颜色的RGB
        const r = parseInt(baseColor.substring(1, 3), 16);
        const g = parseInt(baseColor.substring(3, 5), 16);
        const b = parseInt(baseColor.substring(5, 7), 16);
        
        // 添加基本颜色到火焰色谱
        this.flameColors.push(baseColor);
        
        // 添加一个较亮变体
        const brighterColor = `#${Math.min(255, r + 40).toString(16).padStart(2, '0')}${
            Math.min(255, g + 40).toString(16).padStart(2, '0')}${
            Math.min(255, b + 40).toString(16).padStart(2, '0')}`;
        
        this.flameColors.push(brighterColor);
    }
    
    createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 2 + 3) * this.speed;
        const size = (Math.random() * 0.5 + 0.5) * this.baseSize;
        const life = Math.random() * 0.5 + 0.5;
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            color: this.color,
            life: life,
            maxLife: life,
            hasFlame: Math.random() < 0.3
        };
        
        this.particles.push(particle);
    }
    
    // 创建火焰粒子 (跟随主粒子轨迹)
    createFlameParticle(x, y, parentColor) {
        // 火焰粒子在主粒子周围随机位置
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.baseSize * 2;
        
        // 选择稍微不同的颜色
        const colorIndex = Math.floor(Math.random() * this.flameColors.length);
        const color = this.flameColors[colorIndex];
        
        // 火焰粒子有较短寿命
        const flameParticle = {
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5 - 10 * Math.random() * this.speed, // 向上飘
            size: this.baseSize * 0.3 * (0.5 + Math.random() * 0.7),
            color: color,
            life: 0.2 + Math.random() * 0.3,
            maxLife: 0.2 + Math.random() * 0.3,
            // 火焰粒子会缓慢变大
            growRate: 1.01 + Math.random() * 0.03
        };
        
        this.flameParticles.push(flameParticle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新火焰轨迹
        for (let i = this.flameTrails.length - 1; i >= 0; i--) {
            const flame = this.flameTrails[i];
            flame.life -= deltaTime;
            
            if (flame.life <= 0) {
                this.flameTrails.splice(i, 1);
                continue;
            }
            
            flame.x += flame.vx * deltaTime;
            flame.y += flame.vy * deltaTime;
            flame.vy += this.gravity * deltaTime;
            flame.size *= 0.95;
        }
        
        // 为部分粒子添加火焰轨迹
        for (const particle of this.particles) {
            if (particle.hasFlame && Math.random() < 0.3) {
                const flame = {
                    x: particle.x,
                    y: particle.y,
                    vx: particle.vx * 0.2,
                    vy: particle.vy * 0.2,
                    size: particle.size * 1.5,
                    color: '#ff3300',
                    life: 0.3,
                    maxLife: 0.3
                };
                this.flameTrails.push(flame);
            }
        }
        
        // 更新火焰粒子
        for (let i = this.flameParticles.length - 1; i >= 0; i--) {
            const flame = this.flameParticles[i];
            
            // 更新生命周期
            flame.life -= deltaTime;
            
            // 更新位置
            flame.x += flame.vx * deltaTime;
            flame.y += flame.vy * deltaTime;
            
            // 火焰逐渐变大
            flame.size *= flame.growRate;
            
            // 火焰向上飘动
            flame.vy -= 5 * deltaTime;
            
            // 火焰水平速度减慢
            flame.vx *= 0.95;
            
            // 移除死亡火焰粒子
            if (flame.life <= 0) {
                this.flameParticles.splice(i, 1);
            }
        }
        
        // 创建新粒子
        if (this.particles.length < this.effectParticles && this.lifeTime < this.duration) {
            this.createParticle();
        }
    }
    
    render() {
        super.render();
        
        // 渲染火焰轨迹
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const flame of this.flameTrails) {
            const alpha = flame.life / flame.maxLife * 0.6;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = flame.color;
            this.ctx.beginPath();
            this.ctx.arc(flame.x, flame.y, flame.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
    
    isComplete() {
        return (this.particles.length === 0 && this.flameParticles.length === 0 && this.lifeTime >= this.duration) || this.lifeTime >= this.duration * 1.5;
    }
} 