/**
 * 翔宇状烟花粒子系统
 * 模拟柳状烟花，从中心爆发后向下垂落的流苏效果
 */
class WillowFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.gravity = 0.15;
        this.trails = [];
    }
    
    createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 2 + 3) * this.speed;
        const size = (Math.random() * 0.5 + 0.5) * this.baseSize;
        const life = Math.random() * 0.5 + 1.0;
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2, // 初始向上的速度
            size: size,
            color: this.color,
            life: life,
            maxLife: life,
            trail: []
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新粒子轨迹
        for (const particle of this.particles) {
            // 记录轨迹点
            particle.trail.push({
                x: particle.x,
                y: particle.y,
                life: 0.5,
                maxLife: 0.5
            });
            
            // 限制轨迹长度
            if (particle.trail.length > 10) {
                particle.trail.shift();
            }
            
            // 更新轨迹点生命
            for (let i = particle.trail.length - 1; i >= 0; i--) {
                const point = particle.trail[i];
                point.life -= deltaTime;
                
                if (point.life <= 0) {
                    particle.trail.splice(i, 1);
                }
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            
            // 渲染轨迹
            this.ctx.beginPath();
            this.ctx.strokeStyle = particle.color;
            this.ctx.lineWidth = particle.size;
            
            for (let i = 0; i < particle.trail.length; i++) {
                const point = particle.trail[i];
                const pointAlpha = (point.life / point.maxLife) * alpha * 0.5;
                
                this.ctx.globalAlpha = pointAlpha;
                
                if (i === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            }
            
            if (particle.trail.length > 0) {
                this.ctx.lineTo(particle.x, particle.y);
            }
            
            this.ctx.stroke();
            
            // 渲染粒子
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 渲染光晕
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.globalAlpha = alpha * 0.3;
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
} 