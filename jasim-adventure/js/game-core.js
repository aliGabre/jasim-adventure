/**
 * النواة المحسنة للعبة مع جميع التحسينات
 */
class GameCore {
    constructor() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 960;
        this.canvas.height = 540;
        
        // تجميع عناصر DOM
        this.elements = {
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            level: document.getElementById('level'),
            msg: document.getElementById('msg'),
            overlay: document.getElementById('overlay'),
            shareOpen: document.getElementById('shareOpen'),
            copyLink: document.getElementById('copyLink'),
            nativeShare: document.getElementById('nativeShare'),
            pageUrl: document.getElementById('pageUrl'),
            qrImg: document.getElementById('qrImg'),
            closeOverlay: document.getElementById('closeOverlay'),
            perfInfo: document.getElementById('perfInfo')
        };

        // الثوابت
        this.GRAVITY = 0.6;
        this.MOVE_SPEED = 4.0;
        this.JUMP_VELOCITY = -12.5;
        this.COYOTE_TIME_FRAMES = 8;
        this.JUMP_BUFFER_FRAMES = 8;

        // حالة اللعبة
        this.state = {
            score: 0,
            lives: 3,
            levelIndex: 0,
            cameraX: 0,
            win: false,
            gameOver: false,
            respawn: { x: 0, y: 0 }
        };

        // اللاعب
        this.player = {
            x: 100, y: 100, w: 28, h: 48,
            vx: 0, vy: 0, facing: 1, onGround: false,
            coyote: 0, jumpBuffer: 0, big: false, invul: 0, shootCooldown: 0
        };

        // كائنات اللعبة
        this.level = null;
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.bullets = [];
        this.eBullets = [];
        this.blocks = [];
        this.powerups = [];
        this.pipes = [];
        this.checkpoints = [];
        this.flag = { x: 2000, y: 0, h: 140, reached: false };
        this.houses = [];

        // المدخلات
        this.keys = { left: false, right: false, jump: false, shoot: false, down: false, up: false };
        this.justPressed = { jump: false, shoot: false };

        // أنظمة التحسين
        this.spatialHash = new GameSpatialHash();
        this.objectPools = new GameObjectPools();
        this.sound = new GameSoundManager();
        this.performanceMonitor = new PerformanceMonitor();

        // إحصائيات الأداء
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;

        this.init();
    }

    /**
     * تهيئة اللعبة
     */
    init() {
        this.setupInput();
        this.setupMobileControls();
        this.setupSharing();
        this.sound.init();
        
        // بدء مراقبة الأداء
        this.startPerformanceMonitoring();
    }

    /**
     * بدء مراقبة الأداء
     */
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updatePerformanceDisplay();
        }, 1000);
    }

    /**
     * تحديث عرض الأداء
     */
    updatePerformanceDisplay() {
        const perfStats = this.spatialHash.getPerformanceStats();
        const poolStats = this.objectPools.getPerformanceStats();
        const soundStats = this.sound.getStats();
        
        this.elements.perfInfo.innerHTML = `
            FPS: ${this.fps}<br>
            Objects: ${perfStats.platforms.totalObjects + perfStats.enemies.totalObjects}<br>
            Collision Queries: ${perfStats.platforms.totalQueries}<br>
            Object Reuse: ${Math.round(poolStats.bullets.reuseRate * 100)}%<br>
            Sound Cache: ${soundStats.cacheSize}
        `;
    }

    /**
     * تحديث التجزئة المكانية
     */
    updateSpatialHash() {
        this.spatialHash.updateAll(
            this.platforms,
            this.enemies,
            this.coins,
            this.powerups,
            this.bullets,
            this.eBullets
        );
    }

    /**
     * اكتشاف التصادم المحسن
     */
    rectsCollide(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && 
               a.y < b.y + b.h && a.y + a.h > b.y;
    }

    /**
     * البحث عن المنصات القريبة
     */
    platformsInRange(o) {
        return this.spatialHash.getNearbyPlatforms(o.x, o.y, 80);
    }

    /**
     * فحص الأرض
     */
    checkOnGround(o) {
        const feet = { x: o.x, y: o.y + o.h, w: o.w, h: 2 };
        const nearby = this.spatialHash.getNearbyPlatforms(o.x, o.y, 50);
        return nearby.some(p => this.rectsCollide(feet, p));
    }

    /**
     * الحركة مع التصادم المحسن
     */
    moveWithCollisions(o, dx, dy) {
        // الحركة الأفقية
        o.x += dx;
        const nearby = this.spatialHash.getNearbyPlatforms(o.x, o.y, 50);
        for (const p of nearby) {
            if (this.rectsCollide(o, p)) {
                if (dx > 0) o.x = p.x - o.w;
                else if (dx < 0) o.x = p.x + p.w;
            }
        }
        
        // الحركة العمودية
        o.y += dy;
        for (const p of nearby) {
            if (this.rectsCollide(o, p)) {
                if (dy > 0) { 
                    o.y = p.y - o.h; 
                    o.vy = 0; 
                } else if (dy < 0) {
                    o.y = p.y + p.h; 
                    o.vy = 0;
                    this.hitBlockAt(o.x + o.w * 0.5, p.y + p.h + 1);
                }
            }
        }
    }

    /**
     * تحديث اللاعب المحسن
     */
    updatePlayer() {
        // الحركة الأفقية
        let ax = 0;
        if (this.keys.left) ax = -this.MOVE_SPEED;
        if (this.keys.right) ax = this.MOVE_SPEED;
        this.player.vx = ax;
        if (this.player.vx !== 0) this.player.facing = Math.sign(this.player.vx);

        // الجاذبية
        this.player.vy += this.GRAVITY;

        // القفز المتغير
        if (this.player.vy < 0) {
            if (!this.keys.jump) this.player.vy += 0.6;
            else this.player.vy += -0.12;
        }

        // وقت الكايوتي ومخزن القفز
        if (this.player.onGround) this.player.coyote = this.COYOTE_TIME_FRAMES;
        else if (this.player.coyote > 0) this.player.coyote--;
        
        if (this.justPressed.jump) this.player.jumpBuffer = this.JUMP_BUFFER_FRAMES;
        else if (this.player.jumpBuffer > 0) this.player.jumpBuffer--;

        // القفز
        if (this.player.jumpBuffer > 0 && this.player.coyote > 0) {
            this.player.vy = this.JUMP_VELOCITY;
            this.player.onGround = false;
            this.player.coyote = 0;
            this.player.jumpBuffer = 0;
            this.sound.jump();
        }

        // الرصاص
        if (this.player.shootCooldown > 0) this.player.shootCooldown--;
        if (this.justPressed.shoot && this.player.shootCooldown === 0) {
            const bullet = this.objectPools.bullets.createBullet(
                this.player.x + this.player.w / 2 + this.player.facing * 18,
                this.player.y + this.player.h * 0.45,
                this.player.facing * 9.5,
                0
            );
            this.bullets.push(bullet);
            this.player.shootCooldown = 12;
            this.sound.shoot();
        }

        // الحركة والتصادم
        this.moveWithCollisions(this.player, this.player.vx, this.player.vy);
        this.player.onGround = this.checkOnGround(this.player);

        // الحصانة
        if (this.player.invul > 0) this.player.invul--;

        // السقوط خارج العالم
        if (this.player.y > this.canvas.height + 200) {
            this.takeHit(true);
        }

        // الكاميرا
        this.state.cameraX = Math.max(0, Math.min(this.level.width - this.canvas.width, 
            this.player.x - this.canvas.width * 0.4));

        // إعادة تعيين المدخلات
        this.justPressed.jump = false;
        this.justPressed.shoot = false;
    }

    /**
     * تحديث الرصاص المحسن
     */
    updateBullets() {
        // رصاص اللاعب
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            if (!b.active) continue;
            
            b.x += b.vx;
            const nearby = this.spatialHash.getNearbyPlatforms(b.x, b.y, 30);
            const hitPlatform = nearby.some(p => this.rectsCollide(b, p));
            
            if (hitPlatform || b.x < 0 || b.x > this.level.width) {
                this.objectPools.bullets.return(b);
                this.bullets.splice(i, 1);
                continue;
            }
            
            const nearbyEnemies = this.spatialHash.getNearbyEnemies(b.x, b.y, 30);
            for (const e of nearbyEnemies) {
                if (e.alive && this.rectsCollide(b, e)) {
                    e.alive = false;
                    this.objectPools.bullets.return(b);
                    this.bullets.splice(i, 1);
                    this.state.score += 30;
                    this.updateHUD();
                    this.sound.stomp();
                    break;
                }
            }
        }

        // رصاص الأعداء
        for (let i = this.eBullets.length - 1; i >= 0; i--) {
            const b = this.eBullets[i];
            b.x += b.vx;
            b.y += b.vy;
            const nearby = this.spatialHash.getNearbyPlatforms(b.x, b.y, 30);
            const hitPlatform = nearby.some(p => this.rectsCollide(b, p));
            
            if (hitPlatform || b.x < 0 || b.x > this.level.width) {
                this.eBullets.splice(i, 1);
                continue;
            }
            
            if (this.rectsCollide(this.player, b)) {
                this.eBullets.splice(i, 1);
                this.takeHit(false);
            }
        }
    }

    /**
     * تحديث HUD
     */
    updateHUD() {
        this.elements.score.textContent = this.state.score;
        this.elements.lives.textContent = this.state.lives;
        this.elements.level.textContent = (this.state.levelIndex + 1);
    }

    /**
     * عرض الرسائل
     */
    showMsg(txt, small) {
        this.elements.msg.innerHTML = txt + (small ? `<br><small>${small}</small>` : '');
        this.elements.msg.style.display = 'flex';
    }

    hideMsg() {
        this.elements.msg.style.display = 'none';
    }

    /**
     * بدء اللعبة
     */
    startGame() {
        this.state.score = 0;
        this.state.lives = 3;
        this.state.levelIndex = 0;
        this.state.gameOver = false;
        this.state.win = false;
        this.player.big = false;
        this.loadLevel(this.state.levelIndex);
        
        // إعادة تعيين الإحصائيات
        this.spatialHash.platformsHash.resetStats();
        this.objectPools.resetStats();
        this.sound.resetStats();
    }

    /**
     * الحلقة الرئيسية للعبة
     */
    update() {
        if (this.state.gameOver || this.state.win) return;
        
        // تحديث التجزئة المكانية
        this.updateSpatialHash();
        
        // تحديث اللاعب
        this.updatePlayer();
        
        // تحديث الكائنات
        this.updateCoins();
        this.updatePowerups();
        this.updateEnemies();
        this.updateBullets();
        this.updateCheckpoints();
        this.checkPipes();
        this.checkFlag();
        
        // تحديث تجمعات الكائنات
        this.objectPools.update();
        
        // تحديث مراقب الأداء
        this.performanceMonitor.update();
    }

    /**
     * مراقب الأداء
     */
    updateFPS(currentTime) {
        this.frameCount++;
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    /**
     * دوال مساعدة
     */
    clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }

    // باقي الدوال ستتم إضافتها في الملفات التالية...
}