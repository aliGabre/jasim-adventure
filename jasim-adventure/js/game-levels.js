/**
 * ملف المستويات المحسن مع تحسينات في تخزين البيانات
 */
class LevelManager {
    constructor() {
        this.levels = this.createOptimizedLevels();
        this.currentLevel = null;
        this.levelCache = new Map();
    }
    
    /**
     * إنشاء المستويات المحسنة
     */
    createOptimizedLevels() {
        return [
            {
                name: "السهول",
                theme: "overworld",
                width: 4400,
                start: { x: 120, y: 360 },
                flagX: 4200,
                houses: [{ x: 40 }, { x: 4220 }],
                platforms: this.createPlatforms([
                    [500, 420, 120, 20], [720, 380, 120, 20], [940, 340, 120, 20],
                    [1280, 420, 140, 20], [1680, 420, 120, 20], [2100, 380, 120, 20],
                    [2400, 340, 160, 20], [2800, 420, 140, 20], [3180, 380, 120, 20],
                    [3500, 340, 140, 20]
                ]),
                coins: this.createCoins([
                    [560, 380, 8], [1360, 380, 8], [2460, 300, 8], [3520, 300, 8]
                ]),
                blocks: this.createBlocks([
                    [820, 300, 'q', 'coin'], [980, 260, 'q', 'grow'],
                    [1320, 300, 'q', 'life'], [1700, 300, 'brick', true],
                    [1740, 300, 'brick', true]
                ]),
                enemies: this.createEnemies([
                    [600, 432, 'walker', 8, 350], [2300, 432, 'shooter', 1],
                    [3100, 432, 'walker', 1, 0, -1, 1.2]
                ]),
                pipes: this.createPipes([
                    [260, 472, 'down', 'الهضاب', 80, 360],
                    [1800, 472, 'down', 'تحت الأرض 1', 120, 360]
                ]),
                checkpoints: [{ x: 2200 }]
            },
            
            {
                name: "الهضاب",
                theme: "overworld",
                width: 5200,
                start: { x: 80, y: 360 },
                flagX: 5000,
                houses: [{ x: 40 }, { x: 5020 }],
                platforms: this.createPlatforms([
                    [380, 420, 160, 20], [620, 360, 140, 20], [900, 300, 160, 20],
                    [1280, 360, 160, 20], [1600, 420, 160, 20], [2000, 380, 160, 20],
                    [2400, 340, 160, 20], [2800, 300, 200, 20], [3400, 360, 160, 20],
                    [3800, 420, 160, 20], [4200, 380, 160, 20]
                ]),
                coins: this.createCoins([
                    [980, 260, 10], [2860, 260, 10]
                ]),
                blocks: this.createBlocks([
                    [620, 320, 'q', 'grow'], [1260, 320, 'q', 'coin'],
                    [2000, 340, 'q', 'life'], [2400, 300, 'brick', true],
                    [2440, 300, 'brick', true], [2480, 300, 'brick', true]
                ]),
                enemies: this.createEnemies([
                    [500, 432, 'walker', 10, 320], [2600, 432, 'shooter', 1],
                    [4200, 432, 'shooter', 1, 0, 1, 1.0, 120]
                ]),
                pipes: this.createPipes([
                    [600, 472, 'up', 'السهول', 320, 360],
                    [2200, 472, 'down', 'تحت الأرض 1', 420, 360]
                ]),
                checkpoints: [{ x: 2600 }]
            },
            
            {
                name: "تحت الأرض 1",
                theme: "underground",
                width: 3000,
                start: { x: 120, y: 360 },
                flagX: 2800,
                houses: [],
                platforms: this.createPlatforms([
                    [300, 420, 160, 20], [560, 380, 140, 20], [820, 340, 160, 20],
                    [1100, 380, 160, 20], [1400, 420, 160, 20], [1800, 380, 160, 20],
                    [2200, 340, 160, 20]
                ]),
                coins: this.createCoins([
                    [360, 380, 12], [1860, 300, 12]
                ]),
                blocks: this.createBlocks([
                    [560, 340, 'q', 'coin'], [820, 300, 'q', 'grow']
                ]),
                enemies: this.createEnemies([
                    [400, 432, 'walker', 6, 260], [2000, 432, 'shooter', 1]
                ]),
                pipes: this.createPipes([
                    [2600, 472, 'up', 'الهضاب', 2400, 360]
                ]),
                checkpoints: [{ x: 1500 }]
            },
            
            {
                name: "الصحراء",
                theme: "desert",
                width: 5200,
                start: { x: 120, y: 360 },
                flagX: 5000,
                houses: [{ x: 40 }, { x: 5020 }],
                platforms: this.createPlatforms([
                    [460, 420, 200, 20], [820, 380, 180, 20], [1200, 340, 160, 20],
                    [1600, 300, 200, 20], [2100, 340, 160, 20], [2500, 380, 180, 20],
                    [2900, 420, 160, 20], [3400, 380, 180, 20], [3800, 340, 160, 20],
                    [4200, 300, 200, 20]
                ]),
                coins: this.createCoins([
                    [900, 340, 10], [3200, 300, 10]
                ]),
                blocks: this.createBlocks([
                    [820, 340, 'q', 'grow'], [1600, 260, 'q', 'coin'],
                    [2500, 340, 'brick', true]
                ]),
                enemies: this.createEnemies([
                    [600, 432, 'walker', 10, 340], [2800, 432, 'shooter', 1],
                    [4200, 432, 'shooter', 1, 0, 1, 1.0, 90]
                ]),
                pipes: this.createPipes([
                    [4800, 472, 'down', 'الثلوج', 120, 360]
                ]),
                checkpoints: [{ x: 2600 }]
            },
            
            {
                name: "الثلوج",
                theme: "snow",
                width: 5000,
                start: { x: 120, y: 360 },
                flagX: 4800,
                houses: [{ x: 40 }, { x: 4820 }],
                platforms: this.createPlatforms([
                    [520, 420, 140, 20], [760, 380, 140, 20], [1000, 340, 140, 20],
                    [1240, 300, 140, 20], [1600, 340, 160, 20], [2000, 380, 160, 20],
                    [2400, 340, 160, 20], [2800, 300, 160, 20], [3200, 340, 160, 20],
                    [3600, 380, 160, 20]
                ]),
                coins: this.createCoins([
                    [1200, 260, 10], [3000, 260, 10]
                ]),
                blocks: this.createBlocks([
                    [760, 340, 'q', 'grow'], [1240, 260, 'q', 'life']
                ]),
                enemies: this.createEnemies([
                    [600, 432, 'walker', 8, 360], [2600, 432, 'shooter', 1, 0, 1, 1.0, 90]
                ]),
                pipes: this.createPipes([
                    [4200, 472, 'down', 'الجزر السماوية', 120, 240]
                ]),
                checkpoints: [{ x: 2500 }]
            },
            
            {
                name: "الجزر السماوية",
                theme: "sky",
                width: 5400,
                start: { x: 120, y: 240 },
                flagX: 5200,
                houses: [],
                platforms: this.createPlatforms([
                    [300, 280, 160, 20], [600, 220, 160, 20], [900, 260, 160, 20],
                    [1200, 200, 160, 20], [1500, 240, 160, 20], [1900, 280, 160, 20],
                    [2300, 240, 160, 20], [2700, 200, 160, 20], [3100, 240, 160, 20],
                    [3500, 200, 160, 20], [3900, 240, 160, 20]
                ]),
                coins: this.createCoins([
                    [1000, 180, 10]
                ]),
                blocks: this.createBlocks([
                    [900, 220, 'q', 'grow']
                ]),
                enemies: this.createEnemies([
                    [600, 292, 'walker', 10, 320], [2600, 292, 'shooter', 1]
                ]),
                pipes: this.createPipes([
                    [5000, 472, 'down', 'القلعة', 80, 360]
                ]),
                checkpoints: [{ x: 2700 }]
            },
            
            {
                name: "القلعة",
                theme: "castle",
                width: 5600,
                start: { x: 80, y: 360 },
                flagX: 5400,
                houses: [{ x: 40 }, { x: 5420 }],
                platforms: this.createPlatforms([
                    [500, 420, 160, 20], [720, 360, 160, 20], [940, 300, 160, 20],
                    [1280, 300, 160, 20], [1600, 360, 160, 20], [1920, 420, 160, 20],
                    [2400, 380, 160, 20], [2800, 340, 160, 20], [3200, 300, 160, 20],
                    [3600, 340, 160, 20], [4000, 380, 160, 20], [4400, 420, 160, 20]
                ]),
                coins: this.createCoins([
                    [1360, 260, 12], [3240, 260, 12]
                ]),
                blocks: this.createBlocks([
                    [720, 320, 'q', 'grow'], [940, 260, 'q', 'life'],
                    [1600, 320, 'brick', true], [1640, 320, 'brick', true],
                    [1680, 320, 'brick', true]
                ]),
                enemies: this.createEnemies([
                    [600, 432, 'walker', 12, 320], [2500, 432, 'shooter', 1],
                    [3800, 432, 'shooter', 1, 0, 1, 1.0, 90],
                    [5000, 432, 'shooter', 1, 0, 1, 1.0, 80]
                ]),
                pipes: this.createPipes([
                    [5200, 472, 'down', 'السهول', 260, 360]
                ]),
                checkpoints: [{ x: 2800 }]
            }
        ];
    }
    
    /**
     * إنشاء منصات محسنة
     */
    createPlatforms(platformData) {
        return platformData.map(([x, y, w, h]) => ({
            x, y, w, h,
            // إضافة خصائص إضافية للتحسين
            visible: true,
            collisionType: 'solid'
        }));
    }
    
    /**
     * إنشاء عملات محسنة
     */
    createCoins(coinData) {
        return coinData.map(([x, y, count]) => {
            const coins = [];
            for (let i = 0; i < count; i++) {
                coins.push({
                    x: x + i * 26,
                    y,
                    w: 18,
                    h: 18,
                    taken: false,
                    active: true,
                    value: 5,
                    animation: 0
                });
            }
            return coins;
        }).flat();
    }
    
    /**
     * إنشاء صناديق محسنة
     */
    createBlocks(blockData) {
        return blockData.map(([x, y, type, content, breakable = false]) => ({
            x, y, w: 40, h: 40, type, contains: content,
            breakable, hit: false, active: true
        }));
    }
    
    /**
     * إنشاء أعداء محسنين
     */
    createEnemies(enemyData) {
        return enemyData.map(([x, y, type, count = 1, spacing = 0, dir = 1, speed = 1.0, cooldown = 120]) => {
            if (count === 1) {
                return {
                    type, x, y, w: type === 'shooter' ? 34 : 30, h: type === 'shooter' ? 34 : 26,
                    dir, speed, alive: true, vx: 0, vy: 0, cooldown
                };
            } else {
                const enemies = [];
                for (let i = 0; i < count; i++) {
                    enemies.push({
                        type, x: x + i * spacing, y, w: 30, h: 26,
                        dir: (i % 2 === 0) ? dir : -dir, speed, alive: true, vx: 0, vy: 0
                    });
                }
                return enemies;
            }
        }).flat();
    }
    
    /**
     * إنشاء أنابيب محسنة
     */
    createPipes(pipeData) {
        return pipeData.map(([x, y, enterDir, targetName, spawnX, spawnY]) => ({
            x, y, w: 64, h: 64, enterDir,
            target: { name: targetName, spawn: { x: spawnX, y: spawnY } }
        }));
    }
    
    /**
     * تحميل مستوى
     */
    loadLevel(index) {
        if (index < 0 || index >= this.levels.length) {
            console.error('Invalid level index:', index);
            return null;
        }
        
        const levelData = this.levels[index];
        
        // إنشاء نسخة عميقة من المستوى
        this.currentLevel = {
            ...levelData,
            platforms: [{ x: 0, y: 472, w: levelData.width, h: 68 }, ...levelData.platforms],
            coins: levelData.coins.map(coin => ({ ...coin })),
            blocks: levelData.blocks.map(block => ({ ...block })),
            enemies: levelData.enemies.map(enemy => ({ ...enemy })),
            pipes: levelData.pipes.map(pipe => ({ ...pipe })),
            checkpoints: levelData.checkpoints.map(cp => ({ ...cp, reached: false })),
            flag: { x: levelData.flagX, y: 472 - 140, h: 140, reached: false },
            houses: levelData.houses || []
        };
        
        return this.currentLevel;
    }
    
    /**
     * الحصول على المستوى الحالي
     */
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    /**
     * البحث عن مستوى بالاسم
     */
    findLevelByName(name) {
        return this.levels.findIndex(level => level.name === name);
    }
    
    /**
     * الحصول على إحصائيات المستويات
     */
    getLevelStats() {
        return {
            totalLevels: this.levels.length,
            totalPlatforms: this.levels.reduce((sum, level) => sum + level.platforms.length, 0),
            totalCoins: this.levels.reduce((sum, level) => sum + level.coins.length, 0),
            totalEnemies: this.levels.reduce((sum, level) => sum + level.enemies.length, 0),
            averageLevelWidth: this.levels.reduce((sum, level) => sum + level.width, 0) / this.levels.length
        };
    }
    
    /**
     * تنظيف الذاكرة
     */
    cleanup() {
        this.levelCache.clear();
        this.currentLevel = null;
    }
}

// تصدير مدير المستويات
window.LevelManager = LevelManager;