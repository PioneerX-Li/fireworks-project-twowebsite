class SpiderFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        this.gravity = 0.3;
        this.webLines = [];
        this.webPoints = [];
    }
    
    createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 2 + 4) * this.speed;
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
            isWebPoint: Math.random() < 0.3 // 30%的概率成为蛛网节点
        };
        
        this.particles.push(particle);
        
        if (particle.isWebPoint) {
            this.webPoints.push(particle);
        }
    }
    
    createWebLine(point1, point2) {
        const line = {
            x1: point1.x,
            y1: point1.y,
            x2: point2.x,
            y2: point2.y,
            life: Math.min(point1.life, point2.life),
            maxLife: Math.min(point1.maxLife, point2.maxLife),
            thickness: Math.min(point1.size, point2.size) * 0.5
        };
        
        this.webLines.push(line);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 更新蛛网线条
        this.webLines = [];
        
        // 为每个网点寻找最近的其他网点并连接
        for (let i = 0; i < this.webPoints.length; i++) {
            const point1 = this.webPoints[i];
            
            for (let j = i + 1; j < this.webPoints.length; j++) {
                const point2 = this.webPoints[j];
                
                // 计算两点之间的距离
                const dx = point2.x - point1.x;
                const dy = point2.y - point1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 如果距离在合适范围内，创建蛛网线条
                if (distance < 100) {
                    this.createWebLine(point1, point2);
                }
            }
        }
        
        // 移除死亡的网点
        this.webPoints = this.webPoints.filter(point => point.life > 0);
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        // 渲染蛛网线条
        for (const line of this.webLines) {
            const alpha = line.life / line.maxLife * 0.3;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = line.thickness;
            
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
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
            if (particle.isWebPoint) {
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 4
                );
                
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.globalAlpha = alpha * 0.4;
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
} 