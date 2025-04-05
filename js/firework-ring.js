/**
 * 环状烟花粒子系统
 * 形成多层同心圆环的烟花效果
 */
class RingFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.gravity = 0.2;
        this.rings = [];
        this.ringCount = 3;
        this.particlesPerRing = Math.floor(count / this.ringCount);
    }
    
    createParticle() {
        // 确定这个粒子属于哪个环
        const ringIndex = Math.floor(this.particles.length / this.particlesPerRing);
        const angleInRing = (this.particles.length % this.particlesPerRing) / this.particlesPerRing * Math.PI * 2;
        
        // 根据环的索引计算半径和速度
        const radius = (ringIndex + 1) * 50;
        const speed = (Math.random() * 0.5 + 0.75) * this.speed * (ringIndex + 1);
        
        // 计算粒子的初始位置和速度
        const x = this.origin.x + Math.cos(angleInRing) * radius;
        const y = this.origin.y + Math.sin(angleInRing) * radius;
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            targetX: x,
            targetY: y,
            vx: Math.cos(angleInRing) * speed,
            vy: Math.sin(angleInRing) * speed,
            size: this.baseSize * (1 - ringIndex * 0.2),
            color: this.color,
            life: this.duration * (1 - ringIndex * 0.1),
            maxLife: this.duration * (1 - ringIndex * 0.1),
            ring: ringIndex,
            angle: angleInRing,
            rotationSpeed: (Math.random() * 2 - 1) * Math.PI // 随机旋转速度
        };
        
        this.particles.push(particle);
        
        // 如果这是环中的第一个粒子，创建一个新的环
        if (this.particles.length % this.particlesPerRing === 1) {
            this.createRing(ringIndex, radius);
        }
    }
    
    createRing(index, radius) {
        const ring = {
            radius: radius,
            life: this.duration * (1 - index * 0.1),
            maxLife: this.duration * (1 - index * 0.1),
            rotationAngle: 0,
            rotationSpeed: Math.random() * Math.PI * 0.5 // 环的旋转速度
        };
        
        this.rings.push(ring);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新环的旋转
        for (const ring of this.rings) {
            ring.life -= deltaTime;
            ring.rotationAngle += ring.rotationSpeed * deltaTime;
        }
        
        // 移除死亡的环
        this.rings = this.rings.filter(ring => ring.life > 0);
        
        // 更新粒子的旋转
        for (const particle of this.particles) {
            const ring = this.rings[particle.ring];
            if (ring) {
                // 更新粒子的角度
                particle.angle += particle.rotationSpeed * deltaTime;
                
                // 计算目标位置
                const totalAngle = particle.angle + ring.rotationAngle;
                particle.targetX = this.origin.x + Math.cos(totalAngle) * ring.radius;
                particle.targetY = this.origin.y + Math.sin(totalAngle) * ring.radius;
                
                // 逐渐移动到目标位置
                const dx = particle.targetX - particle.x;
                const dy = particle.targetY - particle.y;
                particle.vx = dx * 2 * deltaTime;
                particle.vy = dy * 2 * deltaTime;
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        // 渲染环
        for (const ring of this.rings) {
            const alpha = ring.life / ring.maxLife * 0.2;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.arc(this.origin.x, this.origin.y, ring.radius, 0, Math.PI * 2);
            this.ctx.stroke();
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
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
} 