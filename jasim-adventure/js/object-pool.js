/**
 * نظام تجميع الكائنات لتحسين استخدام الذاكرة
 * يقلل من إنشاء وتدمير الكائنات المتكررة
 */
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10, maxSize = 100) {
        this.pool = [];
        this.active = [];
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.initialSize = initialSize;
        this.maxSize = maxSize;
        this.stats = {
            totalCreated: 0,
            totalReused: 0,
            poolHits: 0,
            poolMisses: 0
        };
        
        // إنشاء الكائنات الأولية
        this.prePopulate();
    }
    
    /**
     * إنشاء الكائنات الأولية
     */
    prePopulate() {
        for (let i = 0; i < this.initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    /**
     * الحصول على كائن من التجمع
     */
    get() {
        if (this.pool.length > 0) {
            const obj = this.pool.pop();
            this.resetFn(obj);
            this.active.push(obj);
            this.stats.poolHits++;
            this.stats.totalReused++;
            return obj;
        } else {
            const obj = this.createFn();
            this.active.push(obj);
            this.stats.poolMisses++;
            this.stats.totalCreated++;
            return obj;
        }
    }
    
    /**
     * إعادة كائن إلى التجمع
     */
    return(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            
            // إعادة تعيين الكائن
            this.resetFn(obj);
            
            // إضافة إلى التجمع إذا لم يتجاوز الحد الأقصى
            if (this.pool.length < this.maxSize) {
                this.pool.push(obj);
            }
        }
    }
    
    /**
     * إعادة جميع الكائنات النشطة
     */
    returnAll() {
        for (const obj of this.active) {
            this.resetFn(obj);
            if (this.pool.length < this.maxSize) {
                this.pool.push(obj);
            }
        }
        this.active.length = 0;
    }
    
    /**
     * تنظيف الكائنات الميتة
     */
    cleanup() {
        let writeIndex = 0;
        for (let readIndex = 0; readIndex < this.active.length; readIndex++) {
            const obj = this.active[readIndex];
            if (obj.active !== false && obj.alive !== false) {
                this.active[writeIndex] = obj;
                writeIndex++;
            } else {
                this.return(obj);
            }
        }
        this.active.length = writeIndex;
    }
    
    /**
     * الحصول على إحصائيات الأداء
     */
    getStats() {
        return {
            ...this.stats,
            poolSize: this.pool.length,
            activeCount: this.active.length,
            totalObjects: this.pool.length + this.active.length,
            reuseRate: this.stats.totalReused / (this.stats.totalReused + this.stats.totalCreated)
        };
    }
    
    /**
     * إعادة تعيين الإحصائيات
     */
    resetStats() {
        this.stats = {
            totalCreated: 0,
            totalReused: 0,
            poolHits: 0,
            poolMisses: 0
        };
    }
}

/**
 * تجمع الرصاص
 */
class BulletPool extends ObjectPool {
    constructor() {
        super(
            // دالة إنشاء الرصاص
            () => ({
                x: 0, y: 0, w: 10, h: 10,
                vx: 0, vy: 0, active: true,
                type: 'player', damage: 1
            }),
            // دالة إعادة تعيين الرصاص
            (bullet) => {
                bullet.x = 0;
                bullet.y = 0;
                bullet.vx = 0;
                bullet.vy = 0;
                bullet.active = true;
                bullet.type = 'player';
                bullet.damage = 1;
            },
            20, // حجم أولي
            50   // حد أقصى
        );
    }
    
    /**
     * إنشاء رصاصة جديدة
     */
    createBullet(x, y, vx, vy, type = 'player') {
        const bullet = this.get();
        bullet.x = x;
        bullet.y = y;
        bullet.vx = vx;
        bullet.vy = vy;
        bullet.type = type;
        bullet.active = true;
        return bullet;
    }
}

/**
 * تجمع القوى
 */
class PowerupPool extends ObjectPool {
    constructor() {
        super(
            // دالة إنشاء القوى
            () => ({
                x: 0, y: 0, w: 22, h: 22,
                vx: 0, vy: 0, active: true,
                type: 'grow', collected: false
            }),
            // دالة إعادة تعيين القوى
            (powerup) => {
                powerup.x = 0;
                powerup.y = 0;
                powerup.vx = 0;
                powerup.vy = 0;
                powerup.active = true;
                powerup.type = 'grow';
                powerup.collected = false;
            },
            10, // حجم أولي
            25   // حد أقصى
        );
    }
    
    /**
     * إنشاء قوة جديدة
     */
    createPowerup(x, y, type, vx = 1.0) {
        const powerup = this.get();
        powerup.x = x;
        powerup.y = y;
        powerup.type = type;
        powerup.vx = vx;
        powerup.active = true;
        return powerup;
    }
}

/**
 * تجمع العملات
 */
class CoinPool extends ObjectPool {
    constructor() {
        super(
            // دالة إنشاء العملة
            () => ({
                x: 0, y: 0, w: 18, h: 18,
                taken: false, active: true,
                value: 5, animation: 0
            }),
            // دالة إعادة تعيين العملة
            (coin) => {
                coin.x = 0;
                coin.y = 0;
                coin.taken = false;
                coin.active = true;
                coin.value = 5;
                coin.animation = 0;
            },
            50,  // حجم أولي
            100  // حد أقصى
        );
    }
    
    /**
     * إنشاء عملة جديدة
     */
    createCoin(x, y, value = 5) {
        const coin = this.get();
        coin.x = x;
        coin.y = y;
        coin.value = value;
        coin.active = true;
        return coin;
    }
}

/**
 * مدير تجمعات الكائنات للعبة
 */
class GameObjectPools {
    constructor() {
        this.bullets = new BulletPool();
        this.powerups = new PowerupPool();
        this.coins = new CoinPool();
        
        // تجمعات إضافية
        this.enemies = new ObjectPool(
            () => ({
                type: 'walker', x: 0, y: 0, w: 30, h: 26,
                dir: 1, speed: 1.0, alive: true,
                vx: 0, vy: 0, cooldown: 0
            }),
            (enemy) => {
                enemy.x = 0;
                enemy.y = 0;
                enemy.dir = 1;
                enemy.speed = 1.0;
                enemy.alive = true;
                enemy.vx = 0;
                enemy.vy = 0;
                enemy.cooldown = 0;
            },
            15, 30
        );
    }
    
    /**
     * تحديث جميع التجمعات
     */
    update() {
        this.bullets.cleanup();
        this.powerups.cleanup();
        this.coins.cleanup();
        this.enemies.cleanup();
    }
    
    /**
     * الحصول على إحصائيات الأداء
     */
    getPerformanceStats() {
        return {
            bullets: this.bullets.getStats(),
            powerups: this.powerups.getStats(),
            coins: this.coins.getStats(),
            enemies: this.enemies.getStats()
        };
    }
    
    /**
     * إعادة تعيين جميع الإحصائيات
     */
    resetStats() {
        this.bullets.resetStats();
        this.powerups.resetStats();
        this.coins.resetStats();
        this.enemies.resetStats();
    }
}