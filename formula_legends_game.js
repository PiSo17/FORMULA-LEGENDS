import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/* WEB AUDIO SYNTHESIZER FOR UI & SCALEXTRIC ENGINE SOUNDS */
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playHoverSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
}

function playClickSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
}

function playCrashSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
}

document.querySelectorAll('.hover-sound').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
    el.addEventListener('click', playClickSound);
});

/* PARTICLES CANVAS BACKGROUND */
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizePCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizePCanvas);
resizePCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * pCanvas.width;
        this.y = Math.random() * pCanvas.height;
        this.speed = Math.random() * 2 + 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.y -= this.speed;
        if (this.y < 0) this.reset();
    }
    draw() {
        pCtx.fillStyle = `rgba(225, 6, 0, ${this.alpha})`;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
    }
}

for (let i = 0; i < 45; i++) particles.push(new Particle());

function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* SCREEN NAVIGATION */
const screens = {
    'screen-main': document.getElementById('screen-main'),
    'screen-jugar': document.getElementById('screen-jugar'),
    'screen-quick-map': document.getElementById('screen-quick-map'),
    'screen-leyendas': document.getElementById('screen-leyendas'),
    'screen-circuitos': document.getElementById('screen-circuitos'),
    'screen-opciones': document.getElementById('screen-opciones')
};
const sceneCars = document.getElementById('scene-cars');

function nav(targetId) {
    playClickSound();
    Object.values(screens).forEach(screen => screen.classList.remove('active'));

    if (targetId !== 'screen-main') {
        sceneCars.style.opacity = '0.25';
        sceneCars.style.transform = 'scale(0.92)';
    } else {
        sceneCars.style.opacity = '1';
        sceneCars.style.transform = 'scale(1)';
    }

    setTimeout(() => {
        const targetScreen = screens[targetId];
        if (targetScreen) targetScreen.classList.add('active');
        else console.error(`Pantalla no encontrada: ${targetId}`);
    }, 50);
}

/* 10 WORLD CHAMPIONS DATA & GRID GENERATION */
const legendsData = [
    { 
        id: 1, num: "01", name: "FERNANDO ALONSO", short: "ALONSO", era: "RENAULT 2005", flag: "🇪🇸", ovr: 97, glow: "0, 85, 255", 
        speed: 93, racecraft: 98, wet: 92, tyre: 94, cons: 97, titles: 2, wins: 32, podiums: 106, poles: 22,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fernando_Alonso_2022_Day_3_%28cropped%29.jpg/640px-Fernando_Alonso_2022_Day_3_%28cropped%29.jpg",
        bio: "Fernando Alonso Diaz es considerado uno de los pilotos más completos e implacables de la historia del automovilismo. Destacó por poner fin al dominio de cinco años de Michael Schumacher en 2005 con Renault. Conocido por su agresividad táctica, salidas maestras y habilidad sin igual para exprimir el máximo de cualquier coche."
    },
    { 
        id: 2, num: "02", name: "LEWIS HAMILTON", short: "HAMILTON", era: "MCLAREN 2008", flag: "🇬🇧", ovr: 98, glow: "220, 220, 220", 
        speed: 98, racecraft: 95, wet: 99, tyre: 96, cons: 97, titles: 7, wins: 103, podiums: 197, poles: 104,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_qualification_2.jpg/640px-Lewis_Hamilton_2016_Malaysia_qualification_2.jpg",
        bio: "Sir Lewis Hamilton revolucionó la F1 desde su debut en 2007 con McLaren, obteniendo su primer título en una dramática última vuelta en Interlagos 2008. Ostenta el récord histórico de victorias y pole positions, destacando por su velocidad pura a una vuelta y dominio magistral en mojado."
    },
    { 
        id: 3, num: "03", name: "MICHAEL SCHUMACHER", short: "SCHUMACHER", era: "FERRARI 2004", flag: "🇩🇪", ovr: 99, glow: "225, 6, 0", 
        speed: 98, racecraft: 99, wet: 98, tyre: 95, cons: 99, titles: 7, wins: 91, podiums: 155, poles: 68,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Michael_Schumacher_2005.jpg/640px-Michael_Schumacher_2005.jpg",
        bio: "El 'Káiser'. Michael Schumacher transformó la preparación física y técnica del piloto moderno. Junto a Ferrari, construyó la era de dominio más apabullante del deporte a principios de los 2000. Destacó por su ética de trabajo implacable y ritmo de clasificación continuo durante las carreras."
    },
    { 
        id: 4, num: "04", name: "AYRTON SENNA", short: "SENNA", era: "MCLAREN 1988", flag: "🇧🇷", ovr: 99, glow: "255, 60, 60", 
        speed: 99, racecraft: 90, wet: 99, tyre: 84, cons: 90, titles: 3, wins: 41, podiums: 80, poles: 65,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ayrton_Senna_1989.jpg/640px-Ayrton_Senna_1989.jpg",
        bio: "Mito e icono inmortal del deporte. Ayrton Senna da Silva deslumbró al mundo por su fe inquebrantable, mística y una velocidad pura jamás vista. Sus vueltas de clasificación en Mónaco y su recital bajo el aguacero en Donington Park 1993 son consideradas cumbres del automovilismo."
    },
    { 
        id: 5, num: "05", name: "ALAIN PROST", short: "PROST", era: "MCLAREN 1989", flag: "🇫🇷", ovr: 97, glow: "100, 150, 255", 
        speed: 90, racecraft: 97, wet: 88, tyre: 98, cons: 100, titles: 4, wins: 51, podiums: 106, poles: 33,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Alain_Prost_1988_Canada.jpg/640px-Alain_Prost_1988_Canada.jpg",
        bio: "El 'Profesor'. Alain Prost basó su éxito en una conducción suave, sin estrés mecánico innecesario, y una inteligencia de carrera milimétrica. Mantuvo con Senna la rivalidad más intensa y célebre en la historia de la Fórmula 1."
    },
    { 
        id: 6, num: "06", name: "JUAN MANUEL FANGIO", short: "FANGIO", era: "MASERATI 1957", flag: "🇦🇷", ovr: 96, glow: "0, 170, 255", 
        speed: 94, racecraft: 96, wet: 93, tyre: 95, cons: 98, titles: 5, wins: 24, podiums: 35, poles: 29,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Juan_Manuel_Fangio_1952.jpg/640px-Juan_Manuel_Fangio_1952.jpg",
        bio: "El 'Chueco'. Leyenda argentina pionera que ganó 5 campeonatos con 4 marcas distintas (Alfa Romeo, Maserati, Mercedes y Ferrari), un récord imbatible. Su victoria en Nürburgring 1957 remontando en un circuito letal es la mayor exhibición de manejo de todos los tiempos."
    },
    { 
        id: 7, num: "07", name: "NIKI LAUDA", short: "LAUDA", era: "FERRARI 1977", flag: "🇦🇹", ovr: 97, glow: "225, 6, 0", 
        speed: 92, racecraft: 96, wet: 87, tyre: 97, cons: 96, titles: 3, wins: 25, podiums: 54, poles: 24,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Niki_Lauda_1975.jpg/640px-Niki_Lauda_1975.jpg",
        bio: "Niki Lauda destacaba por su precisión analítica y valentía sobrehumana. Tras sufrir un terrible accidente en Nürburgring 1976 en el que recibió la extremaunción, regresó a correr solo 42 días después con quemaduras graves, conquistando más tarde dos títulos mundiales adicionales."
    },
    { 
        id: 8, num: "08", name: "SEBASTIAN VETTEL", short: "VETTEL", era: "RED BULL 2013", flag: "🇩🇪", ovr: 98, glow: "0, 100, 255", 
        speed: 98, racecraft: 94, wet: 90, tyre: 92, cons: 97, titles: 4, wins: 53, podiums: 122, poles: 57,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Sebastian_Vettel_2017_Malaysia_1.jpg/640px-Sebastian_Vettel_2017_Malaysia_1.jpg",
        bio: "Sebastian Vettel se convirtió en el campeón mundial más joven de la historia. Imbatible cuando lideraba desde la pole position, encadenó 4 campeonatos mundiales consecutivos con Red Bull entre 2010 y 2013, logrando el récord de 13 victorias en una sola temporada."
    },
    { 
        id: 9, num: "09", name: "MIKA HÄKKINEN", short: "HÄKKINEN", era: "MCLAREN 1999", flag: "🇫🇮", ovr: 97, glow: "180, 180, 180", 
        speed: 97, racecraft: 87, wet: 85, tyre: 90, cons: 98, titles: 2, wins: 20, podiums: 51, poles: 26,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Mika_H%C3%A4kkinen_1999_Canada.jpg/640px-Mika_H%C3%A4kkinen_1999_Canada.jpg",
        bio: "El 'Finlandés Volador'. Mika Häkkinen fue el rival más temido y respetado por Michael Schumacher. Su adelantamiento en Spa 2000 a más de 300 km/h dobrando a Ricardo Zonta por ambos lados sigue siendo una de las maniobras más espectaculares de la historia."
    },
    { 
        id: 10, num: "10", name: "JIM CLARK", short: "CLARK", era: "TEAM LOTUS 1965", flag: "🇬🇧", ovr: 96, glow: "0, 180, 80", 
        speed: 98, racecraft: 95, wet: 94, tyre: 96, cons: 97, titles: 2, wins: 25, podiums: 32, poles: 33,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Jim_Clark_1966.jpg/640px-Jim_Clark_1966.jpg",
        bio: "Considerado por muchos ingenieros como el talento natural más puro de todos los tiempos. Dominó los años 60 junto a Lotus. Ganó el título mundial de 1965 consiguiendo el máximo de puntos posibles e imponiéndose también en las 500 Millas de Indianápolis ese mismo año."
    }
];

function renderLegendsGrid() {
    const grid = document.getElementById('legends-grid');
    grid.innerHTML = '';

    legendsData.forEach(driver => {
        const renderMiniStat = (label, val) => `
            <div class="mini-stat-row">
                <span class="mini-stat-label">${label}</span>
                <div class="mini-stat-track">
                    <div class="mini-stat-fill" style="width: ${val}%"></div>
                </div>
                <span class="mini-stat-val">${val}</span>
            </div>
        `;

        grid.innerHTML += `
            <div class="legend-card-container hover-sound" 
                 style="--card-glow: ${driver.glow};"
                 onclick="openBio(${driver.id})">
                
                <div class="card-header-bar">
                    <span class="card-number-badge">${driver.num}</span>
                    <span class="text-xs">${driver.flag}</span>
                </div>

                <div class="card-image-wrapper">
                    <img src="${driver.img}" 
                         alt="${driver.name}"
                         onerror="handleImageError(this, '${driver.short}')">
                </div>

                <div class="card-info-box">
                    <div class="flex justify-between items-start">
                        <div class="w-3/4">
                            <h3 class="driver-name-title">${driver.name}</h3>
                            <p class="driver-sub-info">${driver.era}</p>
                        </div>
                        <div class="ovr-badge-box">
                            <div class="ovr-label">OVR</div>
                            <div class="ovr-val">${driver.ovr}</div>
                        </div>
                    </div>

                    <div class="stat-bar-group">
                        ${renderMiniStat('SPD', driver.speed)}
                        ${renderMiniStat('RAC', driver.racecraft)}
                        ${renderMiniStat('WET', driver.wet)}
                        ${renderMiniStat('TYR', driver.tyre)}
                        ${renderMiniStat('CNS', driver.cons)}
                    </div>
                </div>

            </div>
        `;
    });
}

function handleImageError(imgElem, driverShort) {
    imgElem.onerror = null;
    imgElem.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%230c1017"/><circle cx="150" cy="140" r="60" fill="%231e293b"/><path d="M70 320 Q150 210 230 320 Z" fill="%231e293b"/><text x="150" y="370" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${driverShort}</text></svg>`;
}

renderLegendsGrid();

/* MODAL BIOGRAPHY LOGIC */
function openBio(id) {
    playClickSound();
    const driver = legendsData.find(d => d.id === id);
    if (!driver) return;

    document.getElementById('bio-name').innerText = driver.name;
    document.getElementById('bio-era').innerText = driver.era;
    document.getElementById('bio-team').innerText = `${driver.era} • ${driver.titles} TÍTULOS MUNDIALES`;
    document.getElementById('bio-ovr').innerText = driver.ovr;
    document.getElementById('bio-flag').innerText = driver.flag;
    document.getElementById('bio-text').innerText = driver.bio;
    
    document.getElementById('palmares-titles').innerText = driver.titles;
    document.getElementById('palmares-wins').innerText = driver.wins;
    document.getElementById('palmares-podiums').innerText = driver.podiums;
    document.getElementById('palmares-poles').innerText = driver.poles;

    const bioImg = document.getElementById('bio-img');
    bioImg.src = driver.img;
    bioImg.onerror = function() {
        handleImageError(this, driver.short);
    };

    document.getElementById('bio-glow-bg').style.background = `radial-gradient(circle at 50% 30%, rgba(${driver.glow}, 0.5) 0%, transparent 70%)`;

    const statsContainer = document.getElementById('bio-stats');
    const renderStatBar = (label, val) => `
        <div>
            <div class="flex justify-between font-tech text-xs font-bold mb-1">
                <span class="text-gray-400">${label}</span>
                <span class="text-white">${val} / 100</span>
            </div>
            <div class="w-full h-2 bg-gray-900 border border-gray-800 rounded overflow-hidden">
                <div class="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded" style="width: ${val}%"></div>
            </div>
        </div>
    `;

    statsContainer.innerHTML = `
        ${renderStatBar('Velocidad Pura (Speed)', driver.speed)}
        ${renderStatBar('Habilidad en Carrera (Racecraft)', driver.racecraft)}
        ${renderStatBar('Control en Mojado (Wet Control)', driver.wet)}
        ${renderStatBar('Gestión de Neumáticos', driver.tyre)}
        ${renderStatBar('Consistencia (Consistency)', driver.cons)}
    `;

    const modal = document.getElementById('modal-bio');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
    }, 10);
}

function closeBio() {
    playClickSound();
    const modal = document.getElementById('modal-bio');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/* MODAL SALIR */
function showModalSalir() {
    playClickSound();
    document.getElementById('modal-salir').classList.remove('hidden');
}
function hideModalSalir() {
    playClickSound();
    document.getElementById('modal-salir').classList.add('hidden');
}
function closeGame() {
    hideModalSalir();
    triggerToast('Guardando perfil y cerrando Formula Legends...');
}

/* TOAST NOTIFICATION SYSTEM */
let toastTimeout = null;
function triggerToast(message) {
    playClickSound();
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ESCAPE KEY LISTENER */
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modalBio = document.getElementById('modal-bio');
        if (!modalBio.classList.contains('hidden')) {
            closeBio();
            return;
        }
        const modalSalir = document.getElementById('modal-salir');
        if (!modalSalir.classList.contains('hidden')) {
            hideModalSalir();
            return;
        }
        const gameContainer = document.getElementById('game-canvas-container');
        if (gameContainer.classList.contains('active')) {
            exitScalextricGame();
            return;
        }
        const threeContainer = document.getElementById('threejs-container');
        if (isThreeActive || !threeContainer.classList.contains('hidden')) {
            closeCircuit3D();
            return;
        }
    }
});

/* ========================================================================= */
/* RACE & SCALEXTRIC GAME ENGINE (SOLO & 1V1 COMPETIR CON UN AMIGO)          */
/* ========================================================================= */
let scalextricCanvas, scalextricCtx;
let isGameRunning = false;
let animationFrameId = null;
let raceCountdownEndTime = 0;
let raceHasStarted = false;
let raceFinished = false;
let raceGoVisibleUntil = 0;
let speedZoneMapCache = null;
let raceMode = 'solo'; // 'solo' | 'friend'
const racePaceMultiplier = 4;

// Player 1 (W / S) & Player 2 (ArrowUp / ArrowDown) Key States
let keyW = false;
let keyS = false;
let keyUp = false;
let keyDown = false;
let overtakeBoostTimer = 0;
let overtakeBoostCooldown = 0;
let playerLaneOffset = -8;
const overtakeBoostDuration = 1.5;
const overtakeBoostCooldownDuration = 3;
const overtakeGapThreshold = 0.025;
const overtakeGapRearTolerance = 0.0025;

function createDefaultCarState() {
    return {
        progress: 0,         // 0 to 1 distance along loop
        speed: 0,            // km/h
        maxSpeed: 480,       // max km/h
        accelRate: 3.8,      // rapid acceleration
        brakeRate: 280,      // Maximum braking force in km/h per second
        naturalFriction: 0.6,
        throttleIntensity: 0,
        currentLap: 1,
        totalLaps: 5,
        lapStartTime: 0,
        currentLapTime: 0,
        bestLapTime: null,
        offTrackTimer: 0,    // Spinout penalty timer
        penaltyTimer: 0,     // 1 second speed limit penalty
        isPenalized: false,
        brakeIntensity: 0,
        overtakeBoostTimer: 0,
        overtakeBoostCooldown: 0,
        laneOffset: 0
    };
}

const playerState = createDefaultCarState();
const player2State = createDefaultCarState();

const aiState = {
    progress: 0.015,
    speed: 0,
    maxSpeed: playerState.maxSpeed,
    accelRate: playerState.accelRate,
    currentLap: 1
};

function clearRaceInputKeys() {
    keyW = false;
    keyS = false;
    keyUp = false;
    keyDown = false;
}

// Track Path Generator (Le Mans Top-Down Approximation Spline)
function getLeMansTrackPoint(t, laneOffset = 0) {
    const width = scalextricCanvas.width;
    const height = scalextricCanvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.44;
    const ry = height * 0.40;

    const angle = t * Math.PI * 2;
    
    let x = cx + Math.cos(angle) * rx;
    let y = cy + Math.sin(angle) * ry;

    // Dunlop curve bump top right
    if (t > 0.1 && t < 0.25) {
        const bump = Math.sin((t - 0.1) / 0.15 * Math.PI) * 55;
        y -= bump;
    }
    // Mulsanne Chicanes bottom straight
    if (t > 0.55 && t < 0.75) {
        const chicane = Math.sin((t - 0.55) / 0.2 * Math.PI * 4) * 25;
        y += chicane;
    }
    // Porsche curves left side
    if (t > 0.82 && t < 0.95) {
        const porsche = Math.sin((t - 0.82) / 0.13 * Math.PI * 2) * 40;
        x += porsche;
    }

    // Normal vector for lane offset
    const deltaT = 0.001;
    const nextAngle = (t + deltaT) * Math.PI * 2;
    let nx = cx + Math.cos(nextAngle) * rx;
    let ny = cy + Math.sin(nextAngle) * ry;
    if (t + deltaT > 0.1 && t + deltaT < 0.25) ny -= Math.sin((t + deltaT - 0.1) / 0.15 * Math.PI) * 55;
    if (t + deltaT > 0.55 && t + deltaT < 0.75) ny += Math.sin((t + deltaT - 0.55) / 0.2 * Math.PI * 4) * 25;
    if (t + deltaT > 0.82 && t + deltaT < 0.95) nx += Math.sin((t + deltaT - 0.82) / 0.13 * Math.PI * 2) * 40;

    const dx = nx - x;
    const dy = ny - y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    
    const px = -dy / len;
    const py = dx / len;

    return {
        x: x + px * laneOffset,
        y: y + py * laneOffset,
        angle: Math.atan2(dy, dx),
        curvature: Math.abs((Math.atan2(dy, dx) - (t > 0 ? Math.atan2(dy, dx) : 0)))
    };
}

function getTrackCurvature(t) {
    const p1 = getLeMansTrackPoint(t);
    const p2 = getLeMansTrackPoint((t + 0.005) % 1);
    let diff = Math.abs(p2.angle - p1.angle);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    return diff;
}

function getCurveCrashSpeedLimit(curvature) {
    return 320 / (1 + curvature * 14) + 145;
}

function getRecommendedTrackSpeed(curvature) {
    return Math.max(0, Math.floor((getCurveCrashSpeedLimit(curvature) - 10) / 10) * 10);
}

function getAiTargetTrackSpeed(progress) {
    const { samples } = getTrackSpeedZoneData();
    const steps = samples.length;
    const lookaheadSteps = Math.ceil(steps * 0.04);
    let targetSpeed = playerState.maxSpeed;

    for (let ahead = 0; ahead <= lookaheadSteps; ahead++) {
        const sampleIndex = Math.floor(progress * steps + ahead) % steps;
        const sample = samples[sampleIndex];
        if (sample.category === 2 && sample.speedLimit !== undefined) {
            targetSpeed = Math.min(targetSpeed, sample.speedLimit);
        }
    }

    return targetSpeed;
}

function getPlayerTrackSpeedLimit(progress) {
    const { samples } = getTrackSpeedZoneData();
    const steps = samples.length;
    const sampleIndex = Math.floor(progress * steps) % steps;
    const sample = samples[sampleIndex];
    if (sample.category === 0) return Infinity;
    if (sample.category === 2) return sample.speedLimit ?? getRecommendedTrackSpeed(sample.curvature);

    const approachSteps = Math.ceil(steps * 0.018);
    for (let ahead = 1; ahead <= approachSteps; ahead++) {
        const nextSample = samples[(sampleIndex + ahead) % steps];
        if (nextSample.category === 2) {
            return nextSample.speedLimit ?? getRecommendedTrackSpeed(nextSample.curvature);
        }
    }
    return Infinity;
}

function getTrackSpeedZoneData() {
    if (speedZoneMapCache) return speedZoneMapCache;

    const steps = 300;
    const samples = [];
    const zones = [];
    for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        const curvature = getTrackCurvature(progress);
        const crashZone = curvature > 0.18
            && getTrackCurvature((progress + 0.01) % 1) > 0.08
            && getTrackCurvature((progress + 0.99) % 1) > 0.08;
        samples.push({
            progress,
            curvature,
            crashZone,
            category: crashZone ? 2 : 0
        });
    }

    let zoneStart = null;
    for (let i = 0; i <= steps; i++) {
        const inZone = i < steps && samples[i].crashZone;
        if (inZone && zoneStart === null) zoneStart = i;
        if (!inZone && zoneStart !== null) {
            const zoneEnd = i - 1;
            const midpointIndex = Math.floor((zoneStart + zoneEnd) / 2);
            const zoneSamples = samples.slice(zoneStart, zoneEnd + 1);
            const safeSpeed = Math.min(...zoneSamples.map(sample =>
                getRecommendedTrackSpeed(sample.curvature)
            ));
            zoneSamples.forEach(sample => { sample.speedLimit = safeSpeed; });
            zones.push({
                progress: samples[midpointIndex].progress,
                safeSpeed
            });
            zoneStart = null;
        }
    }

    const approachSamples = Math.ceil(steps * 0.018);
    for (let i = 0; i < steps; i++) {
        if (samples[i].crashZone) continue;
        for (let ahead = 1; ahead <= approachSamples; ahead++) {
            if (samples[(i + ahead) % steps].crashZone) {
                samples[i].category = 1;
                break;
            }
        }
    }

    speedZoneMapCache = { samples, zones };
    return speedZoneMapCache;
}

function drawTrackSpeedZones(ctx) {
    const { samples, zones } = getTrackSpeedZoneData();
    const steps = samples.length;
    const colors = ['#22c55e', '#facc15', '#ef4444'];

    for (let category = 0; category < colors.length; category++) {
        ctx.beginPath();
        for (let i = 0; i < steps; i++) {
            if (samples[i].category !== category) continue;
            const start = getLeMansTrackPoint(samples[i].progress);
            const end = getLeMansTrackPoint((i + 1) / steps);
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
        }
        ctx.lineWidth = category === 0 ? 4 : 8;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colors[category];
        ctx.globalAlpha = category === 0 ? 0.65 : 0.95;
        ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.font = 'bold 12px "Rajdhani", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const zone of zones) {
        const point = getLeMansTrackPoint(zone.progress, 52);
        const label = `FRENA · MAX ${zone.safeSpeed} KM/H`;
        const labelWidth = ctx.measureText(label).width + 16;
        ctx.fillStyle = 'rgba(7, 9, 14, 0.92)';
        ctx.fillRect(point.x - labelWidth / 2, point.y - 13, labelWidth, 26);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(point.x - labelWidth / 2, point.y - 13, labelWidth, 26);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, point.x, point.y);
    }
}

const TYRE_COMPOUNDS = {
    soft:   { label: 'BLANDO', short: 'S', laps: 2, speedPenalty: 0.02 },
    medium: { label: 'MEDIO', short: 'M', laps: 3, speedPenalty: 0.01 },
    hard:   { label: 'DURO', short: 'H', laps: 4, speedPenalty: 0.00 }
};
let activeTyre = 'medium';
let selectedStartingTyre = 'medium';
let tyreLapsUsed = 0;
let pitStopUntil = 0;

function resetTyreStrategy() {
    activeTyre = selectedStartingTyre;
    tyreLapsUsed = 0;
    pitStopUntil = 0;
    updateTyreHud();
}

function updateTyreHud() {
    const compound = TYRE_COMPOUNDS[activeTyre];
    const wear = Math.min(100, (tyreLapsUsed / compound.laps) * 100);
    const label = document.getElementById('tyre-compound-label');
    const fill = document.getElementById('tyre-wear-fill');
    const wearLabel = document.getElementById('tyre-wear-label');
    const lapsLabel = document.getElementById('tyre-laps-label');
    if (label) {
        label.textContent = `${compound.label} · ${compound.short}`;
        label.className = `tyre-compound ${activeTyre}`;
    }
    if (fill) fill.style.width = `${wear}%`;
    if (wearLabel) wearLabel.textContent = `DESGASTE ${Math.round(wear)}%`;
    if (lapsLabel) lapsLabel.textContent = `${Math.min(tyreLapsUsed, compound.laps)} / ${compound.laps} VUELTAS`;
    const pitButton = document.getElementById('pit-open-button');
    if (pitButton) pitButton.textContent = wear >= 100 ? 'NEUMÁTICOS AGOTADOS · ENTRAR EN BOXES [P]' : 'ENTRAR EN BOXES · [P]';
}

function openPitStop() {
    if (!isRace3DActive || raceMode !== 'solo' || raceFinished || !raceHasStarted) return;
    playClickSound();
    playerState.speed = 0;
    document.getElementById('pit-stop-modal').hidden = false;
}

function closePitStop() {
    document.getElementById('pit-stop-modal').hidden = true;
}

function selectPitTyre(compound) {
    if (!TYRE_COMPOUNDS[compound]) return;
    activeTyre = compound;
    tyreLapsUsed = 0;
    playerState.speed = 0;
    pitStopUntil = performance.now() + 2500;
    closePitStop();
    updateTyreHud();
    triggerToast(`BOXES: NEUMÁTICO ${TYRE_COMPOUNDS[compound].label}. PARADA 2,5 S`);
}

let selectedQuickRaceMap = 'indianapolis';
let loadedRaceMap = null;

function openQuickRaceMaps(mode = 'solo') {
    playClickSound();
    raceMode = mode === 'friend' ? 'friend' : 'solo';
    const tyreSetup = document.getElementById('quick-tyre-setup');
    if (tyreSetup) tyreSetup.hidden = true;

    const titleEl = document.getElementById('quick-map-title');
    const subtitleEl = document.getElementById('quick-map-subtitle');
    const descIndy = document.getElementById('quick-map-desc-indianapolis');
    const descLeMans = document.getElementById('quick-map-desc-lemans');
    const descVegas = document.getElementById('quick-map-desc-vegas');

    if (raceMode === 'friend') {
        if (titleEl) titleEl.innerText = 'COMPETIR CON UN AMIGO — ELIGE CIRCUITO';
        if (subtitleEl) subtitleEl.innerText = 'Jugador 1: [W] Acelerar / [S] Frenar  •  Jugador 2: [↑ Flecha Arriba] Acelerar / [↓ Flecha Abajo] Frenar';
        if (descIndy) descIndy.innerText = 'Duelo 1v1 en 3D · J1 Alonso [W/S] vs J2 Hamilton [↑/↓]';
        if (descLeMans) descLeMans.innerText = 'Duelo 1v1 en 3D · J1 Alonso [W/S] vs J2 Hamilton [↑/↓]';
        if (descVegas) descVegas.innerText = 'Duelo 1v1 en 3D · J1 Alonso [W/S] vs J2 Hamilton [↑/↓]';
    } else {
        if (titleEl) titleEl.innerText = 'ELIGE EL CIRCUITO';
        if (subtitleEl) subtitleEl.innerText = 'Selecciona el mapa para tu partida rápida';
        if (descIndy) descIndy.innerText = 'Circuito 3D actual · Alonso contra Hamilton';
        if (descLeMans) descLeMans.innerText = 'Nuevo circuito 3D · trazado del modelo GLB';
        if (descVegas) descVegas.innerText = 'Circuito urbano 3D · raíles y asfalto del modelo GLB';
    }

    nav('screen-quick-map');
}

function selectQuickRaceMap(mapId) {
    const availableMaps = ['indianapolis', 'lemans', 'vegas'];
    selectedQuickRaceMap = availableMaps.includes(mapId) ? mapId : 'indianapolis';
    playClickSound();
    if (raceMode === 'solo') {
        selectedStartingTyre = 'medium';
        updateStartingTyreSelection();
        const setup = document.getElementById('quick-tyre-setup');
        if (setup) {
            setup.hidden = false;
            setup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
    }
    startIndianapolisRace();
}

function selectStartingTyre(compound) {
    if (!TYRE_COMPOUNDS[compound]) return;
    selectedStartingTyre = compound;
    playClickSound();
    updateStartingTyreSelection();
}

function updateStartingTyreSelection() {
    document.querySelectorAll('[data-start-tyre]').forEach(button => {
        const selected = button.dataset.startTyre === selectedStartingTyre;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    const summary = document.getElementById('starting-tyre-summary');
    if (summary) summary.textContent = `SALDRÁS CON ${TYRE_COMPOUNDS[selectedStartingTyre].label}S`;
}

function confirmQuickRaceStart() {
    if (raceMode !== 'solo' || !TYRE_COMPOUNDS[selectedStartingTyre]) return;
    playClickSound();
    const setup = document.getElementById('quick-tyre-setup');
    if (setup) setup.hidden = true;
    startIndianapolisRace();
}

function startScalextricGame() {
    openQuickRaceMaps('solo');
}

function startLegacyScalextricGame() {
    playClickSound();
    raceMode = 'solo';
    document.getElementById('ui-main-layer').style.display = 'none';
    document.getElementById('menu-backgrounds').style.display = 'none';
    const gameContainer = document.getElementById('game-canvas-container');
    gameContainer.classList.add('active', 'legacy-2d');
    configureRaceHudLayout();

    scalextricCanvas = document.getElementById('scalextric-canvas');
    scalextricCtx = scalextricCanvas.getContext('2d');
    resizeLegacyScalextricCanvas();
    window.addEventListener('resize', resizeLegacyScalextricCanvas);
    speedZoneMapCache = null;

    Object.assign(playerState, createDefaultCarState(), {
        lapStartTime: performance.now(),
        laneOffset: -8
    });
    playerLaneOffset = -8;
    aiState.progress = 0.015;
    aiState.speed = 0;
    aiState.currentLap = 1;
    overtakeBoostTimer = 0;
    overtakeBoostCooldown = 0;
    clearRaceInputKeys();

    raceHasStarted = false;
    raceFinished = false;
    raceGoVisibleUntil = 0;
    document.getElementById('race-result').hidden = true;
    raceCountdownEndTime = performance.now() + 3000;
    const countdown = document.getElementById('race-countdown');
    countdown.hidden = false;
    countdown.classList.remove('go');
    countdown.innerText = '3';
    lastFrameTime = performance.now();
    isGameRunning = true;
    requestAnimationFrame(gameLoop);
}

function resizeLegacyScalextricCanvas() {
    if (!scalextricCanvas
        || !document.getElementById('game-canvas-container').classList.contains('legacy-2d')) return;
    scalextricCanvas.width = window.innerWidth;
    scalextricCanvas.height = window.innerHeight;
    speedZoneMapCache = null;
}

function exitScalextricGame() {
    playClickSound();
    isGameRunning = false;
    isRace3DActive = false;
    raceHasStarted = false;
    raceFinished = false;
    clearRaceInputKeys();
    document.getElementById('race-countdown').hidden = true;
    document.getElementById('race-result').hidden = true;
    document.getElementById('race-threejs-loader').hidden = true;
    if (race3DAnimId) cancelAnimationFrame(race3DAnimId);

    const uiLayer = document.getElementById('ui-main-layer');
    const bgContainer = document.getElementById('menu-backgrounds');
    const gameContainer = document.getElementById('game-canvas-container');

    gameContainer.classList.remove('active');
    gameContainer.classList.remove('legacy-2d');
    uiLayer.style.display = 'flex';
    bgContainer.style.display = 'block';
    nav('screen-main');
}

function rematchRace() {
    playClickSound();
    if (isRace3DActive) {
        resetIndianapolisRace();
        lastRace3DTime = performance.now();
        raceCameraReady = false;
        animateIndianapolisRace(lastRace3DTime);
    } else {
        startLegacyScalextricGame();
    }
}

function triggerOvertakeForCar(carState, rivalState) {
    if (!raceHasStarted || carState.isPenalized || carState.overtakeBoostCooldown > 0) return;
    const carRaceDistance = (carState.currentLap - 1) + carState.progress;
    const rivalRaceDistance = (rivalState.currentLap - 1) + rivalState.progress;
    const gapToRival = rivalRaceDistance - carRaceDistance;
    if (gapToRival >= -overtakeGapRearTolerance && gapToRival <= overtakeGapThreshold) {
        carState.overtakeBoostTimer = overtakeBoostDuration;
        carState.overtakeBoostCooldown = overtakeBoostCooldownDuration;
        if (carState === playerState) {
            overtakeBoostTimer = overtakeBoostDuration;
            overtakeBoostCooldown = overtakeBoostCooldownDuration;
        }
    }
}

// Keyboard Controls (Solo & 1v1 Competir con un Amigo)
window.addEventListener('keydown', (e) => {
    if (isGameRunning && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.code === 'Space')) {
        e.preventDefault();
    }
    if ((e.key === 'p' || e.key === 'P') && isRace3DActive && raceMode === 'solo' && !e.repeat) {
        e.preventDefault();
        openPitStop();
    }
    if (e.key === 'w' || e.key === 'W') keyW = true;
    if (e.key === 's' || e.key === 'S') keyS = true;
    if (e.key === 'ArrowUp') keyUp = true;
    if (e.key === 'ArrowDown') keyDown = true;

    if (e.code === 'Space' && isGameRunning && !e.repeat && raceHasStarted) {
        const rival = raceMode === 'friend' ? player2State : aiState;
        triggerOvertakeForCar(playerState, rival);
    }

    if ((e.code === 'ShiftRight' || e.code === 'Enter')
        && isGameRunning && !e.repeat && raceHasStarted && raceMode === 'friend') {
        e.preventDefault();
        triggerOvertakeForCar(player2State, playerState);
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W') keyW = false;
    if (e.key === 's' || e.key === 'S') keyS = false;
    if (e.key === 'ArrowUp') keyUp = false;
    if (e.key === 'ArrowDown') keyDown = false;
});

// Touch Pedal Controls
const btnGas = document.getElementById('btn-touch-gas');
const btnBrake = document.getElementById('btn-touch-brake');

if (btnGas && btnBrake) {
    btnGas.addEventListener('touchstart', (e) => { e.preventDefault(); keyW = true; });
    btnGas.addEventListener('touchend', (e) => { e.preventDefault(); keyW = false; });
    btnBrake.addEventListener('touchstart', (e) => { e.preventDefault(); keyS = true; });
    btnBrake.addEventListener('touchend', (e) => { e.preventDefault(); keyS = false; });
}

function formatTime(ms) {
    if (!ms || isNaN(ms)) return "--:--.--";
    const totalSec = ms / 1000;
    const min = Math.floor(totalSec / 60);
    const sec = Math.floor(totalSec % 60);
    const msec = Math.floor((totalSec % 1) * 100);
    return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}.${msec.toString().padStart(2,'0')}`;
}

/* MAIN GAME LOOP (LEGACY 2D) */
let lastFrameTime = performance.now();

function gameLoop(now) {
    if (!isGameRunning || raceFinished) return;
    const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
    lastFrameTime = now;

    const countdown = document.getElementById('race-countdown');
    if (!raceHasStarted && now < raceCountdownEndTime) {
        countdown.innerText = Math.ceil((raceCountdownEndTime - now) / 1000).toString();
        renderScalextricScene();
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
    }
    if (!raceHasStarted) {
        raceHasStarted = true;
        raceGoVisibleUntil = now + 650;
        playerState.lapStartTime = now;
    }
    if (now < raceGoVisibleUntil) {
        countdown.hidden = false;
        countdown.classList.add('go');
        countdown.innerText = '¡YA!';
    } else {
        countdown.hidden = true;
        countdown.classList.remove('go');
    }

    updatePhysics(dt, now);
    renderScalextricScene();

    if (isGameRunning && !raceFinished) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function finishRace(winner) {
    raceFinished = true;
    isGameRunning = false;
    const result = document.getElementById('race-result');
    const titleEl = document.getElementById('race-result-title');
    const msgEl = document.getElementById('race-result-message');

    if (raceMode === 'friend') {
        if (winner === 'player') {
            titleEl.innerText = '¡GANA JUGADOR 1!';
            msgEl.innerText = 'Alonso [W / S] ha cruzado la meta antes que el Jugador 2.';
        } else {
            titleEl.innerText = '¡GANA JUGADOR 2!';
            msgEl.innerText = 'Hamilton [↑ / ↓] ha cruzado la meta antes que el Jugador 1.';
        }
        document.getElementById('hud-lap').innerText =
            `${Math.min(playerState.currentLap, playerState.totalLaps)} - ${Math.min(player2State.currentLap, player2State.totalLaps)} / ${playerState.totalLaps}`;
    } else {
        titleEl.innerText = winner === 'player'
            ? '¡HAS GANADO!'
            : '¡HAS PERDIDO!';
        msgEl.innerText = winner === 'player'
            ? 'Has cruzado la meta antes que la IA.'
            : 'La IA ha cruzado la meta antes que tú.';
        document.getElementById('hud-lap').innerText = `${playerState.totalLaps} / ${playerState.totalLaps}`;
    }
    result.hidden = false;
}

function updatePhysics(dt, now) {
    overtakeBoostTimer = Math.max(0, overtakeBoostTimer - dt);
    overtakeBoostCooldown = Math.max(0, overtakeBoostCooldown - dt);
    playerState.overtakeBoostTimer = overtakeBoostTimer;
    playerState.overtakeBoostCooldown = overtakeBoostCooldown;

    const p1Gas = keyW || keyUp;
    const p1Brake = keyS || keyDown;

    if (playerState.offTrackTimer > 0) {
        playerState.offTrackTimer -= dt;
        playerState.speed = 0;
        document.getElementById('hud-status').innerText = '💥 SALIDA DE PISTA';
        document.getElementById('hud-status').className = 'text-red-500 font-black animate-pulse';
        return;
    }

    if (playerState.penaltyTimer > 0) {
        playerState.penaltyTimer -= dt;
        playerState.isPenalized = true;
        document.getElementById('hud-status').innerText = `⚡ PENALIZACIÓN (${playerState.penaltyTimer.toFixed(1)}s)`;
        document.getElementById('hud-status').className = 'text-amber-400 font-extrabold';
    } else {
        playerState.isPenalized = false;
    }

    const curvature = getTrackCurvature(playerState.progress);
    let effectiveMaxSpeed = playerState.maxSpeed;
    const playerRaceDistance = (playerState.currentLap - 1) + playerState.progress;
    const aiRaceDistance = (aiState.currentLap - 1) + aiState.progress;
    const gapToAi = aiRaceDistance - playerRaceDistance;
    const draftStrength = p1Gas && !p1Brake && !playerState.isPenalized
        && curvature < 0.08 && gapToAi > 0 && gapToAi <= 0.025
        ? 1
        : 0;
    const isOvertaking = overtakeBoostTimer > 0 && !playerState.isPenalized;
    const boostStrength = draftStrength || isOvertaking ? 1 : 0;
    const targetLaneOffset = isOvertaking ? 8 : -8;
    playerLaneOffset += (targetLaneOffset - playerLaneOffset) * Math.min(1, dt * 8);
    if (boostStrength) effectiveMaxSpeed = playerState.maxSpeed + 90;
    const trackSpeedLimit = getPlayerTrackSpeedLimit(playerState.progress);
    if (Number.isFinite(trackSpeedLimit)) {
        effectiveMaxSpeed = Math.min(effectiveMaxSpeed, trackSpeedLimit);
    }

    if (playerState.isPenalized) {
        effectiveMaxSpeed = 120;
    } else {
        const hudStatus = document.getElementById('hud-status');
        if (Number.isFinite(trackSpeedLimit)) {
            hudStatus.innerText = `⚠ LÍMITE ${trackSpeedLimit} KM/H`;
            hudStatus.className = 'text-amber-300 font-extrabold animate-pulse';
        } else {
            hudStatus.innerText = isOvertaking
                ? '⚡ ADELANTAMIENTO'
                : draftStrength > 0
                    ? '💨 REBUFO'
                    : 'EN PISTA';
            hudStatus.className = boostStrength
                ? 'text-cyan-300 font-extrabold animate-pulse'
                : 'text-emerald-400 font-bold';
        }
    }

    const throttleRequested = (p1Gas || isOvertaking) && !p1Brake;
    playerState.throttleIntensity = throttleRequested
        ? Math.min(1, playerState.throttleIntensity + dt * 2.5)
        : Math.max(0, playerState.throttleIntensity - dt * 4);

    if (playerState.throttleIntensity > 0 && !p1Brake) {
        if (playerState.speed < effectiveMaxSpeed) {
            const accelMult = playerState.isPenalized ? 0.3 : 1.0;
            const acceleration = playerState.accelRate * 90 * accelMult
                * (1 + boostStrength * 0.7) * playerState.throttleIntensity;
            playerState.speed = Math.min(effectiveMaxSpeed, playerState.speed + acceleration * dt);
        }
    } else if (!p1Brake) {
        playerState.speed -= playerState.naturalFriction * 40 * dt;
    }

    if (p1Brake) {
        playerState.brakeIntensity = Math.min(100, playerState.brakeIntensity + dt * 180);
    } else {
        playerState.brakeIntensity = Math.max(0, playerState.brakeIntensity - dt * 300);
    }
    playerState.speed -= playerState.brakeRate * (playerState.brakeIntensity / 100) * dt;

    if (curvature > 0.05) {
        playerState.speed -= curvature * 140 * dt;
    }

    playerState.speed = Math.max(0, playerState.speed);
    if (Number.isFinite(trackSpeedLimit)) {
        playerState.speed = Math.min(playerState.speed, effectiveMaxSpeed);
    } else if (playerState.speed > effectiveMaxSpeed) {
        playerState.speed = Math.max(effectiveMaxSpeed, playerState.speed - 260 * dt);
    }

    const curveAhead = getTrackCurvature((playerState.progress + 0.01) % 1);
    const curveBehind = getTrackCurvature((playerState.progress + 0.99) % 1);
    const maxSafeCurveSpeed = getCurveCrashSpeedLimit(curvature);
    if (curvature > 0.18 && curveAhead > 0.08 && curveBehind > 0.08
        && playerState.speed > maxSafeCurveSpeed + 65) {
        playCrashSound();
        playerState.offTrackTimer = 1.2;
        playerState.penaltyTimer = 1.0;
        playerState.speed = 0;
        return;
    }

    const trackLengthKm = 13.626;
    const distTraveledKm = (playerState.speed * dt * racePaceMultiplier) / 3600;
    const progressDelta = distTraveledKm / trackLengthKm;
    const playerProgressBeforeAdvance = playerState.progress;
    let playerFinishFraction = null;

    playerState.progress += progressDelta;

    if (playerState.progress >= 1) {
        playerState.progress %= 1;
        playerState.currentLap++;

        const lapTime = now - playerState.lapStartTime;
        if (!playerState.bestLapTime || lapTime < playerState.bestLapTime) {
            playerState.bestLapTime = lapTime;
        }
        playerState.lapStartTime = now;
        if (playerState.currentLap > playerState.totalLaps && progressDelta > 0) {
            playerFinishFraction = (1 - playerProgressBeforeAdvance) / progressDelta;
        }
    }
    playerState.currentLapTime = now - playerState.lapStartTime;

    const aiTargetSpeed = getAiTargetTrackSpeed(aiState.progress);
    if (aiState.speed < aiTargetSpeed) {
        aiState.speed = Math.min(
            aiTargetSpeed,
            aiState.speed + aiState.accelRate * 90 * dt
        );
    } else if (aiState.speed > aiTargetSpeed) {
        aiState.speed = Math.max(
            aiTargetSpeed,
            aiState.speed - playerState.brakeRate * dt
        );
    }

    const aiDistKm = (aiState.speed * dt * racePaceMultiplier) / 3600;
    const aiProgressDelta = aiDistKm / trackLengthKm;
    const aiProgressBeforeAdvance = aiState.progress;
    let aiFinishFraction = null;
    aiState.progress += aiProgressDelta;
    if (aiState.progress >= 1) {
        aiState.progress %= 1;
        aiState.currentLap++;
        if (aiState.currentLap > playerState.totalLaps && aiProgressDelta > 0) {
            aiFinishFraction = (1 - aiProgressBeforeAdvance) / aiProgressDelta;
        }
    }

    if (playerFinishFraction !== null || aiFinishFraction !== null) {
        const winner = aiFinishFraction === null
            || (playerFinishFraction !== null && playerFinishFraction <= aiFinishFraction)
            ? 'player'
            : 'ai';
        finishRace(winner);
        return;
    }

    document.getElementById('hud-speed-val').innerText = `${Math.round(playerState.speed)} KM/H`;
    document.getElementById('hud-brake-val').innerText = `${Math.round(playerState.brakeIntensity)}%`;
    document.getElementById('bar-speed-fill').style.width = `${(playerState.speed / playerState.maxSpeed) * 100}%`;
    document.getElementById('bar-brake-fill').style.width = `${playerState.brakeIntensity}%`;

    document.getElementById('hud-lap').innerText = `${playerState.currentLap} / ${playerState.totalLaps}`;
    document.getElementById('hud-time').innerText = formatTime(playerState.currentLapTime);
    document.getElementById('hud-best').innerText = formatTime(playerState.bestLapTime);
    document.getElementById('hud-ai-info').innerText = `${Math.round(aiState.speed)} KM/H`;

    const playerTotalDist = (playerState.currentLap - 1) + playerState.progress;
    const aiTotalDist = (aiState.currentLap - 1) + aiState.progress;

    const isPlayerFirst = playerTotalDist >= aiTotalDist;
    const posElem = document.getElementById('hud-pos');
    if (isPlayerFirst) {
        posElem.innerHTML = '1º <span class="text-xs text-gray-400 font-normal">/ 2</span>';
        posElem.className = 'font-racing text-3xl text-yellow-400 italic font-black';
    } else {
        posElem.innerHTML = '2º <span class="text-xs text-gray-400 font-normal">/ 2</span>';
        posElem.className = 'font-racing text-3xl text-gray-300 italic font-black';
    }
}

/* RENDER SCALEXTRIC TRACK AND CARS */
function renderScalextricScene() {
    const ctx = scalextricCtx;
    const w = scalextricCanvas.width;
    const h = scalextricCanvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#0a1018';
    ctx.fillRect(0, 0, w, h);

    const steps = 300;
    
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
        const pt = getLeMansTrackPoint(i / steps, 0);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.lineWidth = 36;
    ctx.strokeStyle = '#1e2634';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
        const pt = getLeMansTrackPoint(i / steps, 0);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.lineWidth = 42;
    ctx.strokeStyle = '#e10600';
    ctx.setLineDash([12, 12]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
        const pt = getLeMansTrackPoint(i / steps, 0);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.lineWidth = 30;
    ctx.strokeStyle = '#121722';
    ctx.stroke();

    drawTrackSpeedZones(ctx);

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
        const pt = getLeMansTrackPoint(i / steps, -8);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
        const pt = getLeMansTrackPoint(i / steps, 8);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    const startPt = getLeMansTrackPoint(0, 0);
    ctx.save();
    ctx.translate(startPt.x, startPt.y);
    ctx.rotate(startPt.angle + Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-18, -3, 36, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(-18, -3, 9, 6);
    ctx.fillRect(0, -3, 9, 6);
    ctx.restore();

    const aiPt = getLeMansTrackPoint(aiState.progress, 8);
    drawScalextricCar(ctx, aiPt.x, aiPt.y, aiPt.angle, '#3b82f6', '#1d4ed8', 'IA');

    let playerAngle = 0;
    let playerX = 0, playerY = 0;

    if (playerState.offTrackTimer > 0) {
        const basePt = getLeMansTrackPoint(playerState.progress, playerLaneOffset);
        playerX = basePt.x + (Math.random() - 0.5) * 20;
        playerY = basePt.y + (Math.random() - 0.5) * 20;
        playerAngle = basePt.angle + (performance.now() / 80);
    } else {
        const pPt = getLeMansTrackPoint(playerState.progress, playerLaneOffset);
        playerX = pPt.x;
        playerY = pPt.y;
        playerAngle = pPt.angle;
    }

    drawScalextricCar(ctx, playerX, playerY, playerAngle, '#e10600', '#ffffff', 'TÚ');
}

function drawScalextricCar(ctx, x, y, angle, primaryColor, accentColor, label) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(-11, -6, 22, 12);

    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.fillRect(8, -6, 3, 12);
    ctx.fillRect(-12, -7, 3, 14);

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-1, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(-1, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(12, -3);
    ctx.lineTo(28, -8);
    ctx.lineTo(28, 8);
    ctx.lineTo(12, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = primaryColor;
    ctx.font = '9px "Rajdhani", sans-serif';
    ctx.fontWeight = '700';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 12);
}

/* ========================================================================= */
/* MOTOR 3D THREE.JS - CIRCUITOS (INDIANÁPOLIS, LE MANS, LAS VEGAS)          */
/* ========================================================================= */
let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let threeControls = null;
let threeAnimId = null;
let isThreeActive = false;
let isRace3DActive = false;
let threeAssetsPromise = null;
let threeTrackModel = null;
let threeTrackCurve = null;
let threeTrackWidth = 0;
let threeLaneOffset = 0;
let threePlayerCar = null;
let threeAiCar = null;
let race3DAnimId = null;
let lastRace3DTime = 0;
let raceCameraReady = false;
let raceSpeedZoneMapCache = null;
const DEBUG_SPLINE = false;

const camKeys = { w: false, a: false, s: false, d: false, zoomIn: false, zoomOut: false };

const ZOOM_MIN = 15;
const ZOOM_MAX = 160;
const PAN_SPEED = 45;
const PAN_LIMIT = 90;
const RACE_TRACK_LENGTH_KM = 13.626;

const TRACK_3D_CONFIG = {
    indianapolis: {
        file: './modelos3d/indianapolisGP.glb',
        title: 'CIRCUITO DE INDIANÁPOLIS (3D)',
        loadingLabel: 'INDIANÁPOLIS'
    },
    lemans: {
        file: './modelos3d/Lemans.glb',
        title: 'CIRCUITO DE LE MANS (3D)',
        loadingLabel: 'LE MANS'
    },
    vegas: {
        file: './modelos3d/VegasGP_carriles_texturas_corregido.glb',
        title: 'CIRCUITO DE LAS VEGAS (3D)',
        loadingLabel: 'LAS VEGAS'
    }
};

// Trayectoria calculada desde la malla de asfalto del modelo Lemans.glb.
const LEMANS_CENTERLINE_SOURCE_Y = 23.093738555908203;
const LEMANS_CENTERLINE_XZ = [
    [1175.067, -708.807],
    [1174.725, -694.739],
    [1173.970, -680.687],
    [1173.007, -666.647],
    [1171.991, -652.611],
    [1170.722, -638.596],
    [1169.229, -624.603],
    [1167.815, -610.602],
    [1166.791, -596.567],
    [1166.331, -582.503],
    [1166.284, -568.431],
    [1166.451, -554.359],
    [1166.632, -540.288],
    [1166.667, -526.215],
    [1166.667, -512.142],
    [1166.667, -498.070],
    [1166.667, -483.997],
    [1166.667, -469.924],
    [1166.667, -455.851],
    [1166.667, -441.779],
    [1166.667, -427.706],
    [1166.667, -413.633],
    [1166.667, -399.560],
    [1166.667, -385.488],
    [1166.667, -371.415],
    [1166.667, -357.342],
    [1166.683, -343.270],
    [1166.773, -329.197],
    [1166.857, -315.125],
    [1166.837, -301.052],
    [1166.608, -286.981],
    [1166.067, -272.919],
    [1165.308, -258.867],
    [1164.544, -244.815],
    [1163.980, -230.754],
    [1163.728, -216.684],
    [1163.694, -202.611],
    [1163.775, -188.539],
    [1163.869, -174.467],
    [1163.904, -160.394],
    [1163.992, -146.321],
    [1164.078, -132.249],
    [1164.062, -118.176],
    [1163.848, -104.105],
    [1163.379, -90.041],
    [1162.722, -75.983],
    [1161.987, -61.930],
    [1161.276, -47.875],
    [1160.665, -33.816],
    [1160.123, -19.753],
    [1159.553, -5.692],
    [1158.849, 8.363],
    [1157.926, 22.405],
    [1156.835, 36.435],
    [1155.600, 50.454],
    [1154.221, 64.459],
    [1152.698, 78.449],
    [1150.972, 92.415],
    [1149.062, 106.358],
    [1147.071, 120.289],
    [1145.093, 134.222],
    [1143.180, 148.164],
    [1141.278, 162.108],
    [1139.377, 176.051],
    [1137.475, 189.995],
    [1135.584, 203.940],
    [1133.756, 217.893],
    [1131.947, 231.849],
    [1130.061, 245.795],
    [1127.993, 259.715],
    [1125.633, 273.588],
    [1123.040, 287.420],
    [1120.388, 301.240],
    [1117.859, 315.084],
    [1115.628, 328.978],
    [1113.644, 342.910],
    [1111.797, 356.861],
    [1109.992, 370.818],
    [1108.134, 384.767],
    [1106.172, 398.703],
    [1104.173, 412.633],
    [1102.239, 426.572],
    [1100.465, 440.532],
    [1098.898, 454.517],
    [1097.483, 468.518],
    [1096.212, 482.534],
    [1095.091, 496.562],
    [1094.165, 510.603],
    [1093.657, 524.666],
    [1093.332, 538.735],
    [1092.792, 552.797],
    [1091.649, 566.821],
    [1090.004, 580.798],
    [1088.054, 594.734],
    [1085.527, 608.575],
    [1082.182, 622.240],
    [1077.731, 635.584],
    [1071.960, 648.416],
    [1065.654, 660.996],
    [1059.360, 673.583],
    [1053.741, 686.481],
    [1048.994, 699.727],
    [1044.718, 713.133],
    [1040.961, 726.694],
    [1037.857, 740.419],
    [1035.553, 754.297],
    [1034.373, 768.315],
    [1034.013, 782.383],
    [1033.883, 796.455],
    [1033.363, 810.517],
    [1032.669, 824.572],
    [1032.089, 838.632],
    [1031.052, 852.664],
    [1028.993, 866.578],
    [1025.801, 880.282],
    [1022.281, 893.907],
    [1018.072, 907.330],
    [1012.483, 920.231],
    [1004.322, 931.626],
    [992.895, 939.664],
    [979.677, 944.388],
    [965.888, 947.165],
    [951.923, 948.890],
    [937.922, 950.305],
    [923.865, 950.745],
    [909.811, 950.063],
    [895.800, 948.759],
    [881.798, 947.344],
    [867.797, 945.932],
    [853.825, 944.250],
    [839.891, 942.286],
    [825.998, 940.043],
    [812.170, 937.434],
    [798.474, 934.203],
    [784.833, 930.747],
    [771.144, 927.486],
    [757.324, 924.838],
    [743.426, 922.629],
    [729.487, 920.702],
    [715.472, 919.452],
    [701.407, 919.284],
    [687.390, 920.462],
    [673.517, 922.799],
    [659.826, 926.050],
    [646.321, 930.002],
    [632.983, 934.483],
    [619.920, 939.711],
    [607.141, 945.603],
    [594.491, 951.769],
    [581.834, 957.920],
    [569.055, 963.813],
    [556.244, 969.637],
    [543.432, 975.460],
    [530.621, 981.283],
    [517.810, 987.107],
    [505.018, 992.974],
    [492.273, 998.939],
    [479.519, 1004.889],
    [466.705, 1010.705],
    [453.771, 1016.250],
    [440.870, 1021.870],
    [428.046, 1027.665],
    [415.049, 1033.055],
    [401.601, 1037.165],
    [387.689, 1039.095],
    [373.635, 1038.854],
    [359.712, 1036.880],
    [346.078, 1033.414],
    [332.833, 1028.672],
    [320.023, 1022.861],
    [307.690, 1016.092],
    [295.921, 1008.381],
    [284.684, 999.918],
    [274.110, 990.637],
    [264.494, 980.380],
    [255.977, 969.183],
    [248.102, 957.522],
    [240.421, 945.730],
    [232.485, 934.110],
    [224.015, 922.872],
    [215.573, 911.613],
    [207.097, 900.379],
    [198.228, 889.456],
    [188.575, 879.224],
    [177.784, 870.208],
    [166.106, 862.364],
    [153.763, 855.615],
    [140.848, 850.045],
    [127.383, 845.991],
    [113.462, 844.136],
    [99.462, 845.273],
    [85.756, 848.435],
    [72.208, 852.240],
    [58.525, 855.513],
    [44.721, 858.251],
    [30.949, 861.143],
    [17.139, 863.846],
    [3.234, 865.993],
    [-10.761, 867.474],
    [-24.758, 868.928],
    [-38.803, 869.731],
    [-52.838, 869.003],
    [-66.473, 865.692],
    [-79.241, 859.823],
    [-91.067, 852.213],
    [-101.873, 843.209],
    [-111.651, 833.101],
    [-119.997, 821.802],
    [-126.668, 809.419],
    [-132.334, 796.539],
    [-137.828, 783.583],
    [-143.768, 770.828],
    [-149.823, 758.126],
    [-155.452, 745.228],
    [-161.337, 732.447],
    [-168.225, 720.187],
    [-177.060, 709.274],
    [-188.113, 700.617],
    [-200.550, 694.061],
    [-213.639, 688.900],
    [-226.987, 684.446],
    [-240.370, 680.094],
    [-253.904, 676.251],
    [-267.658, 673.276],
    [-281.479, 670.628],
    [-295.257, 667.768],
    [-308.908, 664.354],
    [-322.477, 660.621],
    [-336.017, 656.786],
    [-349.577, 653.023],
    [-363.198, 649.489],
    [-376.886, 646.219],
    [-390.612, 643.117],
    [-404.355, 640.087],
    [-418.094, 637.039],
    [-431.832, 633.989],
    [-445.594, 631.050],
    [-459.348, 628.072],
    [-473.051, 624.868],
    [-486.655, 621.273],
    [-500.124, 617.197],
    [-513.494, 612.805],
    [-526.841, 608.346],
    [-540.246, 604.062],
    [-553.755, 600.121],
    [-567.341, 596.452],
    [-580.954, 592.884],
    [-594.545, 589.235],
    [-608.070, 585.349],
    [-621.505, 581.162],
    [-634.883, 576.793],
    [-648.257, 572.414],
    [-661.677, 568.180],
    [-675.190, 564.251],
    [-688.797, 560.661],
    [-702.428, 557.163],
    [-716.014, 553.498],
    [-729.485, 549.430],
    [-742.775, 544.805],
    [-755.932, 539.813],
    [-769.075, 534.781],
    [-782.301, 529.977],
    [-795.707, 525.698],
    [-809.263, 521.923],
    [-822.886, 518.392],
    [-836.508, 514.863],
    [-850.066, 511.092],
    [-863.605, 507.254],
    [-877.155, 503.454],
    [-890.619, 499.362],
    [-903.882, 494.664],
    [-916.835, 489.164],
    [-929.697, 483.454],
    [-942.359, 477.318],
    [-954.496, 470.206],
    [-965.691, 461.713],
    [-975.386, 451.546],
    [-983.244, 439.882],
    [-990.048, 427.569],
    [-996.341, 414.981],
    [-1002.734, 402.446],
    [-1009.639, 390.185],
    [-1016.844, 378.097],
    [-1024.000, 365.980],
    [-1030.787, 353.653],
    [-1036.847, 340.958],
    [-1041.775, 327.784],
    [-1045.402, 314.190],
    [-1048.172, 300.395],
    [-1050.618, 286.536],
    [-1053.245, 272.711],
    [-1056.040, 258.919],
    [-1058.728, 245.105],
    [-1061.208, 231.253],
    [-1063.389, 217.351],
    [-1065.156, 203.391],
    [-1066.511, 189.384],
    [-1067.631, 175.356],
    [-1068.716, 161.325],
    [-1069.955, 147.307],
    [-1071.312, 133.300],
    [-1072.674, 119.293],
    [-1073.944, 105.278],
    [-1075.025, 91.247],
    [-1075.786, 77.195],
    [-1076.319, 63.132],
    [-1076.827, 49.069],
    [-1077.509, 35.013],
    [-1078.439, 20.971],
    [-1079.471, 6.936],
    [-1080.671, -7.085],
    [-1082.146, -21.080],
    [-1083.969, -35.034],
    [-1086.103, -48.943],
    [-1088.513, -62.808],
    [-1091.196, -76.622],
    [-1094.159, -90.379],
    [-1097.569, -104.031],
    [-1101.410, -117.569],
    [-1105.370, -131.073],
    [-1109.120, -144.637],
    [-1112.382, -158.326],
    [-1115.489, -172.051],
    [-1118.351, -185.829],
    [-1120.692, -199.704],
    [-1122.204, -213.693],
    [-1122.567, -227.757],
    [-1122.028, -241.818],
    [-1120.984, -255.851],
    [-1119.830, -269.876],
    [-1119.434, -283.934],
    [-1120.539, -297.962],
    [-1120.968, -312.019],
    [-1118.359, -325.805],
    [-1112.417, -338.515],
    [-1104.744, -350.306],
    [-1096.328, -361.579],
    [-1087.258, -372.334],
    [-1077.569, -382.535],
    [-1067.271, -392.120],
    [-1056.355, -400.993],
    [-1044.805, -409.019],
    [-1032.586, -415.976],
    [-1019.806, -421.841],
    [-1006.660, -426.848],
    [-993.307, -431.282],
    [-979.848, -435.389],
    [-966.348, -439.365],
    [-952.857, -443.368],
    [-939.442, -447.620],
    [-926.131, -452.181],
    [-912.919, -457.024],
    [-899.816, -462.157],
    [-886.777, -467.451],
    [-873.763, -472.808],
    [-860.773, -478.220],
    [-847.789, -483.648],
    [-834.798, -489.059],
    [-821.793, -494.436],
    [-808.753, -499.726],
    [-795.696, -504.975],
    [-782.574, -510.061],
    [-769.425, -515.073],
    [-756.218, -519.934],
    [-742.995, -524.749],
    [-729.757, -529.525],
    [-716.527, -534.320],
    [-703.299, -539.125],
    [-690.058, -543.889],
    [-676.812, -548.643],
    [-663.531, -553.294],
    [-650.241, -557.924],
    [-636.900, -562.401],
    [-623.546, -566.841],
    [-610.135, -571.106],
    [-596.702, -575.298],
    [-583.220, -579.331],
    [-569.697, -583.227],
    [-556.149, -587.030],
    [-542.533, -590.588],
    [-528.918, -594.146],
    [-515.229, -597.410],
    [-501.534, -600.647],
    [-487.813, -603.773],
    [-474.062, -606.762],
    [-460.310, -609.752],
    [-446.522, -612.568],
    [-432.729, -615.358],
    [-418.929, -618.116],
    [-405.105, -620.748],
    [-391.280, -623.380],
    [-377.445, -625.956],
    [-363.598, -628.466],
    [-349.751, -630.975],
    [-335.894, -633.428],
    [-322.031, -635.847],
    [-308.167, -638.266],
    [-294.296, -640.639],
    [-280.422, -642.996],
    [-266.548, -645.354],
    [-252.670, -647.683],
    [-238.790, -650.006],
    [-224.910, -652.328],
    [-211.016, -654.565],
    [-197.119, -656.782],
    [-183.222, -658.998],
    [-169.308, -661.104],
    [-155.388, -663.171],
    [-141.468, -665.237],
    [-127.540, -667.251],
    [-113.606, -669.222],
    [-99.672, -671.193],
    [-85.736, -673.151],
    [-71.795, -675.075],
    [-57.855, -676.999],
    [-43.914, -678.922],
    [-29.973, -680.844],
    [-16.032, -682.765],
    [-2.091, -684.687],
    [11.846, -686.635],
    [25.781, -688.598],
    [39.716, -690.561],
    [53.648, -692.551],
    [67.570, -694.602],
    [81.493, -696.652],
    [95.414, -698.710],
    [109.316, -700.899],
    [123.217, -703.088],
    [137.118, -705.277],
    [151.008, -707.540],
    [164.896, -709.813],
    [178.784, -712.087],
    [192.670, -714.370],
    [206.556, -716.656],
    [220.442, -718.942],
    [234.323, -721.254],
    [248.202, -723.582],
    [262.081, -725.911],
    [275.953, -728.275],
    [289.820, -730.678],
    [303.686, -733.081],
    [317.544, -735.526],
    [331.391, -738.038],
    [345.238, -740.549],
    [359.075, -743.112],
    [372.895, -745.769],
    [386.714, -748.427],
    [400.519, -751.160],
    [414.300, -754.007],
    [428.082, -756.854],
    [441.836, -759.831],
    [455.566, -762.920],
    [469.295, -766.008],
    [482.961, -769.366],
    [496.609, -772.797],
    [510.251, -776.253],
    [523.810, -780.020],
    [537.369, -783.787],
    [550.902, -787.644],
    [564.387, -791.670],
    [577.871, -795.696],
    [591.316, -799.852],
    [604.741, -804.073],
    [618.163, -808.304],
    [631.543, -812.663],
    [644.923, -817.023],
    [658.287, -821.434],
    [671.640, -825.875],
    [684.992, -830.322],
    [698.341, -834.777],
    [711.703, -839.194],
    [725.080, -843.563],
    [738.447, -847.964],
    [751.742, -852.573],
    [764.830, -857.736],
    [777.518, -863.810],
    [790.964, -867.921],
    [804.699, -870.970],
    [818.557, -873.416],
    [832.468, -875.543],
    [846.382, -877.648],
    [860.283, -879.839],
    [874.198, -881.943],
    [888.139, -883.860],
    [902.116, -885.495],
    [916.133, -886.734],
    [930.184, -887.509],
    [944.248, -888.019],
    [958.314, -888.463],
    [972.372, -889.073],
    [986.399, -890.203],
    [1000.409, -891.523],
    [1014.458, -892.309],
    [1028.514, -891.822],
    [1042.452, -889.924],
    [1056.228, -887.069],
    [1069.788, -883.318],
    [1083.050, -878.617],
    [1095.963, -873.029],
    [1108.646, -866.935],
    [1121.007, -860.215],
    [1132.714, -852.421],
    [1143.306, -843.194],
    [1151.893, -832.088],
    [1158.032, -819.441],
    [1162.548, -806.122],
    [1166.103, -792.508],
    [1169.219, -778.784],
    [1171.812, -764.956],
    [1173.455, -750.983],
    [1174.373, -736.942],
    [1174.852, -722.878],
];


function initThreeJSIndianapolis() {
    threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(0x07090e);
    threeScene.fog = new THREE.FogExp2(0x07090e, 0.0025);

    threeCamera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    threeCamera.position.set(0, 55, 85);

    threeRenderer = new THREE.WebGLRenderer({ antialias: true });
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRenderer.outputColorSpace = THREE.SRGBColorSpace;
    threeRenderer.shadowMap.enabled = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    threeScene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.9);
    threeScene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(60, 100, 40);
    dirLight.castShadow = true;
    threeScene.add(dirLight);

    threeControls = new OrbitControls(threeCamera, threeRenderer.domElement);
    threeControls.enableDamping = true;
    threeControls.dampingFactor = 0.07;
    threeControls.enablePan = false;
    threeControls.minDistance = ZOOM_MIN;
    threeControls.maxDistance = ZOOM_MAX;
    threeControls.maxPolarAngle = Math.PI / 2 - 0.05;

    window.addEventListener('resize', onThreeResize);
    threeAssetsPromise = loadIndianapolisRaceAssets();
    loadedRaceMap = selectedQuickRaceMap;
    return threeAssetsPromise;
}

function attachThreeCanvas(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper || !threeRenderer) {
        throw new Error(`No se encontró el contenedor 3D "${wrapperId}".`);
    }
    wrapper.replaceChildren(threeRenderer.domElement);
    onThreeResize();
}

async function loadIndianapolisRaceAssets() {
    const loader = new GLTFLoader();
    const config = TRACK_3D_CONFIG[selectedQuickRaceMap] || TRACK_3D_CONFIG.indianapolis;
    const trackGltf = await loader.loadAsync(config.file);
    if (threeTrackModel) threeScene.remove(threeTrackModel);
    if (threePlayerCar) threeScene.remove(threePlayerCar);
    if (threeAiCar) threeScene.remove(threeAiCar);
    threeTrackModel = trackGltf.scene;

    const rawTrackBounds = new THREE.Box3().setFromObject(threeTrackModel);
    const rawTrackSize = rawTrackBounds.getSize(new THREE.Vector3());
    const rawTrackCenter = rawTrackBounds.getCenter(new THREE.Vector3());
    const scaleFactor = 110 / (Math.max(rawTrackSize.x, rawTrackSize.y, rawTrackSize.z) || 1);
    threeTrackModel.scale.setScalar(scaleFactor);
    threeTrackModel.position.copy(rawTrackCenter).multiplyScalar(-scaleFactor);
    threeTrackModel.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    threeScene.add(threeTrackModel);
    threeTrackModel.updateMatrixWorld(true);

    const roadBounds = new THREE.Box3();
    const roadMeshName = selectedQuickRaceMap === 'lemans'
        ? 'Pista_Completa'
        : selectedQuickRaceMap === 'vegas' ? 'Pista_Vegas_Asfalto' : 'Cube';
    threeTrackModel.traverse((child) => {
        if (child.isMesh && child.name.includes(roadMeshName)) {
            roadBounds.union(new THREE.Box3().setFromObject(child));
        }
    });
    if (roadBounds.isEmpty()) roadBounds.setFromObject(threeTrackModel);

    const roadCenter = roadBounds.getCenter(new THREE.Vector3());
    const roadSize = roadBounds.getSize(new THREE.Vector3());
    const splineLayout = [
        [-0.28686, 0.44857],
        [-0.30517, 0.41955],
        [-0.31514, 0.37967],
        [-0.32453, 0.33883],
        [-0.33370, 0.29849],
        [-0.34681, 0.26148],
        [-0.37211, 0.24785],
        [-0.39896, 0.24074],
        [-0.42610, 0.23426],
        [-0.45163, 0.22126],
        [-0.47070, 0.19250],
        [-0.47613, 0.14943],
        [-0.47578, 0.10351],
        [-0.46171, 0.07040],
        [-0.43769, 0.04861],
        [-0.41486, 0.02291],
        [-0.39891, -0.01087],
        [-0.39154, -0.05229],
        [-0.38961, -0.09828],
        [-0.38938, -0.14547],
        [-0.38877, -0.19201],
        [-0.38808, -0.23822],
        [-0.38778, -0.28459],
        [-0.38744, -0.33116],
        [-0.38600, -0.37760],
        [-0.38128, -0.42193],
        [-0.36543, -0.45328],
        [-0.33868, -0.46235],
        [-0.31376, -0.44822],
        [-0.29157, -0.42290],
        [-0.26900, -0.39838],
        [-0.24629, -0.37439],
        [-0.22376, -0.34998],
        [-0.20125, -0.32551],
        [-0.17861, -0.30141],
        [-0.15607, -0.27694],
        [-0.13270, -0.25536],
        [-0.10606, -0.25714],
        [-0.08171, -0.27396],
        [-0.05574, -0.28592],
        [-0.03289, -0.26917],
        [-0.02287, -0.22959],
        [-0.01708, -0.18686],
        [-0.00754, -0.14440],
        [0.01238, -0.11976],
        [0.03996, -0.11447],
        [0.06792, -0.11753],
        [0.09569, -0.12191],
        [0.12352, -0.12558],
        [0.15137, -0.12894],
        [0.17923, -0.13235],
        [0.20708, -0.13587],
        [0.23494, -0.13949],
        [0.26278, -0.14317],
        [0.29062, -0.14689],
        [0.31844, -0.15056],
        [0.34616, -0.14999],
        [0.37005, -0.13321],
        [0.37834, -0.09361],
        [0.38662, -0.05102],
        [0.40775, -0.02825],
        [0.43549, -0.02283],
        [0.46248, -0.01678],
        [0.47785, 0.01363],
        [0.47182, 0.05541],
        [0.45823, 0.09244],
        [0.44479, 0.13003],
        [0.43249, 0.16882],
        [0.41974, 0.20716],
        [0.40673, 0.24520],
        [0.39401, 0.28348],
        [0.38182, 0.32221],
        [0.36775, 0.35938],
        [0.34920, 0.39187],
        [0.32652, 0.41641],
        [0.29968, 0.42345],
        [0.27112, 0.42287],
        [0.24242, 0.42302],
        [0.21362, 0.42289],
        [0.18479, 0.42269],
        [0.15602, 0.42266],
        [0.12732, 0.42280],
        [0.09863, 0.42299],
        [0.06993, 0.42315],
        [0.04119, 0.42318],
        [0.01237, 0.42297],
        [-0.01651, 0.42260],
        [-0.04536, 0.42233],
        [-0.07410, 0.42246],
        [-0.10263, 0.42326],
        [-0.13086, 0.42501],
        [-0.15868, 0.42833],
        [-0.18579, 0.43508],
        [-0.21191, 0.44741],
        [-0.23661, 0.45316],
        [-0.26197, 0.43750]
    ];
    const roadY = roadBounds.max.y + 0.08;
    let controlPoints;
    if (selectedQuickRaceMap === 'vegas') {
        const railCenters = {};
        for (const railName of ['Carril_Interior', 'Carril_Exterior']) {
            let railMesh = null;
            threeTrackModel.traverse((child) => {
                if (child.isMesh && child.name.includes(railName)) railMesh = child;
            });
            if (!railMesh) throw new Error(`No se encontró el raíl ${railName} en el modelo de Las Vegas.`);
            const position = railMesh.geometry.getAttribute('position');
            if (position.count < 8 || position.count % 2 !== 0) {
                throw new Error(`La geometría del raíl ${railName} no tiene secciones válidas.`);
            }
            const points = [];
            const a = new THREE.Vector3();
            const b = new THREE.Vector3();
            for (let i = 0; i < position.count; i += 2) {
                a.fromBufferAttribute(position, i).applyMatrix4(railMesh.matrixWorld);
                b.fromBufferAttribute(position, i + 1).applyMatrix4(railMesh.matrixWorld);
                points.push(a.clone().add(b).multiplyScalar(0.5));
            }
            railCenters[railName] = points;
        }
        const innerRail = railCenters['Carril_Interior'];
        const outerRail = railCenters['Carril_Exterior'];
        if (innerRail.length !== outerRail.length) {
            throw new Error('Los raíles de Las Vegas no tienen el mismo número de secciones.');
        }
        controlPoints = innerRail.map((point, index) => point.clone().add(outerRail[index]).multiplyScalar(0.5));
        controlPoints.forEach((point) => { point.y = roadY; });
    } else if (selectedQuickRaceMap === 'lemans') {
        controlPoints = LEMANS_CENTERLINE_XZ.map(([x, z]) => {
            const point = new THREE.Vector3(x, LEMANS_CENTERLINE_SOURCE_Y, z);
            point.applyMatrix4(threeTrackModel.matrixWorld);
            point.y = roadY;
            return point;
        });
    } else {
        controlPoints = splineLayout.map(([x, z]) => new THREE.Vector3(
            roadCenter.x + x * roadSize.x,
            roadY,
            roadCenter.z + z * roadSize.z
        ));
    }

    threeTrackCurve = new THREE.CatmullRomCurve3(controlPoints, true, 'centripetal');
    threeTrackCurve.arcLengthDivisions = 4000;
    threeTrackCurve.updateArcLengths();

    threeTrackWidth = Math.min(roadSize.x, roadSize.z) * 0.065;
    threeLaneOffset = threeTrackWidth * 0.20;

    const [alonsoGltf, hamiltonGltf] = await Promise.all([
        loader.loadAsync('./modelos3d/Alonso.glb'),
        loader.loadAsync('./modelos3d/Hamilton.glb')
    ]);
    threePlayerCar = createRaceCar(alonsoGltf.scene, threeTrackWidth);
    threeAiCar = createRaceCar(hamiltonGltf.scene, threeTrackWidth);
    threePlayerCar.visible = false;
    threeAiCar.visible = false;
    threeScene.add(threePlayerCar, threeAiCar);
}

function createRaceCar(model, trackWidth) {
    const decorativePlanes = [];
    model.traverse((child) => {
        if (child.isMesh && (child.name === 'Plano' || child.name === 'Asphalt')) {
            decorativePlanes.push(child);
        }
    });
    decorativePlanes.forEach(plane => plane.parent.remove(plane));

    const car = new THREE.Group();
    const modelBounds = new THREE.Box3().setFromObject(model);
    const modelSize = modelBounds.getSize(new THREE.Vector3());
    const horizontalLength = Math.max(modelSize.x, modelSize.z) || 1;
    const modelScale = trackWidth * 0.72 / horizontalLength;
    const modelCenter = modelBounds.getCenter(new THREE.Vector3());
    model.scale.setScalar(modelScale);
    model.rotation.y = modelSize.x > modelSize.z ? -Math.PI / 2 : 0;

    const horizontalCenter = new THREE.Vector3(modelCenter.x, 0, modelCenter.z)
        .multiplyScalar(modelScale)
        .applyEuler(model.rotation);
    model.position.copy(horizontalCenter).negate();
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    car.add(model);
    return car;
}

function buildRaceSplineVisuals() {
    // Los coches siguen la línea central calculada desde la geometría del GLB.
}

function getRaceTrackPoint(progress, laneOffset = 0) {
    const t = ((progress % 1) + 1) % 1;
    const point = threeTrackCurve.getPointAt(t);
    const tangent = threeTrackCurve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    point.addScaledVector(normal, laneOffset);
    return { point, tangent };
}

function getRaceTrackCurvature(progress) {
    const delta = 0.005;
    const before = threeTrackCurve.getTangentAt(((progress % 1) + 1) % 1);
    const after = threeTrackCurve.getTangentAt(((progress + delta) % 1 + 1) % 1);
    return Math.acos(THREE.MathUtils.clamp(before.dot(after), -1, 1));
}

function getRaceCurveCrashSpeedLimit(curvature) {
    return 320 / (1 + curvature * 14) + 145;
}

function getRaceRecommendedTrackSpeed(curvature) {
    return Math.max(0, Math.floor((getRaceCurveCrashSpeedLimit(curvature) - 10) / 10) * 10);
}

function getRaceCurveCategory(progress) {
    const curvature = getRaceTrackCurvature(progress);
    const ahead = getRaceTrackCurvature((progress + 0.01) % 1);
    const behind = getRaceTrackCurvature((progress + 0.99) % 1);
    return curvature > 0.035 && ahead > 0.02 && behind > 0.02 ? 2 : 0;
}

function getRaceTrackSpeedData() {
    if (raceSpeedZoneMapCache) return raceSpeedZoneMapCache;
    const steps = 300;
    const samples = [];
    for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        const curvature = getRaceTrackCurvature(progress);
        const crashZone = getRaceCurveCategory(progress) === 2;
        samples.push({ progress, curvature, crashZone, category: crashZone ? 2 : 0 });
    }
    for (let i = 0; i < steps; i++) {
        if (!samples[i].crashZone) continue;
        const indices = [i];
        let next = (i + 1) % steps;
        while (next !== i && samples[next].crashZone && indices.length < steps) {
            indices.push(next);
            next = (next + 1) % steps;
        }
        const safeSpeed = Math.min(...indices.map(index =>
            getRaceRecommendedTrackSpeed(samples[index].curvature)
        ));
        indices.forEach(index => { samples[index].speedLimit = safeSpeed; });
    }
    const approachSteps = Math.ceil(steps * 0.018);
    for (let i = 0; i < steps; i++) {
        if (samples[i].crashZone) continue;
        for (let ahead = 1; ahead <= approachSteps; ahead++) {
            if (samples[(i + ahead) % steps].crashZone) {
                samples[i].category = 1;
                break;
            }
        }
    }
    raceSpeedZoneMapCache = { samples };
    return raceSpeedZoneMapCache;
}

function getRacePlayerTrackSpeedLimit(progress) {
    const samples = getRaceTrackSpeedData().samples;
    const steps = samples.length;
    const index = Math.floor(progress * steps) % steps;
    const sample = samples[index];
    if (sample.category === 0) return Infinity;
    if (sample.category === 2) {
        return sample.speedLimit ?? getRaceRecommendedTrackSpeed(sample.curvature);
    }
    const approachSteps = Math.ceil(steps * 0.018);
    for (let ahead = 1; ahead <= approachSteps; ahead++) {
        const next = samples[(index + ahead) % steps];
        if (next.category === 2) {
            return next.speedLimit ?? getRaceRecommendedTrackSpeed(next.curvature);
        }
    }
    return Infinity;
}

function getRaceAiTargetSpeed(progress) {
    const samples = getRaceTrackSpeedData().samples;
    const steps = samples.length;
    const lookaheadSteps = Math.ceil(steps * 0.04);
    let targetSpeed = aiState.maxSpeed;
    for (let ahead = 0; ahead <= lookaheadSteps; ahead++) {
        const sample = samples[Math.floor(progress * steps + ahead) % steps];
        if (sample.category === 2 && sample.speedLimit !== undefined) {
            targetSpeed = Math.min(targetSpeed, sample.speedLimit);
        }
    }
    return targetSpeed;
}

function onThreeResize() {
    if (!threeCamera || !threeRenderer) return;
    threeCamera.aspect = window.innerWidth / window.innerHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
}

function updateThreeCameraMovement(dt) {
    if (!threeCamera || !threeControls) return;

    const forward = new THREE.Vector3();
    threeCamera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDelta = new THREE.Vector3();
    if (camKeys.w) moveDelta.add(forward);
    if (camKeys.s) moveDelta.sub(forward);
    if (camKeys.d) moveDelta.add(right);
    if (camKeys.a) moveDelta.sub(right);

    if (moveDelta.lengthSq() > 0) {
        moveDelta.normalize().multiplyScalar(PAN_SPEED * dt);

        const nextTarget = threeControls.target.clone().add(moveDelta);
        if (Math.abs(nextTarget.x) <= PAN_LIMIT && Math.abs(nextTarget.z) <= PAN_LIMIT) {
            threeControls.target.add(moveDelta);
            threeCamera.position.add(moveDelta);
        }
    }

    if (camKeys.zoomIn || camKeys.zoomOut) {
        const offset = threeCamera.position.clone().sub(threeControls.target);
        const currentDist = offset.length();
        const zoomStep = 45 * dt * (camKeys.zoomIn ? -1 : 1);
        const clampedDist = THREE.MathUtils.clamp(currentDist + zoomStep, ZOOM_MIN, ZOOM_MAX);
        offset.setLength(clampedDist);
        threeCamera.position.copy(threeControls.target).add(offset);
    }

    threeControls.update();
}

let lastThreeTime = performance.now();
function animateThreeJS(now) {
    if (!isThreeActive) return;
    const dt = Math.min((now - lastThreeTime) / 1000, 0.1);
    lastThreeTime = now;

    updateThreeCameraMovement(dt);
    threeRenderer.render(threeScene, threeCamera);
    threeAnimId = requestAnimationFrame(animateThreeJS);
}

async function openCircuit3D(mapId = 'indianapolis') {
    playClickSound();
    const targetMap = TRACK_3D_CONFIG[mapId] ? mapId : 'indianapolis';
    const config = TRACK_3D_CONFIG[targetMap];
    selectedQuickRaceMap = targetMap;

    document.getElementById('ui-main-layer').style.display = 'none';
    document.getElementById('menu-backgrounds').style.display = 'none';

    const container = document.getElementById('threejs-container');
    container.classList.remove('hidden');
    container.classList.add('flex');

    const titleEl = document.getElementById('threejs-title');
    if (titleEl) titleEl.innerText = config.title;

    const loaderOverlay = document.getElementById('threejs-loader');
    loaderOverlay.innerText = `CARGANDO MODELO 3D DE ${config.loadingLabel}...`;
    loaderOverlay.style.display = 'flex';

    try {
        if (!threeRenderer) {
            initThreeJSIndianapolis();
        } else if (loadedRaceMap !== selectedQuickRaceMap) {
            threeAssetsPromise = loadIndianapolisRaceAssets();
            loadedRaceMap = selectedQuickRaceMap;
        }
        await threeAssetsPromise;
        if (container.classList.contains('hidden')) return;

        attachThreeCanvas('threejs-inspection-wrapper');
        if (threePlayerCar) threePlayerCar.visible = false;
        if (threeAiCar) threeAiCar.visible = false;

        const center = new THREE.Box3().setFromObject(threeTrackModel).getCenter(new THREE.Vector3());
        threeControls.target.copy(center);
        threeCamera.position.copy(center).add(new THREE.Vector3(0, 150, 0.1));
        threeControls.update();

        loaderOverlay.style.display = 'none';
        isThreeActive = true;
        lastThreeTime = performance.now();
        animateThreeJS(lastThreeTime);
    } catch (error) {
        console.error(`Error cargando el visor 3D de ${config.loadingLabel}:`, error);
        loaderOverlay.innerText = `ERROR AL CARGAR ${config.file}`;
    }
}

function openIndianapolis3D() {
    return openCircuit3D('indianapolis');
}

function closeCircuit3D() {
    playClickSound();
    isThreeActive = false;
    if (threeAnimId) cancelAnimationFrame(threeAnimId);

    const container = document.getElementById('threejs-container');
    container.classList.add('hidden');
    container.classList.remove('flex');

    document.getElementById('ui-main-layer').style.display = 'flex';
    document.getElementById('menu-backgrounds').style.display = 'block';
    nav('screen-circuitos');
}

function closeIndianapolis3D() {
    closeCircuit3D();
}

function configureRaceHudLayout() {
    const tyreHud = document.getElementById('tyre-hud');
    if (tyreHud) tyreHud.style.display = raceMode === 'solo' ? 'block' : 'none';
    const p1Title = document.getElementById('hud-p1-title');
    const p1GasLabel = document.getElementById('hud-p1-gas-label');
    const p1BrakeLabel = document.getElementById('hud-p1-brake-label');
    const p2Panel = document.getElementById('hud-p2-panel');
    const rivalLabel = document.getElementById('hud-rival-label');
    const overtakeHint = document.getElementById('hud-overtake-hint');

    if (raceMode === 'friend') {
        if (p1Title) {
            p1Title.innerText = 'JUGADOR 1 · ALONSO';
            p1Title.className = 'text-red-400 font-extrabold';
        }
        if (p1GasLabel) p1GasLabel.innerText = 'VELOCIDAD [W]';
        if (p1BrakeLabel) p1BrakeLabel.innerText = 'FRENO [S]';
        if (p2Panel) p2Panel.classList.remove('hidden');
        if (rivalLabel) rivalLabel.innerText = 'DIFERENCIA';
        if (overtakeHint) overtakeHint.innerText = 'J1 ESPACIO · J2 SHIFT/ENTER: ADELANTAR';
    } else {
        if (p1Title) {
            p1Title.innerText = 'TELEMETRÍA EN TIEMPO REAL';
            p1Title.className = '';
        }
        if (p1GasLabel) p1GasLabel.innerText = 'BARRA 1 - VELOCIDAD [W]';
        if (p1BrakeLabel) p1BrakeLabel.innerText = 'BARRA 2 - FRENO [S]';
        if (p2Panel) p2Panel.classList.add('hidden');
        if (rivalLabel) rivalLabel.innerText = 'RIVAL IA';
        if (overtakeHint) overtakeHint.innerText = 'ESPACIO: ADELANTAR';
    }
}

async function startIndianapolisRace() {
    if (isRace3DActive) return;
    document.getElementById('ui-main-layer').style.display = 'none';
    document.getElementById('menu-backgrounds').style.display = 'none';
    const gameContainer = document.getElementById('game-canvas-container');
    gameContainer.classList.remove('legacy-2d');
    gameContainer.classList.add('active');
    configureRaceHudLayout();

    const loader = document.getElementById('race-threejs-loader');
    loader.hidden = false;
    const config = TRACK_3D_CONFIG[selectedQuickRaceMap] || TRACK_3D_CONFIG.indianapolis;
    loader.innerText = `CARGANDO ${config.loadingLabel} Y MONOPLAZAS...`;
    isRace3DActive = true;
    isGameRunning = true;
    raceFinished = false;

    try {
        if (!threeRenderer) initThreeJSIndianapolis();
        if (loadedRaceMap !== selectedQuickRaceMap) {
            threeAssetsPromise = loadIndianapolisRaceAssets();
            loadedRaceMap = selectedQuickRaceMap;
        }
        await threeAssetsPromise;
        if (!isRace3DActive) return;
        attachThreeCanvas('race-threejs-wrapper');
        threeControls.enabled = true;
        threePlayerCar.visible = true;
        threeAiCar.visible = true;
        loader.hidden = true;
        resetIndianapolisRace();
        lastRace3DTime = performance.now();
        raceCameraReady = false;
        animateIndianapolisRace(lastRace3DTime);
    } catch (error) {
        console.error(`No se pudo iniciar la carrera de ${config.loadingLabel}:`, error);
        loader.innerText = `ERROR AL CARGAR ${config.loadingLabel} O LOS MONOPLAZAS. COMPRUEBA ./modelos3d/`;
        triggerToast(`No se pudo cargar ${config.loadingLabel} o los monoplazas. Revisa la consola.`);
        isGameRunning = false;
        isRace3DActive = false;
    }
}

function resetIndianapolisRace() {
    clearRaceInputKeys();
    resetTyreStrategy();
    const pitModal = document.getElementById('pit-stop-modal');
    if (pitModal) pitModal.hidden = true;

    Object.assign(playerState, createDefaultCarState(), {
        laneOffset: -threeLaneOffset
    });
    playerLaneOffset = -threeLaneOffset;
    overtakeBoostTimer = 0;
    overtakeBoostCooldown = 0;

    if (raceMode === 'friend') {
        Object.assign(player2State, createDefaultCarState(), {
            progress: 0,
            laneOffset: threeLaneOffset
        });
    } else {
        aiState.progress = 0.015;
        aiState.speed = 0;
        aiState.currentLap = 1;
    }

    raceHasStarted = false;
    raceFinished = false;
    raceGoVisibleUntil = 0;
    raceCountdownEndTime = performance.now() + 3000;
    const countdown = document.getElementById('race-countdown');
    countdown.hidden = false;
    countdown.classList.remove('go');
    countdown.innerText = '3';
    document.getElementById('race-result').hidden = true;
    raceSpeedZoneMapCache = null;

    if (raceMode === 'friend') {
        updateFriendRaceHud(
            { draftStrength: 0, isOvertaking: false, trackSpeedLimit: Infinity },
            { draftStrength: 0, isOvertaking: false, trackSpeedLimit: Infinity }
        );
    } else {
        updateRaceHud(0, false, Infinity);
    }
}

function animateIndianapolisRace(now) {
    if (!isRace3DActive) return;
    const dt = Math.min((now - lastRace3DTime) / 1000, 0.1);
    lastRace3DTime = now;
    const countdown = document.getElementById('race-countdown');
    if (!raceHasStarted && now < raceCountdownEndTime) {
        countdown.innerText = Math.ceil((raceCountdownEndTime - now) / 1000).toString();
    } else if (!raceHasStarted) {
        raceHasStarted = true;
        raceGoVisibleUntil = now + 650;
        playerState.lapStartTime = now;
        player2State.lapStartTime = now;
    }
    if (raceHasStarted && now < raceGoVisibleUntil) {
        countdown.hidden = false;
        countdown.classList.add('go');
        countdown.innerText = '¡YA!';
    } else if (raceHasStarted) {
        countdown.hidden = true;
        countdown.classList.remove('go');
    }

    if (raceHasStarted && !raceFinished) updateIndianapolisRacePhysics(dt, now);
    updateRaceCarTransforms(now);
    updateRaceCamera(dt);
    threeRenderer.render(threeScene, threeCamera);
    if (isRace3DActive && !raceFinished) {
        race3DAnimId = requestAnimationFrame(animateIndianapolisRace);
    }
}

function stepHumanCar3DPhysics(carState, rivalState, controls, baseLaneOffset, oppositeLaneOffset, dt, now) {
    carState.overtakeBoostTimer = Math.max(0, carState.overtakeBoostTimer - dt);
    carState.overtakeBoostCooldown = Math.max(0, carState.overtakeBoostCooldown - dt);

    const spinning = carState.offTrackTimer > 0;
    if (spinning) {
        carState.offTrackTimer = Math.max(0, carState.offTrackTimer - dt);
        carState.speed = 0;
    }
    if (carState.penaltyTimer > 0) {
        carState.penaltyTimer = Math.max(0, carState.penaltyTimer - dt);
        carState.isPenalized = true;
    } else {
        carState.isPenalized = false;
    }

    const inPitService = carState === playerState && raceMode === 'solo' && now < pitStopUntil;
    if (inPitService) carState.speed = 0;

    const curvature = getRaceTrackCurvature(carState.progress);
    let effectiveMaxSpeed = carState.maxSpeed;
    if (carState === playerState && raceMode === 'solo') {
        const tyre = TYRE_COMPOUNDS[activeTyre];
        const wearRatio = Math.min(1, tyreLapsUsed / tyre.laps);
        const degradation = wearRatio * 0.22;
        effectiveMaxSpeed *= (1 - degradation);
    }
    const carRaceDistance = (carState.currentLap - 1) + carState.progress;
    const rivalRaceDistance = (rivalState.currentLap - 1) + rivalState.progress;
    const gapToRival = rivalRaceDistance - carRaceDistance;

    const draftStrength = controls.gas && !controls.brake && !carState.isPenalized
        && curvature < 0.08 && gapToRival > 0 && gapToRival <= 0.025 ? 1 : 0;
    const isOvertaking = carState.overtakeBoostTimer > 0 && !carState.isPenalized;
    const boostStrength = draftStrength || isOvertaking ? 1 : 0;

    const targetLaneOffset = isOvertaking ? oppositeLaneOffset : baseLaneOffset;
    carState.laneOffset += (targetLaneOffset - carState.laneOffset) * Math.min(1, dt * 8);
    if (boostStrength) effectiveMaxSpeed += 90;

    const trackSpeedLimit = getRacePlayerTrackSpeedLimit(carState.progress);
    if (Number.isFinite(trackSpeedLimit)) {
        effectiveMaxSpeed = Math.min(effectiveMaxSpeed, trackSpeedLimit);
    }
    if (carState.isPenalized) effectiveMaxSpeed = 120;

    const throttleRequested = (controls.gas || isOvertaking) && !controls.brake && !spinning && !inPitService;
    carState.throttleIntensity = throttleRequested
        ? Math.min(1, carState.throttleIntensity + dt * 2.5)
        : Math.max(0, carState.throttleIntensity - dt * 4);
    if (carState.throttleIntensity > 0 && !controls.brake && !spinning) {
        if (carState.speed < effectiveMaxSpeed) {
            const accelMult = carState.isPenalized ? 0.3 : 1;
            const acceleration = carState.accelRate * 90 * accelMult
                * (1 + boostStrength * 0.7) * carState.throttleIntensity;
            carState.speed = Math.min(effectiveMaxSpeed, carState.speed + acceleration * dt);
        }
    } else if (!controls.brake && !spinning) {
        carState.speed -= carState.naturalFriction * 40 * dt;
    }

    carState.brakeIntensity = controls.brake && !spinning
        ? Math.min(100, carState.brakeIntensity + dt * 180)
        : Math.max(0, carState.brakeIntensity - dt * 300);
    carState.speed -= carState.brakeRate * (carState.brakeIntensity / 100) * dt;
    if (curvature > 0.05 && !spinning) carState.speed -= curvature * 140 * dt;
    carState.speed = Math.max(0, carState.speed);
    if (Number.isFinite(trackSpeedLimit) || carState.isPenalized) {
        carState.speed = Math.min(carState.speed, effectiveMaxSpeed);
    } else if (carState.speed > effectiveMaxSpeed) {
        carState.speed = Math.max(effectiveMaxSpeed, carState.speed - 260 * dt);
    }

    const curveAhead = getRaceTrackCurvature((carState.progress + 0.01) % 1);
    const curveBehind = getRaceTrackCurvature((carState.progress + 0.99) % 1);
    if (!spinning && curvature > 0.035 && curveAhead > 0.02 && curveBehind > 0.02
        && carState.speed > getRaceCurveCrashSpeedLimit(curvature) + 65) {
        playCrashSound();
        carState.offTrackTimer = 1.2;
        carState.penaltyTimer = 1;
        carState.speed = 0;
    }

    const progressBeforeAdvance = carState.progress;
    const progressDelta = spinning ? 0 : (carState.speed * dt * racePaceMultiplier)
        / 3600 / RACE_TRACK_LENGTH_KM;
    carState.progress += progressDelta;
    let finishFraction = null;
    if (carState.progress >= 1) {
        carState.progress %= 1;
        carState.currentLap++;
        if (carState === playerState && raceMode === 'solo') {
            tyreLapsUsed++;
            updateTyreHud();
        }
        const lapTime = now - carState.lapStartTime;
        if (!carState.bestLapTime || lapTime < carState.bestLapTime) {
            carState.bestLapTime = lapTime;
        }
        carState.lapStartTime = now;
        if (carState.currentLap > carState.totalLaps && progressDelta > 0) {
            finishFraction = (1 - progressBeforeAdvance) / progressDelta;
        }
    }
    carState.currentLapTime = now - carState.lapStartTime;

    return { finishFraction, draftStrength, isOvertaking, trackSpeedLimit };
}

function updateIndianapolisRacePhysics(dt, now) {
    if (raceMode === 'friend') {
        const p1Tele = stepHumanCar3DPhysics(
            playerState,
            player2State,
            { gas: keyW, brake: keyS },
            -threeLaneOffset,
            threeLaneOffset,
            dt,
            now
        );
        playerLaneOffset = playerState.laneOffset;
        overtakeBoostTimer = playerState.overtakeBoostTimer;
        overtakeBoostCooldown = playerState.overtakeBoostCooldown;

        const p2Tele = stepHumanCar3DPhysics(
            player2State,
            playerState,
            { gas: keyUp, brake: keyDown },
            threeLaneOffset,
            -threeLaneOffset,
            dt,
            now
        );

        if (p1Tele.finishFraction !== null || p2Tele.finishFraction !== null) {
            const winner = p2Tele.finishFraction === null
                || (p1Tele.finishFraction !== null && p1Tele.finishFraction <= p2Tele.finishFraction)
                ? 'player'
                : 'player2';
            finishRace(winner);
            return;
        }

        updateFriendRaceHud(p1Tele, p2Tele);
        return;
    }

    // Solo mode (W or ArrowUp accelerates, S or ArrowDown brakes)
    const p1Tele = stepHumanCar3DPhysics(
        playerState,
        aiState,
        { gas: keyW || keyUp, brake: keyS || keyDown },
        -threeLaneOffset,
        threeLaneOffset,
        dt,
        now
    );
    playerLaneOffset = playerState.laneOffset;
    overtakeBoostTimer = playerState.overtakeBoostTimer;
    overtakeBoostCooldown = playerState.overtakeBoostCooldown;

    const aiTargetSpeed = getRaceAiTargetSpeed(aiState.progress);
    aiState.speed = aiState.speed < aiTargetSpeed
        ? Math.min(aiTargetSpeed, aiState.speed + aiState.accelRate * 90 * dt)
        : Math.max(aiTargetSpeed, aiState.speed - playerState.brakeRate * dt);
    const aiProgressDelta = (aiState.speed * dt * racePaceMultiplier)
        / 3600 / RACE_TRACK_LENGTH_KM;
    const aiProgressBeforeAdvance = aiState.progress;
    aiState.progress += aiProgressDelta;
    let aiFinishFraction = null;
    if (aiState.progress >= 1) {
        aiState.progress %= 1;
        aiState.currentLap++;
        if (aiState.currentLap > playerState.totalLaps && aiProgressDelta > 0) {
            aiFinishFraction = (1 - aiProgressBeforeAdvance) / aiProgressDelta;
        }
    }

    if (p1Tele.finishFraction !== null || aiFinishFraction !== null) {
        finishRace(aiFinishFraction === null
            || (p1Tele.finishFraction !== null && p1Tele.finishFraction <= aiFinishFraction)
            ? 'player'
            : 'ai');
        return;
    }
    updateRaceHud(p1Tele.draftStrength, p1Tele.isOvertaking, p1Tele.trackSpeedLimit);
}

function updateRaceCarTransforms(now) {
    if (!threePlayerCar || !threeAiCar) return;
    const player = getRaceTrackPoint(playerState.progress, playerLaneOffset);
    const secondCarProgress = raceMode === 'friend' ? player2State.progress : aiState.progress;
    const secondCarLane = raceMode === 'friend' ? player2State.laneOffset : threeLaneOffset;
    const secondCar = getRaceTrackPoint(secondCarProgress, secondCarLane);

    threePlayerCar.position.copy(player.point);
    threeAiCar.position.copy(secondCar.point);
    threePlayerCar.rotation.y = Math.atan2(-player.tangent.x, -player.tangent.z);
    threeAiCar.rotation.y = Math.atan2(-secondCar.tangent.x, -secondCar.tangent.z);

    if (playerState.offTrackTimer > 0) {
        const spinProgress = 1 - playerState.offTrackTimer / 1.2;
        threePlayerCar.rotation.y += spinProgress * Math.PI * 6 + now / 180;
        threePlayerCar.position.x += Math.sin(now / 45) * 0.12;
        threePlayerCar.position.z += Math.cos(now / 45) * 0.12;
    }

    if (raceMode === 'friend' && player2State.offTrackTimer > 0) {
        const spinProgress2 = 1 - player2State.offTrackTimer / 1.2;
        threeAiCar.rotation.y += spinProgress2 * Math.PI * 6 + now / 180;
        threeAiCar.position.x += Math.sin(now / 45) * 0.12;
        threeAiCar.position.z += Math.cos(now / 45) * 0.12;
    }
}

function updateRaceCamera(dt) {
    if (!threeControls || !threePlayerCar) return;
    const target = threePlayerCar.position.clone();
    const blendFactor = raceMode === 'friend' ? 0.5 : 0.25;
    if (threeAiCar && threeAiCar.visible) target.lerp(threeAiCar.position, blendFactor);
    target.y += threeTrackWidth * 0.12;

    if (!raceCameraReady) {
        threeControls.target.copy(target);
        threeCamera.position.copy(target).add(new THREE.Vector3(0, threeTrackWidth * 5.2, threeTrackWidth * 3.2));
        raceCameraReady = true;
    } else {
        const followDelta = target.clone().sub(threeControls.target);
        threeControls.target.add(followDelta);
        threeCamera.position.add(followDelta);

        if (raceMode === 'friend' && threeAiCar && threeAiCar.visible && !camKeys.zoomIn && !camKeys.zoomOut) {
            const separation = threePlayerCar.position.distanceTo(threeAiCar.position);
            const desiredDist = THREE.MathUtils.clamp(
                threeTrackWidth * 6.2 + separation * 0.85,
                ZOOM_MIN,
                ZOOM_MAX
            );
            const offset = threeCamera.position.clone().sub(threeControls.target);
            const currentDist = offset.length();
            if (currentDist > 0.001) {
                const nextDist = THREE.MathUtils.lerp(currentDist, desiredDist, Math.min(1, dt * 3));
                offset.setLength(nextDist);
                threeCamera.position.copy(threeControls.target).add(offset);
            }
        }
    }

    if (camKeys.zoomIn || camKeys.zoomOut) {
        const offset = threeCamera.position.clone().sub(threeControls.target);
        const direction = camKeys.zoomIn ? -1 : 1;
        const distance = THREE.MathUtils.clamp(offset.length() + direction * 45 * dt, ZOOM_MIN, ZOOM_MAX);
        offset.setLength(distance);
        threeCamera.position.copy(threeControls.target).add(offset);
    }
    threeControls.update();
}

function formatCarStatusBadge(statusEl, carState, tele) {
    if (!statusEl) return;
    if (carState.offTrackTimer > 0) {
        statusEl.innerText = '💥 TROMPO';
        statusEl.className = 'text-red-500 font-black animate-pulse';
    } else if (carState.isPenalized) {
        statusEl.innerText = `⚡ PENALIZACIÓN (${carState.penaltyTimer.toFixed(1)}s)`;
        statusEl.className = 'text-amber-400 font-extrabold';
    } else if (Number.isFinite(tele.trackSpeedLimit)) {
        statusEl.innerText = `⚠ LÍMITE ${tele.trackSpeedLimit} KM/H`;
        statusEl.className = 'text-amber-300 font-extrabold animate-pulse';
    } else {
        statusEl.innerText = tele.isOvertaking ? '⚡ ADELANTAMIENTO'
            : tele.draftStrength ? '💨 REBUFO' : 'EN PISTA';
        statusEl.className = tele.draftStrength || tele.isOvertaking
            ? 'text-cyan-300 font-extrabold animate-pulse'
            : 'text-emerald-400 font-bold';
    }
}

function updateFriendRaceHud(p1Tele, p2Tele) {
    // Player 1 HUD
    formatCarStatusBadge(document.getElementById('hud-status'), playerState, p1Tele);
    document.getElementById('hud-speed-val').innerText = `${Math.round(playerState.speed)} KM/H`;
    document.getElementById('hud-brake-val').innerText = `${Math.round(playerState.brakeIntensity)}%`;
    document.getElementById('bar-speed-fill').style.width =
        `${Math.min(100, playerState.speed / playerState.maxSpeed * 100)}%`;
    document.getElementById('bar-brake-fill').style.width = `${playerState.brakeIntensity}%`;

    // Player 2 HUD
    formatCarStatusBadge(document.getElementById('hud-p2-status'), player2State, p2Tele);
    document.getElementById('hud-p2-speed-val').innerText = `${Math.round(player2State.speed)} KM/H`;
    document.getElementById('hud-p2-brake-val').innerText = `${Math.round(player2State.brakeIntensity)}%`;
    document.getElementById('bar-p2-speed-fill').style.width =
        `${Math.min(100, player2State.speed / player2State.maxSpeed * 100)}%`;
    document.getElementById('bar-p2-brake-fill').style.width = `${player2State.brakeIntensity}%`;

    // Shared Center Timing & Leader Board
    const p1Distance = (playerState.currentLap - 1) + playerState.progress;
    const p2Distance = (player2State.currentLap - 1) + player2State.progress;
    const isP1First = p1Distance >= p2Distance;

    const pos = document.getElementById('hud-pos');
    pos.innerHTML = isP1First
        ? 'J1 <span class="text-xs text-gray-400 font-normal">1º</span>'
        : 'J2 <span class="text-xs text-gray-400 font-normal">1º</span>';
    pos.className = isP1First
        ? 'font-racing text-3xl text-red-400 italic font-black'
        : 'font-racing text-3xl text-cyan-300 italic font-black';

    const p1Lap = Math.min(playerState.currentLap, playerState.totalLaps);
    const p2Lap = Math.min(player2State.currentLap, player2State.totalLaps);
    document.getElementById('hud-lap').innerText = `J1:${p1Lap} · J2:${p2Lap} / ${playerState.totalLaps}`;

    const activeLapTime = isP1First ? playerState.currentLapTime : player2State.currentLapTime;
    document.getElementById('hud-time').innerText = formatTime(activeLapTime);

    const bestCandidates = [playerState.bestLapTime, player2State.bestLapTime].filter(Boolean);
    const bestOverall = bestCandidates.length ? Math.min(...bestCandidates) : null;
    document.getElementById('hud-best').innerText = formatTime(bestOverall);

    const lapGap = Math.abs(p1Distance - p2Distance);
    const gapEl = document.getElementById('hud-ai-info');
    gapEl.innerText = `+${lapGap.toFixed(2)} V`;
    gapEl.className = isP1First
        ? 'font-racing text-xl text-red-400 italic font-black'
        : 'font-racing text-xl text-cyan-300 italic font-black';
}

function updateRaceHud(draftStrength, isOvertaking, trackSpeedLimit) {
    const status = document.getElementById('hud-status');
    if (playerState.offTrackTimer > 0) {
        status.innerText = '💥 TROMPO';
        status.className = 'text-red-500 font-black animate-pulse';
    } else if (playerState.isPenalized) {
        status.innerText = `⚡ PENALIZACIÓN (${playerState.penaltyTimer.toFixed(1)}s)`;
        status.className = 'text-amber-400 font-extrabold';
    } else if (Number.isFinite(trackSpeedLimit)) {
        status.innerText = `⚠ LÍMITE ${trackSpeedLimit} KM/H`;
        status.className = 'text-amber-300 font-extrabold animate-pulse';
    } else {
        status.innerText = isOvertaking ? '⚡ ADELANTAMIENTO'
            : draftStrength ? '💨 REBUFO' : 'EN PISTA';
        status.className = draftStrength || isOvertaking
            ? 'text-cyan-300 font-extrabold animate-pulse'
            : 'text-emerald-400 font-bold';
    }
    document.getElementById('hud-speed-val').innerText = `${Math.round(playerState.speed)} KM/H`;
    document.getElementById('hud-brake-val').innerText = `${Math.round(playerState.brakeIntensity)}%`;
    document.getElementById('bar-speed-fill').style.width =
        `${Math.min(100, playerState.speed / playerState.maxSpeed * 100)}%`;
    document.getElementById('bar-brake-fill').style.width = `${playerState.brakeIntensity}%`;
    document.getElementById('hud-lap').innerText =
        `${Math.min(playerState.currentLap, playerState.totalLaps)} / ${playerState.totalLaps}`;
    document.getElementById('hud-time').innerText = formatTime(playerState.currentLapTime);
    document.getElementById('hud-best').innerText = formatTime(playerState.bestLapTime);
    const aiInfoEl = document.getElementById('hud-ai-info');
    aiInfoEl.innerText = `${Math.round(aiState.speed)} KM/H`;
    aiInfoEl.className = 'font-racing text-xl text-blue-400 italic font-black';

    const playerDistance = (playerState.currentLap - 1) + playerState.progress;
    const aiDistance = (aiState.currentLap - 1) + aiState.progress;
    const pos = document.getElementById('hud-pos');
    const isPlayerFirst = playerDistance >= aiDistance;
    pos.innerHTML = isPlayerFirst
        ? '1º <span class="text-xs text-gray-400 font-normal">/ 2</span>'
        : '2º <span class="text-xs text-gray-400 font-normal">/ 2</span>';
    pos.className = isPlayerFirst
        ? 'font-racing text-3xl text-yellow-400 italic font-black'
        : 'font-racing text-3xl text-gray-300 italic font-black';
}

window.addEventListener('keydown', (e) => {
    if (!isThreeActive) return;
    const key = e.key.toLowerCase();
    if (key === 'w') camKeys.w = true;
    if (key === 'a') camKeys.a = true;
    if (key === 's') camKeys.s = true;
    if (key === 'd') camKeys.d = true;
    if (e.key === '+' || e.key === '=') camKeys.zoomIn = true;
    if (e.key === '-') camKeys.zoomOut = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w') camKeys.w = false;
    if (key === 'a') camKeys.a = false;
    if (key === 's') camKeys.s = false;
    if (key === 'd') camKeys.d = false;
    if (e.key === '+' || e.key === '=') camKeys.zoomIn = false;
    if (e.key === '-') camKeys.zoomOut = false;
});

/* EXPONER FUNCIONES AL ÁMBITO GLOBAL PARA LOS ONCLICK DEL HTML */
Object.assign(window, {
    nav,
    openBio,
    closeBio,
    handleImageError,
    showModalSalir,
    hideModalSalir,
    closeGame,
    startScalextricGame,
    startLegacyScalextricGame,
    exitScalextricGame,
    rematchRace,
    openCircuit3D,
    closeCircuit3D,
    openIndianapolis3D,
    closeIndianapolis3D,
    triggerToast,
    openQuickRaceMaps,
    selectQuickRaceMap,
    // Controles de selección de neumáticos (los llama el HTML mediante onclick)
    selectStartingTyre,
    updateStartingTyreSelection,
    confirmQuickRaceStart,
    openPitStop,
    closePitStop,
    selectPitTyre
});