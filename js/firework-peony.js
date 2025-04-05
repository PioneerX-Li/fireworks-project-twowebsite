/**
 * 花团状烟花粒子系统
 * 形成圆形花朵状的爆炸效果，粒子从中心向外扩散形成圆形
 */
class PeonyFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.trailEffect = true;
        
        // 花团烟花的特殊属性
        this.trailLength = 4;  // 拖尾长度
        this.particleColors = this.generateColorVariations(color, 3);
    }
    
    // 生成颜色变体
    generateColorVariations(baseColor, count) {
        const colors = [baseColor];
        
        // 提取RGB组件
        const r = parseInt(baseColor.substring(1, 3), 16);
        const g = parseInt(baseColor.substring(3, 5), 16);
        const b = parseInt(baseColor.substring(5, 7), 16);
        
        // 创建轻微变化的颜色
        for (let i = 0; i < count; i++) {
            // 随机微调RGB值
            const rVariation = Math.min(255, Math.max(0, r + (Math.random() - 0.5) * 50));
            const gVariation = Math.min(255, Math.max(0, g + (Math.random() - 0.5) * 50));
            const bVariation = Math.min(255, Math.max(0, b + (Math.random() - 0.5) * 50));
            
            // 转换回十六进制
            const newColor = '#' + 
                Math.round(rVariation).toString(16).padStart(2, '0') +
                Math.round(gVariation).toString(16).padStart(2, '0') +
                Math.round(bVariation).toString(16).padStart(2, '0');
            
            colors.push(newColor);
        }
        
        return colors;
    }
    
    createParticle() {
        // 随机角度
        const angle = Math.random() * Math.PI * 2;
        
        // 速度，有一些固定的可变范围，使爆炸形成花朵层次感
        const velocityTiers = [
            0.6 + Math.random() * 0.2,  // 内层
            0.8 + Math.random() * 0.2,  // 中层
            1.0 + Math.random() * 0.2   // 外层
        ];
        
        const velocityMultiplier = velocityTiers[Math.floor(Math.random() * velocityTiers.length)];
        const velocity = velocityMultiplier * this.speed * 30;
        
        // 随机选择一个颜色变体
        const color = this.particleColors[Math.floor(Math.random() * this.particleColors.length)];
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size: this.baseSize * (0.5 + Math.random() * 0.5),
            color: color,
            life: 0.7 + Math.random() * 0.5,
            maxLife: 0.7 + Math.random() * 0.5,
            trail: [],  // 粒子轨迹
            trailLength: this.trailLength + Math.floor(Math.random() * 3)
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新粒子轨迹
        if (this.trailEffect) {
            for (const particle of this.particles) {
                // 记录当前位置
                particle.trail.unshift({ x: particle.x, y: particle.y });
                
                // 限制轨迹长度
                if (particle.trail.length > particle.trailLength) {
                    particle.trail.pop();
                }
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            const size = particle.size * alpha; // 粒子变小
            
            // 绘制轨迹
            if (this.trailEffect && particle.trail.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                
                for (let i = 0; i < particle.trail.length; i++) {
                    const point = particle.trail[i];
                    this.ctx.lineTo(point.x, point.y);
                    
                    // 轨迹透明度递减
                    const trailAlpha = alpha * (1 - i / particle.trail.length);
                    
                    // 每段轨迹使用不同粗细
                    this.ctx.lineWidth = size * (1 - i / particle.trail.length);
                    this.ctx.strokeStyle = particle.color.replace('rgb', 'rgba').replace(')', `,${trailAlpha})`);
                    this.ctx.stroke();
                    this.ctx.beginPath();
                    this.ctx.moveTo(point.x, point.y);
                }
            }
            
            // 绘制粒子
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
} 