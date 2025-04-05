/**
 * 礼炮状烟花粒子系统
 * 模拟礼炮/旧式炮仗爆炸效果，带有强烈的声光冲击感
 */
class SaluteFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.gravity = 0.4;
        this.shockwaves = [];
        
        // 礼炮烟花的特殊属性
        this.explosionPhase = 0; // 爆炸阶段：0初始爆炸, 1次级爆炸, 2余波
        this.explosionDelay = 0.1; // 次级爆炸延迟
        this.lastExplosionTime = 0;
        this.explosionRadius = 10; // 初始爆炸半径
        this.explosionPoints = []; // 次级爆炸点
        
        // 闪光粒子
        this.flashParticles = [];
        
        // 主爆炸已完成
        this.mainExplosionDone = false;
        
        // 初始爆炸颜色 (通常为白色或明亮的变体)
        this.initialColor = '#ffffff';
        this.afterglowColor = color;
    }
    
    init(count) {
        // 不在初始化时创建粒子，而是在update中触发爆炸
        this.mainExplosionDone = false;
        this.explosionPhase = 0;
        this.lastExplosionTime = 0;
    }
    
    createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 3 + 4) * this.speed;
        const size = (Math.random() * 0.5 + 0.5) * this.baseSize;
        const life = Math.random() * 0.3 + 0.3;
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            color: this.color,
            life: life,
            maxLife: life
        };
        
        this.particles.push(particle);
        
        // 在爆炸中心创建冲击波
        if (this.particles.length === 1) {
            this.createShockwave();
        }
        
        // 根据爆炸阶段创建不同的粒子
        switch (this.explosionPhase) {
            case 0: // 初始爆炸
                this.createInitialExplosion();
                break;
            case 1: // 次级爆炸
                this.createSecondaryExplosion();
                break;
            case 2: // 余波
                this.createAftershockParticle();
                break;
        }
    }
    
    createShockwave() {
        const shockwave = {
            x: this.origin.x,
            y: this.origin.y,
            radius: 0,
            maxRadius: 100,
            life: 0.5,
            maxLife: 0.5,
            speed: this.speed * 100
        };
        
        this.shockwaves.push(shockwave);
    }
    
    // 初始爆炸 - 创建强烈的中心闪光和初始粒子
    createInitialExplosion() {
        // 创建中心闪光
        const flashParticle = {
            x: this.origin.x,
            y: this.origin.y,
            size: this.baseSize * 10, // 大尺寸闪光
            color: '#ffffff', // 白色
            life: 0.2,
            maxLife: 0.2,
            alphaMultiplier: 0.8
        };
        
        this.flashParticles.push(flashParticle);
        
        // 创建大量高速粒子
        const explosionCount = Math.floor(this.effectParticles * 0.3);
        
        for (let i = 0; i < explosionCount; i++) {
            // 随机角度
            const angle = Math.random() * Math.PI * 2;
            
            // 高速度，产生冲击感
            const velocity = (0.8 + Math.random() * 0.4) * this.speed * 70;
            
            // 决定是否为次级爆炸点
            const isSecondaryPoint = Math.random() < 0.1;
            
            const particle = {
                x: this.origin.x,
                y: this.origin.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: this.baseSize * (0.5 + Math.random() * 0.5),
                color: this.initialColor,
                life: 0.3 + Math.random() * 0.3,
                maxLife: 0.3 + Math.random() * 0.3,
                isSecondaryPoint: isSecondaryPoint,
                // 爆炸痕迹
                leavesTrail: Math.random() < 0.5,
                lastTrailTime: 0,
                trailRate: 0.01 + Math.random() * 0.02
            };
            
            this.particles.push(particle);
            
            // 如果是次级爆炸点，记录它
            if (isSecondaryPoint) {
                this.explosionPoints.push({
                    countdown: 0.1 + Math.random() * 0.2, // 爆炸倒计时
                    x: this.origin.x, // 初始位置，会随粒子更新
                    y: this.origin.y,
                    particle: particle,
                    hasExploded: false
                });
            }
        }
        
        // 修改爆炸阶段
        this.explosionPhase = 1;
        this.lastExplosionTime = this.lifeTime;
    }
    
    // 次级爆炸 - 从初始粒子轨迹上产生的额外爆炸
    createSecondaryExplosion() {
        // 检查是否有次级爆炸点准备爆炸
        for (let i = this.explosionPoints.length - 1; i >= 0; i--) {
            const point = this.explosionPoints[i];
            
            // 如果关联粒子已消失或已爆炸，移除该点
            if (point.hasExploded || !this.particles.includes(point.particle)) {
                this.explosionPoints.splice(i, 1);
                continue;
            }
            
            // 更新位置为关联粒子的位置
            point.x = point.particle.x;
            point.y = point.particle.y;
            
            // 更新倒计时
            point.countdown -= 0.016; // 假设16ms的帧时间
            
            // 检查是否应该爆炸
            if (point.countdown <= 0 && !point.hasExploded) {
                this.createSecondaryExplosionAt(point.x, point.y);
                point.hasExploded = true;
                
                // 创建闪光
                const flashParticle = {
                    x: point.x,
                    y: point.y,
                    size: this.baseSize * 5, // 较小的闪光
                    color: '#ffffff', // 白色
                    life: 0.1,
                    maxLife: 0.1,
                    alphaMultiplier: 0.6
                };
                
                this.flashParticles.push(flashParticle);
            }
        }
        
        // 如果所有次级爆炸点都已触发，转为余波阶段
        if (this.explosionPoints.length === 0 && this.lifeTime - this.lastExplosionTime > this.explosionDelay) {
            this.explosionPhase = 2;
            this.mainExplosionDone = true;
        }
    }
    
    // 在指定位置创建次级爆炸
    createSecondaryExplosionAt(x, y) {
        // 创建第二波粒子
        const explosionCount = Math.floor(this.effectParticles * 0.1);
        
        for (let i = 0; i < explosionCount; i++) {
            // 随机角度
            const angle = Math.random() * Math.PI * 2;
            
            // 较低速度
            const velocity = (0.5 + Math.random() * 0.5) * this.speed * 40;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: this.baseSize * (0.3 + Math.random() * 0.3), // 更小的粒子
                color: this.afterglowColor, // 使用烟花的主颜色
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                isSecondaryPoint: false
            };
            
            this.particles.push(particle);
        }
    }
    
    // 余波效果 - 缓慢消散的粒子
    createAftershockParticle() {
        if (Math.random() < 0.2) {
            // 在爆炸区域内随机位置
            const radius = this.explosionRadius * (0.5 + Math.random() * 0.5);
            const angle = Math.random() * Math.PI * 2;
            
            const x = this.origin.x + Math.cos(angle) * radius;
            const y = this.origin.y + Math.sin(angle) * radius;
            
            // 低速度
            const velocity = this.speed * 10 * Math.random();
            const direction = Math.random() * Math.PI * 2;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(direction) * velocity,
                vy: Math.sin(direction) * velocity - 5, // 轻微向上漂移
                size: this.baseSize * (0.2 + Math.random() * 0.3), // 更小的粒子
                color: this.afterglowColor,
                life: 0.3 + Math.random() * 0.5,
                maxLife: 0.3 + Math.random() * 0.5,
                // 闪烁效果
                twinkleSpeed: 5 + Math.random() * 5,
                twinkleOffset: Math.random() * Math.PI * 2
            };
            
            this.particles.push(particle);
        }
    }
    
    // 创建轨迹粒子
    createTrailParticle(x, y, color) {
        const trailParticle = {
            x: x + (Math.random() - 0.5) * 2,
            y: y + (Math.random() - 0.5) * 2,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: this.baseSize * 0.2 * (0.5 + Math.random() * 0.5),
            color: color,
            life: 0.1 + Math.random() * 0.1,
            maxLife: 0.1 + Math.random() * 0.1
        };
        
        this.particles.push(trailParticle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新冲击波
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const wave = this.shockwaves[i];
            wave.life -= deltaTime;
            
            if (wave.life <= 0) {
                this.shockwaves.splice(i, 1);
                continue;
            }
            
            wave.radius += wave.speed * deltaTime;
        }
        
        // 更新爆炸半径 (随时间增长)
        this.explosionRadius += deltaTime * this.speed * 20;
        
        // 更新所有粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 更新位置
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 应用重力
            if (this.useGravity) {
                particle.vy += this.gravity * deltaTime;
            }
            
            // 创建轨迹粒子
            if (particle.leavesTrail) {
                particle.lastTrailTime += deltaTime;
                if (particle.lastTrailTime >= particle.trailRate) {
                    particle.lastTrailTime = 0;
                    this.createTrailParticle(particle.x, particle.y, particle.color);
                }
            }
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 更新闪光粒子
        for (let i = this.flashParticles.length - 1; i >= 0; i--) {
            const flash = this.flashParticles[i];
            
            // 更新生命周期
            flash.life -= deltaTime;
            
            // 移除死亡闪光
            if (flash.life <= 0) {
                this.flashParticles.splice(i, 1);
            }
        }
        
        // 如果主爆炸完成后，持续创建余波粒子
        if (this.mainExplosionDone && this.lifeTime < this.duration) {
            for (let i = 0; i < 2; i++) {
                this.createAftershockParticle();
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        // 渲染冲击波
        for (const wave of this.shockwaves) {
            const alpha = wave.life / wave.maxLife * 0.4;
            const gradient = this.ctx.createRadialGradient(
                wave.x, wave.y, 0,
                wave.x, wave.y, wave.radius
            );
            
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.3, this.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 渲染粒子
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            
            // 渲染主体
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 渲染光晕
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.globalAlpha = alpha * 0.5;
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 绘制闪光粒子
        for (const flash of this.flashParticles) {
            const alpha = (flash.life / flash.maxLife) * flash.alphaMultiplier;
            
            // 创建径向渐变
            const gradient = this.ctx.createRadialGradient(
                flash.x, flash.y, 0,
                flash.x, flash.y, flash.size
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, ' + alpha + ')');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, ' + alpha * 0.5 + ')');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.globalAlpha = 1; // 使用渐变自身的透明度
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(flash.x, flash.y, flash.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
} 