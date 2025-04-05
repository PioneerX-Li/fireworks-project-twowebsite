/**
 * 罗马焰火筒烟花粒子系统
 * 模拟罗马蜡烛/焰火筒的多段连续垂直发射烟花效果
 */
class RomanCandleFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        
        // 罗马焰火筒的特殊属性
        this.launchCount = 5 + Math.floor(Math.random() * 5); // 发射次数
        this.launchDelay = 0.3; // 发射间隔
        this.lastLaunchTime = 0;
        this.currentLaunch = 0;
        this.particlesPerLaunch = Math.floor(count / this.launchCount);
        
        // 发射点位置 (屏幕底部居中)
        this.launchPoint = {
            x: x,
            y: ctx.canvas.height - 50
        };
        
        // 轨迹粒子
        this.trailParticles = [];
        
        // 颜色变化 (每次发射不同颜色)
        this.launchColors = this.generateLaunchColors(color, this.launchCount);
    }
    
    // 为每次发射生成不同的颜色
    generateLaunchColors(baseColor, count) {
        const colors = [baseColor];
        
        // 提取RGB组件
        const r = parseInt(baseColor.substring(1, 3), 16);
        const g = parseInt(baseColor.substring(3, 5), 16);
        const b = parseInt(baseColor.substring(5, 7), 16);
        
        // 为每次发射创建颜色变体
        for (let i = 1; i < count; i++) {
            const hueShift = (i / count) * 360; // 色相偏移
            
            // 应用色相旋转算法
            const hsv = this.rgbToHsv(r, g, b);
            hsv.h = (hsv.h + hueShift) % 360;
            const rgb = this.hsvToRgb(hsv.h, hsv.s, hsv.v);
            
            // 转换回十六进制
            const newColor = '#' + 
                Math.round(rgb.r).toString(16).padStart(2, '0') +
                Math.round(rgb.g).toString(16).padStart(2, '0') +
                Math.round(rgb.b).toString(16).padStart(2, '0');
            
            colors.push(newColor);
        }
        
        return colors;
    }
    
    // RGB转HSV辅助函数
    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        let h, s, v;
        
        if (delta === 0) {
            h = 0;
        } else if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        s = max === 0 ? 0 : delta / max;
        v = max;
        
        return { h, s, v };
    }
    
    // HSV转RGB辅助函数
    hsvToRgb(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    init(count) {
        // 初始时不创建粒子，而是等待发射
    }
    
    createParticle() {
        // 检查是否应该发射
        if (this.lifeTime - this.lastLaunchTime >= this.launchDelay) {
            if (this.currentLaunch < this.launchCount) {
                this.launchFirework();
                this.lastLaunchTime = this.lifeTime;
                this.currentLaunch++;
            }
        }
    }
    
    // 发射焰火
    launchFirework() {
        // 当前发射颜色
        const currentColor = this.launchColors[this.currentLaunch % this.launchColors.length];
        
        // 计算目标位置 (随机化爆炸高度)
        const targetY = 50 + Math.random() * (this.ctx.canvas.height * 0.4);
        
        // 添加主发射粒子
        const launchParticle = {
            x: this.launchPoint.x,
            y: this.launchPoint.y,
            targetX: this.launchPoint.x + (Math.random() - 0.5) * 100, // 轻微水平偏移
            targetY: targetY,
            vx: 0,
            vy: -this.speed * 100, // 向上发射速度
            size: this.baseSize * 1.2,
            color: currentColor,
            life: 1.0,
            maxLife: 1.0,
            // 发射特性
            isLaunching: true,
            hasExploded: false,
            particleColor: currentColor
        };
        
        this.particles.push(launchParticle);
    }
    
    // 创建爆炸粒子
    createExplosionParticles(x, y, color) {
        // 爆炸粒子数量
        const explosionCount = this.particlesPerLaunch;
        
        for (let i = 0; i < explosionCount; i++) {
            // 随机角度
            const angle = Math.random() * Math.PI * 2;
            
            // 随机速度 (不同粒子速度不同以产生层次感)
            const velocity = (0.5 + Math.random() * 0.5) * this.speed * 40;
            
            // 爆炸粒子
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: this.baseSize * (0.3 + Math.random() * 0.7),
                color: color,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                isLaunching: false,
                hasExploded: true
            };
            
            this.particles.push(particle);
        }
    }
    
    // 创建轨迹粒子
    createTrailParticle(x, y, color) {
        const trailParticle = {
            x: x + (Math.random() - 0.5) * 3,
            y: y + (Math.random() - 0.5) * 3,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5 + 10, // 轻微向下漂移
            size: this.baseSize * 0.3 * (0.5 + Math.random() * 0.5),
            color: color,
            life: 0.2 + Math.random() * 0.2,
            maxLife: 0.2 + Math.random() * 0.2
        };
        
        this.trailParticles.push(trailParticle);
    }
    
    update(deltaTime) {
        this.lifeTime += deltaTime;
        
        // 创建新的发射
        if (this.currentLaunch < this.launchCount && this.lifeTime < this.duration) {
            this.createParticle();
        }
        
        // 更新发射和爆炸粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            if (particle.isLaunching) {
                // 发射阶段
                
                // 移动向目标位置
                particle.y += particle.vy * deltaTime;
                
                // 添加轨迹粒子
                if (Math.random() < 0.3) {
                    this.createTrailParticle(particle.x, particle.y, particle.color);
                }
                
                // 检查是否到达爆炸位置
                if (particle.y <= particle.targetY) {
                    // 触发爆炸
                    this.createExplosionParticles(particle.x, particle.y, particle.particleColor);
                    particle.hasExploded = true;
                    particle.life = 0; // 移除发射粒子
                }
            } else {
                // 爆炸阶段
                
                // 更新位置
                particle.x += particle.vx * deltaTime;
                particle.y += particle.vy * deltaTime;
                
                // 应用重力
                if (this.useGravity) {
                    particle.vy += 9.8 * deltaTime * this.speed;
                }
            }
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 更新轨迹粒子
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const trail = this.trailParticles[i];
            
            // 更新生命周期
            trail.life -= deltaTime;
            
            // 更新位置
            trail.x += trail.vx * deltaTime;
            trail.y += trail.vy * deltaTime;
            
            // 移除死亡轨迹粒子
            if (trail.life <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        // 绘制轨迹粒子
        for (const trail of this.trailParticles) {
            const alpha = trail.life / trail.maxLife * 0.6;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = trail.color;
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 绘制主粒子
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            const size = particle.size * (particle.isLaunching ? 1 : alpha); // 爆炸粒子会缩小
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            // 如果是发射粒子，添加亮光
            if (particle.isLaunching) {
                // 绘制亮度渐变
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, size * 2
                );
                
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, particle.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // 爆炸粒子
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
    
    isComplete() {
        return (this.particles.length === 0 && this.trailParticles.length === 0 && this.currentLaunch >= this.launchCount) || this.lifeTime >= this.duration * 1.2;
    }
} 