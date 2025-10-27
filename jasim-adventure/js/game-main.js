/**
 * الملف الرئيسي للعبة مع دمج جميع التحسينات
 */
class OptimizedJasimGame {
    constructor() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        
        // تهيئة الأنظمة المحسنة
        this.levelManager = new LevelManager();
        this.renderer = new GameRenderer(this.canvas, this.ctx);
        this.spatialHash = new GameSpatialHash();
        this.objectPools = new GameObjectPools();
        this.sound = new GameSoundManager();
        this.performanceManager = new GamePerformanceManager();
        
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
        
        // الثوابت
        this.GRAVITY = 0.6;
        this.MOVE_SPEED = 4.0;
        this.JUMP_VELOCITY = -12.5;
        this.COYOTE_TIME_FRAMES = 8;
        this.JUMP_BUFFER_FRAMES = 8;
        
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
        
        // بدء اللعبة
        this.startGame();
        
        // بدء حلقة اللعبة
        this.gameLoop();
        
        console.log('🎮 اللعبة المحسنة جاهزة!');
    }
    
    /**
     * إعداد المدخلات
     */
    setupInput() {
        addEventListener('keydown', e => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'ArrowDown'].includes(e.code)) e.preventDefault();
            if (this.state.gameOver || this.state.win) { this.startGame(); return; }

            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
            if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') { 
                this.keys.jump = true; this.keys.up = true; this.justPressed.jump = true; 
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = true;
            if (e.code === 'AltLeft' || e.code === 'AltRight' || e.key === 'Alt' || e.code === 'KeyZ') {
                e.preventDefault();
                this.keys.shoot = true; this.justPressed.shoot = true;
            }
        }, { passive: false });

        addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
            if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') { 
                this.keys.jump = false; this.keys.up = false; 
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = false;
            if (e.code === 'AltLeft' || e.code === 'AltRight' || e.key === 'Alt' || e.code === 'KeyZ') { 
                this.keys.shoot = false; 
            }
        });
    }
    
    /**
     * إعداد التحكم بالموبايل
     */
    setupMobileControls() {
        const btnL = document.getElementById('left');
        const btnR = document.getElementById('right');
        const btnJ = document.getElementById('jump');
        const btnF = document.getElementById('fire');
        const btnD = document.getElementById('down');

        const bindBtn = (btn, prop) => {
            const down = e => {
                e.preventDefault();
                if (this.state.gameOver || this.state.win) { this.startGame(); return; }
                this.keys[prop] = true;
                if (prop === 'jump') this.justPressed.jump = true;
                if (prop === 'shoot') this.justPressed.shoot = true;
            };
            const up = e => { e.preventDefault(); this.keys[prop] = false; };
            
            btn.addEventListener('touchstart', down, { passive: false });
            btn.addEventListener('touchend', up, { passive: false });
            btn.addEventListener('mousedown', down);
            btn.addEventListener('mouseup', up);
            btn.addEventListener('mouseleave', up);
        };

        bindBtn(btnL, 'left');
        bindBtn(btnR, 'right');
        bindBtn(btnJ, 'jump');
        bindBtn(btnF, 'shoot');
        bindBtn(btnD, 'down');
    }
    
    /**
     * إعداد المشاركة
     */
    setupSharing() {
        const shareOpen = document.getElementById('shareOpen');
        const closeOverlay = document.getElementById('closeOverlay');
        const copyLink = document.getElementById('copyLink');
        const nativeShare = document.getElementById('nativeShare');
        const pageUrl = document.getElementById('pageUrl');
        const qrImg = document.getElementById('qrImg');
        
        shareOpen.onclick = () => this.openShare();
        closeOverlay.onclick = () => document.getElementById('overlay').style.display = 'none';
        
        copyLink.onclick = async () => {
            try {
                await navigator.clipboard.writeText(pageUrl.value);
                copyLink.textContent = 'تم النسخ ✓';
                setTimeout(() => copyLink.textContent = 'نسخ الرابط', 1200);
            } catch { }
        };

        nativeShare.onclick = async () => {
            try {
                if (navigator.share) {
                    await navigator.share({ title: document.title, url: location.href });
                } else {
                    alert('ميزة المشاركة غير مدعومة على هذا المتصفح');
                }
            } catch { }
        };
    }
    
    /**
     * فتح المشاركة
     */
    openShare() {
        const url = location.href;
        document.getElementById('pageUrl').value = url;
        document.getElementById('qrImg').src = 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=M|0&chl=' + encodeURIComponent(url);
        document.getElementById('overlay').style.display = 'flex';
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
        this.updateHUD();
        this.hideMsg();
        
        // إعادة تعيين الإحصائيات
        this.spatialHash.platformsHash.resetStats();
        this.objectPools.resetStats();
        this.sound.resetStats();
        this.performanceManager.getMonitor().reset();
        
        console.log('🚀 بدأت اللعبة المحسنة!');
    }
    
    /**
     * تحميل مستوى
     */
    loadLevel(index) {
        this.level = this.levelManager.loadLevel(index);
        if (!this.level) return;
        
        this.platforms = this.level.platforms;
        this.coins = this.level.coins;
        this.blocks = this.level.blocks;
        this.enemies = this.level.enemies;
        this.bullets = [];
        this.eBullets = [];
        this.powerups = [];
        this.pipes = this.level.pipes;
        this.checkpoints = this.level.checkpoints;
        this.flag = this.level.flag;
        this.houses = this.level.houses;
        
        // إعادة تعيين اللاعب
        this.player.x = this.level.start.x;
        this.player.y = this.level.start.y;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.onGround = false;
        this.player.coyote = 0;
        this.player.jumpBuffer = 0;
        this.player.invul = 0;
        this.player.shootCooldown = 0;
        
        this.state.cameraX = 0;
        this.state.respawn = { x: this.level.start.x, y: Math.min(this.level.start.y, 472 - this.player.h) };
        
        this.updateHUD();
        this.hideMsg();
        
        console.log(`📊 تم تحميل المستوى: ${this.level.name}`);
    }
    
    /**
     * تحديث اللاعب
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
     * الحركة مع التصادم
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
     * فحص الأرض
     */
    checkOnGround(o) {
        const feet = { x: o.x, y: o.y + o.h, w: o.w, h: 2 };
        const nearby = this.spatialHash.getNearbyPlatforms(o.x, o.y, 50);
        return nearby.some(p => this.rectsCollide(feet, p));
    }
    
    /**
     * اكتشاف التصادم
     */
    rectsCollide(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && 
               a.y < b.y + b.h && a.y + a.h > b.y;
    }
    
    /**
     * ضرب صندوق
     */
    hitBlockAt(cx, yTouch) {
        for (let i = 0; i < this.blocks.length; i++) {
            const b = this.blocks[i];
            if (Math.abs((b.x + 20) - cx) <= 22 && Math.abs((b.y + b.h) - yTouch) < 8) {
                if (b.type === 'q' && !b.hit) {
                    b.hit = true;
                    if (b.contains === 'coin') {
                        this.state.score += 10;
                        this.updateHUD();
                        this.sound.coin();
                    } else if (b.contains === 'grow') {
                        const powerup = this.objectPools.powerups.createPowerup(b.x, b.y - 22, 'grow', 1.0);
                        this.powerups.push(powerup);
                        this.sound.power();
                    } else if (b.contains === 'life') {
                        this.state.lives += 1;
                        this.updateHUD();
                        this.sound.life();
                    }
                } else if (b.type === 'brick') {
                    if (b.breakable && this.player.big) {
                        this.blocks.splice(i, 1);
                        this.sound.break();
                    }
                }
                break;
            }
        }
    }
    
    /**
     * تحديث العملات
     */
    updateCoins() {
        for (const c of this.coins) {
            if (!c.taken && this.rectsCollide(this.player, c)) {
                c.taken = true;
                this.state.score += 5;
                this.updateHUD();
                this.sound.coin();
            }
        }
    }
    
    /**
     * تحديث القوى
     */
    updatePowerups() {
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const p = this.powerups[i];
            p.x += p.vx;
            p.vy = (p.vy || 0) + this.GRAVITY * 0.7;
            this.moveItemWithPlatforms(p);
            
            if (this.rectsCollide(this.player, p)) {
                this.objectPools.powerups.return(p);
                this.powerups.splice(i, 1);
                
                if (p.type === 'grow') {
                    if (!this.player.big) {
                        this.player.big = true;
                        const oldH = this.player.h;
                        this.player.h = 64;
                        this.player.y -= (this.player.h - oldH);
                    }
                    this.state.score += 20;
                    this.updateHUD();
                    this.sound.power();
                }
            }
        }
    }
    
    /**
     * حركة عنصر مع المنصات
     */
    moveItemWithPlatforms(o) {
        const dx = o.vx || 0;
        const dy = o.vy || 0;
        
        o.x += dx;
        for (const p of this.platforms) {
            if (this.rectsCollide(o, p)) {
                if (dx > 0) o.x = p.x - o.w;
                else o.x = p.x + p.w;
                o.vx = -(o.vx || 0);
            }
        }
        
        o.y += dy;
        for (const p of this.platforms) {
            if (this.rectsCollide(o, p)) {
                if (dy > 0) { 
                    o.y = p.y - o.h; 
                    o.vy = 0; 
                } else { 
                    o.y = p.y + p.h; 
                    o.vy = 0; 
                }
            }
        }
    }
    
    /**
     * تحديث الأعداء
     */
    updateEnemies() {
        for (const e of this.enemies) {
            if (!e.alive) continue;
            
            if (e.type === 'walker') {
                e.vx = e.dir * e.speed;
                e.vy = (e.vy || 0) + this.GRAVITY * 0.9;
                this.moveEntityWithPlatforms(e, e.vx, e.vy);
                
                if (this.onEdge(e)) e.dir *= -1;

                if (this.rectsCollide(this.player, e)) {
                    if (this.player.vy > 0 && this.player.y + this.player.h - 6 < e.y + 10) {
                        e.alive = false;
                        this.state.score += 20;
                        this.updateHUD();
                        this.player.vy = -9;
                        this.sound.stomp();
                    } else {
                        this.takeHit(false);
                    }
                }
            } else if (e.type === 'shooter') {
                e.vy = (e.vy || 0) + this.GRAVITY * 0.9;
                this.moveEntityWithPlatforms(e, 0, e.vy);
                
                if (e.cooldown > 0) e.cooldown--;
                
                const dist = Math.abs((e.x + e.w / 2) - (this.player.x + this.player.w / 2));
                if (dist < 520 && e.cooldown === 0) {
                    const dir = Math.sign((this.player.x + this.player.w / 2) - (e.x + e.w / 2)) || 1;
                    this.eBullets.push({ 
                        x: e.x + e.w / 2, y: e.y + e.h * 0.5, w: 10, h: 10, 
                        vx: dir * 6.5, vy: 0 
                    });
                    e.cooldown = 90 + (Math.random() * 60 | 0);
                }
                
                if (this.rectsCollide(this.player, e)) this.takeHit(false);
            }
        }
    }
    
    /**
     * حركة كائن مع المنصات
     */
    moveEntityWithPlatforms(o, dx, dy) {
        o.x += dx;
        const near = this.spatialHash.getNearbyPlatforms(o.x, o.y, 50);
        for (const p of near) {
            if (this.rectsCollide(o, p)) {
                if (dx > 0) o.x = p.x - o.w;
                else o.x = p.x + p.w;
                o.vx = 0;
                if (o.dir) o.dir *= -1;
            }
        }
        
        o.y += dy;
        for (const p of near) {
            if (this.rectsCollide(o, p)) {
                if (dy > 0) { 
                    o.y = p.y - o.h; 
                    o.vy = 0; 
                } else { 
                    o.y = p.y + p.h; 
                    o.vy = 0; 
                }
            }
        }
    }
    
    /**
     * فحص الحافة
     */
    onEdge(e) {
        const foot = { x: e.x + (e.dir > 0 ? e.w + 1 : -1), y: e.y + e.h + 1, w: 2, h: 2 };
        return !this.platforms.some(p => this.rectsCollide(foot, p));
    }
    
    /**
     * تحديث الرصاص
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
     * أخذ ضرر
     */
    takeHit(fell) {
        if (this.player.invul > 0) return;
        
        if (this.player.big) {
            this.player.big = false;
            const oldH = this.player.h;
            this.player.h = 48;
            this.player.y += (oldH - this.player.h);
            this.player.invul = 120;
            this.sound.hit();
        } else {
            this.state.lives--;
            this.updateHUD();
            this.sound.hit();
            
            if (this.state.lives <= 0) {
                this.state.gameOver = true;
                this.showMsg('انتهت اللعبة', 'اضغط أي زر أو المس الشاشة للبدء من جديد');
                return;
            } else {
                this.player.x = this.state.respawn.x;
                this.player.y = Math.min(this.state.respawn.y, 472 - this.player.h);
                this.player.vx = 0;
                this.player.vy = 0;
                this.player.invul = 120;
            }
        }
    }
    
    /**
     * تحديث نقاط الحفظ
     */
    updateCheckpoints() {
        for (const cp of this.checkpoints) {
            if (!cp.reached && this.player.x + this.player.w / 2 >= cp.x) {
                cp.reached = true;
                this.state.respawn = { x: cp.x + 20, y: 472 - this.player.h };
                this.showMsg('نقطة حفظ ✓');
                setTimeout(() => this.hideMsg(), 700);
            }
        }
    }
    
    /**
     * فحص الأنابيب
     */
    checkPipes() {
        for (const p of this.pipes) {
            const topArea = { x: p.x, y: p.y - 4, w: p.w, h: 8 };
            const onTop = this.rectsCollide(
                { x: this.player.x + 4, y: this.player.y + this.player.h - 2, w: this.player.w - 8, h: 4 },
                topArea
            );
            
            if (onTop && p.enterDir === 'down' && this.keys.down && this.player.onGround) {
                this.warpTo(p.target);
                return;
            }
            if (onTop && p.enterDir === 'up' && this.keys.up && this.player.onGround) {
                this.warpTo(p.target);
                return;
            }
        }
    }
    
    /**
     * الانتقال عبر الأنبوب
     */
    warpTo(target) {
        const idx = this.levelManager.findLevelByName(target.name);
        if (idx < 0) return;
        
        this.state.levelIndex = idx;
        this.loadLevel(this.state.levelIndex);
        
        if (target.spawn) {
            this.player.x = target.spawn.x;
            this.player.y = target.spawn.y;
            this.player.vx = 0;
            this.player.vy = 0;
        }
        
        this.state.respawn = { x: this.player.x, y: this.player.y };
        this.sound.power();
        this.showMsg('انتقال عبر الأنبوب...', '');
        setTimeout(() => this.hideMsg(), 500);
    }
    
    /**
     * فحص العلم
     */
    checkFlag() {
        if (!this.flag.reached && this.player.x + this.player.w > this.flag.x) {
            this.flag.reached = true;
            this.sound.win();
            this.state.score += 100;
            this.updateHUD();
            
            if (this.state.levelIndex < this.levelManager.levels.length - 1) {
                this.showMsg(`أحسنت! الانتقال إلى المستوى ${this.state.levelIndex + 2}`, '...جاري التحميل');
                setTimeout(() => { 
                    this.state.levelIndex++; 
                    this.loadLevel(this.state.levelIndex); 
                }, 1400);
            } else {
                this.state.win = true;
                this.showMsg('فوز! لقد أنهيت اللعبة', 'اضغط أي زر لإعادة اللعب');
            }
        }
    }
    
    /**
     * تحديث HUD
     */
    updateHUD() {
        document.getElementById('score').textContent = this.state.score;
        document.getElementById('lives').textContent = this.state.lives;
        document.getElementById('level').textContent = (this.state.levelIndex + 1);
    }
    
    /**
     * عرض رسالة
     */
    showMsg(txt, small) {
        const msgEl = document.getElementById('msg');
        msgEl.innerHTML = txt + (small ? `<br><small>${small}</small>` : '');
        msgEl.style.display = 'flex';
    }
    
    /**
     * إخفاء رسالة
     */
    hideMsg() {
        document.getElementById('msg').style.display = 'none';
    }
    
    /**
     * تحديث اللعبة
     */
    update() {
        if (this.state.gameOver || this.state.win) return;
        
        // تحديث التجزئة المكانية
        this.spatialHash.updateAll(
            this.platforms,
            this.enemies,
            this.coins,
            this.powerups,
            this.bullets,
            this.eBullets
        );
        
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
        this.performanceManager.getMonitor().update();
    }
    
    /**
     * رسم اللعبة
     */
    draw() {
        // مسح Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // تحديث تجميع الرسومات
        this.renderer.updateRenderBatches({
            platforms: this.platforms,
            blocks: this.blocks,
            coins: this.coins,
            enemies: this.enemies,
            bullets: this.bullets,
            powerups: this.powerups,
            houses: this.houses,
            pipes: this.pipes,
            checkpoints: this.checkpoints,
            flag: this.flag
        });
        
        // رسم الخلفية
        this.renderer.drawBackground(this.level.theme, this.state.cameraX);
        
        // رسم العالم
        this.renderer.drawWorld({
            platforms: this.platforms,
            blocks: this.blocks,
            coins: this.coins,
            enemies: this.enemies,
            bullets: this.bullets,
            powerups: this.powerups,
            houses: this.houses,
            pipes: this.pipes,
            checkpoints: this.checkpoints,
            flag: this.flag
        }, this.state.cameraX);
        
        // رسم اللاعب
        this.renderer.drawPlayer(this.player, this.state.cameraX);
    }
    
    /**
     * حلقة اللعبة الرئيسية
     */
    gameLoop() {
        const currentTime = performance.now();
        
        // تحديث FPS
        this.frameCount++;
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        // تحديث اللعبة
        this.update();
        
        // رسم اللعبة
        this.draw();
        
        // تحديث عرض الأداء
        this.updatePerformanceDisplay();
        
        // استمرار الحلقة
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * تحديث عرض الأداء
     */
    updatePerformanceDisplay() {
        const perfStats = this.spatialHash.getPerformanceStats();
        const poolStats = this.objectPools.getPerformanceStats();
        const renderStats = this.renderer.getRenderStats();
        const soundStats = this.sound.getStats();
        
        const perfInfo = document.getElementById('perfInfo');
        if (perfInfo) {
            perfInfo.innerHTML = `
                FPS: ${this.fps}<br>
                Objects: ${renderStats.totalObjects}<br>
                Visible: ${renderStats.visibleObjects}<br>
                Collision Queries: ${perfStats.platforms.totalQueries}<br>
                Object Reuse: ${Math.round(poolStats.bullets.reuseRate * 100)}%<br>
                Draw Calls: ${renderStats.drawCalls}<br>
                Sound Cache: ${soundStats.cacheSize}
            `;
        }
    }
}

// إنشاء اللعبة عند تحميل الصفحة
window.addEventListener('load', () => {
    window.game = new OptimizedJasimGame();
    console.log('🎮 تم تحميل اللعبة المحسنة بنجاح!');
});