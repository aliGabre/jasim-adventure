/**
 * نظام العرض المحسن مع قطع العرض وتحسينات الرسومات
 */
class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.quality = 'high'; // high, medium, low
        this.cullingEnabled = true;
        this.batchRendering = true;
        
        // إحصائيات العرض
        this.stats = {
            totalObjects: 0,
            visibleObjects: 0,
            drawCalls: 0,
            cullingEfficiency: 0
        };
        
        // تجميع الرسومات
        this.renderBatches = {
            platforms: [],
            blocks: [],
            coins: [],
            enemies: [],
            bullets: [],
            powerups: []
        };
        
        // خلفيات محسنة
        this.backgroundCache = new Map();
        this.themeColors = this.createThemeColors();
        
        this.init();
    }
    
    /**
     * تهيئة العارض
     */
    init() {
        // تحسين إعدادات Canvas
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.imageSmoothingQuality = 'high';
        
        // إنشاء خلفيات مخزنة مسبقاً
        this.preRenderBackgrounds();
    }
    
    /**
     * إنشاء ألوان الثيمات
     */
    createThemeColors() {
        return {
            overworld: {
                skyTop: '#76b8ff',
                skyMid: '#8cd1ff',
                hill1: '#3c9444',
                hill2: '#2e7a36'
            },
            underground: {
                skyTop: '#1a1a1a',
                skyMid: '#1a1a1a',
                hill1: '#222',
                hill2: '#111'
            },
            desert: {
                skyTop: '#f7c56b',
                skyMid: '#ffd98a',
                hill1: '#d6a14a',
                hill2: '#c1872e'
            },
            snow: {
                skyTop: '#bfe9ff',
                skyMid: '#e8f6ff',
                hill1: '#a6d5f2',
                hill2: '#8fc3e6'
            },
            sky: {
                skyTop: '#b8e2ff',
                skyMid: '#dff3ff',
                hill1: '#cfeaff',
                hill2: '#b6dcff'
            },
            castle: {
                skyTop: '#3e3e3e',
                skyMid: '#5a5a5a',
                hill1: '#444',
                hill2: '#383838'
            }
        };
    }
    
    /**
     * إنشاء خلفيات مخزنة مسبقاً
     */
    preRenderBackgrounds() {
        const themes = Object.keys(this.themeColors);
        
        themes.forEach(theme => {
            const colors = this.themeColors[theme];
            const bgCanvas = document.createElement('canvas');
            bgCanvas.width = 200;
            bgCanvas.height = 540;
            const bgCtx = bgCanvas.getContext('2d');
            
            // رسم الخلفية
            const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
            gradient.addColorStop(0, colors.skyTop);
            gradient.addColorStop(0.6, colors.skyMid);
            gradient.addColorStop(1, colors.skyMid);
            
            bgCtx.fillStyle = gradient;
            bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
            
            // رسم التلال
            if (theme !== 'underground' && theme !== 'castle') {
                bgCtx.fillStyle = 'rgba(255,255,255,0.85)';
                for (let i = 0; i < 3; i++) {
                    const x = i * 60;
                    const y = 80 + (i % 3) * 30;
                    this.drawCloudOptimized(bgCtx, x, y, 120, 30);
                }
            }
            
            // رسم التلال
            for (let i = 0; i < 3; i++) {
                const x = i * 80;
                this.drawHillOptimized(bgCtx, x, 540, 220, 120, colors.hill1);
                this.drawHillOptimized(bgCtx, x + 40, 540, 280, 150, colors.hill2);
            }
            
            this.backgroundCache.set(theme, bgCanvas);
        });
    }
    
    /**
     * تعيين جودة العرض
     */
    setQuality(quality) {
        this.quality = quality;
        
        switch (quality) {
            case 'low':
                this.cullingEnabled = true;
                this.batchRendering = false;
                break;
            case 'medium':
                this.cullingEnabled = true;
                this.batchRendering = true;
                break;
            case 'high':
                this.cullingEnabled = true;
                this.batchRendering = true;
                break;
        }
    }
    
    /**
     * فحص الرؤية
     */
    isVisible(x, y, w, h, cameraX, margin = 20) {
        if (!this.cullingEnabled) return true;
        return x + w >= cameraX - margin && x <= cameraX + this.canvas.width + margin;
    }
    
    /**
     * تحديث تجميع الرسومات
     */
    updateRenderBatches(gameObjects) {
        this.renderBatches.platforms = gameObjects.platforms || [];
        this.renderBatches.blocks = gameObjects.blocks || [];
        this.renderBatches.coins = gameObjects.coins || [];
        this.renderBatches.enemies = gameObjects.enemies || [];
        this.renderBatches.bullets = gameObjects.bullets || [];
        this.renderBatches.powerups = gameObjects.powerups || [];
        
        // حساب الإحصائيات
        this.stats.totalObjects = Object.values(this.renderBatches).reduce((sum, batch) => sum + batch.length, 0);
    }
    
    /**
     * رسم الخلفية المحسنة
     */
    drawBackground(theme, cameraX) {
        const colors = this.themeColors[theme] || this.themeColors.overworld;
        
        // استخدام الخلفية المخزنة مسبقاً
        if (this.backgroundCache.has(theme)) {
            const bgCanvas = this.backgroundCache.get(theme);
            const patternX = Math.floor(cameraX / 200);
            const offsetX = cameraX % 200;
            
            // رسم نمط متكرر
            for (let i = -1; i <= Math.ceil(this.canvas.width / 200) + 1; i++) {
                const x = i * 200 - offsetX;
                this.ctx.drawImage(bgCanvas, x, 0);
            }
        } else {
            // رسم خلفية بسيطة
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, colors.skyTop);
            gradient.addColorStop(0.6, colors.skyMid);
            gradient.addColorStop(1, colors.skyMid);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // رسم السحب (إذا لم تكن تحت الأرض)
        if (theme !== 'underground' && theme !== 'castle') {
            this.drawClouds(cameraX);
        }
        
        // رسم التلال
        this.drawHills(cameraX, colors);
    }
    
    /**
     * رسم السحب
     */
    drawClouds(cameraX) {
        this.ctx.fillStyle = 'rgba(255,255,255,0.85)';
        for (let i = 0; i < 8; i++) {
            const x = ((i * 500 - (cameraX * 0.4)) % 1200 + 1200) % 1200 - 200;
            const y = 80 + (i % 3) * 30;
            this.drawCloudOptimized(this.ctx, x, y, 120, 30);
        }
    }
    
    /**
     * رسم التلال
     */
    drawHills(cameraX, colors) {
        for (let i = 0; i < 10; i++) {
            const x = ((i * 700 - (cameraX * 0.2)) % 1800 + 1800) % 1800 - 300;
            this.drawHillOptimized(this.ctx, x, 540, 220, 120, colors.hill1);
        }
        for (let i = 0; i < 10; i++) {
            const x = ((i * 700 + 200 - (cameraX * 0.15)) % 1800 + 1800) % 1800 - 300;
            this.drawHillOptimized(this.ctx, x, 540, 280, 150, colors.hill2);
        }
    }
    
    /**
     * رسم سحابة محسنة
     */
    drawCloudOptimized(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.ellipse(x, y, w * 0.32, h * 0.52, 0, 0, Math.PI * 2);
        ctx.ellipse(x + w * 0.25, y - 10, w * 0.28, h * 0.55, 0, 0, Math.PI * 2);
        ctx.ellipse(x + w * 0.5, y, w * 0.35, h * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * رسم تل محسن
     */
    drawHillOptimized(ctx, x, baseY, w, h, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.quadraticCurveTo(x + w * 0.5, baseY - h, x + w, baseY);
        ctx.lineTo(x + w, baseY + 10);
        ctx.lineTo(x, baseY + 10);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * رسم العالم المحسن
     */
    drawWorld(gameObjects, cameraX) {
        this.stats.drawCalls = 0;
        this.stats.visibleObjects = 0;
        
        // رسم الأرضية
        this.drawGround(cameraX);
        
        // رسم المنصات
        this.drawPlatforms(cameraX);
        
        // رسم الصناديق
        this.drawBlocks(cameraX);
        
        // رسم العملات
        this.drawCoins(cameraX);
        
        // رسم القوى
        this.drawPowerups(cameraX);
        
        // رسم الأعداء
        this.drawEnemies(cameraX);
        
        // رسم الرصاص
        this.drawBullets(cameraX);
        
        // رسم البيوت
        this.drawHouses(gameObjects.houses || [], cameraX);
        
        // رسم الأنابيب
        this.drawPipes(gameObjects.pipes || [], cameraX);
        
        // رسم نقاط الحفظ
        this.drawCheckpoints(gameObjects.checkpoints || [], cameraX);
        
        // رسم العلم
        this.drawFlag(gameObjects.flag, cameraX);
        
        // تحديث كفاءة القطع
        this.stats.cullingEfficiency = this.stats.visibleObjects / Math.max(this.stats.totalObjects, 1);
    }
    
    /**
     * رسم الأرضية
     */
    drawGround(cameraX) {
        this.ctx.fillStyle = '#e8834a';
        this.ctx.fillRect(-cameraX, 472, this.canvas.width, 68);
        
        // نمط الأرضية
        for (let x = Math.floor(cameraX / 40) * 40 - 40; x < cameraX + this.canvas.width + 40; x += 40) {
            this.ctx.fillStyle = (Math.floor(x / 40) % 2 === 0) ? '#d4733e' : '#c76532';
            this.ctx.fillRect(x - cameraX, 520, 40, 20);
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم المنصات
     */
    drawPlatforms(cameraX) {
        this.ctx.fillStyle = '#d4733e';
        this.ctx.strokeStyle = 'rgba(0,0,0,.15)';
        
        for (const platform of this.renderBatches.platforms) {
            if (this.isVisible(platform.x, platform.y, platform.w, platform.h, cameraX)) {
                this.ctx.fillRect(platform.x - cameraX, platform.y, platform.w, platform.h);
                this.ctx.strokeRect(platform.x - cameraX, platform.y, platform.w, platform.h);
                this.stats.visibleObjects++;
            }
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم الصناديق
     */
    drawBlocks(cameraX) {
        for (const block of this.renderBatches.blocks) {
            if (!this.isVisible(block.x, block.y, block.w, block.h, cameraX)) continue;
            
            if (block.type === 'q') {
                this.ctx.fillStyle = block.hit ? '#8c6b1a' : '#c88a1a';
                this.ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
                
                if (!block.hit) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fillRect(block.x - cameraX + 16, block.y + 8, 8, 8);
                }
            } else {
                this.ctx.fillStyle = '#b87333';
                this.ctx.fillRect(block.x - cameraX, block.y, block.w, block.h);
                this.ctx.strokeStyle = 'rgba(0,0,0,.25)';
                this.ctx.strokeRect(block.x - cameraX, block.y, block.w, block.h);
            }
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم العملات
     */
    drawCoins(cameraX) {
        this.ctx.fillStyle = '#ffd700';
        
        for (const coin of this.renderBatches.coins) {
            if (coin.taken || !this.isVisible(coin.x, coin.y, coin.w, coin.h, cameraX)) continue;
            
            this.ctx.beginPath();
            this.ctx.arc(coin.x - cameraX, coin.y, 9, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = 'rgba(255,255,255,.6)';
            this.ctx.fillRect(coin.x - cameraX - 2, coin.y - 5, 3, 10);
            this.ctx.fillStyle = '#ffd700';
            
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم القوى
     */
    drawPowerups(cameraX) {
        for (const powerup of this.renderBatches.powerups) {
            if (!this.isVisible(powerup.x, powerup.y, powerup.w, powerup.h, cameraX)) continue;
            
            this.ctx.fillStyle = '#ff4444';
            this.ctx.fillRect(powerup.x - cameraX, powerup.y, powerup.w, powerup.h);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(powerup.x - cameraX + 6, powerup.y + 6, 10, 4);
            
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم الأعداء
     */
    drawEnemies(cameraX) {
        for (const enemy of this.renderBatches.enemies) {
            if (!enemy.alive || !this.isVisible(enemy.x, enemy.y, enemy.w, enemy.h, cameraX)) continue;
            
            if (enemy.type === 'walker') {
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(enemy.x - cameraX, enemy.y, enemy.w, enemy.h);
                
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(enemy.x - cameraX + 6, enemy.y + 6, 4, 4);
                this.ctx.fillRect(enemy.x - cameraX + enemy.w - 10, enemy.y + 6, 4, 4);
            } else {
                this.ctx.fillStyle = '#000080';
                this.ctx.fillRect(enemy.x - cameraX, enemy.y, enemy.w, enemy.h);
                
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(enemy.x - cameraX + 8, enemy.y + 8, 6, 6);
                this.ctx.fillRect(enemy.x - cameraX + enemy.w - 14, enemy.y + 8, 6, 6);
            }
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم الرصاص
     */
    drawBullets(cameraX) {
        // رصاص اللاعب
        this.ctx.fillStyle = '#ff2e2e';
        for (const bullet of this.renderBatches.bullets) {
            if (!bullet.active || !this.isVisible(bullet.x, bullet.y, bullet.w, bullet.h, cameraX)) continue;
            this.ctx.fillRect(bullet.x - cameraX, bullet.y, bullet.w, bullet.h);
            this.stats.visibleObjects++;
        }
        
        // رصاص الأعداء
        this.ctx.fillStyle = '#ffcc00';
        for (const bullet of this.renderBatches.eBullets || []) {
            if (!this.isVisible(bullet.x, bullet.y, bullet.w, bullet.h, cameraX)) continue;
            this.ctx.fillRect(bullet.x - cameraX, bullet.y, bullet.w, bullet.h);
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم البيوت
     */
    drawHouses(houses, cameraX) {
        for (const house of houses) {
            const x = house.x;
            if (!this.isVisible(x, 472, 100, 110, cameraX, 200)) continue;
            
            this.drawHouse(x - cameraX, 472);
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم بيت
     */
    drawHouse(x, groundY) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x, groundY - 110, 100, 110);
        
        this.ctx.fillStyle = '#b33';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, groundY - 110);
        this.ctx.lineTo(x + 50, groundY - 150);
        this.ctx.lineTo(x + 110, groundY - 110);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.fillStyle = '#2b1a0d';
        this.ctx.fillRect(x + 36, groundY - 50, 28, 50);
        
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(x + 16, groundY - 85, 18, 18);
        this.ctx.fillRect(x + 66, groundY - 85, 18, 18);
    }
    
    /**
     * رسم الأنابيب
     */
    drawPipes(pipes, cameraX) {
        for (const pipe of pipes) {
            if (!this.isVisible(pipe.x, pipe.y, pipe.w, pipe.h, cameraX, 40)) continue;
            this.drawPipe(pipe.x, pipe.y, pipe.w, pipe.h, cameraX);
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم أنبوب
     */
    drawPipe(x, y, w, h, cameraX) {
        this.ctx.fillStyle = '#0a9a2a';
        this.ctx.fillRect(x - cameraX, y - h, w, h);
        
        this.ctx.fillStyle = '#0fc642';
        this.ctx.fillRect(x - cameraX - 6, y - h - 14, w + 12, 14);
        
        this.ctx.fillStyle = 'rgba(0,0,0,.15)';
        this.ctx.fillRect(x - cameraX, y - h + 6, w, 3);
    }
    
    /**
     * رسم نقاط الحفظ
     */
    drawCheckpoints(checkpoints, cameraX) {
        for (const cp of checkpoints) {
            this.drawCheckpoint(cp.x, cameraX, cp.reached);
            this.stats.visibleObjects++;
        }
        this.stats.drawCalls++;
    }
    
    /**
     * رسم نقطة حفظ
     */
    drawCheckpoint(x, cameraX, reached) {
        this.ctx.fillStyle = reached ? '#33dd66' : '#cccccc';
        this.ctx.fillRect(x - cameraX, 472 - 60, 8, 60);
        
        this.ctx.fillStyle = reached ? '#33dd66' : '#ff4444';
        this.ctx.beginPath();
        this.ctx.moveTo(x - cameraX + 8, 472 - 60);
        this.ctx.lineTo(x - cameraX + 48, 472 - 40);
        this.ctx.lineTo(x - cameraX + 8, 472 - 20);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    /**
     * رسم العلم
     */
    drawFlag(flag, cameraX) {
        if (!this.isVisible(flag.x, flag.y, 8, flag.h, cameraX)) return;
        
        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.fillRect(flag.x - cameraX, flag.y, 8, flag.h);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.moveTo(flag.x - cameraX + 8, flag.y + 4);
        this.ctx.lineTo(flag.x - cameraX + 52, flag.y + 24);
        this.ctx.lineTo(flag.x - cameraX + 8, flag.y + 44);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.stats.visibleObjects++;
        this.stats.drawCalls++;
    }
    
    /**
     * رسم اللاعب
     */
    drawPlayer(player, cameraX) {
        if (player.invul % 10 < 7) {
            this.drawPlayerSprite(player.x - cameraX, player.y, player.w, player.h, player.facing, player.big);
        }
    }
    
    /**
     * رسم شخصية اللاعب
     */
    drawPlayerSprite(x, y, w, h, facing, big) {
        this.ctx.fillStyle = '#ff4136';
        this.ctx.fillRect(x, y, w, 10);
        
        this.ctx.fillStyle = '#f6c6a6';
        this.ctx.fillRect(x + 4, y + 10, w - 8, 12);
        
        this.ctx.fillStyle = '#000';
        const eyeX = facing > 0 ? x + w - 10 : x + 6;
        this.ctx.fillRect(eyeX, y + 12, 3, 3);
        
        this.ctx.fillStyle = big ? '#d11' : '#ff4136';
        this.ctx.fillRect(x + 2, y + 22, w - 4, 16);
        
        this.ctx.fillStyle = '#0074d9';
        this.ctx.fillRect(x + 2, y + 38, w - 4, h - 38);
        
        this.stats.drawCalls++;
    }
    
    /**
     * الحصول على إحصائيات العرض
     */
    getRenderStats() {
        return { ...this.stats };
    }
    
    /**
     * تنظيف الذاكرة
     */
    cleanup() {
        this.backgroundCache.clear();
        this.renderBatches = {
            platforms: [],
            blocks: [],
            coins: [],
            enemies: [],
            bullets: [],
            powerups: []
        };
    }
}

// تصدير العارض
window.GameRenderer = GameRenderer;