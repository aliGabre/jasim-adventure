// 🍄 مغامرات جاسم - نسخة سوبر ماريو المحسنة 🍄
// Main Game File - Optimized Super Mario Version

class SuperMarioJasimGame {
    constructor() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // إعدادات اللعبة
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this.level = 1;
        this.time = 300;
        
        // إعدادات الأداء
        this.fps = 60;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fpsCounter = 0;
        
        // إعدادات اللاعب
        this.player = {
            x: 100,
            y: 400,
            width: 32,
            height: 32,
            vx: 0,
            vy: 0,
            onGround: false,
            facing: 1, // 1 = right, -1 = left
            health: 100,
            powerLevel: 1,
            bullets: [],
            lastShot: 0
        };
        
        // إعدادات اللعبة
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.powerups = [];
        this.bullets = [];
        this.particles = [];
        this.backgrounds = [];
        
        // إعدادات الكاميرا
        this.camera = {
            x: 0,
            y: 0,
            width: 800,
            height: 600
        };
        
        // إعدادات الإدخال
        this.keys = {};
        this.touchControls = {};
        this.setupInput();
        
        // إعدادات الصوت
        this.soundManager = new GameSoundManager();
        
        // إعدادات الأداء
        this.performanceMonitor = new GamePerformanceManager();
        
        // إعدادات المستويات
        this.levelManager = new LevelManager();
        
        // إعدادات الرسم
        this.renderer = new GameRenderer(this.ctx);
        
        // إعدادات التصادم
        this.spatialHash = new GameSpatialHash();
        
        // إعدادات تجميع الكائنات
        this.objectPools = new GameObjectPools();
        
        // تحميل المستوى الأول
        this.loadLevel(1);
        
        // بدء حلقة اللعبة
        this.gameLoop();
        
        // إعداد واجهة المستخدم
        this.setupUI();
        
        // إعداد أزرار المشاركة
        this.setupShareButtons();
        
        console.log('🎮 تم تحميل لعبة سوبر ماريو المحسنة بنجاح!');
    }
    
    setupCanvas() {
        // تعيين حجم الكانفاس
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // تحسين الأداء
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.textRenderingOptimization = true;
    }
    
    setupInput() {
        // إعدادات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // منع السلوك الافتراضي لبعض المفاتيح
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // إعدادات أزرار الهاتف
        this.setupTouchControls();
        
        // إعدادات لوحة المفاتيح العربية
        this.setupArabicControls();
    }
    
    setupTouchControls() {
        // أزرار الحركة
        const leftBtn = document.getElementById('left');
        const rightBtn = document.getElementById('right');
        const upBtn = document.getElementById('up');
        const downBtn = document.getElementById('down');
        const jumpBtn = document.getElementById('jump');
        const fireBtn = document.getElementById('fire');
        const pauseBtn = document.getElementById('pause');
        const menuBtn = document.getElementById('menu');
        
        // إعدادات أزرار الحركة
        if (leftBtn) {
            leftBtn.addEventListener('touchstart', () => this.touchControls.left = true);
            leftBtn.addEventListener('touchend', () => this.touchControls.left = false);
            leftBtn.addEventListener('mousedown', () => this.touchControls.left = true);
            leftBtn.addEventListener('mouseup', () => this.touchControls.left = false);
        }
        
        if (rightBtn) {
            rightBtn.addEventListener('touchstart', () => this.touchControls.right = true);
            rightBtn.addEventListener('touchend', () => this.touchControls.right = false);
            rightBtn.addEventListener('mousedown', () => this.touchControls.right = true);
            rightBtn.addEventListener('mouseup', () => this.touchControls.right = false);
        }
        
        if (upBtn) {
            upBtn.addEventListener('touchstart', () => this.touchControls.up = true);
            upBtn.addEventListener('touchend', () => this.touchControls.up = false);
            upBtn.addEventListener('mousedown', () => this.touchControls.up = true);
            upBtn.addEventListener('mouseup', () => this.touchControls.up = false);
        }
        
        if (downBtn) {
            downBtn.addEventListener('touchstart', () => this.touchControls.down = true);
            downBtn.addEventListener('touchend', () => this.touchControls.down = false);
            downBtn.addEventListener('mousedown', () => this.touchControls.down = true);
            downBtn.addEventListener('mouseup', () => this.touchControls.down = false);
        }
        
        if (jumpBtn) {
            jumpBtn.addEventListener('touchstart', () => this.touchControls.jump = true);
            jumpBtn.addEventListener('touchend', () => this.touchControls.jump = false);
            jumpBtn.addEventListener('mousedown', () => this.touchControls.jump = true);
            jumpBtn.addEventListener('mouseup', () => this.touchControls.jump = false);
        }
        
        if (fireBtn) {
            fireBtn.addEventListener('touchstart', () => this.touchControls.fire = true);
            fireBtn.addEventListener('touchend', () => this.touchControls.fire = false);
            fireBtn.addEventListener('mousedown', () => this.touchControls.fire = true);
            fireBtn.addEventListener('mouseup', () => this.touchControls.fire = false);
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.showMenu());
        }
    }
    
    setupArabicControls() {
        // دعم لوحة المفاتيح العربية
        const arabicKeys = {
            'KeyA': 'ArrowLeft',    // أ
            'KeyD': 'ArrowRight',   // د
            'KeyW': 'Space',        // و
            'KeyS': 'ArrowDown'     // س
        };
        
        document.addEventListener('keydown', (e) => {
            if (arabicKeys[e.code]) {
                this.keys[arabicKeys[e.code]] = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (arabicKeys[e.code]) {
                this.keys[arabicKeys[e.code]] = false;
            }
        });
    }
    
    loadLevel(levelNumber) {
        console.log(`🎯 تحميل المستوى ${levelNumber}`);
        
        // تحميل بيانات المستوى
        const levelData = this.levelManager.getLevel(levelNumber);
        
        // تطبيق البيانات
        this.platforms = levelData.platforms;
        this.enemies = levelData.enemies;
        this.coins = levelData.coins;
        this.powerups = levelData.powerups;
        this.backgrounds = levelData.backgrounds;
        
        // إعادة تعيين اللاعب
        this.player.x = levelData.playerStart.x;
        this.player.y = levelData.playerStart.y;
        this.player.vx = 0;
        this.player.vy = 0;
        
        // إعادة تعيين الكاميرا
        this.camera.x = 0;
        this.camera.y = 0;
        
        // إعادة تعيين الوقت
        this.time = 300;
        
        // تحديث واجهة المستخدم
        this.updateUI();
        
        // تشغيل موسيقى المستوى
        this.soundManager.playLevelMusic(levelNumber);
        
        console.log(`✅ تم تحميل المستوى ${levelNumber} بنجاح`);
    }
    
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime >= 1000 / this.fps) {
            this.update(deltaTime);
            this.draw();
            
            this.lastTime = currentTime;
            this.frameCount++;
            
            // تحديث عداد FPS
            if (this.frameCount % 60 === 0) {
                this.fpsCounter = Math.round(1000 / deltaTime);
            }
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // تحديث اللاعب
        this.updatePlayer(deltaTime);
        
        // تحديث الأعداء
        this.updateEnemies(deltaTime);
        
        // تحديث الرصاصات
        this.updateBullets(deltaTime);
        
        // تحديث العملات والقوى
        this.updateItems(deltaTime);
        
        // تحديث الجسيمات
        this.updateParticles(deltaTime);
        
        // تحديث الكاميرا
        this.updateCamera();
        
        // تحديث التصادم
        this.updateCollisions();
        
        // تحديث الوقت
        this.updateTime(deltaTime);
        
        // تحديث مراقب الأداء
        this.performanceMonitor.update(deltaTime);
    }
    
    updatePlayer(deltaTime) {
        // معالجة الإدخال
        this.handlePlayerInput();
        
        // تطبيق الجاذبية
        if (!this.player.onGround) {
            this.player.vy += 0.8; // الجاذبية
        }
        
        // تحديث الموقع
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
        
        // حدود الشاشة
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > 8000) this.player.x = 8000;
        if (this.player.y > 600) {
            this.player.y = 600;
            this.player.vy = 0;
            this.player.onGround = true;
        }
        
        // إطلاق الرصاص - تم تغييره من Alt إلى Ctrl
        if (this.keys['ControlLeft'] || this.keys['ControlRight'] || this.touchControls.fire) {
            this.fireBullet();
        }
    }
    
    handlePlayerInput() {
        // الحركة الأفقية
        if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchControls.left) {
            this.player.vx = -5;
            this.player.facing = -1;
        } else if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchControls.right) {
            this.player.vx = 5;
            this.player.facing = 1;
        } else {
            this.player.vx = 0;
        }
        
        // القفز
        if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'] || this.touchControls.jump) && this.player.onGround) {
            this.player.vy = -15;
            this.player.onGround = false;
            this.soundManager.playSound('jump');
        }
        
        // الحركة العمودية
        if (this.keys['ArrowDown'] || this.keys['KeyS'] || this.touchControls.down) {
            // يمكن إضافة سلوك للحركة للأسفل
        }
    }
    
    fireBullet() {
        const now = Date.now();
        if (now - this.player.lastShot < 200) return; // تأخير بين الطلقات
        
        const bullet = this.objectPools.bulletPool.get();
        if (bullet) {
            bullet.x = this.player.x + (this.player.facing === 1 ? this.player.width : 0);
            bullet.y = this.player.y + this.player.height / 2;
            bullet.vx = this.player.facing * 10;
            bullet.vy = 0;
            bullet.active = true;
            
            this.bullets.push(bullet);
            this.player.lastShot = now;
            
            this.soundManager.playSound('shoot');
        }
    }
    
    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => {
            if (!enemy.active) return;
            
            // تحديث الموقع
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            
            // تطبيق الجاذبية
            if (!enemy.onGround) {
                enemy.vy += 0.8;
            }
            
            // حدود الحركة
            if (enemy.x <= enemy.startX - 100 || enemy.x >= enemy.startX + 100) {
                enemy.vx *= -1;
            }
            
            // فحص التصادم مع الأرض
            enemy.onGround = false;
            this.platforms.forEach(platform => {
                if (this.checkCollision(enemy, platform)) {
                    enemy.y = platform.y - enemy.height;
                    enemy.vy = 0;
                    enemy.onGround = true;
                }
            });
        });
    }
    
    updateBullets(deltaTime) {
        this.bullets.forEach((bullet, index) => {
            if (!bullet.active) return;
            
            // تحديث الموقع
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // إزالة الرصاصات خارج الشاشة
            if (bullet.x < this.camera.x - 100 || bullet.x > this.camera.x + this.camera.width + 100) {
                bullet.active = false;
                this.objectPools.bulletPool.release(bullet);
                this.bullets.splice(index, 1);
            }
        });
    }
    
    updateItems(deltaTime) {
        // تحديث العملات
        this.coins.forEach(coin => {
            if (coin.active) {
                coin.rotation += 0.1;
            }
        });
        
        // تحديث القوى
        this.powerups.forEach(powerup => {
            if (powerup.active) {
                powerup.y += Math.sin(Date.now() * 0.005) * 0.5;
            }
        });
    }
    
    updateParticles(deltaTime) {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    updateCamera() {
        // تتبع اللاعب
        const targetX = this.player.x - this.camera.width / 2;
        const targetY = this.player.y - this.camera.height / 2;
        
        // حركة سلسة للكاميرا
        this.camera.x += (targetX - this.camera.x) * 0.1;
        this.camera.y += (targetY - this.camera.y) * 0.1;
        
        // حدود الكاميرا
        if (this.camera.x < 0) this.camera.x = 0;
        if (this.camera.y < 0) this.camera.y = 0;
    }
    
    updateCollisions() {
        // تحديث الشبكة المكانية
        this.spatialHash.clear();
        this.spatialHash.addObject(this.player, 'player');
        
        this.platforms.forEach(platform => {
            this.spatialHash.addObject(platform, 'platform');
        });
        
        this.enemies.forEach(enemy => {
            this.spatialHash.addObject(enemy, 'enemy');
        });
        
        // فحص تصادم اللاعب مع المنصات
        const nearbyPlatforms = this.spatialHash.getNearbyObjects(this.player, 'platform');
        this.player.onGround = false;
        
        nearbyPlatforms.forEach(platform => {
            if (this.checkCollision(this.player, platform)) {
                this.resolveCollision(this.player, platform);
            }
        });
        
        // فحص تصادم اللاعب مع الأعداء
        const nearbyEnemies = this.spatialHash.getNearbyObjects(this.player, 'enemy');
        nearbyEnemies.forEach(enemy => {
            if (this.checkCollision(this.player, enemy)) {
                this.handlePlayerEnemyCollision(enemy);
            }
        });
        
        // فحص تصادم الرصاصات مع الأعداء
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;
            
            const nearbyEnemies = this.spatialHash.getNearbyObjects(bullet, 'enemy');
            nearbyEnemies.forEach(enemy => {
                if (this.checkCollision(bullet, enemy)) {
                    this.handleBulletEnemyCollision(bullet, enemy);
                }
            });
        });
        
        // فحص جمع العملات
        this.coins.forEach((coin, index) => {
            if (coin.active && this.checkCollision(this.player, coin)) {
                this.collectCoin(coin, index);
            }
        });
        
        // فحص جمع القوى
        this.powerups.forEach((powerup, index) => {
            if (powerup.active && this.checkCollision(this.player, powerup)) {
                this.collectPowerup(powerup, index);
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    resolveCollision(player, platform) {
        const overlapX = Math.min(
            player.x + player.width - platform.x,
            platform.x + platform.width - player.x
        );
        const overlapY = Math.min(
            player.y + player.height - platform.y,
            platform.y + platform.height - player.y
        );
        
        if (overlapX < overlapY) {
            if (player.x < platform.x) {
                player.x = platform.x - player.width;
            } else {
                player.x = platform.x + platform.width;
            }
            player.vx = 0;
        } else {
            if (player.y < platform.y) {
                player.y = platform.y - player.height;
                player.vy = 0;
            } else {
                player.y = platform.y + platform.height;
                player.vy = 0;
                player.onGround = true;
            }
        }
    }
    
    handlePlayerEnemyCollision(enemy) {
        if (this.player.vy > 0 && this.player.y < enemy.y) {
            // اللاعب يقفز على العدو
            this.defeatEnemy(enemy);
            this.player.vy = -10; // ارتداد صغير
        } else {
            // اللاعب يصاب
            this.playerHit();
        }
    }
    
    handleBulletEnemyCollision(bullet, enemy) {
        bullet.active = false;
        this.defeatEnemy(enemy);
        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    }
    
    defeatEnemy(enemy) {
        enemy.active = false;
        this.score += 100;
        this.soundManager.playSound('enemyDefeat');
        this.updateUI();
    }
    
    playerHit() {
        this.lives--;
        this.player.health -= 20;
        this.soundManager.playSound('playerHit');
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.respawnPlayer();
        }
        
        this.updateUI();
    }
    
    collectCoin(coin, index) {
        coin.active = false;
        this.coins.splice(index, 1);
        this.score += 50;
        this.soundManager.playSound('coin');
        this.createCoinEffect(coin.x, coin.y);
        this.updateUI();
    }
    
    collectPowerup(powerup, index) {
        powerup.active = false;
        this.powerups.splice(index, 1);
        this.player.powerLevel++;
        this.score += 200;
        this.soundManager.playSound('powerup');
        this.createPowerupEffect(powerup.x, powerup.y);
        this.updateUI();
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1000,
                color: '#FFD700'
            };
            this.particles.push(particle);
        }
    }
    
    createCoinEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 5,
                life: 500,
                color: '#FFD700'
            };
            this.particles.push(particle);
        }
    }
    
    createPowerupEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 800,
                color: '#FF00FF'
            };
            this.particles.push(particle);
        }
    }
    
    updateTime(deltaTime) {
        this.time -= deltaTime / 1000;
        if (this.time <= 0) {
            this.timeUp();
        }
    }
    
    timeUp() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.respawnPlayer();
        }
        this.updateUI();
    }
    
    respawnPlayer() {
        this.player.x = 100;
        this.player.y = 400;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.health = 100;
        
        // إعادة تعيين الكاميرا
        this.camera.x = 0;
        this.camera.y = 0;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.soundManager.playSound('gameOver');
        this.showMessage('انتهت اللعبة!', 'اضغط R لإعادة المحاولة');
    }
    
    showMessage(title, subtitle = '') {
        const msgDiv = document.getElementById('msg');
        msgDiv.innerHTML = `${title}<br><small>${subtitle}</small>`;
        msgDiv.style.display = 'flex';
    }
    
    hideMessage() {
        const msgDiv = document.getElementById('msg');
        msgDiv.style.display = 'none';
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showMessage('متوقف مؤقتاً', 'اضغط P للاستمرار');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.hideMessage();
        }
    }
    
    showMenu() {
        this.gameState = 'menu';
        this.showMessage('القائمة الرئيسية', 'اضغط Enter للبدء');
    }
    
    draw() {
        // مسح الشاشة
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // حفظ سياق الرسم
        this.ctx.save();
        
        // تطبيق تحويل الكاميرا
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // رسم الخلفية
        this.renderer.drawBackground(this.level, this.camera);
        
        // رسم المنصات
        this.platforms.forEach(platform => {
            if (this.isInViewport(platform)) {
                this.renderer.drawPlatform(platform, this.level);
            }
        });
        
        // رسم العملات
        this.coins.forEach(coin => {
            if (coin.active && this.isInViewport(coin)) {
                this.renderer.drawCoin(coin);
            }
        });
        
        // رسم القوى
        this.powerups.forEach(powerup => {
            if (powerup.active && this.isInViewport(powerup)) {
                this.renderer.drawPowerup(powerup);
            }
        });
        
        // رسم الأعداء
        this.enemies.forEach(enemy => {
            if (enemy.active && this.isInViewport(enemy)) {
                this.renderer.drawEnemy(enemy, this.level);
            }
        });
        
        // رسم الرصاصات
        this.bullets.forEach(bullet => {
            if (bullet.active && this.isInViewport(bullet)) {
                this.renderer.drawBullet(bullet);
            }
        });
        
        // رسم الجسيمات
        this.particles.forEach(particle => {
            this.renderer.drawParticle(particle);
        });
        
        // رسم اللاعب
        this.renderer.drawPlayer(this.player, this.level);
        
        // استعادة سياق الرسم
        this.ctx.restore();
        
        // رسم واجهة المستخدم
        this.drawUI();
        
        // رسم معلومات الأداء
        this.drawPerformanceInfo();
    }
    
    isInViewport(obj) {
        return obj.x + obj.width > this.camera.x &&
               obj.x < this.camera.x + this.camera.width &&
               obj.y + obj.height > this.camera.y &&
               obj.y < this.camera.y + this.camera.height;
    }
    
    drawUI() {
        // رسم شريط الصحة
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(20, 20, 200, 20);
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(20, 20, (this.player.health / 100) * 200, 20);
        
        // رسم حدود شريط الصحة
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(20, 20, 200, 20);
        
        // رسم النص
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`الصحة: ${this.player.health}%`, 25, 35);
    }
    
    drawPerformanceInfo() {
        // تحديث معلومات الأداء في HTML
        document.getElementById('fps').textContent = this.fpsCounter;
        document.getElementById('objects').textContent = this.enemies.length + this.coins.length + this.powerups.length;
        document.getElementById('visible').textContent = this.getVisibleObjectsCount();
        document.getElementById('collisions').textContent = this.spatialHash.getCollisionCount();
        document.getElementById('memory').textContent = Math.round(performance.memory?.usedJSHeapSize / 1024) || 0;
    }
    
    getVisibleObjectsCount() {
        let count = 0;
        this.enemies.forEach(enemy => {
            if (this.isInViewport(enemy)) count++;
        });
        this.coins.forEach(coin => {
            if (coin.active && this.isInViewport(coin)) count++;
        });
        this.powerups.forEach(powerup => {
            if (powerup.active && this.isInViewport(powerup)) count++;
        });
        return count;
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('coins').textContent = this.coins.filter(c => c.active).length;
        document.getElementById('level').textContent = this.level;
        document.getElementById('time').textContent = Math.max(0, Math.floor(this.time));
    }
    
    setupUI() {
        // إعداد أزرار التحكم
        this.updateUI();
        
        // إضافة مستمعي الأحداث للوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR' && this.gameState === 'gameOver') {
                this.restartGame();
            } else if (e.code === 'KeyP') {
                this.togglePause();
            } else if (e.code === 'Enter' && this.gameState === 'menu') {
                this.startGame();
            }
        });
    }
    
    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this.level = 1;
        this.time = 300;
        this.gameState = 'playing';
        this.hideMessage();
        this.loadLevel(1);
        this.updateUI();
    }
    
    startGame() {
        this.gameState = 'playing';
        this.hideMessage();
    }
    
    setupShareButtons() {
        // زر المشاركة
        const shareBtn = document.getElementById('shareOpen');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.showShareOverlay());
        }
        
        // زر ملء الشاشة
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // زر الجودة
        const qualityBtn = document.getElementById('qualityBtn');
        if (qualityBtn) {
            qualityBtn.addEventListener('click', () => this.toggleQuality());
        }
        
        // إعداد نافذة المشاركة
        this.setupShareOverlay();
    }
    
    showShareOverlay() {
        const overlay = document.getElementById('overlay');
        const pageUrl = document.getElementById('pageUrl');
        const qrImg = document.getElementById('qrImg');
        
        // تعيين الرابط الحالي
        pageUrl.value = window.location.href;
        
        // إنشاء QR Code
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(window.location.href)}`;
        qrImg.src = qrUrl;
        
        // عرض النافذة
        overlay.style.display = 'flex';
        
        // إعداد أزرار النافذة
        this.setupOverlayButtons();
    }
    
    setupShareOverlay() {
        // زر نسخ الرابط
        const copyBtn = document.getElementById('copyLink');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const urlInput = document.getElementById('pageUrl');
                urlInput.select();
                document.execCommand('copy');
                copyBtn.textContent = 'تم النسخ!';
                setTimeout(() => {
                    copyBtn.textContent = 'نسخ الرابط';
                }, 2000);
            });
        }
        
        // زر المشاركة الأصلية
        const nativeShareBtn = document.getElementById('nativeShare');
        if (nativeShareBtn) {
            nativeShareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'مغامرات جاسم - نسخة سوبر ماريو المحسنة',
                        text: 'العب هذه اللعبة المذهلة!',
                        url: window.location.href
                    });
                } else {
                    alert('المشاركة الأصلية غير مدعومة في هذا المتصفح');
                }
            });
        }
        
        // زر الإغلاق
        const closeBtn = document.getElementById('closeOverlay');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('overlay').style.display = 'none';
            });
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('خطأ في تفعيل ملء الشاشة:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    toggleQuality() {
        // تبديل جودة الرسومات
        if (this.renderer.quality === 'high') {
            this.renderer.quality = 'medium';
            this.fps = 45;
        } else if (this.renderer.quality === 'medium') {
            this.renderer.quality = 'low';
            this.fps = 30;
        } else {
            this.renderer.quality = 'high';
            this.fps = 60;
        }
        
        console.log(`🎨 تم تغيير جودة الرسومات إلى: ${this.renderer.quality}`);
    }
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تحميل لعبة سوبر ماريو المحسنة...');
    
    // إنشاء اللعبة
    window.game = new SuperMarioJasimGame();
    
    console.log('✅ تم تحميل اللعبة بنجاح!');
});