class BasicFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.gravity = 0.5;
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
            maxLife: life
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 添加拖尾效果
        for (const particle of this.particles) {
            if (Math.random() < 0.1) {
                const trail = {
                    x: particle.x,
                    y: particle.y,
                    vx: particle.vx * 0.1,
                    vy: particle.vy * 0.1,
                    size: particle.size * 0.5,
                    color: particle.color,
                    life: 0.2,
                    maxLife: 0.2
                };
                this.particles.push(trail);
            }
        }
    }
} 