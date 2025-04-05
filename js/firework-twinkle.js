class TwinkleFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.gravity = 0.1;
        this.sparkles = [];
    }
    
    createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 2 + 3) * this.speed;
        const size = (Math.random() * 0.5 + 0.5) * this.baseSize;
        const life = Math.random() * 0.5 + 0.8;
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            color: this.color,
            life: life,
            maxLife: life,
            twinkleSpeed: Math.random() * 10 + 5,
            twinklePhase: Math.random() * Math.PI * 2
        };
        
        this.particles.push(particle);
        
        // 创建闪烁效果
        if (Math.random() < 0.4) {
            this.createSparkle(particle);
        }
    }
    
    createSparkle(particle) {
        const sparkle = {
            x: particle.x,
            y: particle.y,
            size: particle.size * 2,
            color: this.color,
            life: particle.life * 0.5,
            maxLife: particle.life * 0.5,
            alpha: 0,
            fadeSpeed: Math.random() * 5 + 5
        };
        
        this.sparkles.push(sparkle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新闪烁效果
        const time = performance.now() / 1000;
        
        for (const particle of this.particles) {
            particle.twinklePhase += particle.twinkleSpeed * deltaTime;
            
            if (Math.random() < deltaTime * 2) {
                this.createSparkle(particle);
            }
        }
        
        // 更新闪光
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const sparkle = this.sparkles[i];
            sparkle.life -= deltaTime;
            
            if (sparkle.life <= 0) {
                this.sparkles.splice(i, 1);
                continue;
            }
            
            // 更新闪光的alpha值
            sparkle.alpha = Math.sin(time * sparkle.fadeSpeed) * 0.5 + 0.5;
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        // 渲染闪光
        for (const sparkle of this.sparkles) {
            const baseAlpha = sparkle.life / sparkle.maxLife;
            this.ctx.globalAlpha = baseAlpha * sparkle.alpha;
            
            // 渲染闪光的光晕
            const gradient = this.ctx.createRadialGradient(
                sparkle.x, sparkle.y, 0,
                sparkle.x, sparkle.y, sparkle.size
            );
            
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 渲染粒子
        for (const particle of this.particles) {
            const baseAlpha = particle.life / particle.maxLife;
            const twinkle = Math.sin(particle.twinklePhase) * 0.5 + 0.5;
            this.ctx.globalAlpha = baseAlpha * twinkle;
            
            // 渲染主体
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
            
            this.ctx.globalAlpha = baseAlpha * twinkle * 0.5;
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
}