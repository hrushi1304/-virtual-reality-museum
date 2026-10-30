/**
 * controls.js – First-Person Exploration Controller
 *
 * Responsibilities:
 *  - WASD + Arrow Keys FPS movement
 *  - Sprint mode with Shift key
 *  - Keyboard movement in touchpad-first and optional pointer-lock modes
 *  - AABB Walkable Zone Collision Detection with wall sliding
 *  - Procedural footstep audio triggering via soundManager
 */

import * as THREE from 'three';
import { soundManager } from './audio.js';

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard State
// ─────────────────────────────────────────────────────────────────────────────
const keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
  Shift: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Movement Configuration
// ─────────────────────────────────────────────────────────────────────────────
const BASE_SPEED    = 5.5;  // units/second walking speed
const SPRINT_SPEED  = 8.5;  // units/second sprinting speed
const PLAYER_HEIGHT = 1.7;  // Natural eye height (meters)
const PLAYER_RADIUS = 0.35; // Collision padding

// ─────────────────────────────────────────────────────────────────────────────
// Museum Walkable Zones
// Seamless overlapping AABB bounding boxes mirroring museum.js floorplan
// ─────────────────────────────────────────────────────────────────────────────
export const WALKABLE_ZONES = [
  // 1. Main Lobby
  { name: 'Lobby Core',             xMin:  -9.2, xMax:   9.2, zMin:   8.2, zMax:  21.4 },

  // 2. Colonnade Opening (Lobby <-> Central Atrium)
  { name: 'Lobby-Atrium Pass',      xMin:  -6.2, xMax:   6.2, zMin:   7.5, zMax:   8.8 },

  // 3. Central Atrium Hub
  { name: 'Atrium Core',            xMin:  -9.2, xMax:   9.2, zMin:  -6.6, zMax:   8.2 },

  // 4. Art Gallery (West Wing)
  { name: 'Art Gallery Core',       xMin: -25.2, xMax: -10.2, zMin:  -6.6, zMax:  22.2 },

  // Archway Lobby <-> Art Gallery
  { name: 'Lobby-Art Arch',         xMin: -11.0, xMax:  -8.8, zMin:  12.2, zMax:  17.8 },

  // Archway Atrium <-> Art Gallery
  { name: 'Atrium-Art Arch',        xMin: -11.0, xMax:  -8.8, zMin:  -0.8, zMax:   4.8 },

  // 5. Historical Artifacts Gallery (East Wing)
  { name: 'History Gallery Core',   xMin:  10.2, xMax:  25.2, zMin:  -6.6, zMax:  22.2 },

  // Archway Lobby <-> History Gallery
  { name: 'Lobby-History Arch',     xMin:   8.8, xMax:  11.0, zMin:  12.2, zMax:  17.8 },

  // Archway Atrium <-> History Gallery
  { name: 'Atrium-History Arch',    xMin:   8.8, xMax:  11.0, zMin:  -0.8, zMax:   4.8 },

  // 6. Science & Technology Wing (South-West)
  { name: 'Science Wing Core',      xMin: -25.2, xMax:  -0.6, zMin: -26.2, zMax:  -6.6 },

  // Passage Art Gallery <-> Science Wing
  { name: 'Art-Science Pass',       xMin: -19.8, xMax: -16.2, zMin:  -7.8, zMax:  -6.2 },

  // Passage Atrium <-> Science Wing
  { name: 'Atrium-Science Pass',    xMin:  -7.8, xMax:  -2.2, zMin:  -7.8, zMax:  -6.2 },

  // 7. Central Exhibition Hall (South-East)
  { name: 'Exhibition Hall Core',   xMin:   0.6, xMax:  25.2, zMin: -26.2, zMax:  -6.6 },

  // Passage Atrium <-> Exhibition Hall
  { name: 'Atrium-Exhibit Pass',    xMin:   2.2, xMax:   7.8, zMin:  -7.8, zMax:  -6.2 },

  // Passage History <-> Exhibition Hall
  { name: 'History-Exhibit Pass',   xMin:  16.2, xMax:  19.8, zMin:  -7.8, zMax:  -6.2 },

  // Grand Archway between Science Wing <-> Exhibition Hall
  { name: 'Science-Exhibit Arch',   xMin:  -1.2, xMax:   1.2, zMin: -18.8, zMax: -13.2 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Boundary Test
// ─────────────────────────────────────────────────────────────────────────────
export function isPositionWalkable(x, z) {
  for (let i = 0; i < WALKABLE_ZONES.length; i++) {
    const zc = WALKABLE_ZONES[i];
    if (x >= zc.xMin && x <= zc.xMax && z >= zc.zMin && z <= zc.zMax) {
      return true;
    }
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Setup Keyboard Listeners
// ─────────────────────────────────────────────────────────────────────────────
export function setupControls(controls, camera, scene) {
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k in keys)     keys[k]     = true;
    if (e.key in keys) keys[e.key] = true;
    if (e.key === 'Shift') keys.Shift = true;
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k in keys)     keys[k]     = false;
    if (e.key in keys) keys[e.key] = false;
    if (e.key === 'Shift') keys.Shift = false;
  });

  // Prevent a held movement key from sticking when the browser loses focus.
  window.addEventListener('blur', () => {
    Object.keys(keys).forEach((key) => { keys[key] = false; });
  });

  // Lock camera starting height
  camera.position.y = PLAYER_HEIGHT;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-Frame Movement Update
// ─────────────────────────────────────────────────────────────────────────────
const forwardVector = new THREE.Vector3();
const rightVector = new THREE.Vector3();
const movementVector = new THREE.Vector3();
const worldUpVector = new THREE.Vector3(0, 1, 0);

export function updateMovement(delta, camera, controls, navigationEnabled = false) {
  if (!controls.isLocked && !navigationEnabled) return;

  // Avoid allocations when the visitor is not pressing a movement key.
  if (!(keys.w || keys.ArrowUp || keys.s || keys.ArrowDown || keys.a || keys.ArrowLeft || keys.d || keys.ArrowRight)) return;

  // Get look direction projected onto the horizontal XZ plane.
  controls.getDirection(forwardVector);
  forwardVector.y = 0;
  forwardVector.normalize();

  // Perpendicular right vector and desired movement direction.
  rightVector.crossVectors(forwardVector, worldUpVector).normalize();
  movementVector.set(0, 0, 0);
  if (keys.w || keys.ArrowUp)    movementVector.addScaledVector(forwardVector,  1);
  if (keys.s || keys.ArrowDown)  movementVector.addScaledVector(forwardVector, -1);
  if (keys.a || keys.ArrowLeft)  movementVector.addScaledVector(rightVector,   -1);
  if (keys.d || keys.ArrowRight) movementVector.addScaledVector(rightVector,    1);

  if (movementVector.lengthSq() === 0) return;

  movementVector.normalize();

  const speed = keys.Shift ? SPRINT_SPEED : BASE_SPEED;
  const step  = speed * Math.min(delta, 0.05);

  // Proposed next positions
  const nextX = camera.position.x + movementVector.x * step;
  const nextZ = camera.position.z + movementVector.z * step;

  // Independent axis collision check (allows smooth sliding along walls)
  let moved = false;
  if (isPositionWalkable(nextX, camera.position.z)) {
    camera.position.x = nextX;
    moved = true;
  }
  if (isPositionWalkable(camera.position.x, nextZ)) {
    camera.position.z = nextZ;
    moved = true;
  }

  // Trigger procedural footstep sound when moving
  if (moved) {
    soundManager.playFootstep();
  }

  // Keep camera locked at realistic human eye height
  camera.position.y = PLAYER_HEIGHT;
}
