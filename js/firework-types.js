/**
 * 烟花特效类型汇总文件
 * 用于集中管理所有烟花子类型，便于在主界面中引用
 */

// 烟花子类型ID常量
const FIREWORK_TYPES = {
    // 基本烟花
    BASIC: 'firework',
    
    // 花团状烟花
    PEONY: 'firework-peony',
    
    // 翔宇状烟花
    WILLOW: 'firework-willow',
    
    // 烈焰绘花烟花
    FLAME_BLOSSOM: 'firework-flame',
    
    // 落叶状烟花
    LEAF: 'firework-leaf',
    
    // 环状烟花
    RING: 'firework-ring',
    
    // 罗马焰火筒烟花
    ROMAN_CANDLE: 'firework-roman-candle',
    
    // 礼炮状烟花
    SALUTE: 'firework-salute',
    
    // 蜘蛛状烟花
    SPIDER: 'firework-spider',
    
    // 闪烁状烟花
    TWINKLE: 'firework-twinkle'
};

// 烟花子类型名称和描述
const FIREWORK_INFO = {
    [FIREWORK_TYPES.BASIC]: {
        name: '基础烟花',
        description: '简单的爆炸效果，粒子均匀向外扩散'
    },
    [FIREWORK_TYPES.PEONY]: {
        name: '花团烟花',
        description: '形成圆形花朵状的爆炸效果，粒子从中心向外扩散'
    },
    [FIREWORK_TYPES.WILLOW]: {
        name: '翔宇烟花',
        description: '柳条状烟花，从中心爆发后向下垂落的流苏效果'
    },
    [FIREWORK_TYPES.FLAME_BLOSSOM]: {
        name: '烈焰绘花',
        description: '带有火焰效果的烟花，火花从中心爆发并留下火焰痕迹'
    },
    [FIREWORK_TYPES.LEAF]: {
        name: '落叶烟花',
        description: '像落叶一样缓慢旋转飘落的烟花效果'
    },
    [FIREWORK_TYPES.RING]: {
        name: '环状烟花',
        description: '形成多层同心圆环的烟花效果'
    },
    [FIREWORK_TYPES.ROMAN_CANDLE]: {
        name: '罗马焰火筒',
        description: '模拟罗马蜡烛的多段连续垂直发射烟花效果'
    },
    [FIREWORK_TYPES.SALUTE]: {
        name: '礼炮烟花',
        description: '模拟礼炮爆炸效果，带有强烈的声光冲击感'
    },
    [FIREWORK_TYPES.SPIDER]: {
        name: '蜘蛛烟花',
        description: '像蜘蛛网一样扩散后下垂的烟花效果'
    },
    [FIREWORK_TYPES.TWINKLE]: {
        name: '闪烁烟花',
        description: '以不同频率闪烁的星点效果的烟花'
    }
};

// 基础粒子系统类
class ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        this.ctx = ctx;
        this.origin = { x, y };
        this.effectParticles = count;
        this.particles = [];
        this.color = color;
        this.baseSize = size;
        this.speed = speed;
        this.duration = duration;
        this.lifeTime = 0;
        this.useGravity = false;
        this.gravity = 0.8;
        this.initialBurst = true;
        this.trailEffect = false;
    }
    
    createParticle() {
        // 由子类实现
    }
    
    update(deltaTime) {
        this.lifeTime += deltaTime;
        
        // 移除超出生命周期的粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新粒子
            particle.life -= deltaTime;
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 应用重力
            if (this.useGravity) {
                particle.vy += (9.8 * this.gravity) * deltaTime * this.speed;
            }
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 如果粒子数量少于预期，且特效持续时间未到，则创建新粒子
        if (this.particles.length < this.effectParticles && this.lifeTime < this.duration && this.initialBurst) {
            for (let i = 0; i < 3; i++) {
                this.createParticle();
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }
    
    isComplete() {
        return this.particles.length === 0 || (this.lifeTime > this.duration);
    }
}

/**
 * 创建烟花特效系统工厂函数
 * @param {string} type 烟花类型
 * @param {Object} ctx Canvas 2D上下文
 * @param {number} x X坐标
 * @param {number} y Y坐标
 * @param {number} particles 粒子数量
 * @param {string} color 颜色
 * @param {number} size 大小
 * @param {number} speed 速度
 * @param {number} duration 持续时间
 * @returns {Object} 烟花粒子系统实例
 */
function createFireworkSystem(type, ctx, x, y, particles, color, size, speed, duration) {
    console.log('创建烟花系统:', type);
    
    switch(type) {
        case FIREWORK_TYPES.BASIC:
            console.log('创建基础烟花');
            return new FireworkParticleSystem(ctx, x, y, particles, color, size, speed, duration);
            
        case FIREWORK_TYPES.PEONY:
            console.log('创建牡丹花型烟花');
            if (typeof PeonyFireworkSystem !== 'undefined') {
                return new PeonyFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.WILLOW:
            console.log('创建柳树型烟花');
            if (typeof WillowFireworkSystem !== 'undefined') {
                return new WillowFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.FLAME_BLOSSOM:
            console.log('创建烈焰绘花烟花');
            if (typeof FlameBlossomFireworkSystem !== 'undefined') {
                return new FlameBlossomFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.LEAF:
            console.log('创建叶状烟花');
            if (typeof LeafFireworkSystem !== 'undefined') {
                return new LeafFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.RING:
            console.log('创建环形烟花');
            if (typeof RingFireworkSystem !== 'undefined') {
                return new RingFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.ROMAN_CANDLE:
            console.log('创建罗马焰火筒烟花');
            if (typeof RomanCandleFireworkSystem !== 'undefined') {
                return new RomanCandleFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.SALUTE:
            console.log('创建礼炮烟花');
            if (typeof SaluteFireworkSystem !== 'undefined') {
                return new SaluteFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.SPIDER:
            console.log('创建蜘蛛型烟花');
            if (typeof SpiderFireworkSystem !== 'undefined') {
                return new SpiderFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        case FIREWORK_TYPES.TWINKLE:
            console.log('创建闪烁烟花');
            if (typeof TwinkleFireworkSystem !== 'undefined') {
                return new TwinkleFireworkSystem(ctx, x, y, particles, color, size, speed, duration);
            }
            break;
            
        default:
            console.warn('未知的特效类型:', type);
            return new FireworkParticleSystem(ctx, x, y, particles, color, size, speed, duration);
    }
    
    // 如果特殊类型未找到，使用基础烟花作为后备
    console.warn('无法创建特殊烟花类型', type, '，使用基础烟花替代');
    return new FireworkParticleSystem(ctx, x, y, particles, color, size, speed, duration);
}

/**
 * 基础烟花粒子系统类
 */
class FireworkParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, particleCount, color, size, speed, duration) {
        super(ctx, x, y, particleCount, color, size, speed, duration);
        this.useGravity = true;
        
        this.createParticles(particleCount);
    }
    
    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const angle = Math.random() * Math.PI * 2; // 随机角度
        const velocity = (Math.random() * 0.5 + 0.5) * this.speed; // 随机速度
        
        this.particles.push({
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            radius: Math.random() * this.baseSize + 1,
            color: this.color,
            alpha: 1,
            life: 1.0,
            maxLife: 1.0
        });
    }
} 