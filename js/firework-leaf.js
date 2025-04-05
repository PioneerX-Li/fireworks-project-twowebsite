/**
 * 落叶状烟花粒子系统
 * 模拟像落叶一样缓慢旋转飘落的烟花效果
 */
class LeafFireworkSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
        
        // 落叶状烟花的特殊属性
        this.rotationSpeed = 2; // 旋转速度倍率
        this.airResistance = 0.98; // 空气阻力
        
        // 生成叶子颜色变化
        this.leafColors = this.generateLeafColors(color, 5);
    }
    
    // 生成叶子颜色变化
    generateLeafColors(baseColor, count) {
        const colors = [baseColor];
        
        // 提取RGB组件
        const r = parseInt(baseColor.substring(1, 3), 16);
        const g = parseInt(baseColor.substring(3, 5), 16);
        const b = parseInt(baseColor.substring(5, 7), 16);
        
        // 如果是偏绿色，使用更多绿色变体
        const isGreenish = g > Math.max(r, b);
        
        // 创建颜色变体
        for (let i = 0; i < count; i++) {
            let rVariation, gVariation, bVariation;
            
            if (isGreenish) {
                // 绿色变体 (黄绿到深绿)
                rVariation = Math.min(255, Math.max(0, r + (Math.random() - 0.3) * 60));
                gVariation = Math.min(255, Math.max(0, g + (Math.random() - 0.2) * 40));
                bVariation = Math.min(255, Math.max(0, b + (Math.random() - 0.6) * 30));
            } else {
                // 普通变体
                rVariation = Math.min(255, Math.max(0, r + (Math.random() - 0.5) * 50));
                gVariation = Math.min(255, Math.max(0, g + (Math.random() - 0.5) * 50));
                bVariation = Math.min(255, Math.max(0, b + (Math.random() - 0.5) * 50));
            }
            
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
        // 随机速度
        const velocity = (0.4 + Math.random() * 0.6) * this.speed * 30;
        
        // 随机选择一个颜色
        const color = this.leafColors[Math.floor(Math.random() * this.leafColors.length)];
        
        // 叶子形状参数
        const leafShape = {
            type: Math.floor(Math.random() * 3), // 0-圆形, 1-椭圆, 2-心形
            width: this.baseSize * (0.8 + Math.random() * 0.6),
            height: this.baseSize * (1.0 + Math.random() * 0.8),
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * Math.PI * this.rotationSpeed,
            wobbleFrequency: 1 + Math.random() * 2,
            wobbleAmplitude: Math.random() * 0.2
        };
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size: this.baseSize,
            color: color,
            life: 1.5 + Math.random() * 1.0,
            maxLife: 1.5 + Math.random() * 1.0,
            shape: leafShape,
            // 飘落参数
            oscillationTime: 0,
            oscillationSpeed: 2 + Math.random() * 3
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.lifeTime += deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 更新旋转
            particle.shape.rotation += particle.shape.rotationSpeed * deltaTime;
            
            // 更新摆动参数
            particle.oscillationTime += deltaTime * particle.oscillationSpeed;
            
            // 添加横向摆动 (像叶子一样)
            const wobble = Math.sin(particle.oscillationTime) * 10 * this.speed * deltaTime;
            
            // 更新位置
            particle.x += particle.vx * deltaTime + wobble;
            particle.y += particle.vy * deltaTime;
            
            // 应用阻力 (使叶子逐渐减速)
            particle.vx *= this.airResistance;
            particle.vy *= this.airResistance;
            
            // 应用重力
            if (this.useGravity) {
                particle.vy += 9.8 * deltaTime * this.speed * 0.6; // 减小重力效应
            }
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 如果粒子数量少于预期，且特效持续时间未到，则创建新粒子
        if (this.particles.length < this.effectParticles && this.lifeTime < this.duration) {
            this.createParticle();
        }
    }
    
    render() {
        this.ctx.save();
        
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            // 绘制叶子
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.shape.rotation);
            
            const width = particle.shape.width;
            const height = particle.shape.height;
            
            switch (particle.shape.type) {
                case 0: // 圆形叶
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                
                case 1: // 椭圆叶
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 添加叶脉
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -height/2);
                    this.ctx.lineTo(0, height/2);
                    this.ctx.strokeStyle = this.adjustBrightness(particle.color, -50);
                    this.ctx.lineWidth = width / 10;
                    this.ctx.stroke();
                    break;
                
                case 2: // 心形叶
                    const leafScale = width / 20;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, leafScale * 5);
                    
                    // 左半边
                    this.ctx.bezierCurveTo(
                        -leafScale * 5, leafScale * 0, 
                        -leafScale * 10, -leafScale * 3, 
                        0, -leafScale * 10
                    );
                    
                    // 右半边
                    this.ctx.bezierCurveTo(
                        leafScale * 10, -leafScale * 3, 
                        leafScale * 5, leafScale * 0, 
                        0, leafScale * 5
                    );
                    
                    this.ctx.fill();
                    break;
            }
            
            this.ctx.restore();
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
    
    // 辅助方法：调整颜色亮度
    adjustBrightness(hexColor, percent) {
        // 去掉#号
        const hex = hexColor.replace('#', '');
        
        // 提取 RGB 分量
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        // 调整亮度
        r = Math.max(0, Math.min(255, r + percent));
        g = Math.max(0, Math.min(255, g + percent));
        b = Math.max(0, Math.min(255, b + percent));
        
        // 转换回十六进制
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
} 