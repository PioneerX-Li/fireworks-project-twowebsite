/**
 * 烟花特效库 - 粒子系统实现
 */

// 基础Effect类定义 - 用于在容器中创建并管理粒子系统
class Effect {
    constructor(container, options = {}) {
        console.log("创建特效，容器:", container);
        
        if (!container) {
            console.error("Error: 容器为空!");
            return;
        }
        
        this.container = container;
        this.options = options;
        
        // 动态创建的画布
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布尺寸
        this.canvas.width = container.clientWidth || 800;
        this.canvas.height = container.clientHeight || 600;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '10';
        
        console.log("创建画布:", this.canvas.width, "x", this.canvas.height);
        
        // 移除现有的额外画布
        const existingCanvases = container.querySelectorAll('canvas:not(#effectCanvas)');
        existingCanvases.forEach(canvas => canvas.remove());
        
        // 添加到容器
        container.appendChild(this.canvas);
        
        // 创建粒子系统
        this.createParticleSystem();
        
        // 控制器实例
        this.controller = window.effectsController;
        if (this.controller) {
            // 添加到控制器的粒子系统列表中
            this.controller.particleSystems.push(this.particleSystem);
            console.log("已将粒子系统添加到控制器列表");
        } else {
            console.error("未找到effectsController实例");
        }
    }
    
    // 创建粒子系统 (由子类实现)
    createParticleSystem() {
        console.error("子类必须实现createParticleSystem方法");
    }
}

// 喷泉特效
class FountainEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height;
        
        // 获取用户选择的颜色或使用默认颜色
        const color = this.options.color || 
                      (window.effectsController?.effectColor) || 
                      "#ff5500";
        
        console.log("创建喷泉粒子系统:", {
            centerX, 
            centerY, 
            count: this.options.count || 50,
            color: color,
            size: this.options.size || 5,
            speed: this.options.speed || 5,
            duration: this.options.duration || 3
        });
        
        this.particleSystem = new FountainParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            color,
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 流星特效
class MeteorEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 3;
        
        this.particleSystem = new MeteorParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#5588ff",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 闪光特效
class SparkleEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particleSystem = new SparkleParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ffff00",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 螺旋特效
class SpiralEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particleSystem = new SpiralParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ff00ff",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 心形特效
class HeartEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particleSystem = new HeartParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ff0066",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 彩带特效
class ConfettiEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 3;
        
        this.particleSystem = new ConfettiParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ff5500",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 星光特效
class StarsEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particleSystem = new StarsParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ffffff",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 气泡特效
class BubblesEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height;
        
        this.particleSystem = new BubblesParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#00ffff",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 火焰特效
class FlameEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height - 20;
        
        this.particleSystem = new FlameParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ff5500",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 雪花特效
class SnowEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = 0;
        
        this.particleSystem = new SnowParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ffffff",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

// 闪粉特效
class GlitterEffect extends Effect {
    createParticleSystem() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particleSystem = new GlitterParticleSystem(
            this.ctx,
            centerX,
            centerY,
            this.options.count || 50,
            this.options.color || "#ffff00",
            this.options.size || 5,
            this.options.speed || 5,
            this.options.duration || 3
        );
    }
}

/**
 * 主控制器
 */
class EffectsController {
    constructor() {
        // 初始化画布
        this.canvas = document.getElementById('effectCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // 粒子特效系统
        this.particleSystems = [];
        this.isPlaying = false;
        
        // 当前参数
        this.effectType = 'firework';
        this.effectColor = '#ff5500';
        this.effectSize = 5;
        this.effectParticles = 50;
        this.effectSpeed = 5;
        this.effectDuration = 2.0;
        
        // 将控制器实例保存到window对象，方便其他地方访问
        window.effectsController = this;
        
        // 绑定UI事件
        this.bindEvents();
        
        // 渲染循环
        this.lastTime = 0;
        requestAnimationFrame(this.animate.bind(this));
    }
    
    // 调整画布大小
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    // 绑定事件
    bindEvents() {
        // 调整窗口大小时重设画布
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 播放按钮
        const playButton = document.getElementById('playEffect');
        if (playButton) {
            playButton.addEventListener('click', () => this.playEffect());
        }
        
        // 保存按钮
        const saveButton = document.getElementById('saveEffect');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveEffect());
        }
        
        // 展开烟花子类型按钮
        const expandFireworksButton = document.getElementById('expandFireworks');
        if (expandFireworksButton) {
            expandFireworksButton.addEventListener('click', () => this.toggleFireworkSubtypes());
        }
        
        // 初始隐藏所有烟花子类型
        this.hideFireworkSubtypes();
        
        // 特效类型选择
        const typeSelector = document.getElementById('effectType');
        if (typeSelector) {
            typeSelector.addEventListener('change', (e) => {
                this.effectType = e.target.value;
            });
        }
        
        // 颜色选择
        const colorPicker = document.getElementById('effectColor');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.effectColor = e.target.value;
            });
        }
        
        // 大小滑块
        const sizeSlider = document.getElementById('effectSize');
        const sizeValue = document.getElementById('sizeValue');
        if (sizeSlider && sizeValue) {
            sizeSlider.addEventListener('input', (e) => {
                this.effectSize = parseInt(e.target.value);
                sizeValue.textContent = this.effectSize;
            });
        }
        
        // 粒子数量滑块
        const particlesSlider = document.getElementById('effectParticles');
        const particlesValue = document.getElementById('particlesValue');
        if (particlesSlider && particlesValue) {
            particlesSlider.addEventListener('input', (e) => {
                this.effectParticles = parseInt(e.target.value);
                particlesValue.textContent = this.effectParticles;
            });
        }
        
        // 速度滑块
        const speedSlider = document.getElementById('effectSpeed');
        const speedValue = document.getElementById('speedValue');
        if (speedSlider && speedValue) {
            speedSlider.addEventListener('input', (e) => {
                this.effectSpeed = parseInt(e.target.value);
                speedValue.textContent = this.effectSpeed;
            });
        }
        
        // 持续时间滑块
        const durationSlider = document.getElementById('effectDuration');
        const durationValue = document.getElementById('durationValue');
        if (durationSlider && durationValue) {
            durationSlider.addEventListener('input', (e) => {
                this.effectDuration = parseFloat(e.target.value);
                durationValue.textContent = this.effectDuration.toFixed(1);
            });
        }
        
        // 效果库预览按钮
        const previewButtons = document.querySelectorAll('.effect-actions button[data-effect]');
        previewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const effectType = e.target.getAttribute('data-effect');
                if (effectType) {
                    document.getElementById('effectType').value = effectType;
                    this.effectType = effectType;
                    this.playEffect();
                }
            });
        });
        
        // 添加调试信息
        console.log('已绑定', previewButtons.length, '个预览按钮');
        // 打印所有按钮的data-effect值
        previewButtons.forEach(button => {
            console.log('按钮绑定:', button.getAttribute('data-effect'));
        });
        
        // 添加测试按钮事件
        const testAllButton = document.getElementById('testAllEffects');
        if (testAllButton) {
            testAllButton.addEventListener('click', () => this.testAllEffects());
        }
        
        const fixButtonsButton = document.getElementById('fixPreviewButtons');
        if (fixButtonsButton) {
            fixButtonsButton.addEventListener('click', () => this.fixPreviewButtons());
        }
    }
    
    // 播放效果
    playEffect(effect) {
        // 如果没有提供effect参数，使用当前选中的效果类型
        if (!effect) {
            effect = this.effectType;
        }
        
        console.log("开始播放效果:", effect);
        console.trace(); // 添加调用堆栈跟踪
        
        // 使用canvas-container替代preview-area
        let container = document.querySelector('.canvas-container');
        if (!container) {
            console.error("找不到画布容器元素，检查CSS选择器'.canvas-container'");
            alert("错误：无法找到画布容器元素");
            return;
        }
        
        console.log("容器信息:", {
            width: container.clientWidth,
            height: container.clientHeight,
            children: container.children.length,
            hasCanvas: !!container.querySelector('canvas'),
            mainCanvas: document.getElementById('effectCanvas') ? '找到' : '未找到'
        });
        
        // 确保参数有效
        const size = this.effectSize || 5; 
        const count = this.effectParticles || 50;
        const speed = this.effectSpeed || 5;
        const duration = this.effectDuration || 2.0;
        
        console.log("使用参数:", {size, count, speed, duration, effectType: effect});
        
        // 添加HTML按钮data-effect值到JS类型的映射
        const effectMapping = {
            'firework': 'firework-basic',
            'firework-flame': 'firework-flame',
            'firework-roman': 'firework-roman-candle'
        };
        
        // 如果存在映射，使用映射后的类型
        const mappedEffect = effectMapping[effect] || effect;
        console.log("映射后的效果类型:", mappedEffect);
        
        try {
            // 根据效果类型创建对应的效果
            switch(mappedEffect) {
                case 'sparkle':
                    new SparkleEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'fountain':
                    new FountainEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'meteor':
                    new MeteorEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'spiral':
                    new SpiralEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'heart':
                    new HeartEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'confetti':
                    new ConfettiEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'stars':
                    new StarsEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'bubbles':
                    new BubblesEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'flame':
                    new FlameEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'snow':
                    new SnowEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'glitter':
                    new GlitterEffect(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-basic':
                    new BasicFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-peony':
                    new PeonyFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-willow':
                    new WillowFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-flame':
                    new FlameBlossomFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-leaf':
                    new LeafFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-ring':
                    new RingFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-roman':
                    new RomanCandleFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-salute':
                    new SaluteFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-spider':
                    new SpiderFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                case 'firework-twinkle':
                    new TwinkleFireworkSystem(container, {
                        size: size,
                        count: count,
                        speed: speed,
                        duration: duration
                    });
                    break;
                default:
                    console.error("Unknown effect type:", mappedEffect);
            }
        } catch (error) {
            console.error(`播放效果时出错: ${error.message}`);
        }
    }
    
    // 保存效果
    saveEffect() {
        const effectData = {
            type: this.effectType,
            color: this.effectColor,
            size: this.effectSize,
            particles: this.effectParticles,
            speed: this.effectSpeed,
            duration: this.effectDuration
        };
        
        // 在实际应用中，这里可以将效果保存到本地存储或发送到服务器
        console.log('保存效果:', effectData);
        alert('效果已保存！');
    }
    
    // 动画循环
    animate(timestamp) {
        // 计算帧时间差
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        try {
            // 更新并渲染所有粒子系统
            for (let i = this.particleSystems.length - 1; i >= 0; i--) {
                const system = this.particleSystems[i];
                system.update(deltaTime);
                system.render();
                
                // 移除完成的系统
                if (system.isComplete()) {
                    console.log(`特效系统完成，移除系统`);
                    this.particleSystems.splice(i, 1);
                }
            }
        } catch (error) {
            console.error(`动画更新错误: ${error.message}`);
        }
        
        // 继续动画循环
        requestAnimationFrame(this.animate.bind(this));
    }

    // 测试所有特效
    testAllEffects() {
        console.log('开始测试所有特效...');
        const effectTypes = [
            'firework',
            'firework-peony',
            'firework-willow',
            'firework-flame',
            'firework-leaf',
            'firework-ring',
            'firework-roman',
            'firework-salute',
            'firework-spider',
            'firework-twinkle',
            'sparkle', 'fountain', 'meteor', 
            'spiral', 'heart', 'confetti', 'stars', 
            'bubbles', 'flame', 'snow', 'glitter'
        ];
        
        // 清除现有特效
        this.particleSystems = [];
        
        // 逐一测试
        let delay = 0;
        effectTypes.forEach((type, index) => {
            setTimeout(() => {
                console.log(`测试特效: ${type}`);
                this.effectType = type;
                document.getElementById('effectType').value = type;
                this.playEffect();
            }, delay);
            delay += 300; // 每个特效间隔300ms
        });
    }

    // 修复预览按钮
    fixPreviewButtons() {
        console.log('重新绑定预览按钮...');
        const previewButtons = document.querySelectorAll('.effect-actions button[data-effect]');
        
        previewButtons.forEach(button => {
            // 移除旧事件监听器
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button);
            
            // 添加新事件监听器
            const effectType = clone.getAttribute('data-effect');
            console.log(`重新绑定按钮: ${effectType}`);
            
            clone.addEventListener('click', () => {
                console.log(`点击了特效按钮: ${effectType}`);
                document.getElementById('effectType').value = effectType;
                this.effectType = effectType;
                this.playEffect();
            });
        });
        
        console.log(`已重新绑定 ${previewButtons.length} 个预览按钮`);
    }
    
    // 显示/隐藏烟花子类型
    toggleFireworkSubtypes() {
        // 获取所有烟花子类型卡片
        const fireworkSubtypeCards = document.querySelectorAll('.effect-card');
        const fireworkSubtypeOptions = document.querySelectorAll('#effectType option[value^="firework-"]');
        const expandButton = document.getElementById('expandFireworks');
        
        // 检查当前状态
        let isExpanded = false;
        let visibleCount = 0;
        
        // 检查现有子类型的显示状态
        fireworkSubtypeCards.forEach(card => {
            const previewElement = card.querySelector('.effect-preview');
            if (previewElement && previewElement.className.includes('firework-') && 
                !previewElement.className.includes('firework-preview')) {
                if (card.style.display !== 'none') {
                    visibleCount++;
                }
            }
        });
        
        isExpanded = visibleCount > 0;
        console.log(`当前显示的烟花子类型数量: ${visibleCount}, 展开状态: ${isExpanded}`);
        
        if (isExpanded) {
            // 如果已经展开，就隐藏所有子类型
            fireworkSubtypeCards.forEach(card => {
                const previewElement = card.querySelector('.effect-preview');
                if (previewElement && previewElement.className.includes('firework-') && 
                    !previewElement.className.includes('firework-preview')) {
                    card.style.display = 'none';
                }
            });
            
            fireworkSubtypeOptions.forEach(option => {
                option.style.display = 'none';
            });
            
            if (expandButton) {
                expandButton.textContent = '展开子类型';
            }
        } else {
            // 如果已经隐藏，就展开所有子类型
            fireworkSubtypeCards.forEach(card => {
                const previewElement = card.querySelector('.effect-preview');
                if (previewElement && previewElement.className.includes('firework-') && 
                    !previewElement.className.includes('firework-preview')) {
                    card.style.display = 'block';
                    console.log(`显示子类型: ${previewElement.className}`);
                }
            });
            
            fireworkSubtypeOptions.forEach(option => {
                option.style.display = 'block';
                console.log(`显示选项: ${option.value}`);
            });
            
            if (expandButton) {
                expandButton.textContent = '收起子类型';
            }
            
            // 在展开后滚动到最左侧查看所有类型
            const effectsGrid = document.querySelector('.effects-grid');
            if (effectsGrid) {
                setTimeout(() => {
                    effectsGrid.scrollLeft = 0;
                    console.log('重置滚动位置');
                }, 100);
            }
        }
        
        // 打印所有烟花子类型
        const debugOutput = document.getElementById('debugOutput');
        if (debugOutput) {
            let subTypes = [];
            fireworkSubtypeCards.forEach(card => {
                const previewElement = card.querySelector('.effect-preview');
                if (previewElement && previewElement.className.includes('firework-') && 
                    !previewElement.className.includes('firework-preview')) {
                    subTypes.push(previewElement.className);
                }
            });
            debugOutput.textContent = `烟花子类型(${subTypes.length}个): ${subTypes.join(', ')}`;
        }
        
        console.log(`切换烟花子类型显示: ${!isExpanded}`);
    }
    
    // 初始隐藏烟花子类型
    hideFireworkSubtypes() {
        console.log('初始化隐藏烟花子类型');
        
        // 隐藏下拉菜单中的烟花子类型选项
        const fireworkSubtypeOptions = document.querySelectorAll('#effectType option[value^="firework-"]');
        fireworkSubtypeOptions.forEach(option => {
            option.style.display = 'none';
            console.log(`隐藏选项: ${option.value} - ${option.textContent}`);
        });
        
        // 为烟花子类型卡片添加标记并隐藏它们
        const effectCards = document.querySelectorAll('.effect-card');
        let foundSubtypes = 0;
        
        effectCards.forEach(card => {
            const previewElement = card.querySelector('.effect-preview');
            if (previewElement && previewElement.className.includes('firework-') && 
                !previewElement.className.includes('firework-preview')) {
                card.setAttribute('data-firework-subtype', 'true');
                card.style.display = 'none';
                foundSubtypes++;
                console.log(`设置子类型: ${previewElement.className}`);
            }
        });
        
        console.log(`找到 ${foundSubtypes} 个烟花子类型`);
        
        // 在调试面板显示所有找到的烟花子类型
        const debugOutput = document.getElementById('debugOutput');
        if (debugOutput) {
            const allSubtypes = [];
            document.querySelectorAll('.effect-card .effect-preview[class*="firework-"]').forEach(el => {
                if (!el.classList.contains('firework-preview')) {
                    allSubtypes.push(el.className);
                }
            });
            debugOutput.textContent = `找到烟花子类型(${allSubtypes.length}个): ${allSubtypes.join(', ')}`;
        }
        
        // 确保主烟花卡片可见
        const mainFireworkCard = document.querySelector('.effect-card .effect-preview.firework-preview');
        if (mainFireworkCard) {
            const mainCard = mainFireworkCard.closest('.effect-card');
            if (mainCard) {
                mainCard.style.display = 'block';
            }
        }
    }
}

/**
 * 基础粒子系统类
 */
class ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        this.ctx = ctx;
        this.origin = { x, y };
        this.particles = [];
        this.color = color;
        this.baseSize = size;
        this.speed = speed;
        this.duration = duration;
        this.lifeTime = 0;
        this.effectParticles = count;
        
        this.init(count);
    }
    
    // 初始化粒子
    init(count) {
        // 确保初始粒子数量不超过预期
        const initialCount = Math.min(count, this.effectParticles);
        for (let i = 0; i < initialCount; i++) {
            this.createParticle();
        }
    }
    
    // 创建单个粒子
    createParticle() {
        // 由子类实现
    }
    
    // 更新所有粒子
    update(deltaTime) {
        this.lifeTime += deltaTime;
        
        // 移除超出生命周期的粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新粒子
            particle.life -= deltaTime;
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 应用重力 (可选)
            if (this.useGravity) {
                particle.vy += 9.8 * deltaTime * this.speed;
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
    
    // 渲染所有粒子
    render() {
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            const size = particle.size * alpha; // 粒子变小
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
    }
    
    // 是否完成
    isComplete() {
        return (this.particles.length === 0 && this.lifeTime >= this.duration) || this.lifeTime >= this.duration;
    }
}

/**
 * 烟花爆炸粒子系统
 */
class FireworkParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
    }
    
    createParticle() {
        // 随机角度
        const angle = Math.random() * Math.PI * 2;
        // 随机速度
        const velocity = (0.5 + Math.random() * 0.5) * this.speed * 30;
        
        const particle = {
            x: this.origin.x,
            y: this.origin.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size: this.baseSize * (0.5 + Math.random() * 0.5),
            color: this.color,
            life: 0.5 + Math.random() * 0.5,
            maxLife: 0.5 + Math.random() * 0.5
        };
        
        this.particles.push(particle);
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            const size = particle.size * alpha; // 粒子变小
            
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

/**
 * 闪光粒子系统
 */
class SparkleParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = false;
    }
    
    createParticle() {
        // 在中心周围随机位置
        const radius = Math.random() * 50 * (this.baseSize / 5);
        const angle = Math.random() * Math.PI * 2;
        
        const particle = {
            x: this.origin.x + Math.cos(angle) * radius,
            y: this.origin.y + Math.sin(angle) * radius,
            vx: 0,
            vy: 0,
            size: this.baseSize * (0.2 + Math.random() * 0.8),
            color: this.color,
            life: Math.random() * 0.5,
            maxLife: Math.random() * 0.5,
            // 闪烁速度
            blinkSpeed: 5 + Math.random() * 5 * this.speed
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 持续创建新粒子
        if (this.lifeTime < this.duration) {
            for (let i = 0; i < 2; i++) {
                this.createParticle();
            }
        }
    }
    
    render() {
        const time = performance.now() / 1000;
        
        for (const particle of this.particles) {
            const pulse = 0.5 + 0.5 * Math.sin(time * particle.blinkSpeed);
            const alpha = (particle.life / particle.maxLife) * pulse;
            const size = particle.size * (0.5 + 0.5 * pulse);
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
    }
}

/**
 * 喷泉粒子系统
 */
class FountainParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = true;
    }
    
    createParticle() {
        // 向上喷射，带随机偏移
        const angle = -Math.PI/2 + (Math.random() - 0.5) * 0.5;
        const velocity = (0.8 + Math.random() * 0.4) * this.speed * 40;
        
        const particle = {
            x: this.origin.x + (Math.random() - 0.5) * 10,
            y: this.origin.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size: this.baseSize * (0.5 + Math.random() * 0.5),
            color: this.color,
            life: 0.8 + Math.random() * 0.6,
            maxLife: 0.8 + Math.random() * 0.6
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 持续创建新粒子
        if (this.lifeTime < this.duration) {
            for (let i = 0; i < 3; i++) {
                this.createParticle();
            }
        }
    }
}

/**
 * 流星粒子系统
 */
class MeteorParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.time = 0;
        this.effectParticles = count;
        this.useGravity = false;
        
        // 流星尾巴
        this.tailLength = 20;
        
        // 创建一批初始流星
        this.initMeteors();
    }
    
    // 初始化流星
    initMeteors() {
        const initialCount = Math.min(5, Math.floor(this.effectParticles / 10));
        for (let i = 0; i < initialCount; i++) {
            this.createMeteor();
        }
    }
    
    // 创建流星
    createMeteor() {
        // 随机选择起始位置 (从左上到右上的区域)
        const startX = Math.random() * this.ctx.canvas.width;
        const startY = -20; // 屏幕上方
        
        // 计算速度 (从左上到右下的方向)
        const speed = (40 + Math.random() * 60) * this.speed;
        const angle = Math.PI / 4 + Math.random() * Math.PI / 4; // 45-90度角
        
        const particle = {
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: (1 + Math.random()) * this.baseSize,
            color: this.color,
            life: 2.0 + Math.random() * 1.0,
            maxLife: 2.0 + Math.random() * 1.0,
            // 流星尾巴
            tail: [],
            maxTail: Math.floor(10 + Math.random() * 20)
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 记录当前位置到尾巴
            if (this.time % 0.05 < deltaTime) {
                particle.tail.unshift({ x: particle.x, y: particle.y });
                
                // 限制尾巴长度
                if (particle.tail.length > particle.maxTail) {
                    particle.tail.pop();
                }
            }
            
            // 更新位置
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 如果超出屏幕或生命结束则移除
            if (particle.x > this.ctx.canvas.width + 50 || 
                particle.y > this.ctx.canvas.height + 50 || 
                particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 定期创建新流星
        if (this.lifeTime < this.duration && Math.random() < 0.05) {
            if (this.particles.length < this.effectParticles / 5) {
                this.createMeteor();
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const particle of this.particles) {
            // 绘制流星尾巴
            if (particle.tail.length > 0) {
                const gradient = this.ctx.createLinearGradient(
                    particle.x, particle.y,
                    particle.tail[particle.tail.length - 1].x,
                    particle.tail[particle.tail.length - 1].y
                );
                
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                
                for (const point of particle.tail) {
                    this.ctx.lineTo(point.x, point.y);
                }
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = particle.size;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.stroke();
            }
            
            // 绘制流星头部
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
}

/**
 * 螺旋粒子系统
 */
class SpiralParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, Math.min(count, 150), color, size, speed, duration);
        this.useGravity = false;
        this.time = 0;
        this.radius = 5;
        this.maxRadius = 80 + size * 10;
    }
    
    createParticle() {
        // 以螺旋形状创建粒子
        const angle = this.particles.length * 0.1;
        const radius = this.radius;
        this.radius += 0.5;
        
        const particle = {
            x: this.origin.x + Math.cos(angle) * radius,
            y: this.origin.y + Math.sin(angle) * radius,
            angle: angle,
            radius: radius,
            size: this.baseSize * (0.5 + Math.random() * 0.5),
            color: this.color,
            life: 1.0 + Math.random() * 0.5,
            maxLife: 1.0 + Math.random() * 0.5,
            rotationSpeed: 0.5 + Math.random() * 0.5
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        // 更新现有粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 更新位置（旋转）
            particle.angle += particle.rotationSpeed * deltaTime * this.speed;
            particle.x = this.origin.x + Math.cos(particle.angle) * particle.radius;
            particle.y = this.origin.y + Math.sin(particle.angle) * particle.radius;
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 持续创建新粒子
        if (this.lifeTime < this.duration && this.radius < this.maxRadius) {
            for (let i = 0; i < 2; i++) {
                this.createParticle();
            }
        }
    }
}

/**
 * 爱心粒子系统
 */
class HeartParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = false;
        this.time = 0;
        this.heartSize = 3 + this.baseSize * 2;
    }
    
    createParticle() {
        // 生成心形坐标 (参数方程)
        const t = Math.random() * Math.PI * 2;
        const scale = 16 * this.heartSize;
        
        // 心形参数方程
        const x = scale * Math.pow(Math.sin(t), 3);
        const y = scale * (13 * Math.cos(t) / 16 - 5 * Math.cos(2 * t) / 16 - 2 * Math.cos(3 * t) / 16 - Math.cos(4 * t) / 16);
        
        // 随机方向速度（从中心向外扩散）
        const dx = x;
        const dy = y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        const particle = {
            // 起点在中心
            x: this.origin.x,
            y: this.origin.y,
            // 目标位置
            targetX: this.origin.x + x,
            targetY: this.origin.y - y, // 反转Y坐标使心形正确朝上
            // 方向速度
            vx: dirX * 40 * this.speed,
            vy: dirY * 40 * this.speed,
            size: this.baseSize * (0.6 + Math.random() * 0.4),
            color: this.color,
            life: 1.0,
            maxLife: 1.0,
            arrived: false
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            if (particle.arrived) {
                particle.life -= deltaTime;
            }
            
            if (!particle.arrived) {
                // 移动到目标位置
                particle.x += particle.vx * deltaTime;
                particle.y += particle.vy * deltaTime;
                
                // 计算与目标的距离
                const dx = particle.targetX - particle.x;
                const dy = particle.targetY - particle.y;
                const distSquared = dx * dx + dy * dy;
                
                // 到达目标
                if (distSquared < 10) {
                    particle.arrived = true;
                    particle.x = particle.targetX;
                    particle.y = particle.targetY;
                    // 到达后开始衰减
                    particle.life = 2.0 + Math.random() * 0.5;
                    particle.maxLife = particle.life;
                }
            } else {
                // 到达后的轻微抖动
                particle.x += (Math.random() - 0.5) * 0.4;
                particle.y += (Math.random() - 0.5) * 0.4;
            }
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}

/**
 * 彩带粒子系统
 */
class ConfettiParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.time = 0;
        this.effectParticles = count;
        this.useGravity = true;
        
        // 彩带颜色
        this.colors = [
            "#fd6a78", // 红粉色
            "#6acafd", // 浅蓝色
            "#fed20c", // 黄色
            "#58fd7d", // 绿色
            "#ca58fd"  // 紫色
        ];
        
        // 立即创建一批彩带
        this.initConfetti();
    }
    
    initConfetti() {
        const initialCount = Math.min(this.effectParticles, 50);
        for (let i = 0; i < initialCount; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        // 随机选择颜色
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // 随机初始速度
        const speed = 100 * this.speed;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed * (0.3 + Math.random() * 0.7);
        const vy = Math.sin(angle) * speed * (0.3 + Math.random() * 0.7);
        
        // 彩带大小
        const width = (0.5 + Math.random()) * this.baseSize;
        const height = (1 + Math.random() * 2) * this.baseSize;
        
        // 旋转角度和速度
        const rotation = Math.random() * Math.PI * 2;
        const rotationSpeed = (Math.random() - 0.5) * 2 * Math.PI;
        
        const particle = {
            x: this.origin.x + (Math.random() - 0.5) * 20,
            y: this.origin.y + (Math.random() - 0.5) * 20,
            vx: vx,
            vy: vy,
            width: width,
            height: height,
            color: color,
            life: 1.0 + Math.random() * 2.0,
            maxLife: 1.0 + Math.random() * 2.0,
            rotation: rotation,
            rotationSpeed: rotationSpeed,
            drag: 0.98
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        // 添加风的影响
        const windForce = Math.sin(this.time * 0.3) * 20 * deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 更新位置
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 添加风力
            particle.x += windForce;
            
            // 更新速度 (阻力)
            particle.vx *= particle.drag;
            particle.vy *= particle.drag;
            
            // 重力效果
            particle.vy += 98 * deltaTime * this.speed;
            
            // 更新旋转
            particle.rotation += particle.rotationSpeed * deltaTime;
            
            // 移除死亡粒子
            if (particle.life <= 0 || particle.y > this.ctx.canvas.height + 50) {
                this.particles.splice(i, 1);
            }
        }
        
        // 创建新粒子
        if (this.particles.length < this.effectParticles && this.lifeTime < this.duration) {
            for (let i = 0; i < 2; i++) {
                this.createParticle();
            }
        }
    }
    
    render() {
        this.ctx.save();
        
        for (const particle of this.particles) {
            // 计算透明度
            const alpha = Math.min(1, particle.life / particle.maxLife);
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            // 绘制彩带 (矩形)
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            this.ctx.fillRect(
                -particle.width / 2,
                -particle.height / 2,
                particle.width,
                particle.height
            );
            
            this.ctx.restore();
        }
        
        this.ctx.restore();
    }
}

/**
 * 星光粒子系统
 */
class StarsParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = false;
        this.time = 0;
        this.effectParticles = count;
        
        // 立即创建一批星星
        this.initStars();
    }
    
    // 初始化星星
    initStars() {
        const initialCount = Math.min(this.effectParticles, 40);
        for (let i = 0; i < initialCount; i++) {
            this.createStar();
        }
    }
    
    // 创建星星
    createStar() {
        // 随机位置，覆盖整个画布
        const x = Math.random() * this.ctx.canvas.width;
        const y = Math.random() * this.ctx.canvas.height;
        
        // 星星大小
        const size = (0.5 + Math.random() * 1.5) * this.baseSize;
        
        // 闪烁速度
        const twinkleSpeed = 1 + Math.random() * 3;
        
        const particle = {
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            size: size,
            color: this.color,
            life: 5.0 + Math.random() * 5.0,
            maxLife: 5.0 + Math.random() * 5.0,
            twinkleSpeed: twinkleSpeed,
            twinkleOffset: Math.random() * Math.PI * 2,
            // 星星旋转
            rotation: Math.random() * Math.PI * 2
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 持续创建新星星
        if (this.particles.length < this.effectParticles && this.lifeTime < this.duration) {
            if (Math.random() < 0.1) {
                this.createStar();
            }
        }
    }
    
    render() {
        this.ctx.save();
        
        for (const particle of this.particles) {
            // 计算闪烁效果
            const twinkle = 0.3 + 0.7 * Math.sin(this.time * particle.twinkleSpeed + particle.twinkleOffset);
            
            this.ctx.globalAlpha = twinkle;
            this.ctx.fillStyle = particle.color;
            
            // 绘制星星
            this.drawStar(
                this.ctx,
                particle.x,
                particle.y,
                5, // 尖角数
                particle.size,
                particle.size * 0.4,
                particle.rotation
            );
        }
        
        this.ctx.restore();
    }
    
    // 绘制星星形状
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, rotation) {
        let rot = Math.PI / 2 * 3 + rotation;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx + Math.cos(Math.PI / 2 * 3 + rotation) * outerRadius, cy + Math.sin(Math.PI / 2 * 3 + rotation) * outerRadius);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * 气泡粒子系统
 */
class BubblesParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = false;
        this.time = 0;
        this.effectParticles = count;
        
        // 提取颜色RGB值以创建渐变
        this.rgbColor = this.hexToRgb(color);
    }
    
    // 将十六进制颜色转换为RGB
    hexToRgb(hex) {
        // 去掉#号
        hex = hex.replace('#', '');
        
        // 转换为RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return {r, g, b};
    }
    
    createParticle() {
        // 随机位置（在区域内）
        const x = this.origin.x + (Math.random() - 0.5) * this.ctx.canvas.width * 0.8;
        const y = this.origin.y + this.ctx.canvas.height * 0.5; // 从底部附近产生
        
        // 随机大小
        const size = this.baseSize * (0.5 + Math.random() * 2);
        
        // 气泡上升速度，随大小变化
        const speed = (0.5 + Math.random() * 0.5) * this.speed * (1 - size / (this.baseSize * 3));
        
        // 添加横向晃动
        const wobble = {
            amplitude: Math.random() * 2 * this.speed,
            frequency: 0.5 + Math.random() * 2,
            offset: Math.random() * Math.PI * 2
        };
        
        // 计算适当的生命值，使大气泡寿命更长
        const lifeBase = 1.5 + (size / this.baseSize);
        
        const particle = {
            x: x,
            y: y,
            vx: 0,
            vy: -speed * 20,  // 向上移动
            size: size,
            color: this.color,
            life: lifeBase + Math.random(),
            maxLife: lifeBase + Math.random(),
            wobble: wobble,
            opacity: 0.5,  // 开始就有一定透明度
            popSize: 0,  // 用于破裂动画
            isPopping: false
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 如果气泡到达顶部或生命结束，开始破裂
            if ((particle.y < particle.size * 2 || particle.life <= 0.3) && !particle.isPopping) {
                particle.isPopping = true;
                // 破裂时停止移动
                particle.vx = 0;
                particle.vy = 0;
            }
            
            if (particle.isPopping) {
                // 破裂动画
                particle.popSize += deltaTime * 50 * this.speed;
                particle.opacity -= deltaTime * 3; // 快速淡出
            } else {
                // 正常上升
                // 应用横向晃动
                const wobbleX = Math.sin(this.time * particle.wobble.frequency + particle.wobble.offset) * particle.wobble.amplitude;
                particle.x += wobbleX;
                
                // 更新位置
                particle.x += particle.vx * deltaTime;
                particle.y += particle.vy * deltaTime;
                
                // 逐渐变为完全不透明
                if (particle.opacity < 0.8) {
                    particle.opacity += deltaTime * 2;
                }
            }
            
            // 移除完全破裂的气泡
            if (particle.life <= 0 || particle.opacity <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 持续创建新粒子
        if (this.lifeTime < this.duration) {
            console.log('创建气泡粒子, 当前数量:', this.particles.length);
            const createRate = Math.max(1, Math.floor(this.effectParticles / 30));
            for (let i = 0; i < createRate; i++) {
                if (Math.random() < 0.1) { // 随机控制产生频率
                    this.createParticle();
                }
            }
        }
    }
    
    render() {
        for (const particle of this.particles) {
            // 设置透明度
            this.ctx.globalAlpha = particle.isPopping ? particle.opacity : particle.opacity;
            
            // 创建径向渐变
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            
            const {r, g, b} = this.rgbColor;
            
            // 中心偏白色的渐变
            gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 0.7})`);
            gradient.addColorStop(0.3, `rgba(${r + 60}, ${g + 60}, ${b + 60}, ${particle.opacity * 0.5})`);
            gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            this.ctx.fillStyle = gradient;
            
            if (particle.isPopping) {
                // 绘制破裂的气泡
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size + particle.popSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 绘制破裂的小气泡
                for (let i = 0; i < 3; i++) {
                    const angle = i * Math.PI * 2 / 3 + this.time;
                    const distance = particle.popSize * 0.5;
                    const microX = particle.x + Math.cos(angle) * distance;
                    const microY = particle.y + Math.sin(angle) * distance;
                    const microSize = particle.size * 0.2;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(microX, microY, microSize, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } else {
                // 绘制正常气泡
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 添加高光
                this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.4})`;
                this.ctx.beginPath();
                this.ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // 重置全局透明度
        this.ctx.globalAlpha = 1.0;
    }
}

/**
 * 简化版火焰粒子系统
 */
class FlameParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = false;
        this.time = 0;
        this.effectParticles = count;
        
        // 火焰颜色渐变
        this.baseColor = color;
        this.colors = [
            color,                                      // 基本颜色
            this.adjustColor(color, 50, 50, 0),        // 明亮的变体
            this.adjustColor(color, -30, -60, -30),    // 暗色变体
            '#ffff80',                                  // 亮黄色
            '#ffffff'                                   // 白色
        ];
        
        // 不要在构造函数中调用init
        // 立即创建部分粒子
        this.initialParticles();
    }
    
    // 初始化一批粒子
    initialParticles() {
        for (let i = 0; i < Math.min(this.effectParticles, 50); i++) {
            this.createParticle();
        }
    }
    
    // 调整颜色亮度
    adjustColor(hexColor, rDelta, gDelta, bDelta) {
        // 去掉#号
        const hex = hexColor.replace('#', '');
        
        // 转换为RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        // 调整值
        r = Math.max(0, Math.min(255, r + rDelta));
        g = Math.max(0, Math.min(255, g + gDelta));
        b = Math.max(0, Math.min(255, b + bDelta));
        
        // 转回十六进制
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    createParticle() {
        // 火焰基点偏移
        const xOffset = (Math.random() - 0.5) * 40 * this.baseSize / 5;
        const yBase = this.origin.y + (Math.random() * 10);
        
        // 垂直速度，保持向上
        const vy = -20 - Math.random() * 30 * this.speed;
        // 横向速度小，带有轻微偏移
        const vx = (Math.random() - 0.5) * 5 * this.speed;
        
        // 粒子大小
        const size = (0.5 + Math.random() * 1.5) * this.baseSize;
        
        // 选择颜色
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        const particle = {
            x: this.origin.x + xOffset,
            y: yBase,
            vx: vx,
            vy: vy,
            size: size,
            color: color,
            life: 0.5 + Math.random() * 0.5,
            maxLife: 0.5 + Math.random() * 0.5,
            // 横向波动
            wobble: {
                amplitude: Math.random() * 3,
                frequency: 2 + Math.random() * 3,
                offset: Math.random() * Math.PI * 2
            }
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 更新位置
            particle.x += particle.vx * deltaTime;
            
            // 添加横向波动
            const wobbleX = Math.sin(this.time * particle.wobble.frequency + particle.wobble.offset) * particle.wobble.amplitude;
            particle.x += wobbleX * deltaTime;
            
            particle.y += particle.vy * deltaTime;
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 持续创建新粒子
        if (this.lifeTime < this.duration) {
            const createCount = Math.max(5, Math.floor(this.effectParticles / 20));
            for (let i = 0; i < createCount; i++) {
                this.createParticle();
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const particle of this.particles) {
            // 根据生命周期计算透明度
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.globalAlpha = alpha;
            
            // 创建径向渐变
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
}

/**
 * 简化版闪粉粒子系统
 */
class GlitterParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = false;
        this.time = 0;
        this.effectParticles = count;
        
        // 创建闪光颜色
        this.colors = [
            color,                                      // 基本颜色
            this.adjustColor(color, 50, 50, 50),       // 亮版本
            '#ffffff',                                  // 白色
            '#ffd700',                                  // 金色
            '#c0c0c0'                                   // 银色
        ];
        
        // 不要在构造函数中调用init
        // 立即创建部分粒子
        this.initialParticles();
    }
    
    // 初始化一批粒子
    initialParticles() {
        for (let i = 0; i < Math.min(this.effectParticles, 50); i++) {
            this.createParticle();
        }
    }
    
    // 调整颜色亮度
    adjustColor(hexColor, rDelta, gDelta, bDelta) {
        // 去掉#号
        const hex = hexColor.replace('#', '');
        
        // 转换为RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        // 调整值
        r = Math.max(0, Math.min(255, r + rDelta));
        g = Math.max(0, Math.min(255, g + gDelta));
        b = Math.max(0, Math.min(255, b + bDelta));
        
        // 转回十六进制
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    createParticle() {
        // 随机位置
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 * (this.baseSize / 5);
        const x = this.origin.x + Math.cos(angle) * distance;
        const y = this.origin.y + Math.sin(angle) * distance;
        
        // 随机速度和方向
        const speed = (0.5 + Math.random() * 1.5) * this.speed * 40;
        const direction = Math.random() * Math.PI * 2;
        const vx = Math.cos(direction) * speed;
        const vy = Math.sin(direction) * speed;
        
        // 随机选择颜色
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // 闪烁速度
        const twinkleSpeed = 5 + Math.random() * 15;
        
        const particle = {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: (0.2 + Math.random() * 0.8) * this.baseSize,
            color: color,
            life: 0.5 + Math.random() * 1.0,
            maxLife: 0.5 + Math.random() * 1.0,
            twinkleSpeed: twinkleSpeed,
            twinkleOffset: Math.random() * Math.PI * 2
        };
        
        this.particles.push(particle);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 更新位置
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 减速
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            
            // 移除死亡粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 持续创建新粒子
        if (this.lifeTime < this.duration) {
            const spawnRate = Math.max(3, Math.floor(this.effectParticles / 20));
            for (let i = 0; i < spawnRate; i++) {
                this.createParticle();
            }
        }
    }
    
    render() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (const particle of this.particles) {
            // 计算闪烁效果
            const twinkle = 0.5 + 0.5 * Math.sin(this.time * particle.twinkleSpeed + particle.twinkleOffset);
            
            // 根据生命周期计算透明度
            let alpha = particle.life / particle.maxLife;
            
            // 应用闪烁
            alpha *= twinkle;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            // 绘制闪光点
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 添加高光
            this.ctx.globalAlpha = alpha * 0.6;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
}

/**
 * 雪花粒子系统
 */
class SnowParticleSystem extends ParticleSystem {
    constructor(ctx, x, y, count, color, size, speed, duration) {
        super(ctx, x, y, count, color, size, speed, duration);
        this.useGravity = false;
        this.time = 0;
        this.effectParticles = count;
        
        // 立即创建一批雪花
        this.initSnowflakes();
    }
    
    // 初始创建一批雪花
    initSnowflakes() {
        for (let i = 0; i < Math.min(this.effectParticles, 30); i++) {
            // 随机位置（覆盖整个屏幕）
            const x = Math.random() * this.ctx.canvas.width;
            const y = Math.random() * this.ctx.canvas.height;
            this.createParticleAt(x, y);
        }
    }
    
    // 在指定位置创建雪花
    createParticleAt(x, y) {
        // 雪花下落速度（大雪花下落更快）
        const size = (0.5 + Math.random() * 1.5) * this.baseSize;
        const fallSpeed = (0.3 + Math.random() * 0.7) * this.speed * 20 * (size / this.baseSize);
        
        const particle = {
            x: x,
            y: y,
            vx: 0,
            vy: fallSpeed,
            size: size,
            color: this.color,
            life: 5.0 + Math.random() * 5.0,
            maxLife: 5.0 + Math.random() * 5.0,
            // 雪花晃动参数
            drift: {
                amplitude: Math.random() * 3 * this.speed,
                frequency: 0.2 + Math.random() * 0.8,
                offset: Math.random() * Math.PI * 2
            },
            // 雪花旋转
            rotation: {
                angle: Math.random() * Math.PI * 2,
                speed: (Math.random() - 0.5) * 2 * this.speed
            }
        };
        
        this.particles.push(particle);
    }
    
    // 从顶部创建新雪花
    createParticle() {
        const x = Math.random() * this.ctx.canvas.width;
        const y = -20; // 从屏幕上方开始
        this.createParticleAt(x, y);
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新生命周期
            particle.life -= deltaTime;
            
            // 计算水平飘动
            const driftX = Math.sin(this.time * particle.drift.frequency + particle.drift.offset) * particle.drift.amplitude;
            
            // 更新位置
            particle.x += driftX * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 更新旋转
            particle.rotation.angle += particle.rotation.speed * deltaTime;
            
            // 如果雪花飘出屏幕底部，移除它
            if (particle.y > this.ctx.canvas.height + 20) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // 移除生命结束的粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 持续创建新雪花，保持恒定数量
        if (this.lifeTime < this.duration) {
            const spawnRate = Math.max(1, Math.floor(this.effectParticles / 60));
            for (let i = 0; i < spawnRate; i++) {
                if (Math.random() < 0.2) {
                    this.createParticle();
                }
            }
        }
    }
    
    render() {
        for (const particle of this.particles) {
            // 计算透明度
            let alpha = 0.7;
            
            // 淡入
            if (particle.life > particle.maxLife - 1.0) {
                alpha *= (particle.maxLife - particle.life);
            }
            
            // 淡出
            if (particle.life < 1.0) {
                alpha *= particle.life;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            // 绘制简单的雪花（圆点）
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
}

// 添加导航按钮功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取导航按钮和特效容器
    const prevButton = document.querySelectorAll('.nav-button')[0];
    const nextButton = document.querySelectorAll('.nav-button')[1];
    const effectsGrid = document.querySelector('.effects-grid');
    
    // 设置导航按钮点击事件
    if (prevButton && nextButton && effectsGrid) {
        // 每次点击滚动一个卡片的宽度（250px + 20px间距）
        prevButton.addEventListener('click', () => {
            effectsGrid.scrollBy({ left: -270, behavior: 'smooth' });
        });
        
        nextButton.addEventListener('click', () => {
            effectsGrid.scrollBy({ left: 270, behavior: 'smooth' });
        });
    }
});

// 初始化控制器
document.addEventListener('DOMContentLoaded', () => {
    // 创建控制器实例
    window.effectsController = new EffectsController();
    console.log('特效库初始化完成');
    console.log('控制器实例:', window.effectsController);
    
    // 添加测试代码确认控制器存在并可用
    const debugOutput = document.getElementById('debugOutput');
    if (debugOutput) {
        debugOutput.textContent = '控制器初始化成功: ' + (window.effectsController ? '是' : '否');
    }

    // 添加展开子类型按钮的点击事件
    setTimeout(() => {
        const expandBtn = document.getElementById('expandFireworks');
        if (expandBtn) {
            console.log('找到展开按钮，添加点击事件');
            
            expandBtn.addEventListener('click', function() {
                console.log('点击展开烟花子类型按钮');
                
                // 隐藏所有原始效果卡片
                document.querySelectorAll('.effect-card').forEach(c => {
                    c.style.display = 'none';
                });
                
                // 创建烟花子类型卡片
                const effectsGrid = document.querySelector('.effects-grid');
                const fireworkTypes = [
                    { name: '基础烟花', desc: '简单的爆炸效果，粒子均匀向外扩散', type: 'firework' },
                    { name: '牡丹花型烟花', desc: '绚丽的牡丹花型爆炸效果', type: 'firework-peony' },
                    { name: '柳树型烟花', desc: '优雅的柳树下垂效果', type: 'firework-willow' },
                    { name: '烈焰绘花烟花', desc: '带有火焰效果的烟花，火花从中心爆发', type: 'firework-flame' },
                    { name: '叶状烟花', desc: '如叶片散开的烟花效果', type: 'firework-leaf' },
                    { name: '环形烟花', desc: '完美的圆环爆炸效果', type: 'firework-ring' },
                    { name: '罗马蜡烛', desc: '模拟罗马蜡烛的多段连续垂直发射烟花效果', type: 'firework-roman' },
                    { name: '礼炮烟花', desc: '模拟礼炮爆炸效果，带有强烈的声光冲击感', type: 'firework-salute' },
                    { name: '蜘蛛型烟花', desc: '蜘蛛网状的爆炸效果', type: 'firework-spider' },
                    { name: '闪烁烟花', desc: '以不同频率闪烁的星点效果的烟花', type: 'firework-twinkle' }
                ];
                
                // 创建返回按钮
                const backButton = document.createElement('div');
                backButton.className = 'effect-card';
                backButton.style.background = '#222';
                backButton.innerHTML = `
                    <div class="effect-preview" style="display: flex; justify-content: center; align-items: center;">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#4a6af9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="effect-info">
                        <h3>返回主菜单</h3>
                        <p>返回到所有效果类型</p>
                        <div class="effect-actions">
                            <button id="backToMain" style="width: 100%;">返回</button>
                        </div>
                    </div>
                `;
                effectsGrid.prepend(backButton);
                
                // 添加返回按钮事件
                document.getElementById('backToMain').addEventListener('click', () => {
                    // 移除所有烟花子类型卡片和返回按钮
                    const cardsToRemove = document.querySelectorAll('.firework-subtype-card, .effect-card');
                    cardsToRemove.forEach(card => {
                        if (card.classList.contains('firework-subtype-card') || card.querySelector('#backToMain')) {
                            card.remove();
                        } else {
                            card.style.display = ''; // 显示原来的卡片
                        }
                    });
                });
                
                // 添加烟花子类型卡片
                fireworkTypes.forEach(type => {
                    const card = document.createElement('div');
                    card.className = 'effect-card firework-subtype-card';
                    card.innerHTML = `
                        <div class="effect-preview ${type.type}-preview"></div>
                        <div class="effect-info">
                            <h3>${type.name}</h3>
                            <p>${type.desc}</p>
                            <div class="effect-actions">
                                <button data-effect="${type.type}" class="preview-btn">预览</button>
                                <button data-effect="${type.type}" class="add-btn">添加</button>
                            </div>
                        </div>
                    `;
                    effectsGrid.appendChild(card);
                    
                    // 绑定新卡片的预览和添加按钮事件
                    const previewBtn = card.querySelector('.preview-btn');
                    previewBtn.addEventListener('click', function() {
                        console.log('预览效果:', type.type);
                        document.getElementById('effectType').value = type.type;
                        window.effectsController.effectType = type.type;
                        window.effectsController.playEffect();
                    });
                    
                    const addBtn = card.querySelector('.add-btn');
                    addBtn.addEventListener('click', function() {
                        console.log('添加效果:', type.type);
                        document.getElementById('effectType').value = type.type;
                        window.effectsController.effectType = type.type;
                        window.effectsController.saveEffect();
                    });
                });
            });
        } else {
            console.error('找不到展开按钮');
        }
    }, 1000);
}); 