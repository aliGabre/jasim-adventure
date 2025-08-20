<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no" />
    <title>مغامرات جاسم - نسخة مطورة</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0
        }

        body {
            background: #5C94FC;
            font-family: "Segoe UI", Tahoma, Arial, sans-serif;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        h1 {
            margin: 10px 0 8px;
            text-shadow: 3px 3px 0 #000;
            font-weight: 900;
        }

        .sub {
            opacity: .9;
            margin-bottom: 8px
        }

        .game-wrap {
            position: relative;
            width: 95vw;
            max-width: 1000px;
            aspect-ratio: 16/9;
            border: 4px solid #8B4513;
            border-radius: 12px;
            overflow: hidden;
            background: #63adff;
            box-shadow: 0 12px 24px rgba(0, 0, 0, .35);
        }

        canvas {
            width: 100%;
            height: 100%;
            display: block;
            image-rendering: pixelated;
            background: linear-gradient(#76b8ff, #8cd1ff 55%, #63adff);
        }

        .hud {
            position: absolute;
            inset: 10px 10px auto 10px;
            display: flex;
            gap: 10px;
            justify-content: space-between;
            pointer-events: none;
            font-weight: 800;
            text-shadow: 1px 1px 2px #000;
        }

        .hud .left,
        .hud .right {
            display: flex;
            gap: 14px
        }

        .badge {
            background: rgba(0, 0, 0, .45);
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 16px
        }

        .msg {
            position: absolute;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 14px;
            background: rgba(0, 0, 0, .4);
            text-align: center;
            font-size: 32px;
            font-weight: 900;
            text-shadow: 3px 3px 0 #000;
            padding: 20px;
        }

        .msg small {
            font-size: 16px;
            opacity: .9
        }

        .mobile {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 18px;
            z-index: 5;
            gap: 10px;
            opacity: .92;
        }

        .pad {
            display: flex;
            gap: 10px
        }

        .btn {
            width: 64px;
            height: 64px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, .55);
            color: #222;
            font-size: 22px;
            font-weight: 800;
            box-shadow: 0 4px 0 rgba(0, 0, 0, .2);
        }

        .btn.jump {
            background: rgba(255, 90, 90, .8);
            color: #fff
        }

        .btn.fire {
            background: rgba(255, 200, 0, .9);
            color: #7a3
        }

        .btn.down {
            background: rgba(180, 255, 180, .9);
            color: #063
        }

        @media(min-width:900px) {
            .mobile {
                display: none
            }
        }

        /* زر المشاركة */
        .sharebar {
            margin: 8px 0 0;
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .sharebtn {
            border: none;
            background: #ffe08a;
            color: #5b3f00;
            font-weight: 800;
            padding: 8px 12px;
            border-radius: 8px;
            box-shadow: 0 3px 0 rgba(0, 0, 0, .2);
            cursor: pointer;
        }

        .overlay {
            position: fixed;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, .5);
            z-index: 9999;
            padding: 20px;
        }

        .card {
            background: #fff;
            color: #222;
            max-width: 92vw;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, .35);
        }

        .card h3 {
            margin-bottom: 8px
        }

        .row {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap
        }

        .urlbox {
            width: 320px;
            max-width: 80vw;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 6px
        }

        .qr {
            width: 260px;
            height: 260px;
            border: 1px solid #ddd
        }

        .close {
            margin-top: 10px;
            background: #444;
            color: #fff
        }
    </style>
</head>

<body>
    <h1>🍄 مغامرات جاسم 🍄</h1>
    <div class="sub">مراحل طويلة، أنابيب انتقال، نقاط حفظ، صناديق مكافآت، قفز متدرّج، ورصاص بمفتاح Alt</div>

    <div class="sharebar">
        <button id="shareOpen" class="sharebtn">🔗 مشاركة / QR</button>
    </div>

    <div class="game-wrap">
        <canvas id="game"></canvas>
        <div class="hud">
            <div class="left">
                <div class="badge">النقاط: <span id="score">0</span></div>
                <div class="badge">الأرواح: <span id="lives">3</span></div>
            </div>
            <div class="right">
                <div class="badge">المستوى: <span id="level">1</span></div>
            </div>
        </div>
        <div id="msg" class="msg"></div>
    </div>

    <div class="mobile">
        <div class="pad">
            <button class="btn" id="left">◀</button>
            <button class="btn down" id="down">▼</button>
            <button class="btn" id="right">▶</button>
        </div>
        <div class="pad">
            <button class="btn jump" id="jump">⤒</button>
            <button class="btn fire" id="fire">✶</button>
        </div>
    </div>

    <!-- Overlay لمشاركة الرابط و QR -->
    <div id="overlay" class="overlay">
        <div class="card">
            <h3>مشاركة اللعبة</h3>
            <div class="row" style="margin-bottom:8px">
                <input id="pageUrl" class="urlbox" readonly />
                <button id="copyLink" class="sharebtn">نسخ الرابط</button>
                <button id="nativeShare" class="sharebtn">مشاركة</button>
            </div>
            <div class="row">
                <img id="qrImg" class="qr" alt="QR" />
                <div style="max-width:320px; font-size:14px; line-height:1.5">
                    ملاحظة: يعمل QR عند استضافة الملف على الإنترنت (مثل GitHub Pages).
                    إن كان الرابط يبدأ بـ file:// فلن يفتح على الجوال. ارفع الملف ثم افتح هذه النافذة مجدداً ليتولّد QR
                    صالح.
                </div>
            </div>
            <button id="closeOverlay" class="sharebtn close">إغلاق</button>
        </div>
    </div>

    <script>
        // إعدادات أساسية
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        canvas.width = 960;
        canvas.height = 540;

        // HUD وعناصر الرسائل
        const elScore = document.getElementById('score');
        const elLives = document.getElementById('lives');
        const elLevel = document.getElementById('level');
        const elMsg = document.getElementById('msg');

        // مشاركة/QR
        const overlay = document.getElementById('overlay');
        const shareOpen = document.getElementById('shareOpen');
        const copyLink = document.getElementById('copyLink');
        const nativeShare = document.getElementById('nativeShare');
        const pageUrl = document.getElementById('pageUrl');
        const qrImg = document.getElementById('qrImg');
        const closeOverlay = document.getElementById('closeOverlay');
        function openShare() {
            const url = location.href;
            pageUrl.value = url;
            qrImg.src = 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=M|0&chl=' + encodeURIComponent(url);
            overlay.style.display = 'flex';
        }
        shareOpen.onclick = openShare;
        closeOverlay.onclick = () => overlay.style.display = 'none';
        copyLink.onclick = async () => {
            try { await navigator.clipboard.writeText(pageUrl.value); copyLink.textContent = 'تم النسخ ✓'; setTimeout(() => copyLink.textContent = 'نسخ الرابط', 1200); } catch { }
        };
        nativeShare.onclick = async () => {
            try {
                if (navigator.share) await navigator.share({ title: document.title, url: location.href });
                else alert('ميزة المشاركة غير مدعومة على هذا المتصفح');
            } catch { }
        };

        // الأصوات (WebAudio بسيط)
        const sound = {
            enabled: true,
            ctx: null,
            init() {
                try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
                catch (e) { this.enabled = false; }
            },
            tone(freq = 440, dur = .1, type = 'square', vol = .08) {
                if (!this.enabled || !this.ctx) return;
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                o.type = type;
                o.frequency.setValueAtTime(freq, this.ctx.currentTime);
                g.gain.setValueAtTime(vol, this.ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
                o.connect(g); g.connect(this.ctx.destination);
                o.start(); o.stop(this.ctx.currentTime + dur);
            },
            jump() { this.tone(520, .09, 'sine', .06) },
            coin() { this.tone(900, .08, 'triangle', .07) },
            stomp() { this.tone(200, .12, 'square', .09) },
            hit() { this.tone(160, .25, 'sawtooth', .09) },
            power() { this.tone(660, .08); setTimeout(() => this.tone(880, .12), 80) },
            win() { [523, 659, 783, 1046].forEach((f, i) => setTimeout(() => this.tone(f, .12, 'square', .07), 150 * i)); },
            shoot() { this.tone(980, .08, 'triangle', .07) },
            break() { this.tone(120, .06, 'square', .1) },
            life() { this.tone(880, .08, 'square', .08); setTimeout(() => this.tone(1175, .12, 'square', .08), 90) }
        };

        // ثوابت فيزيائية
        const GRAVITY = 0.6;
        const MOVE_SPEED = 4.0;
        const JUMP_VELOCITY = -12.5;
        const COYOTE_TIME_FRAMES = 8;
        const JUMP_BUFFER_FRAMES = 8;

        // حالة اللعبة
        let state = {
            score: 0,
            lives: 3,
            levelIndex: 0,
            cameraX: 0,
            win: false,
            gameOver: false,
            respawn: { x: 0, y: 0 } // نقطة الحفظ
        };

        // اللاعب جاسم
        const player = {
            x: 100, y: 100, w: 28, h: 48,
            vx: 0, vy: 0,
            facing: 1,
            onGround: false,
            coyote: 0, jumpBuffer: 0,
            big: false, invul: 0,
            shootCooldown: 0
        };

        // كائنات العالم
        let level = null;
        let platforms = [];
        let coins = [];
        let enemies = [];
        let bullets = [];
        let eBullets = [];
        let blocks = [];
        let powerups = [];
        let pipes = [];
        let checkpoints = [];
        let flag = { x: 2000, y: 0, h: 140, reached: false };
        let houses = [];

        // مُدخلات
        const keys = { left: false, right: false, jump: false, shoot: false, down: false, up: false };
        const justPressed = { jump: false, shoot: false };

        // تحكّم لوحة مفاتيح
        addEventListener('keydown', e => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'ArrowDown'].includes(e.code)) e.preventDefault();
            if (state.gameOver || state.win) { startGame(); return; }

            if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;

            if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') { keys.jump = true; keys.up = true; justPressed.jump = true; }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') { keys.down = true; }

            // إطلاق بالـ Alt (مع بديل Z في حال منع النظام Alt)
            if (e.code === 'AltLeft' || e.code === 'AltRight' || e.key === 'Alt' || e.code === 'KeyZ') {
                e.preventDefault();
                keys.shoot = true; justPressed.shoot = true;
            }
        }, { passive: false });
        addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;

            if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') { keys.jump = false; keys.up = false; }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') { keys.down = false; }

            if (e.code === 'AltLeft' || e.code === 'AltRight' || e.key === 'Alt' || e.code === 'KeyZ') { keys.shoot = false; }
        });

        // أزرار موبايل
        const btnL = document.getElementById('left');
        const btnR = document.getElementById('right');
        const btnJ = document.getElementById('jump');
        const btnF = document.getElementById('fire');
        const btnD = document.getElementById('down');
        function bindBtn(btn, prop) {
            const down = e => {
                e.preventDefault(); if (state.gameOver || state.win) { startGame(); return; }
                keys[prop] = true; if (prop === 'jump') justPressed.jump = true; if (prop === 'shoot') justPressed.shoot = true;
            };
            const up = e => { e.preventDefault(); keys[prop] = false; };
            btn.addEventListener('touchstart', down, { passive: false });
            btn.addEventListener('touchend', up, { passive: false });
            btn.addEventListener('mousedown', down);
            btn.addEventListener('mouseup', up);
            btn.addEventListener('mouseleave', up);
        }
        bindBtn(btnL, 'left'); bindBtn(btnR, 'right'); bindBtn(btnJ, 'jump'); bindBtn(btnF, 'shoot'); bindBtn(btnD, 'down');

        // أدوات
        const rectsCollide = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

        // تعريف المستويات
        const LEVELS = [
            {
                name: "السهول", theme: "overworld",
                width: 4400,
                start: { x: 120, y: 360 },
                flagX: 4200,
                houses: [{ x: 40 }, { x: 4220 }],
                platforms: [
                    { x: 500, y: 420, w: 120, h: 20 },
                    { x: 720, y: 380, w: 120, h: 20 },
                    { x: 940, y: 340, w: 120, h: 20 },
                    { x: 1280, y: 420, w: 140, h: 20 },
                    { x: 1680, y: 420, w: 120, h: 20 },
                    { x: 2100, y: 380, w: 120, h: 20 },
                    { x: 2400, y: 340, w: 160, h: 20 },
                    { x: 2800, y: 420, w: 140, h: 20 },
                    { x: 3180, y: 380, w: 120, h: 20 },
                    { x: 3500, y: 340, w: 140, h: 20 }
                ],
                coins: [
                    ...Array.from({ length: 8 }, (_, i) => ({ x: 560 + i * 26, y: 380 })),
                    ...Array.from({ length: 8 }, (_, i) => ({ x: 1360 + i * 26, y: 380 })),
                    ...Array.from({ length: 8 }, (_, i) => ({ x: 2460 + i * 26, y: 300 })),
                    ...Array.from({ length: 8 }, (_, i) => ({ x: 3520 + i * 26, y: 300 }))
                ],
                blocks: [
                    { x: 820, y: 300, w: 40, h: 40, type: 'q', contains: 'coin', hit: false },
                    { x: 980, y: 260, w: 40, h: 40, type: 'q', contains: 'grow', hit: false },
                    { x: 1320, y: 300, w: 40, h: 40, type: 'q', contains: 'life', hit: false },
                    { x: 1700, y: 300, w: 40, h: 40, type: 'brick', breakable: true, hit: false },
                    { x: 1740, y: 300, w: 40, h: 40, type: 'brick', breakable: true, hit: false }
                ],
                enemies: [
                    ...Array.from({ length: 8 }, (_, i) => ({ type: 'walker', x: 600 + i * 350, y: 432, w: 30, h: 26, dir: i % 2 ? 1 : -1, speed: 1.1, alive: true })),
                    { type: 'shooter', x: 2300, y: 432, w: 34, h: 34, cooldown: 120, alive: true },
                    { type: 'walker', x: 3100, y: 432, w: 30, h: 26, dir: -1, speed: 1.2, alive: true }
                ],
                pipes: [
                    { x: 260, y: 472, w: 64, h: 64, enterDir: 'down', target: { name: 'الهضاب', spawn: { x: 80, y: 360 } } },
                    { x: 1800, y: 472, w: 64, h: 64, enterDir: 'down', target: { name: 'تحت الأرض 1', spawn: { x: 120, y: 360 } } }
                ],
                checkpoints: [{ x: 2200 }]
            },

            {
                name: "الهضاب", theme: "overworld",
                width: 5200,
                start: { x: 80, y: 360 },
                flagX: 5000,
                houses: [{ x: 40 }, { x: 5020 }],
                platforms: [
                    { x: 380, y: 420, w: 160, h: 20 },
                    { x: 620, y: 360, w: 140, h: 20 },
                    { x: 900, y: 300, w: 160, h: 20 },
                    { x: 1280, y: 360, w: 160, h: 20 },
                    { x: 1600, y: 420, w: 160, h: 20 },
                    { x: 2000, y: 380, w: 160, h: 20 },
                    { x: 2400, y: 340, w: 160, h: 20 },
                    { x: 2800, y: 300, w: 200, h: 20 },
                    { x: 3400, y: 360, w: 160, h: 20 },
                    { x: 3800, y: 420, w: 160, h: 20 },
                    { x: 4200, y: 380, w: 160, h: 20 }
                ],
                coins: [
                    ...Array.from({ length: 10 }, (_, i) => ({ x: 980 + i * 26, y: 260 })),
                    ...Array.from({ length: 10 }, (_, i) => ({ x: 2860 + i * 26, y: 260 }))
                ],
                blocks: [
                    { x: 620, y: 320, w: 40, h: 40, type: 'q', contains: 'grow', hit: false },
                    { x: 1260, y: 320, w: 40, h: 40, type: 'q', contains: 'coin', hit: false },
                    { x: 2000, y: 340, w: 40, h: 40, type: 'q', contains: 'life', hit: false },
                    { x: 2400, y: 300, w: 40, h: 40, type: 'brick', breakable: true, hit: false },
                    { x: 2440, y: 300, w: 40, h: 40, type: 'brick', breakable: true, hit: false },
                    { x: 2480, y: 300, w: 40, h: 40, type: 'brick', breakable: true, hit: false }
                ],
                enemies: [
                    ...Array.from({ length: 10 }, (_, i) => ({ type: 'walker', x: 500 + i * 320, y: 432, w: 30, h: 26, dir: i % 2 ? 1 : -1, speed: 1.3, alive: true })),
                    { type: 'shooter', x: 2600, y: 432, w: 34, h: 34, cooldown: 100, alive: true },
                    { type: 'shooter', x: 4200, y: 432, w: 34, h: 34, cooldown: 120, alive: true }
                ],
                pipes: [
                    { x: 600, y: 472, w: 64, h: 64, enterDir: 'up', target: { name: 'السهول', spawn: { x: 320, y: 360 } } },
                    { x: 2200, y: 472, w: 64, h: 64, enterDir: 'down', target: { name: 'تحت الأرض 1', spawn: { x: 420, y: 360 } } }
                ],
                checkpoints: [{ x: 2600 }]
            },

            {
                name: "تحت الأرض 1", theme: "underground",
                width: 3000,
                start: { x: 120, y: 360 },
                flagX: 2800,
                houses: [],
                platforms: [
                    { x: 300, y: 420, w: 160, h: 20 },
                    { x: 560, y: 380, w: 140, h: 20 },
                    { x: 820, y: 340, w: 160, h: 20 },
                    { x: 1100, y: 380, w: 160, h: 20 },
                    { x: 1400, y: 420, w: 160, h: 20 },
                    { x: 1800, y: 380, w: 160, h: 20 },
                    { x: 2200, y: 340, w: 160, h: 20 }
                ],
                coins: [
                    ...Array.from({ length: 12 }, (_, i) => ({ x: 360 + i * 26, y: 380 })),
                    ...Array.from({ length: 12 }, (_, i) => ({ x: 1860 + i * 26, y: 300 }))
                ],
                blocks: [
                    { x: 560, y: 340, w: 40, h: 40, type: 'q', contains: 'coin', hit: false },
                    { x: 820, y: 300, w: 40, h: 40, type: 'q', contains: 'grow', hit: false }
                ],
                enemies: [
                    ...Array.from({ length: 6 }, (_, i) => ({ type: 'walker', x: 400 + i * 260, y: 432, w: 30, h: 26, dir: i % 2 ? 1 : -1, speed: 1.2, alive: true })),
                    { type: 'shooter', x: 2000, y: 432, w: 34, h: 34, cooldown: 100, alive: true }
                ],
                pipes: [
                    { x: 2600, y: 472, w: 64, h: 64, enterDir: 'up', target: { name: 'الهضاب', spawn: { x: 2400, y: 360 } } }
                ],
                checkpoints: [{ x: 1500 }]
            },

            {
                name: "الصحراء", theme: "desert",
                width: 5200,
                start: { x: 120, y: 360 },
                flagX: 5000,
                houses: [{ x: 40 }, { x: 5020 }],
                platforms: [
                    { x: 460, y: 420, w: 200, h: 20 },
                    { x: 820, y: 380, w: 180, h: 20 },
                    { x: 1200, y: 340, w: 160, h: 20 },
                    { x: 1600, y: 300, w: 200, h: 20 },
                    { x: 2100, y: 340, w: 160, h: 20 },
                    { x: 2500, y: 380, w: 180, h: 20 },
                    { x: 2900, y: 420, w: 160, h: 20 },
                    { x: 3400, y: 380, w: 180, h: 20 },
                    { x: 3800, y: 340, w: 160, h: 20 },
                    { x: 4200, y: 300, w: 200, h: 20 }
                ],
                coins: [
                    ...Array.from({ length: 10 }, (_, i) => ({ x: 900 + i * 30, y: 340 })),
                    ...Array.from({ length: 10 }, (_, i) => ({ x: 3200 + i * 30, y: 300 }))
                ],
                blocks: [
                    { x: 820, y: 340, w: 40, h: 40, type: 'q', contains: 'grow', hit: false },
                    { x: 1600, y: 260, w: 40, h: 40, type: 'q', contains: 'coin', hit: false },
                    { x: 2500, y: 340, w: 40, h: 40, type: 'brick', breakable: true, hit: false }
                ],
                enemies: [
                    ...Array.from({ length: 10 }, (_, i) => ({ type: 'walker', x: 600 + i * 340, y: 432, w: 30, h: 26, dir: i % 2 ? 1 : -1, speed: 1.35, alive: true })),
                    { type: 'shooter', x: 2800, y: 432, w: 34, h: 34, cooldown: 100, alive: true },
                    { type: 'shooter', x: 4200, y: 432, w: 34, h: 34, cooldown: 90, alive: true }
                ],
                pipes: [
                    { x: 4800, y: 472, w: 64, h: 64, enterDir: 'down', target: { name: 'الثلوج', spawn: { x: 120, y: 360 } } }
                ],
                checkpoints: [{ x: 2600 }]
            },

            {
                name: "الثلوج", theme: "snow",
                width: 5000,
                start: { x: 120, y: 360 },
                flagX: 4800,
                houses: [{ x: 40 }, { x: 4820 }],
                platforms: [
                    { x: 520, y: 420, w: 140, h: 20 },
                    { x: 760, y: 380, w: 140, h: 20 },
                    { x: 1000, y: 340, w: 140, h: 20 },
                    { x: 1240, y: 300, w: 140, h: 20 },
                    { x: 1600, y: 340, w: 160, h: 20 },
                    { x: 2000, y: 380, w: 160, h: 20 },
                    { x: 2400, y: 340, w: 160, h: 20 },
                    { x: 2800, y: 300, w: 160, h: 20 },
                    { x: 3200, y: 340, w: 160, h: 20 },
                    { x: 3600, y: 380, w: 160, h: 20 }
                ],
                coins: [
                    ...Array.from({ length: 10 }, (_, i) => ({ x: 1200 + i * 28, y: 260 })),
                    ...Array.from({ length: 10 }, (_, i) => ({ x: 3000 + i * 28, y: 260 }))
                ],
                blocks: [
                    { x: 760, y: 340, w: 40, h: 40, type: 'q', contains: 'grow', hit: false },
                    { x: 1240, y: 260, w: 40, h: 40, type: 'q', contains: 'life', hit: false }
                ],
                enemies: [
                    ...Array.from({ length: 8 }, (_, i) => ({ type: 'walker', x: 600 + i * 360, y: 432, w: 30, h: 26, dir: i % 2 ? 1 : -1, speed: 1.25, alive: true })),
                    { type: 'shooter', x: 2600, y: 432, w: 34, h: 34, cooldown: 90, alive: true }
                ],
                pipes: [
                    { x: 4200, y: 472, w: 64, h: 64, enterDir: 'down', target: { name: 'الجزر السماوية', spawn: { x: 120, y: 240 } } }
                ],
                checkpoints: [{ x: 2500 }]
            },

            {
                name: "الجزر السماوية", theme: "sky",
                width: 5400,
                start: { x: 120, y: 240 },
                flagX: 5200,
                houses: [],
                platforms: [
                    { x: 300, y: 280, w: 160, h: 20 },
                    { x: 600, y: 220, w: 160, h: 20 },
                    { x: 900, y: 260, w: 160, h: 20 },
                    { x: 1200, y: 200, w: 160, h: 20 },
                    { x: 1500, y: 240, w: 160, h: 20 },
                    { x: 1900, y: 280, w: 160, h: 20 },
                    { x: 2300, y: 240, w: 160, h: 20 },
                    { x: 2700, y: 200, w: 160, h: 20 },
                    { x: 3100, y: 240, w: 160, h: 20 },
                    { x: 3500, y: 200, w: 160, h: 20 },
                    { x: 3900, y: 240, w: 160, h: 20 }
                ],
                coins: [...Array.from({ length: 10 }, (_, i) => ({ x: 1000 + i * 36, y: 180 }))],
                blocks: [{ x: 900, y: 220, w: 40, h: 40, type: 'q', contains: 'grow', hit: false }],
                enemies: [
                    ...Array.from({ length: 10 }, (_, i) => ({ type: 'walker', x: 600 + i * 320, y: 292, w: 30, h: 26, dir: i % 2 ? 1 : -1, speed: 1.2, alive: true })),
                    { type: 'shooter', x: 2600, y: 292, w: 34, h: 34, cooldown: 100, alive: true }
                ],
                pipes: [
                    { x: 5000, y: 472, w: 64, h: 64, enterDir: 'down', target: { name: 'القلعة', spawn: { x: 80, y: 360 } } }
                ],
                checkpoints: [{ x: 2700 }]
            },

            {
                name: "القلعة", theme: "castle",
                width: 5600,
                start: { x: 80, y: 360 },
                flagX: 5400,
                houses: [{ x: 40 }, { x: 5420 }],
                platforms: [
                    { x: 500, y: 420, w: 160, h: 20 },
                    { x: 720, y: 360, w: 160, h: 20 },
                    { x: 940, y: 300, w: 160, h: 20 },
                    { x: 1280, y: 300, w: 160, h: 20 },
                    { x: 1600, y: 360, w: 160, h: 20 },
                    { x: 1920, y: 420, w: 160, h: 20 },
                    { x: 2400, y: 380, w: 160, h: 20 },
                    { x: 2800, y: 340, w: 160, h: 20 },
                    { x: 3200, y: 300, w: 160, h: 20 },
                    { x: 3600, y: 340, w: 160, h: 20 },
                    { x: 4000, y: 380, w: 160, h: 20 },
                    { x: 4400, y: 420, w: 160, h: 20 }
                ],
                coins: [
                    ...Array.from({ length: 12 }, (_, i) => ({ x: 1360 + i * 26, y: 260 })),
                    ...Array.from({ length: 12 }, (_, i) => ({ x: 3240 + i * 26, y: 260 }))
                ],
                blocks: [
                    { x: 720, y: 320, w: 40, h: 40, type: 'q', contains: 'grow', hit: false },
                    { x: 940, y: 260, w: 40, h: 40, type: 'q', contains: 'life', hit: false },
                    { x: 1600, y: 320, w: 40, h: 40, type: 'brick', breakable: true, hit: false },
                    { x: 1640, y: 320, w: 40, h: 40, type: 'brick', breakable: true, hit: false },
                    { x: 1680, y: 320, w: 40, h: 40, type: 'brick', breakable: true, hit: false }
                ],
                enemies: [
                    ...Array.from({ length: 12 }, (_, i) => ({ type: 'walker', x: 600 + i * 320, y: 432, w: 30, h: 26, dir: i % 2 ? 1 : -1, speed: 1.35, alive: true })),
                    { type: 'shooter', x: 2500, y: 432, w: 34, h: 34, cooldown: 90, alive: true },
                    { type: 'shooter', x: 3800, y: 432, w: 34, h: 34, cooldown: 90, alive: true },
                    { type: 'shooter', x: 5000, y: 432, w: 34, h: 34, cooldown: 80, alive: true }
                ],
                pipes: [
                    { x: 5200, y: 472, w: 64, h: 64, enterDir: 'down', target: { name: 'السهول', spawn: { x: 260, y: 360 } } }
                ],
                checkpoints: [{ x: 2800 }]
            }
        ];

        // تهيئة مستوى
        function loadLevel(i) {
            const src = LEVELS[i];
            level = JSON.parse(JSON.stringify(src));
            platforms = [{ x: 0, y: 472, w: level.width, h: 68 }, ...level.platforms];
            coins = level.coins.map(c => ({ x: c.x, y: c.y, w: 18, h: 18, taken: false }));
            blocks = level.blocks.map(b => ({ ...b }));
            enemies = level.enemies.map(e => ({ ...e }));
            bullets = []; eBullets = []; powerups = [];
            pipes = (level.pipes || []).map(p => ({ ...p }));
            checkpoints = (level.checkpoints || []).map(c => ({ ...c, reached: false }));
            flag = { x: level.flagX, y: 472 - 140, h: 140, reached: false };
            houses = level.houses || [];

            player.x = level.start.x; player.y = level.start.y;
            player.vx = 0; player.vy = 0; player.onGround = false; player.coyote = 0; player.jumpBuffer = 0; player.invul = 0; player.shootCooldown = 0;
            state.cameraX = 0;
            state.respawn = { x: level.start.x, y: Math.min(level.start.y, 472 - player.h) }; // نقطة الحفظ الأولية
            elLevel.textContent = (state.levelIndex + 1);
            updateHUD();
            hideMsg();
        }

        function updateHUD() {
            elScore.textContent = state.score;
            elLives.textContent = state.lives;
            elLevel.textContent = (state.levelIndex + 1);
        }

        function showMsg(txt, small) {
            elMsg.innerHTML = txt + (small ? `<br><small>${small}</small>` : '');
            elMsg.style.display = 'flex';
        }
        function hideMsg() { elMsg.style.display = 'none'; }

        function startGame() {
            sound.init();
            state.score = 0; state.lives = 3; state.levelIndex = 0;
            state.gameOver = false; state.win = false;
            player.big = false;
            loadLevel(state.levelIndex);
        }

        // فيزياء اللاعب
        function updatePlayer() {
            // حركة أفقية
            let ax = 0;
            if (keys.left) ax = -MOVE_SPEED;
            if (keys.right) ax = MOVE_SPEED;
            player.vx = ax;
            if (player.vx !== 0) player.facing = Math.sign(player.vx);

            // جاذبية
            player.vy += GRAVITY;

            // قفزة متغيرة الطول (ضغط مطوّل أعلى)
            if (player.vy < 0) {
                if (!keys.jump) player.vy += 0.6;   // تقصير القفزة عند ترك الزر
                else player.vy += -0.12; // دعم خفيف لقفزة أعلى
            }

            // coyote/jump buffer
            if (player.onGround) player.coyote = COYOTE_TIME_FRAMES;
            else if (player.coyote > 0) player.coyote--;
            if (justPressed.jump) player.jumpBuffer = JUMP_BUFFER_FRAMES;
            else if (player.jumpBuffer > 0) player.jumpBuffer--;

            // بدء القفز
            if (player.jumpBuffer > 0 && player.coyote > 0) {
                player.vy = JUMP_VELOCITY;
                player.onGround = false;
                player.coyote = 0;
                player.jumpBuffer = 0;
                sound.jump();
            }

            // إطلاق
            if (player.shootCooldown > 0) player.shootCooldown--;
            if (justPressed.shoot && player.shootCooldown === 0) {
                bullets.push({
                    x: player.x + player.w / 2 + player.facing * 18,
                    y: player.y + player.h * 0.45,
                    w: 10, h: 10,
                    vx: player.facing * 9.5
                });
                player.shootCooldown = 12;
                sound.shoot();
            }

            // الحركة مع التصادم
            moveWithCollisions(player, player.vx, player.vy);
            player.onGround = checkOnGround(player);

            // حصانة قصيرة
            if (player.invul > 0) player.invul--;

            // سقطة خارج العالم
            if (player.y > canvas.height + 200) {
                takeHit(true);
            }

            // تحريك الكاميرا
            state.cameraX = clamp(player.x - canvas.width * 0.4, 0, level.width - canvas.width);
            justPressed.jump = false;
            justPressed.shoot = false;
        }

        // حركة كائن مع تصادم منصات (X ثم Y)
        function moveWithCollisions(o, dx, dy) {
            // X
            o.x += dx;
            const nearby = platformsInRange(o);
            for (const p of nearby) {
                if (rectsCollide(o, p)) {
                    if (dx > 0) o.x = p.x - o.w;
                    else if (dx < 0) o.x = p.x + p.w;
                }
            }
            // Y
            o.y += dy;
            for (const p of nearby) {
                if (rectsCollide(o, p)) {
                    if (dy > 0) { o.y = p.y - o.h; o.vy = 0; }
                    else if (dy < 0) {
                        o.y = p.y + p.h; o.vy = 0;
                        hitBlockAt(o.x + o.w * 0.5, p.y + p.h + 1);
                    }
                }
            }
        }

        function platformsInRange(o) {
            const r = 80;
            const minX = o.x - r, maxX = o.x + o.w + r;
            return platforms.filter(pl => pl.x < maxX && pl.x + pl.w > minX);
        }
        function checkOnGround(o) {
            const feet = { x: o.x, y: o.y + o.h, w: o.w, h: 2 };
            return platforms.some(p => rectsCollide(feet, p));
        }

        // صناديق
        function hitBlockAt(cx, yTouch) {
            for (let i = 0; i < blocks.length; i++) {
                const b = blocks[i];
                if (Math.abs((b.x + 20) - cx) <= 22 && Math.abs((b.y + b.h) - yTouch) < 8) {
                    if (b.type === 'q' && !b.hit) {
                        b.hit = true;
                        if (b.contains === 'coin') {
                            state.score += 10; updateHUD(); sound.coin();
                        } else if (b.contains === 'grow') {
                            powerups.push({ type: 'grow', x: b.x, y: b.y - 22, w: 22, h: 22, vx: 1.0 });
                            sound.power();
                        } else if (b.contains === 'life') {
                            state.lives += 1; updateHUD(); sound.life();
                        }
                    } else if (b.type === 'brick') {
                        if (b.breakable && player.big) {
                            blocks.splice(i, 1);
                            sound.break();
                        }
                    }
                    break;
                }
            }
        }

        function updateCoins() {
            for (const c of coins) {
                if (!c.taken && rectsCollide(player, c)) {
                    c.taken = true;
                    state.score += 5; updateHUD(); sound.coin();
                }
            }
        }

        function updatePowerups() {
            for (let i = powerups.length - 1; i >= 0; i--) {
                const p = powerups[i];
                p.x += p.vx;
                p.vy = (p.vy || 0) + GRAVITY * 0.7;
                moveItemWithPlatforms(p);
                if (rectsCollide(player, p)) {
                    powerups.splice(i, 1);
                    if (p.type === 'grow') {
                        if (!player.big) {
                            player.big = true;
                            const oldH = player.h;
                            player.h = 64;
                            player.y -= (player.h - oldH);
                        }
                        state.score += 20; updateHUD(); sound.power();
                    }
                }
            }
        }

        function moveItemWithPlatforms(o) {
            const dx = o.vx || 0, dy = o.vy || 0;
            o.x += dx;
            for (const p of platforms) {
                if (rectsCollide(o, p)) {
                    if (dx > 0) o.x = p.x - o.w;
                    else o.x = p.x + p.w;
                    o.vx = -(o.vx || 0);
                }
            }
            o.y += dy;
            for (const p of platforms) {
                if (rectsCollide(o, p)) {
                    if (dy > 0) { o.y = p.y - o.h; o.vy = 0; }
                    else { o.y = p.y + p.h; o.vy = 0; }
                }
            }
        }

        function updateEnemies() {
            for (const e of enemies) {
                if (!e.alive) continue;
                if (e.type === 'walker') {
                    e.vx = e.dir * e.speed;
                    e.vy = (e.vy || 0) + GRAVITY * 0.9;
                    moveEntityWithPlatforms(e, e.vx, e.vy);
                    if (onEdge(e)) e.dir *= -1;

                    if (rectsCollide(player, e)) {
                        if (player.vy > 0 && player.y + player.h - 6 < e.y + 10) {
                            e.alive = false; state.score += 20; updateHUD();
                            player.vy = -9; sound.stomp();
                        } else {
                            takeHit(false);
                        }
                    }
                } else if (e.type === 'shooter') {
                    e.vy = (e.vy || 0) + GRAVITY * 0.9;
                    moveEntityWithPlatforms(e, 0, e.vy);
                    if (e.cooldown > 0) e.cooldown--;
                    const dist = Math.abs((e.x + e.w / 2) - (player.x + player.w / 2));
                    if (dist < 520 && e.cooldown === 0) {
                        const dir = Math.sign((player.x + player.w / 2) - (e.x + e.w / 2)) || 1;
                        eBullets.push({ x: e.x + e.w / 2, y: e.y + e.h * 0.5, w: 10, h: 10, vx: dir * 6.5, vy: 0 });
                        e.cooldown = 90 + (Math.random() * 60 | 0);
                    }
                    if (rectsCollide(player, e)) takeHit(false);
                }
            }
        }

        function moveEntityWithPlatforms(o, dx, dy) {
            o.x += dx;
            const near = platformsInRange(o);
            for (const p of near) {
                if (rectsCollide(o, p)) {
                    if (dx > 0) o.x = p.x - o.w;
                    else o.x = p.x + p.w;
                    o.vx = 0; if (o.dir) o.dir *= -1;
                }
            }
            o.y += dy;
            for (const p of near) {
                if (rectsCollide(o, p)) {
                    if (dy > 0) { o.y = p.y - o.h; o.vy = 0; }
                    else { o.y = p.y + p.h; o.vy = 0; }
                }
            }
        }

        function onEdge(e) {
            const foot = { x: e.x + (e.dir > 0 ? e.w + 1 : -1), y: e.y + e.h + 1, w: 2, h: 2 };
            return !platforms.some(p => rectsCollide(foot, p));
        }

        function updateBullets() {
            // رصاص اللاعب
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.x += b.vx;
                const hitPlatform = platforms.some(p => rectsCollide(b, p));
                if (hitPlatform || b.x < 0 || b.x > level.width) { bullets.splice(i, 1); continue; }
                for (const e of enemies) {
                    if (e.alive && rectsCollide(b, e)) {
                        e.alive = false; bullets.splice(i, 1);
                        state.score += 30; updateHUD(); sound.stomp();
                        break;
                    }
                }
            }
            // رصاص الأعداء
            for (let i = eBullets.length - 1; i >= 0; i--) {
                const b = eBullets[i];
                b.x += b.vx; b.y += b.vy;
                const hitPlatform = platforms.some(p => rectsCollide(b, p));
                if (hitPlatform || b.x < 0 || b.x > level.width) { eBullets.splice(i, 1); continue; }
                if (rectsCollide(player, b)) { eBullets.splice(i, 1); takeHit(false); }
            }
        }

        function takeHit(fell) {
            if (player.invul > 0) return;
            if (player.big) {
                player.big = false;
                const oldH = player.h;
                player.h = 48;
                player.y += (oldH - player.h);
                player.invul = 120;
                sound.hit();
            } else {
                state.lives--; updateHUD(); sound.hit();
                if (state.lives <= 0) {
                    state.gameOver = true;
                    showMsg('انتهت اللعبة', 'اضغط أي زر أو المس الشاشة للبدء من جديد');
                    return;
                } else {
                    // العودة لأقرب نقطة حفظ بدلاً من البداية
                    player.x = state.respawn.x; player.y = Math.min(state.respawn.y, 472 - player.h);
                    player.vx = 0; player.vy = 0; player.invul = 120;
                }
            }
        }

        // نقاط حفظ
        function updateCheckpoints() {
            for (const cp of checkpoints) {
                if (!cp.reached && player.x + player.w / 2 >= cp.x) {
                    cp.reached = true;
                    state.respawn = { x: cp.x + 20, y: 472 - player.h };
                    showMsg('نقطة حفظ ✓'); setTimeout(hideMsg, 700);
                }
            }
        }

        // أنابيب: انتقال بين المراحل
        function findLevelByName(name) { return LEVELS.findIndex(l => l.name === name); }
        function warpTo(target) {
            const idx = (typeof target.index === 'number') ? target.index : findLevelByName(target.name);
            if (idx < 0) return;
            state.levelIndex = idx;
            loadLevel(state.levelIndex);
            if (target.spawn) {
                player.x = target.spawn.x;
                player.y = target.spawn.y;
                player.vx = 0; player.vy = 0;
            }
            state.respawn = { x: player.x, y: player.y };
            sound.power();
            showMsg('انتقال عبر الأنبوب...', ''); setTimeout(hideMsg, 500);
        }
        function checkPipes() {
            for (const p of pipes) {
                const topArea = { x: p.x, y: p.y - 4, w: p.w, h: 8 };
                const onTop = rectsCollide(
                    { x: player.x + 4, y: player.y + player.h - 2, w: player.w - 8, h: 4 },
                    topArea
                );
                if (onTop && p.enterDir === 'down' && keys.down && player.onGround) { warpTo(p.target); return; }
                if (onTop && p.enterDir === 'up' && keys.up && player.onGround) { warpTo(p.target); return; }
            }
        }

        function checkFlag() {
            if (!flag.reached && player.x + player.w > flag.x) {
                flag.reached = true;
                sound.win();
                state.score += 100; updateHUD();
                if (state.levelIndex < LEVELS.length - 1) {
                    showMsg(`أحسنت! الانتقال إلى المستوى ${state.levelIndex + 2}`, '...جاري التحميل');
                    setTimeout(() => { state.levelIndex++; loadLevel(state.levelIndex); }, 1400);
                } else {
                    state.win = true;
                    showMsg('فوز! لقد أنهيت اللعبة', 'اضغط أي زر لإعادة اللعب');
                }
            }
        }

        // خلفية حسب الثيم
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();
            drawWorld();
        }

        function drawBackground() {
            const cam = state.cameraX;
            const th = (level.theme || 'overworld');
            let skyTop = '#76b8ff', skyMid = '#8cd1ff', hill1 = '#3c9444', hill2 = '#2e7a36';
            if (th === 'underground') { skyTop = skyMid = '#1a1a1a'; hill1 = '#222'; hill2 = '#111'; }
            if (th === 'desert') { skyTop = '#f7c56b'; skyMid = '#ffd98a'; hill1 = '#d6a14a'; hill2 = '#c1872e'; }
            if (th === 'snow') { skyTop = '#bfe9ff'; skyMid = '#e8f6ff'; hill1 = '#a6d5f2'; hill2 = '#8fc3e6'; }
            if (th === 'sky') { skyTop = '#b8e2ff'; skyMid = '#dff3ff'; hill1 = '#cfeaff'; hill2 = '#b6dcff'; }
            if (th === 'castle') { skyTop = '#3e3e3e'; skyMid = '#5a5a5a'; hill1 = '#444'; hill2 = '#383838'; }

            const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
            g.addColorStop(0, skyTop); g.addColorStop(0.6, skyMid); g.addColorStop(1, skyMid);
            ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (th !== 'underground' && th !== 'castle') {
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                for (let i = 0; i < 8; i++) {
                    const x = ((i * 500 - (cam * 0.4)) % 1200 + 1200) % 1200 - 200;
                    const y = 80 + (i % 3) * 30;
                    drawCloud(x, y, 120, 30);
                }
            }
            for (let i = 0; i < 10; i++) {
                const x = ((i * 700 - (cam * 0.2)) % 1800 + 1800) % 1800 - 300;
                drawHill(x, 540, 220, 120, hill1);
            }
            for (let i = 0; i < 10; i++) {
                const x = ((i * 700 + 200 - (cam * 0.15)) % 1800 + 1800) % 1800 - 300;
                drawHill(x, 540, 280, 150, hill2);
            }
        }
        function drawCloud(x, y, w, h) {
            ctx.beginPath();
            ctx.ellipse(x, y, w * .32, h * .52, 0, 0, Math.PI * 2);
            ctx.ellipse(x + w * 0.25, y - 10, w * .28, h * .55, 0, 0, Math.PI * 2);
            ctx.ellipse(x + w * 0.5, y, w * .35, h * .6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        function drawHill(x, baseY, w, h, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.quadraticCurveTo(x + w * 0.5, baseY - h, x + w, baseY);
            ctx.lineTo(x + w, baseY + 10);
            ctx.lineTo(x, baseY + 10);
            ctx.closePath();
            ctx.fill();
        }

        function drawPipe(x, y, w, h, cam) {
            ctx.fillStyle = '#0a9a2a';
            ctx.fillRect(x - cam, y - h, w, h);
            ctx.fillStyle = '#0fc642';
            ctx.fillRect(x - cam - 6, y - h - 14, w + 12, 14);
            ctx.fillStyle = 'rgba(0,0,0,.15)';
            ctx.fillRect(x - cam, y - h + 6, w, 3);
        }

        function drawCheckpoint(x, cam, reached) {
            ctx.fillStyle = reached ? '#33dd66' : '#cccccc';
            ctx.fillRect(x - cam, 472 - 60, 8, 60);
            ctx.fillStyle = reached ? '#33dd66' : '#ff4444';
            ctx.beginPath();
            ctx.moveTo(x - cam + 8, 472 - 60);
            ctx.lineTo(x - cam + 48, 472 - 40);
            ctx.lineTo(x - cam + 8, 472 - 20);
            ctx.closePath(); ctx.fill();
        }

        function drawWorld() {
            const cam = state.cameraX;
            // أرضية
            ctx.fillStyle = '#e8834a';
            ctx.fillRect(-cam, 472, canvas.width, 68);
            for (let x = Math.floor(cam / 40) * 40 - 40; x < cam + canvas.width + 40; x += 40) {
                ctx.fillStyle = (Math.floor(x / 40) % 2 === 0) ? '#d4733e' : '#c76532';
                ctx.fillRect(x - cam, 520, 40, 20);
            }
            // منصات
            ctx.fillStyle = '#d4733e';
            for (const p of platforms) {
                if (p.y >= 472 && p.h >= 68) continue;
                if (p.x + p.w < cam - 20 || p.x > cam + canvas.width + 20) continue;
                ctx.fillRect(p.x - cam, p.y, p.w, p.h);
                ctx.strokeStyle = 'rgba(0,0,0,.15)';
                ctx.strokeRect(p.x - cam, p.y, p.w, p.h);
            }
            // صناديق
            for (const b of blocks) {
                if (b.x + b.w < cam - 20 || b.x > cam + canvas.width + 20) continue;
                if (b.type === 'q') {
                    ctx.fillStyle = b.hit ? '#8c6b1a' : '#c88a1a';
                    ctx.fillRect(b.x - cam, b.y, b.w, b.h);
                    if (!b.hit) { ctx.fillStyle = '#fff'; ctx.fillRect(b.x - cam + 16, b.y + 8, 8, 8); }
                } else {
                    ctx.fillStyle = '#b87333';
                    ctx.fillRect(b.x - cam, b.y, b.w, b.h);
                    ctx.strokeStyle = 'rgba(0,0,0,.25)';
                    ctx.strokeRect(b.x - cam, b.y, b.w, b.h);
                }
            }
            // عملات
            for (const c of coins) {
                if (c.taken) continue;
                if (c.x + c.w < cam - 20 || c.x > cam + canvas.width + 20) continue;
                ctx.fillStyle = '#ffd700';
                ctx.beginPath(); ctx.arc(c.x - cam, c.y, 9, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(c.x - cam - 2, c.y - 5, 3, 10);
            }
            // قوى
            for (const p of powerups) {
                if (p.x + p.w < cam - 20 || p.x > cam + canvas.width + 20) continue;
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(p.x - cam, p.y, p.w, p.h);
                ctx.fillStyle = '#fff'; ctx.fillRect(p.x - cam + 6, p.y + 6, 10, 4);
            }
            // أعداء
            for (const e of enemies) {
                if (!e.alive) continue;
                if (e.x + e.w < cam - 20 || e.x > cam + canvas.width + 20) continue;
                if (e.type === 'walker') {
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(e.x - cam, e.y, e.w, e.h);
                    ctx.fillStyle = '#000';
                    ctx.fillRect(e.x - cam + 6, e.y + 6, 4, 4);
                    ctx.fillRect(e.x - cam + e.w - 10, e.y + 6, 4, 4);
                } else {
                    ctx.fillStyle = '#000080';
                    ctx.fillRect(e.x - cam, e.y, e.w, e.h);
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(e.x - cam + 8, e.y + 8, 6, 6);
                    ctx.fillRect(e.x - cam + e.w - 14, e.y + 8, 6, 6);
                }
            }
            // رصاص
            ctx.fillStyle = '#ff2e2e';
            for (const b of bullets) {
                if (b.x + b.w < cam - 20 || b.x > cam + canvas.width + 20) continue;
                ctx.fillRect(b.x - cam, b.y, b.w, b.h);
            }
            ctx.fillStyle = '#ffcc00';
            for (const b of eBullets) {
                if (b.x + b.w < cam - 20 || b.x > cam + canvas.width + 20) continue;
                ctx.fillRect(b.x - cam, b.y, b.w, b.h);
            }
            // بيوت
            for (const h of houses) {
                const x = h.x;
                if (x < cam - 200 || x > cam + canvas.width + 200) continue;
                drawHouse(x - cam, 472);
            }
            // أنابيب
            for (const p of pipes) {
                if (p.x + p.w < cam - 40 || p.x > cam + canvas.width + 40) continue;
                drawPipe(p.x, p.y, p.w, p.h, cam);
            }
            // نقاط حفظ
            for (const cp of checkpoints) {
                drawCheckpoint(cp.x, cam, !!cp.reached);
            }
            // سارية العلم
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(flag.x - cam, flag.y, 8, flag.h);
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(flag.x - cam + 8, flag.y + 4);
            ctx.lineTo(flag.x - cam + 52, flag.y + 24);
            ctx.lineTo(flag.x - cam + 8, flag.y + 44);
            ctx.closePath(); ctx.fill();

            // اللاعب
            if (player.invul % 10 < 7) {
                drawPlayer(player.x - cam, player.y, player.w, player.h, player.facing, player.big);
            }
        }

        function drawHouse(x, groundY) {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, groundY - 110, 100, 110);
            ctx.fillStyle = '#b33';
            ctx.beginPath();
            ctx.moveTo(x - 10, groundY - 110);
            ctx.lineTo(x + 50, groundY - 150);
            ctx.lineTo(x + 110, groundY - 110);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#2b1a0d';
            ctx.fillRect(x + 36, groundY - 50, 28, 50);
            ctx.fillStyle = '#eee';
            ctx.fillRect(x + 16, groundY - 85, 18, 18);
            ctx.fillRect(x + 66, groundY - 85, 18, 18);
        }

        function drawPlayer(x, y, w, h, facing, big) {
            ctx.fillStyle = '#ff4136';
            ctx.fillRect(x, y, w, 10);
            ctx.fillStyle = '#f6c6a6';
            ctx.fillRect(x + 4, y + 10, w - 8, 12);
            ctx.fillStyle = '#000';
            const eyeX = facing > 0 ? x + w - 10 : x + 6;
            ctx.fillRect(eyeX, y + 12, 3, 3);
            ctx.fillStyle = big ? '#d11' : '#ff4136';
            ctx.fillRect(x + 2, y + 22, w - 4, 16);
            ctx.fillStyle = '#0074d9';
            ctx.fillRect(x + 2, y + 38, w - 4, h - 38);
        }

        // حلقة اللعبة
        function update() {
            if (state.gameOver || state.win) return;
            updatePlayer();
            updateCoins();
            updatePowerups();
            updateEnemies();
            updateBullets();
            updateCheckpoints();
            checkPipes();
            checkFlag();
        }

        function loop() { update(); draw(); requestAnimationFrame(loop); }

        // ابدأ
        startGame();
        loop();
    </script>
</body>

</html>

