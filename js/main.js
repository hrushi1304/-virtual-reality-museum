/**
 * main.js – Master Application Entry Point & Orchestrator
 *
 * Responsibilities:
 *  - Scene, Camera, WebGLRenderer configuration
 *  - High-performance animation and render loop
 *  - Touchpad-first camera navigation with optional pointer-lock compatibility
 *  - Zone transition tracking & HUD updates
 *  - Mini-map radar canvas renderer
 *  - Web Audio API sound initialization
 *  - Optional WebXR support
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { buildMuseum, GALLERY_ZONES } from './museum.js';
import { setupControls, updateMovement } from './controls.js';
import { setupInteraction, updateInteraction, isPanelOpen, openInfoPanel } from './interaction.js';
import { createAllExhibits, getExhibitObjects } from './exhibits.js';
import { soundManager } from './audio.js';

// ─────────────────────────────────────────────────────────────────────────────
// DOM References
// ─────────────────────────────────────────────────────────────────────────────
const loadingScreen       = document.getElementById('loading-screen');
const loaderBar           = document.getElementById('loader-bar');
const loaderStatus        = document.getElementById('loader-status');
const welcomeScreen       = document.getElementById('welcome-screen');
const enterBtn            = document.getElementById('enter-btn');
const canvasContainer     = document.getElementById('canvas-container');
const hud                 = document.getElementById('hud');
const galleryNameEl       = document.getElementById('gallery-name');
const helpBtn             = document.getElementById('help-btn');
const helpOverlay         = document.getElementById('help-overlay');
const helpClose           = document.getElementById('help-close');
const hudFps              = document.getElementById('hud-fps');
const pauseScreen         = document.getElementById('pause-screen');
const resumeBtn           = document.getElementById('resume-btn');
const galleryTransitionEl = document.getElementById('gallery-transition');
const gtNameEl            = document.getElementById('gt-name');
const audioToggleBtn      = document.getElementById('audio-toggle-btn');
const fullscreenBtn       = document.getElementById('fullscreen-btn');
const minimapCanvas       = document.getElementById('minimap-canvas');
const galleryGuideBtn     = document.getElementById('gallery-guide-btn');
const galleryGuide        = document.getElementById('gallery-guide');
const galleryGuideClose   = document.getElementById('gallery-guide-close');

// ─────────────────────────────────────────────────────────────────────────────
// Three.js Core Setup
// ─────────────────────────────────────────────────────────────────────────────

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd4d1c8);
scene.fog = new THREE.Fog(0xd4d1c8, 82, 145);

// Camera – Human First-Person Perspective (Starting at Lobby looking forward)
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 140);
camera.rotation.order = 'YXZ';
camera.position.set(0, 1.7, 18);

// WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
canvasContainer.appendChild(renderer.domElement);

// ─────────────────────────────────────────────────────────────────────────────
// First-Person Controls (Touchpad-First; Pointer Lock Kept as Compatibility Path)
// ─────────────────────────────────────────────────────────────────────────────
const controls = new PointerLockControls(camera, renderer.domElement);
controls.manualMode = true; // Touchpad-first navigation; pointer lock is not required.
controls.navigationActive = false;
scene.add(controls.getObject());

// Expose internal references for automated capture and diagnostics
window.__MUSEUM__ = { camera, controls, scene, renderer, getExhibitObjects, openInfoPanel };

// Pointer lock remains supported by Three.js, but the default experience does not use it.
controls.addEventListener('lock', () => {
  controls.manualMode = false;
  setNavigationEnabled(true);
  pauseScreen.classList.add('hidden');
  hud.classList.remove('hidden');
});

controls.addEventListener('unlock', () => {
  if (museumRunning && !isPanelOpen() && !controls.manualMode) {
    setNavigationEnabled(false);
    pauseScreen.classList.remove('hidden');
  }
});

document.addEventListener('pointerlockerror', () => {
  // A pointer-lock failure must never strand the visitor without controls.
  controls.manualMode = true;
  setNavigationEnabled(true);
  pauseScreen.classList.add('hidden');
  console.warn('Pointer lock unavailable; continuing in touchpad navigation mode.');
});

function resumeExploration() {
  if (!museumRunning) return;
  if (controls.manualMode) {
    setNavigationEnabled(true);
    pauseScreen.classList.add('hidden');
  } else {
    controls.lock();
  }
}

if (resumeBtn) {
  resumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resumeExploration();
  });
}
pauseScreen.addEventListener('click', (e) => {
  if (e.target === pauseScreen) resumeExploration();
});

// Only the optional pointer-lock mode captures the cursor on canvas click.
canvasContainer.addEventListener('click', () => {
  if (museumRunning && !controls.manualMode && !controls.isLocked && !isPanelOpen()) {
    controls.lock();
  }
});

// Touchpad / touchscreen look: click-and-drag rotates the camera without hiding the cursor.
const lookDrag = { pointerId: null, lastX: 0, lastY: 0, moved: false };
function setupTouchpadLook() {
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'none';

  canvas.addEventListener('pointerdown', (event) => {
    if (!museumRunning || !controls.manualMode || !controls.navigationActive || event.button !== 0) return;
    lookDrag.pointerId = event.pointerId;
    lookDrag.lastX = event.clientX;
    lookDrag.lastY = event.clientY;
    lookDrag.moved = false;
    try { canvas.setPointerCapture(event.pointerId); } catch (_) { /* Pointer capture is optional. */ }
  });

  canvas.addEventListener('pointermove', (event) => {
    if (lookDrag.pointerId !== event.pointerId || !controls.manualMode || !controls.navigationActive) return;
    const dx = event.clientX - lookDrag.lastX;
    const dy = event.clientY - lookDrag.lastY;
    lookDrag.lastX = event.clientX;
    lookDrag.lastY = event.clientY;
    if (Math.abs(dx) + Math.abs(dy) > 0) lookDrag.moved = true;

    camera.rotation.order = 'YXZ';
    camera.rotation.y -= dx * 0.0042;
    camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - dy * 0.0036, -1.42, 1.42);
  });

  const endDrag = (event) => {
    if (lookDrag.pointerId !== event.pointerId) return;
    lookDrag.pointerId = null;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
}

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────
let museumRunning  = false;
let navigationEnabled = false;
let currentGallery = 'Main Lobby';
const animatedObjects = [];

function setNavigationEnabled(enabled) {
  navigationEnabled = Boolean(enabled);
  controls.navigationActive = navigationEnabled;
}
let frameCount     = 0;
let fpsTimer       = 0;
const clock        = new THREE.Clock();
let transitionTimer = null;

// ─────────────────────────────────────────────────────────────────────────────
// Loading Sequence
// ─────────────────────────────────────────────────────────────────────────────
async function runLoadingSequence() {
  const steps = [
    { pct: 15, msg: 'Initializing Three.js WebGL rendering pipeline…' },
    { pct: 35, msg: 'Constructing galleries, columns, and marble floors…' },
    { pct: 60, msg: 'Loading gallery artwork and painting exhibit inscriptions…' },
    { pct: 80, msg: 'Assembling 3D artifacts, Bohr atom, and planetary orrery…' },
    { pct: 95, msg: 'Calibrating raycasters and audio synthesizers…' },
    { pct: 100, msg: 'Museum Ready! Click below to enter.' },
  ];

  for (const step of steps) {
    loaderBar.style.width = step.pct + '%';
    loaderStatus.textContent = step.msg;
    await delay(step.pct === 100 ? 350 : 220);
  }

  // Build the complete 3D environment
  buildMuseum(scene);
  createAllExhibits(scene);
  setupControls(controls, camera, scene);
  setupInteraction(camera, scene, getExhibitObjects(), controls, renderer.domElement);
  setupTouchpadLook();
  scene.traverse((object) => {
    if (object.userData.rotate && object.userData.rotateSpeed) animatedObjects.push(object);
  });

  await delay(250);

  // Fade out loading screen into welcome landing page
  loadingScreen.style.transition = 'opacity 0.5s ease';
  loadingScreen.style.opacity = '0';
  await delay(500);
  loadingScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
}

// ─────────────────────────────────────────────────────────────────────────────
// Enter Museum (Synchronous User Gesture Handled Here!)
// ─────────────────────────────────────────────────────────────────────────────
enterBtn.addEventListener('click', () => {
  // 1. Initialize procedural audio synthesizer on first direct user gesture
  soundManager.init();

  // Touchpad-first mode keeps the cursor visible and does not require pointer lock.
  controls.manualMode = true;

  // Start the simulation with keyboard movement and click-drag camera look.
  welcomeScreen.classList.add('hidden');
  hud.classList.remove('hidden');
  museumRunning = true;
  setNavigationEnabled(true);

  showGalleryTransition('Welcome to the Virtual Museum');
  if (vrBtn) vrBtn.classList.remove('hidden');
  renderer.setAnimationLoop(animate);
});

// ─────────────────────────────────────────────────────────────────────────────
// Gallery Transition Toast
// ─────────────────────────────────────────────────────────────────────────────
function showGalleryTransition(name) {
  if (transitionTimer) clearTimeout(transitionTimer);
  gtNameEl.textContent = name;
  galleryTransitionEl.classList.remove('hidden');
  galleryTransitionEl.classList.remove('fade-out');

  transitionTimer = setTimeout(() => {
    galleryTransitionEl.classList.add('fade-out');
    setTimeout(() => {
      galleryTransitionEl.classList.add('hidden');
    }, 600);
  }, 2200);
}

// Detect which gallery zone the visitor currently occupies
function detectGallery() {
  const pos = camera.position;
  for (let i = 0; i < GALLERY_ZONES.length; i++) {
    const z = GALLERY_ZONES[i];
    if (pos.x >= z.xMin && pos.x <= z.xMax && pos.z >= z.zMin && pos.z <= z.zMax) {
      if (z.name !== currentGallery) {
        currentGallery = z.name;
        galleryNameEl.textContent = currentGallery;
        showGalleryTransition(currentGallery);
      }
      return;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD Mini-Map Radar Renderer
// ─────────────────────────────────────────────────────────────────────────────
function updateMinimap() {
  if (!minimapCanvas) return;
  const ctx = minimapCanvas.getContext('2d');
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background map box
  ctx.fillStyle = 'rgba(15, 12, 25, 0.85)';
  ctx.fillRect(0, 0, w, h);

  // Map coordinates: X from -26 to 26 (range 52), Z from -27 to 23 (range 50)
  const mapX = (x) => ((x + 28) / 56) * w;
  const mapZ = (z) => ((-z + 25) / 52) * h;

  // Draw gallery room outlines
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.45)';
  ctx.lineWidth = 1.5;

  GALLERY_ZONES.forEach((zone) => {
    const x0 = mapX(zone.xMin);
    const z0 = mapZ(zone.zMax);
    const rw = mapX(zone.xMax) - x0;
    const rh = mapZ(zone.zMin) - z0;
    ctx.strokeRect(x0, z0, rw, rh);
  });

  // Player position dot
  const px = mapX(camera.position.x);
  const pz = mapZ(camera.position.z);

  // Player view direction cone
  const dir = new THREE.Vector3();
  controls.getDirection(dir);
  ctx.fillStyle = 'rgba(201, 168, 76, 0.3)';
  ctx.beginPath();
  ctx.moveTo(px, pz);
  ctx.arc(px, pz, 16, -Math.atan2(dir.x, dir.z) - Math.PI / 6, -Math.atan2(dir.x, dir.z) + Math.PI / 6);
  ctx.closePath();
  ctx.fill();

  // Player location beacon
  ctx.fillStyle = '#ffdf66';
  ctx.beginPath();
  ctx.arc(px, pz, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio & Fullscreen Buttons
// ─────────────────────────────────────────────────────────────────────────────
if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const muted = soundManager.toggleMute();
    audioToggleBtn.textContent = muted ? '🔇 Muted' : '🔊 Sound';
  });
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else {
      showGalleryTransition('Fullscreen is not supported by this browser');
    }
  } catch (error) {
    console.warn('Fullscreen request failed:', error);
    showGalleryTransition('Fullscreen was blocked by the browser');
  }
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFullscreen();
  });
}

document.addEventListener('fullscreenchange', () => {
  if (fullscreenBtn) {
    fullscreenBtn.textContent = document.fullscreenElement ? '⤓ Exit Full' : '⛶ Fullscreen';
    fullscreenBtn.title = document.fullscreenElement ? 'Exit Fullscreen' : 'Enter Fullscreen';
  }
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Quick travel directory: move the visitor to a safe point in a selected wing.
function openGalleryGuide() {
  if (!museumRunning) return;
  setNavigationEnabled(false);
  galleryGuide.classList.remove('hidden');
}
function closeGalleryGuide() {
  galleryGuide.classList.add('hidden');
  if (museumRunning) setNavigationEnabled(true);
}
if (galleryGuideBtn) galleryGuideBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openGalleryGuide();
});
if (galleryGuideClose) galleryGuideClose.addEventListener('click', closeGalleryGuide);
if (galleryGuide) {
  galleryGuide.addEventListener('click', (e) => {
    if (e.target === galleryGuide) closeGalleryGuide();
  });
  galleryGuide.querySelectorAll('.gallery-destination').forEach((button) => {
    button.addEventListener('click', () => {
      const x = Number(button.dataset.x);
      const z = Number(button.dataset.z);
      const yaw = Number(button.dataset.yaw);
      camera.position.set(x, 1.7, z);
      camera.rotation.order = 'YXZ';
      camera.rotation.set(0, yaw, 0);
      const destination = button.dataset.gallery || button.querySelector('strong')?.textContent || 'Gallery';
      currentGallery = destination;
      galleryNameEl.textContent = destination;
      closeGalleryGuide();
      showGalleryTransition(destination);
    });
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// Help / Controls Overlay
// ─────────────────────────────────────────────────────────────────────────────
function openHelp() {
  if (controls.isLocked) controls.unlock();
  if (controls.manualMode) setNavigationEnabled(false);
  helpOverlay.classList.remove('hidden');
}
function closeHelp() {
  helpOverlay.classList.add('hidden');
  if (museumRunning && controls.manualMode) setNavigationEnabled(true);
}
helpBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openHelp();
});
helpClose.addEventListener('click', closeHelp);
helpOverlay.addEventListener('click', (e) => {
  if (e.target === helpOverlay) closeHelp();
});

window.addEventListener('keydown', (event) => {
  if (!museumRunning || event.repeat) return;
  const key = event.key.toLowerCase();
  if (key === 'p' && controls.manualMode && !isPanelOpen() && helpOverlay.classList.contains('hidden') && galleryGuide.classList.contains('hidden')) {
    setNavigationEnabled(!navigationEnabled);
    pauseScreen.classList.toggle('hidden', navigationEnabled);
  }
  if (key === 'g' && (navigationEnabled || !galleryGuide.classList.contains('hidden')) && helpOverlay.classList.contains('hidden') && !isPanelOpen()) {
    if (galleryGuide.classList.contains('hidden')) openGalleryGuide();
    else closeGalleryGuide();
  }
  if (key === 'f') toggleFullscreen();
});

// ─────────────────────────────────────────────────────────────────────────────
// Window Resize
// ─────────────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Animation & Render Loop
// ─────────────────────────────────────────────────────────────────────────────
function animate() {
  // Three.js manages this loop for both normal rendering and immersive WebXR sessions.
  const delta = clock.getDelta();

  // FPS calculation
  frameCount++;
  fpsTimer += delta;
  if (fpsTimer >= 1.0) {
    hudFps.textContent = `${frameCount} fps`;
    frameCount = 0;
    fpsTimer = 0;
  }

  // Update exploration kinematics & gallery detection
  if (museumRunning && !isPanelOpen() && (controls.isLocked || (controls.manualMode && navigationEnabled))) {
    updateMovement(delta, camera, controls, navigationEnabled);
    detectGallery();
  }

  // Update raycasting interaction (cursor-based in touchpad mode, centre-based in pointer-lock mode).
  updateInteraction(camera, scene, controls, navigationEnabled);

  // Update mini-map radar
  updateMinimap();

  // Animate rotating showcase objects (Earth, planets, Atom, Pyramids, Sculptures)
  for (const obj of animatedObjects) {
    obj.rotation.y += obj.userData.rotateSpeed * delta;
  }

  renderer.render(scene, camera);
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────────────────────────
// WebXR Support (Optional VR Headset Mode)
// ─────────────────────────────────────────────────────────────────────────────
let vrBtn = null;
if ('xr' in navigator) {
  navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
    if (!supported) return;

    renderer.xr.enabled = true;
    vrBtn = document.createElement('button');
    vrBtn.id = 'vr-btn';
    vrBtn.textContent = '🥽 Enter VR';
    vrBtn.className = 'btn-vr hidden';
    vrBtn.title = 'Enter immersive VR (compatible headset required)';
    vrBtn.addEventListener('click', async () => {
      if (!museumRunning) {
        showGalleryTransition('Enter the museum before starting VR');
        return;
      }
      try {
        const session = await navigator.xr.requestSession('immersive-vr', {
          optionalFeatures: ['local-floor', 'bounded-floor'],
        });
        await renderer.xr.setSession(session);
      } catch (error) {
        console.warn('Unable to start WebXR session:', error);
        showGalleryTransition('VR could not start. Check headset connection and browser permissions.');
      }
    });
    document.body.appendChild(vrBtn);
    if (museumRunning) vrBtn.classList.remove('hidden');
  }).catch((error) => {
    console.info('WebXR immersive mode is not available:', error);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────────────────────────
runLoadingSequence();
