/**
 * interaction.js – Raycaster-based Exhibit Interaction & Modal Manager
 *
 * Responsibilities:
 *  - Cursor-position raycasting (touchpad mode) and screen-centre raycasting (pointer-lock compatibility)
 *  - Dynamic crosshair and HUD prompt updates
 *  - Emissive hover highlighting of 3D objects & paintings
 *  - Information modal management (open, populate, close)
 *  - Procedural UI audio effects integration
 *  - Real-time orbital animation of planetary bodies and electrons
 */

import * as THREE from 'three';
import { soundManager } from './audio.js';

// ─────────────────────────────────────────────────────────────────────────────
// DOM Elements
// ─────────────────────────────────────────────────────────────────────────────
const crosshair         = document.getElementById('crosshair');
const interactionPrompt = document.getElementById('interaction-prompt');
const promptText        = document.getElementById('prompt-text');
const infoPanel         = document.getElementById('info-panel');
const infoClose         = document.getElementById('info-close');
const infoCategory      = document.getElementById('info-category');
const infoTitle         = document.getElementById('info-title');
const infoDescription   = document.getElementById('info-description');
const infoExtra         = document.getElementById('info-extra');
const infoFact          = document.getElementById('info-fact');
const infoSdg           = document.getElementById('info-sdg');

// ─────────────────────────────────────────────────────────────────────────────
// Raycaster & Interaction State
// ─────────────────────────────────────────────────────────────────────────────
const raycaster     = new THREE.Raycaster();
const screenCentre  = new THREE.Vector2(0, 0); // NDC centre for pointer-lock mode
const pointerNDC    = new THREE.Vector2(0, 0); // actual cursor position in touchpad mode
let pointerInside   = false;
let pointerDownInfo = null;
const orbitObjects  = [];
const INTERACT_DIST = 6.8;                     // Maximum interaction distance (meters)
let exhibitList     = [];
let currentHovered  = null;
let panelOpen       = false;

const SCALE_HIGHLIGHT = 1.05;

// ─────────────────────────────────────────────────────────────────────────────
// Setup Listeners
// ─────────────────────────────────────────────────────────────────────────────
export function setupInteraction(camera, scene, exhibits, controls, canvas) {
  exhibitList = exhibits;

  // Cache animated orbital objects once; avoid traversing the entire scene every frame.
  scene.traverse((object) => {
    if ((object.userData.orbitInXZ || object.userData.orbitRotX !== undefined) && object.userData.orbitCentre) {
      orbitObjects.push(object);
    }
  });

  // Cursor-based raycasting makes touchpad clicks and touchscreen taps first-class inputs.
  if (canvas) {
    canvas.addEventListener('pointerenter', () => { pointerInside = true; });
    canvas.addEventListener('pointerleave', () => {
      if (!controls.isLocked) pointerInside = false;
    });
    canvas.addEventListener('pointermove', (event) => {
      if (controls.isLocked) return;
      const rect = canvas.getBoundingClientRect();
      pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointerInside = true;
    });
    canvas.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType !== 'touch') return;
      pointerDownInfo = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    });
    canvas.addEventListener('pointerup', (event) => {
      if (!pointerDownInfo || pointerDownInfo.pointerId !== event.pointerId) return;
      const rect = canvas.getBoundingClientRect();
      pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const distance = Math.hypot(event.clientX - pointerDownInfo.x, event.clientY - pointerDownInfo.y);
      pointerDownInfo = null;
      if (controls.manualMode && controls.navigationActive && distance < 9) {
        refreshHovered(camera, pointerNDC);
        if (currentHovered && !panelOpen) openInfoPanel(currentHovered.userData.exhibitData, controls);
      }
    });
    canvas.addEventListener('pointercancel', () => { pointerDownInfo = null; });
  }

  // Keyboard inspection remains available, even when the visitor prefers the touchpad.
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e' && currentHovered && !panelOpen && (controls.isLocked || controls.navigationActive)) {
      openInfoPanel(currentHovered.userData.exhibitData, controls);
    } else if (e.key === 'Escape' && panelOpen) {
      closeInfoPanel(controls);
    }
  });

  // Pointer-lock mode still supports centre-aim + click inspection.
  window.addEventListener('mousedown', (e) => {
    if (controls.isLocked && currentHovered && !panelOpen && e.button === 0) {
      openInfoPanel(currentHovered.userData.exhibitData, controls);
    }
  });

  infoClose.addEventListener('click', () => closeInfoPanel(controls));
  infoPanel.addEventListener('click', (e) => {
    if (e.target === infoPanel) closeInfoPanel(controls);
  });
}

function refreshHovered(camera, point) {
  raycaster.setFromCamera(point, camera);
  const hits = raycaster.intersectObjects(exhibitList, false);
  const next = hits.length && hits[0].distance < INTERACT_DIST ? hits[0].object : null;
  if (next !== currentHovered) {
    if (currentHovered) unhighlightExhibit(currentHovered);
    currentHovered = next;
    if (currentHovered) highlightExhibit(currentHovered);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal Actions
// ─────────────────────────────────────────────────────────────────────────────
export function openInfoPanel(data, controls) {
  if (!data) return;
  panelOpen = true;

  soundManager.playExhibitOpen();

  // Populate data fields
  infoCategory.textContent    = data.category || 'EXHIBIT';
  infoTitle.textContent       = data.title || 'Untitled Exhibit';
  infoDescription.textContent = data.description || '';
  infoExtra.textContent       = data.extra || '';
  infoFact.textContent        = data.fact || '';

  if (infoSdg) {
    infoSdg.textContent = data.sdg || 'SDG 4: Quality Education — Promoting accessible, immersive digital learning.';
  }

  // Release pointer lock so user can interact with the panel and read comfortably
  if (controls && controls.isLocked) {
    controls.unlock();
  }

  infoPanel.classList.remove('hidden');
  interactionPrompt.classList.add('hidden');
  crosshair.classList.remove('active');
}

export function closeInfoPanel(controls) {
  if (!panelOpen) return;
  panelOpen = false;

  soundManager.playExhibitClose();
  infoPanel.classList.add('hidden');

  // Note: Controls will re-lock when the user clicks back onto the canvas
}

export function isPanelOpen() {
  return panelOpen;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-Frame Raycasting & Hover Detection
// ─────────────────────────────────────────────────────────────────────────────
export function updateInteraction(camera, scene, controls, navigationEnabled = false) {
  updateOrbits();
  if (controls.manualMode) crosshair.classList.add('hidden');
  else crosshair.classList.remove('hidden');

  const active = controls.isLocked || (controls.manualMode && navigationEnabled);
  if (panelOpen || !active || (controls.manualMode && !pointerInside)) {
    if (currentHovered) {
      unhighlightExhibit(currentHovered);
      currentHovered = null;
    }
    crosshair.classList.remove('active');
    interactionPrompt.classList.add('hidden');
    return;
  }

  const aimPoint = controls.isLocked ? screenCentre : pointerNDC;
  refreshHovered(camera, aimPoint);

  if (controls.manualMode) {
    crosshair.classList.add('hidden');
  } else {
    crosshair.classList.remove('hidden');
  }

  if (currentHovered) {
    crosshair.classList.add('active');
    const title = currentHovered.userData.exhibitData?.title || 'Exhibit';
    promptText.innerHTML = controls.manualMode
      ? `<b>${title}</b> — Click / tap to explore`
      : `<b>${title}</b> — Press <kbd>E</kbd> or Click to Explore`;
    interactionPrompt.classList.remove('hidden');
  } else {
    crosshair.classList.remove('active');
    interactionPrompt.classList.add('hidden');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Highlight Shaders / Emissive Modifiers
// ─────────────────────────────────────────────────────────────────────────────
function highlightExhibit(mesh) {
  if (!mesh || !mesh.material) return;

  const applyHighlight = (mat) => {
    if (mat.emissive) {
      mat._origEmissive = mat.emissive.clone();
      mat._origEmissiveIntensity = mat.emissiveIntensity || 0;
      mat.emissive.set(0x664411);
      mat.emissiveIntensity = Math.min((mat.emissiveIntensity || 0) + 0.6, 1.8);
    } else {
      if (!mesh.userData._highlightScaled) {
        mesh.scale.multiplyScalar(SCALE_HIGHLIGHT);
        mesh.userData._highlightScaled = true;
      }
    }
  };

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(applyHighlight);
  } else {
    applyHighlight(mesh.material);
  }
}

function unhighlightExhibit(mesh) {
  if (!mesh || !mesh.material) return;

  const removeHighlight = (mat) => {
    if (mat._origEmissive !== undefined) {
      mat.emissive.copy(mat._origEmissive);
      mat.emissiveIntensity = mat._origEmissiveIntensity || 0;
      delete mat._origEmissive;
      delete mat._origEmissiveIntensity;
    }
  };

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(removeHighlight);
  } else {
    removeHighlight(mesh.material);
  }

  if (mesh.userData._highlightScaled) {
    mesh.scale.divideScalar(SCALE_HIGHLIGHT);
    delete mesh.userData._highlightScaled;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Orbital Kinematics (Planets & Subatomic Electrons)
// ─────────────────────────────────────────────────────────────────────────────
const orbitClock = new THREE.Clock();
const orbitVector = new THREE.Vector3();
const orbitEuler = new THREE.Euler();

function updateOrbits() {
  const elapsed = orbitClock.getElapsedTime();
  for (const obj of orbitObjects) {
    const data = obj.userData;
    const centre = data.orbitCentre;
    const radius = data.orbitRadius;
    const angle = data.orbitAngle + elapsed * (data.orbitSpeed || 1.0);

    if (data.orbitInXZ) {
      obj.position.set(
        centre.x + Math.cos(angle) * radius,
        centre.y,
        centre.z + Math.sin(angle) * radius
      );
    } else {
      orbitVector.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      orbitEuler.set(data.orbitRotX || 0, 0, data.orbitRotZ || 0);
      orbitVector.applyEuler(orbitEuler);
      obj.position.copy(centre).add(orbitVector);
    }
  }
}

