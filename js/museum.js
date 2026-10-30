/**
 * museum.js – Complete architectural construction of the Virtual Museum
 *
 * Distinct Connected Wings:
 *  1. Main Lobby (Grand Entrance, Directory, Welcome Feature)
 *  2. Central Atrium (Connecting Hub, Earth & Satellite Showcase, SDG 4 Wall)
 *  3. Art Gallery (Classical hardwood parquet, framed master paintings, spotlights)
 *  4. Historical Artifacts Gallery (Travertine stone, pedestals, ancient relics)
 *  5. Science & Technology Wing (High-tech floor, Atom model, DNA helix, VR tech)
 *  6. Central Exhibition Hall (Solar System Orrery, Great Pyramid)
 *
 * All textures (marble, parquet, travertine, signs) are procedurally generated
 * via HTML5 Canvas API – 100% self-contained, CORS-free, and instantly loaded!
 */

import * as THREE from 'three';

// Keep light targets separate from exhibit meshes. Reparenting a target mesh
// into the scene would detach it from its architectural or exhibit group.
function aimSpotlightAt(scene, spotlight, targetObject) {
  targetObject.updateWorldMatrix(true, false);
  const target = new THREE.Object3D();
  target.position.copy(targetObject.getWorldPosition(new THREE.Vector3()));
  scene.add(target);
  spotlight.target = target;
  scene.add(spotlight);
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery Zone Definitions (for HUD indicator & transition banners)
// ─────────────────────────────────────────────────────────────────────────────
export const GALLERY_ZONES = [
  { name: 'Main Lobby',                   xMin: -10, xMax:  10, zMin:   8, zMax:  22 },
  { name: 'Central Atrium',               xMin: -10, xMax:  10, zMin:  -7, zMax:   8 },
  { name: 'Art Gallery',                  xMin: -26, xMax: -10, zMin:  -7, zMax:  23 },
  { name: 'Historical Artifacts Gallery', xMin:  10, xMax:  26, zMin:  -7, zMax:  23 },
  { name: 'Science & Technology Wing',    xMin: -26, xMax:   0, zMin: -27, zMax:  -7 },
  { name: 'Central Exhibition Hall',      xMin:   0, xMax:  26, zMin: -27, zMax:  -7 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Procedural Canvas Texture Generators
// ─────────────────────────────────────────────────────────────────────────────

// 1. Polished Marble Tile with Subtle Veining
function createMarbleTexture(isDark = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isDark ? '#292735' : '#eee9df';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle marble veins
  const veinColor = isDark ? 'rgba(80, 70, 95, 0.25)' : 'rgba(180, 170, 155, 0.35)';
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = 3;
  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    let x = Math.random() * 1024;
    let y = Math.random() * 1024;
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 220;
      y += (Math.random() - 0.3) * 220;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Tile grid lines (4x4 tiles per 1024px)
  ctx.strokeStyle = isDark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(150, 140, 125, 0.4)';
  ctx.lineWidth = 4;
  for (let k = 0; k <= 1024; k += 256) {
    ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k, 1024); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(1024, k); ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 2. Hardwood Parquet Herringbone Texture (Art Gallery)
function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base warm wood tone
  ctx.fillStyle = '#60442b';
  ctx.fillRect(0, 0, 512, 512);

  const plankW = 64;
  const plankH = 16;
  const woodTones = ['#765334', '#68482c', '#805b39', '#5e4128', '#896342'];

  for (let y = 0; y < 512; y += plankH) {
    for (let x = 0; x < 512; x += plankW) {
      ctx.fillStyle = woodTones[(x / plankW + y / plankH) % woodTones.length];
      ctx.fillRect(x + 1, y + 1, plankW - 2, plankH - 2);

      // Fine grain lines
      ctx.strokeStyle = 'rgba(20, 10, 5, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 8);
      ctx.lineTo(x + plankW - 5, y + 8);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 3. Ancient Travertine Stone Tile Texture (History Gallery)
function createStoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#bfae95';
  ctx.fillRect(0, 0, 512, 512);

  // Noise / porous stone flecks
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(70, 60, 45, 0.15)' : 'rgba(240, 230, 210, 0.2)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  // 2x2 large stone slabs
  ctx.strokeStyle = 'rgba(75, 60, 45, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 508, 508);
  ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 512); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 256); ctx.lineTo(512, 256); ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 4. High-Tech Grid Tile (Science & Tech Wing)
function createTechFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1d2c3f';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle grid with cyan glow seams
  ctx.strokeStyle = 'rgba(88, 165, 235, 0.48)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
  }

  // Corner tech markers
  ctx.fillStyle = 'rgba(105, 198, 255, 0.8)';
  for (let x = 64; x < 512; x += 128) {
    for (let y = 64; y < 512; y += 128) {
      ctx.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ─────────────────────────────────────────────────────────────────────────────
// Museum Materials Collection
// ─────────────────────────────────────────────────────────────────────────────
function makeMaterials() {
  const marbleTex = createMarbleTexture(false);
  marbleTex.repeat.set(4, 4);

  const darkMarbleTex = createMarbleTexture(true);
  darkMarbleTex.repeat.set(4, 4);

  const parquetTex = createParquetTexture();
  parquetTex.repeat.set(8, 12);

  const stoneTex = createStoneTexture();
  stoneTex.repeat.set(6, 8);

  const techTex = createTechFloorTexture();
  techTex.repeat.set(8, 8);

  return {
    floorLobby: new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.2,
      metalness: 0.1,
    }),
    floorAtrium: new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.18,
      metalness: 0.12,
    }),
    floorArt: new THREE.MeshStandardMaterial({
      map: parquetTex,
      roughness: 0.35,
      metalness: 0.05,
    }),
    floorHistory: new THREE.MeshStandardMaterial({
      map: stoneTex,
      roughness: 0.55,
      metalness: 0.05,
    }),
    floorScience: new THREE.MeshStandardMaterial({
      map: techTex,
      color: 0xb7d0e8,
      roughness: 0.32,
      metalness: 0.25,
    }),
    floorCentral: new THREE.MeshStandardMaterial({
      map: darkMarbleTex,
      color: 0xc3bdd8,
      roughness: 0.28,
      metalness: 0.15,
    }),
    // Museum Wall Materials
    wallLobby: new THREE.MeshStandardMaterial({
      color: 0xf5f0e4,
      roughness: 0.85,
      metalness: 0.02,
    }),
    wallArt: new THREE.MeshStandardMaterial({
      color: 0x526078, // Deep blue-grey gallery wall with readable exhibit contrast
      roughness: 0.8,
      metalness: 0.05,
    }),
    wallHistory: new THREE.MeshStandardMaterial({
      color: 0x88745e, // Warm sandstone / travertine
      roughness: 0.85,
      metalness: 0.05,
    }),
    wallScience: new THREE.MeshStandardMaterial({
      color: 0x1d3852, // Illuminated deep navy blue
      roughness: 0.75,
      metalness: 0.1,
    }),
    wallCentral: new THREE.MeshStandardMaterial({
      color: 0x353449, // Celestial indigo / slate
      roughness: 0.8,
      metalness: 0.05,
    }),
    // Architectural Trims & Accents
    ceiling: new THREE.MeshStandardMaterial({
      color: 0xf4eee2,
      roughness: 0.95,
      metalness: 0.0,
    }),
    trimGold: new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.35,
      metalness: 0.75,
    }),
    skirtingBoard: new THREE.MeshStandardMaterial({
      color: 0x15121c,
      roughness: 0.5,
      metalness: 0.3,
    }),
    pillarStone: new THREE.MeshStandardMaterial({
      color: 0xe6e0d0,
      roughness: 0.45,
      metalness: 0.1,
    }),
    pedestalMat: new THREE.MeshStandardMaterial({
      color: 0x1e1a29,
      roughness: 0.4,
      metalness: 0.3,
    }),
    benchLeather: new THREE.MeshStandardMaterial({
      color: 0x4a2a16,
      roughness: 0.6,
      metalness: 0.05,
    }),
    benchMetal: new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8,
    }),
    brassStanchion: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
    }),
    velvetRope: new THREE.MeshStandardMaterial({
      color: 0x990012,
      roughness: 0.9,
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Architectural Mesh Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createBox(w, h, d, mat, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createCylinder(rt, rb, h, seg, mat, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Fluted Classical Pillar with Capital and Base
function createPillar(scene, x, z, h, mat) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  // Plinth (Base Block)
  const plinth = createBox(0.9, 0.25, 0.9, mat.skirtingBoard, 0, 0.125, 0);
  group.add(plinth);

  // Molded Torus Base
  const baseRing = createBox(0.8, 0.15, 0.8, mat.pillarStone, 0, 0.325, 0);
  group.add(baseRing);

  // Fluted Shaft
  const shaft = createCylinder(0.28, 0.32, h - 0.8, 16, mat.pillarStone, 0, (h - 0.8) / 2 + 0.4, 0);
  group.add(shaft);

  // Capital (Top)
  const neck = createCylinder(0.35, 0.28, 0.15, 16, mat.trimGold, 0, h - 0.325, 0);
  group.add(neck);

  const abacus = createBox(0.85, 0.2, 0.85, mat.trimGold, 0, h - 0.1, 0);
  group.add(abacus);

  scene.add(group);
}

// Archway Surround with Gold Crown
function createArchway(scene, x, z, width, height, thickness, isXAxis, mat) {
  const archGroup = new THREE.Group();
  archGroup.position.set(x, 0, z);

  const halfW = width / 2;
  const pillarW = 0.5;

  if (isXAxis) {
    // Archway spanning across X (opening faces Z)
    // Left post
    archGroup.add(createBox(pillarW, height, thickness, mat.trimGold, -halfW - pillarW / 2, height / 2, 0));
    // Right post
    archGroup.add(createBox(pillarW, height, thickness, mat.trimGold, halfW + pillarW / 2, height / 2, 0));
    // Header lintel
    archGroup.add(createBox(width + pillarW * 2, 0.6, thickness * 1.2, mat.trimGold, 0, height + 0.3, 0));
  } else {
    // Archway spanning across Z (opening faces X)
    // Front post
    archGroup.add(createBox(thickness, height, pillarW, mat.trimGold, 0, height / 2, -halfW - pillarW / 2));
    // Back post
    archGroup.add(createBox(thickness, height, pillarW, mat.trimGold, 0, height / 2, halfW + pillarW / 2));
    // Header lintel
    archGroup.add(createBox(thickness * 1.2, 0.6, width + pillarW * 2, mat.trimGold, 0, height + 0.3, 0));
  }

  scene.add(archGroup);
}

// Museum Upholstered Leather Bench
function createBench(scene, x, z, ry = 0, mat) {
  const bench = new THREE.Group();
  bench.position.set(x, 0, z);
  bench.rotation.y = ry;

  // Leather seat cushion
  const seat = createBox(2.2, 0.18, 0.7, mat.benchLeather, 0, 0.55, 0);
  bench.add(seat);

  // Brass/dark metal frame and legs
  const leg1 = createBox(0.06, 0.46, 0.6, mat.benchMetal, -0.9, 0.23, 0);
  const leg2 = createBox(0.06, 0.46, 0.6, mat.benchMetal, 0.9, 0.23, 0);
  const support = createBox(1.8, 0.04, 0.06, mat.benchMetal, 0, 0.2, 0);
  bench.add(leg1);
  bench.add(leg2);
  bench.add(support);

  scene.add(bench);
}

// Velvet Stanchion Barrier (protective museum rope)
function createStanchionBarrier(scene, x, z, length, isXAxis, mat) {
  const barrier = new THREE.Group();
  barrier.position.set(x, 0, z);

  const post1 = createCylinder(0.03, 0.03, 0.9, 8, mat.brassStanchion, -length / 2, 0.45, 0);
  const post2 = createCylinder(0.03, 0.03, 0.9, 8, mat.brassStanchion, length / 2, 0.45, 0);
  const base1 = createCylinder(0.15, 0.15, 0.04, 12, mat.brassStanchion, -length / 2, 0.02, 0);
  const base2 = createCylinder(0.15, 0.15, 0.04, 12, mat.brassStanchion, length / 2, 0.02, 0);

  // Velvet draped rope
  const rope = createBox(length, 0.03, 0.03, mat.velvetRope, 0, 0.75, 0);

  barrier.add(post1); barrier.add(post2);
  barrier.add(base1); barrier.add(base2);
  barrier.add(rope);

  if (!isXAxis) barrier.rotation.y = Math.PI / 2;
  scene.add(barrier);
}

// Directional Signboard
function createDirectionSign(scene, lines, x, z, ry, mat) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = ry;

  // Sturdy brass post
  const post = createCylinder(0.04, 0.05, 1.9, 8, mat.trimGold, 0, 0.95, 0);
  const base = createCylinder(0.25, 0.25, 0.05, 16, mat.skirtingBoard, 0, 0.025, 0);
  group.add(post);
  group.add(base);

  // Sign canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#192234';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 244);

  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 30px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(lines[0], 256, 70);

  ctx.fillStyle = '#f0ead8';
  ctx.font = '22px "Inter", sans-serif';
  ctx.fillText(lines[1], 256, 130);

  if (lines[2]) {
    ctx.fillStyle = '#9e9683';
    ctx.font = 'italic 18px "Inter", sans-serif';
    ctx.fillText(lines[2], 256, 185);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const signGeometry = new THREE.PlaneGeometry(1.4, 0.7);
  const signMaterial = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide, toneMapped: false });
  const board = new THREE.Mesh(signGeometry, signMaterial);
  board.position.set(0, 1.9, 0.006);
  group.add(board);
  // Separate reverse-facing panel keeps lettering readable from either approach.
  const reverseBoard = new THREE.Mesh(signGeometry, signMaterial);
  reverseBoard.position.set(0, 1.9, -0.006);
  reverseBoard.rotation.y = Math.PI;
  group.add(reverseBoard);

  scene.add(group);
}

// ─────────────────────────────────────────────────────────────────────────────
// Build Museum Environment
// ─────────────────────────────────────────────────────────────────────────────
export function buildMuseum(scene) {
  const mat = makeMaterials();
  const wallH = 6.0;   // Height of all gallery walls
  const wallT = 0.45;  // Solid structural wall thickness

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. LIGHTING SETUP – Cinematic Gallery Illumination
  // ═══════════════════════════════════════════════════════════════════════════

  // Ambient Fill Light
  const ambient = new THREE.AmbientLight(0xfff7ed, 0.62);
  scene.add(ambient);

  // Hemisphere Light (Sky cool blue, Ground warm marble bounce)
  const hemi = new THREE.HemisphereLight(0xe5efff, 0x87745d, 0.55);
  scene.add(hemi);

  // Directional Sunlight pouring through Skylight
  const sunLight = new THREE.DirectionalLight(0xfff7e8, 1.0);
  sunLight.position.set(6, 16, 8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 70;
  sunLight.shadow.camera.left = -32;
  sunLight.shadow.camera.right = 32;
  sunLight.shadow.camera.top = 32;
  sunLight.shadow.camera.bottom = -32;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Gallery Wing Characteristic Point Lights (atmospheric glows)
  const zonePointLights = [
    // Main Lobby
    { x:  0, y: 4.8, z:  15, color: 0xfff6dd, intensity: 2.3, dist: 30 },
    // Central Atrium
    { x:  0, y: 4.8, z:   0, color: 0xfff8e8, intensity: 2.4, dist: 32 },
    // Art Gallery (Warm classical gallery feel)
    { x: -18, y: 4.2, z:  14, color: 0xffecc0, intensity: 2.2, dist: 27 },
    { x: -18, y: 4.2, z:   0, color: 0xffecc0, intensity: 2.2, dist: 27 },
    // Historical Artifacts (Rich golden museum tone)
    { x:  18, y: 4.2, z:  14, color: 0xffe4b0, intensity: 2.2, dist: 27 },
    { x:  18, y: 4.2, z:   0, color: 0xffe4b0, intensity: 2.2, dist: 27 },
    // Science & Tech Wing (Cybernetic cyan / blue glow)
    { x: -14, y: 4.5, z: -17, color: 0x90d4ff, intensity: 2.3, dist: 30 },
    // Central Exhibition Hall (Celestial violet / pure white)
    { x:  14, y: 4.5, z: -17, color: 0xe0dcff, intensity: 2.3, dist: 30 },
  ];

  zonePointLights.forEach(pl => {
    const light = new THREE.PointLight(pl.color, pl.intensity, pl.dist, 1.25);
    light.position.set(pl.x, pl.y, pl.z);
    scene.add(light);
  });

  // Broad, low-intensity fill lights prevent corners and exhibit labels from crushing to black.
  [
    [-18, 5.2, 8, 0xffe7bf], [18, 5.2, 8, 0xffe7bf],
    [-14, 5.2, -17, 0xb9dcff], [14, 5.2, -17, 0xd5d0ff],
  ].forEach(([x, y, z, color]) => {
    const fill = new THREE.PointLight(color, 0.8, 24, 1.4);
    fill.position.set(x, y, z);
    scene.add(fill);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. FLOORS – Seamless Architectural Sections
  // ═══════════════════════════════════════════════════════════════════════════

  // Main Lobby Floor
  scene.add(createBox(20, 0.2, 14, mat.floorLobby, 0, -0.1, 15));

  // Central Atrium Floor
  scene.add(createBox(20, 0.2, 15, mat.floorAtrium, 0, -0.1, 0.5));

  // Art Gallery Floor (Hardwood Parquet)
  scene.add(createBox(16, 0.2, 30, mat.floorArt, -18, -0.1, 8));

  // History Gallery Floor (Ancient Travertine)
  scene.add(createBox(16, 0.2, 30, mat.floorHistory, 18, -0.1, 8));

  // Science & Technology Wing Floor (High-Tech Grid)
  scene.add(createBox(24, 0.2, 20, mat.floorScience, -14, -0.1, -17));

  // Central Exhibition Hall Floor (Celestial Marble)
  scene.add(createBox(24, 0.2, 20, mat.floorCentral, 14, -0.1, -17));

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. WALLS & DOORWAYS – Seamless Interconnected Floorplan
  // ═══════════════════════════════════════════════════════════════════════════

  // --- A. EXTERIOR BOUNDARY WALLS ---
  // North Outer Walls
  scene.add(createBox(20, wallH, wallT, mat.wallLobby, 0, wallH / 2, 22 + wallT / 2));     // Lobby North (Entrance)
  scene.add(createBox(16, wallH, wallT, mat.wallArt, -18, wallH / 2, 23 + wallT / 2));     // Art North
  scene.add(createBox(16, wallH, wallT, mat.wallHistory, 18, wallH / 2, 23 + wallT / 2));  // History North

  // West Outer Walls
  scene.add(createBox(wallT, wallH, 30, mat.wallArt, -26 - wallT / 2, wallH / 2, 8));     // Art West
  scene.add(createBox(wallT, wallH, 20, mat.wallScience, -26 - wallT / 2, wallH / 2, -17));// Science West

  // East Outer Walls
  scene.add(createBox(wallT, wallH, 30, mat.wallHistory, 26 + wallT / 2, wallH / 2, 8));   // History East
  scene.add(createBox(wallT, wallH, 20, mat.wallCentral, 26 + wallT / 2, wallH / 2, -17)); // Central Hall East

  // South Outer Walls (Back of Museum)
  scene.add(createBox(24, wallH, wallT, mat.wallScience, -14, wallH / 2, -27 - wallT / 2)); // Science South
  scene.add(createBox(24, wallH, wallT, mat.wallCentral, 14, wallH / 2, -27 - wallT / 2));  // Central Hall South

  // --- B. INTERIOR PARTITION WALLS & ARCHWAYS ---

  // 1. Divider Wall at x = -10 (Between Lobby/Atrium and Art Gallery)
  // Segments:
  // - North section (z: 18 to 22, length 4)
  scene.add(createBox(wallT, wallH, 4, mat.wallLobby, -10, wallH / 2, 20));
  // Archway 1: Lobby -> Art Gallery (z: 12 to 18, 6m wide opening)
  createArchway(scene, -10, 15, 6, 4.2, wallT, false, mat);
  // - Middle section (z: 5 to 12, length 7)
  scene.add(createBox(wallT, wallH, 7, mat.wallLobby, -10, wallH / 2, 8.5));
  // Archway 2: Central Atrium -> Art Gallery (z: -1 to 5, 6m wide opening)
  createArchway(scene, -10, 2, 6, 4.2, wallT, false, mat);
  // - South section (z: -7 to -1, length 6)
  scene.add(createBox(wallT, wallH, 6, mat.wallLobby, -10, wallH / 2, -4));

  // 2. Divider Wall at x = 10 (Between Lobby/Atrium and History Gallery)
  // Segments:
  // - North section (z: 18 to 22, length 4)
  scene.add(createBox(wallT, wallH, 4, mat.wallLobby, 10, wallH / 2, 20));
  // Archway 1: Lobby -> History Gallery (z: 12 to 18, 6m wide opening)
  createArchway(scene, 10, 15, 6, 4.2, wallT, false, mat);
  // - Middle section (z: 5 to 12, length 7)
  scene.add(createBox(wallT, wallH, 7, mat.wallLobby, 10, wallH / 2, 8.5));
  // Archway 2: Central Atrium -> History Gallery (z: -1 to 5, 6m wide opening)
  createArchway(scene, 10, 2, 6, 4.2, wallT, false, mat);
  // - South section (z: -7 to -1, length 6)
  scene.add(createBox(wallT, wallH, 6, mat.wallLobby, 10, wallH / 2, -4));

  // 3. Divider Wall at z = 8 (Between Lobby and Central Atrium)
  // Wide open colonnade passage in center (x: -6 to 6 is open, 12m wide!)
  // Left wing partition (x: -10 to -6, width 4)
  scene.add(createBox(4, wallH, wallT, mat.wallLobby, -8, wallH / 2, 8));
  // Right wing partition (x: 6 to 10, width 4)
  scene.add(createBox(4, wallH, wallT, mat.wallLobby, 8, wallH / 2, 8));
  // Overhead decorative arch lintel across center opening
  scene.add(createBox(12, 0.8, wallT * 1.2, mat.trimGold, 0, wallH - 0.4, 8));

  // 4. Divider Wall at z = -7 (Between Front Wings and Back Wings)
  // - Art to Science passage (x: -20 to -16 open, 4m wide)
  scene.add(createBox(6, wallH, wallT, mat.wallArt, -23, wallH / 2, -7)); // x: -26 to -20
  createArchway(scene, -18, -7, 4, 4.0, wallT, true, mat);
  scene.add(createBox(6, wallH, wallT, mat.wallArt, -13, wallH / 2, -7)); // x: -16 to -10

  // - Central Atrium to Science Wing passage (x: -8 to -2 open, 6m wide)
  scene.add(createBox(2, wallH, wallT, mat.wallCentral, -9, wallH / 2, -7));
  createArchway(scene, -5, -7, 6, 4.2, wallT, true, mat);
  scene.add(createBox(4, wallH, wallT, mat.wallCentral, 0, wallH / 2, -7)); // Center column

  // - Central Atrium to Central Exhibition Hall passage (x: 2 to 8 open, 6m wide)
  createArchway(scene, 5, -7, 6, 4.2, wallT, true, mat);
  scene.add(createBox(2, wallH, wallT, mat.wallCentral, 9, wallH / 2, -7));

  // - History to Central Exhibition passage (x: 16 to 20 open, 4m wide)
  scene.add(createBox(6, wallH, wallT, mat.wallHistory, 13, wallH / 2, -7));
  createArchway(scene, 18, -7, 4, 4.0, wallT, true, mat);
  scene.add(createBox(6, wallH, wallT, mat.wallHistory, 23, wallH / 2, -7));

  // 5. Dividing Wall at x = 0 (Between Science Wing and Central Exhibition Hall)
  // Wall from z: -27 to -7, with a grand archway at z: -19 to -13 (6m wide opening)
  scene.add(createBox(wallT, wallH, 8, mat.wallScience, 0, wallH / 2, -23)); // z: -27 to -19
  createArchway(scene, 0, -16, 6, 4.2, wallT, false, mat);
  scene.add(createBox(wallT, wallH, 6, mat.wallScience, 0, wallH / 2, -10)); // z: -13 to -7

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CEILINGS & SKYLIGHTS
  // ═══════════════════════════════════════════════════════════════════════════
  const ceilY = wallH + 0.15;

  // Lobby Ceiling (with central recessed opening for skylight glow)
  scene.add(createBox(20, 0.3, 14, mat.ceiling, 0, ceilY, 15));
  // Central Atrium Ceiling
  scene.add(createBox(20, 0.3, 15, mat.ceiling, 0, ceilY, 0.5));
  // Art Gallery Ceiling
  scene.add(createBox(16, 0.3, 30, mat.ceiling, -18, ceilY, 8));
  // History Gallery Ceiling
  scene.add(createBox(16, 0.3, 30, mat.ceiling, 18, ceilY, 8));
  // Science Wing Ceiling
  scene.add(createBox(24, 0.3, 20, mat.ceiling, -14, ceilY, -17));
  // Central Exhibition Hall Ceiling
  scene.add(createBox(24, 0.3, 20, mat.ceiling, 14, ceilY, -17));

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ARCHITECTURAL PILLARS & COLONNADES
  // ═══════════════════════════════════════════════════════════════════════════

  // Colonnade around the Lobby/Atrium boundary
  const colonnadePositions = [
    [-6, 8], [6, 8],
    [-6, 1], [6, 1],
    [-6, -6], [6, -6],
  ];
  colonnadePositions.forEach(([px, pz]) => {
    createPillar(scene, px, pz, wallH, mat);
  });

  // Pillars flanking the grand wing archways
  createPillar(scene, -9.5, 18.2, wallH, mat);
  createPillar(scene, -9.5, 11.8, wallH, mat);
  createPillar(scene,  9.5, 18.2, wallH, mat);
  createPillar(scene,  9.5, 11.8, wallH, mat);

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. MUSEUM BENCHES & FURNITURE
  // ═══════════════════════════════════════════════════════════════════════════

  // Lobby Benches
  createBench(scene, -4, 18, 0, mat);
  createBench(scene,  4, 18, 0, mat);

  // Art Gallery Viewing Benches
  createBench(scene, -18, 14, Math.PI / 2, mat);
  createBench(scene, -18, 2,  Math.PI / 2, mat);

  // History Gallery Viewing Benches
  createBench(scene, 18, 14, -Math.PI / 2, mat);
  createBench(scene, 18, 2,  -Math.PI / 2, mat);

  // Science Wing Modern Bench
  createBench(scene, -14, -10, 0, mat);

  // Central Exhibition Hall Bench
  createBench(scene, 14, -10, 0, mat);

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. DIRECTIONAL SIGNAGE & DIRECTORY BOARDS
  // ═══════════════════════════════════════════════════════════════════════════

  // Central Hub Directory (Atrium Crossroads)
  createDirectionSign(scene, ['ART GALLERY', '← WEST WING', 'Classical Masterpieces'], -5, 5, 0, mat);
  createDirectionSign(scene, ['HISTORY GALLERY', 'EAST WING →', 'Antiquities & Relics'], 5, 5, 0, mat);
  createDirectionSign(scene, ['SCIENCE & TECH', '↓ SOUTH-WEST', 'Physics, DNA & VR'], -5, -4, 0, mat);
  createDirectionSign(scene, ['EXHIBITION HALL', 'SOUTH-EAST ↓', 'Solar System & Pyramids'], 5, -4, 0, mat);

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. GRAND LOBBY WELCOME WALL & SDG 4 EDUCATIONAL DISPLAY
  // ═══════════════════════════════════════════════════════════════════════════

  // Grand Entrance Board on Lobby North Wall
  const lobbyBannerCanvas = document.createElement('canvas');
  lobbyBannerCanvas.width = 1024;
  lobbyBannerCanvas.height = 320;
  const lbctx = lobbyBannerCanvas.getContext('2d');

  lbctx.fillStyle = '#0d0b18';
  lbctx.fillRect(0, 0, 1024, 320);

  lbctx.strokeStyle = '#c9a84c';
  lbctx.lineWidth = 8;
  lbctx.strokeRect(10, 10, 1004, 300);

  lbctx.fillStyle = '#c9a84c';
  lbctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  lbctx.textAlign = 'center';
  lbctx.fillText('VIRTUAL REALITY MUSEUM', 512, 85);

  lbctx.fillStyle = '#f0ead8';
  lbctx.font = '28px "Inter", sans-serif';
  lbctx.fillText('Explore  •  Learn  •  Experience', 512, 145);

  lbctx.fillStyle = '#9e9683';
  lbctx.font = '20px "Inter", sans-serif';
  lbctx.fillText('WASD: Walk  |  Touchpad Drag: Look  |  Click: Inspect  |  P: Pause  |  G: Gallery Guide', 512, 210);

  lbctx.fillStyle = '#c9a84c';
  lbctx.font = 'italic 18px "Inter", sans-serif';
  lbctx.fillText('Foundations of Virtual Reality  •  CIAP Academic Project', 512, 265);

  const lobbyBannerTex = new THREE.CanvasTexture(lobbyBannerCanvas);
  lobbyBannerTex.colorSpace = THREE.SRGBColorSpace;
  lobbyBannerTex.anisotropy = 4;
  const lobbyBannerGroup = new THREE.Group();
  lobbyBannerGroup.position.set(0, 3.2, 21.9);
  lobbyBannerGroup.rotation.y = Math.PI;
  const lobbyBannerGeometry = new THREE.PlaneGeometry(8.0, 2.5);
  const lobbyBannerMaterial = new THREE.MeshBasicMaterial({
    map: lobbyBannerTex, toneMapped: false, side: THREE.FrontSide,
  });
  const lobbyBannerFront = new THREE.Mesh(lobbyBannerGeometry, lobbyBannerMaterial);
  lobbyBannerFront.position.z = 0.008;
  lobbyBannerGroup.add(lobbyBannerFront);
  const lobbyBannerBack = new THREE.Mesh(lobbyBannerGeometry, lobbyBannerMaterial);
  lobbyBannerBack.position.z = -0.008;
  lobbyBannerBack.rotation.y = Math.PI;
  lobbyBannerGroup.add(lobbyBannerBack);
  scene.add(lobbyBannerGroup);

  // SDG 4 Quality Education board. The old centre position overlapped the
  // solid divider column at z = -7, splitting the word UNITED and obscuring
  // the message. This position mounts it on the science wing's east wall,
  // clear of the doorway and fully visible from inside the science gallery.
  const sdgCanvas = document.createElement('canvas');
  sdgCanvas.width = 1200;
  sdgCanvas.height = 640;
  const sctx = sdgCanvas.getContext('2d');
  const sdgGradient = sctx.createLinearGradient(0, 0, 1200, 640);
  sdgGradient.addColorStop(0, '#0b2a21');
  sdgGradient.addColorStop(1, '#071813');
  sctx.fillStyle = sdgGradient;
  sctx.fillRect(0, 0, 1200, 640);
  sctx.strokeStyle = '#25b56a';
  sctx.lineWidth = 12;
  sctx.strokeRect(18, 18, 1164, 604);

  sctx.textAlign = 'center';
  sctx.fillStyle = '#a8e6c4';
  sctx.font = '600 30px Inter, Arial, sans-serif';
  sctx.fillText('UNITED NATIONS  •  SUSTAINABLE DEVELOPMENT GOALS', 600, 82);
  sctx.fillStyle = '#42d18a';
  sctx.font = 'bold 66px Georgia, serif';
  sctx.fillText('GOAL 4', 600, 180);
  sctx.fillStyle = '#f4f0df';
  sctx.font = 'bold 54px Inter, Arial, sans-serif';
  sctx.fillText('QUALITY EDUCATION', 600, 250);

  sctx.fillStyle = '#dce8df';
  sctx.font = '28px Inter, Arial, sans-serif';
  sctx.fillText('Ensure inclusive and equitable quality education', 600, 326);
  sctx.fillText('and promote lifelong learning opportunities for all.', 600, 368);

  sctx.strokeStyle = 'rgba(75, 195, 130, 0.5)';
  sctx.lineWidth = 2;
  sctx.beginPath(); sctx.moveTo(145, 415); sctx.lineTo(1055, 415); sctx.stroke();
  sctx.textAlign = 'left';
  sctx.fillStyle = '#a8e6c4';
  sctx.font = '24px Inter, Arial, sans-serif';
  sctx.fillText('•  VR learning can make museums accessible beyond physical distance.', 135, 472);
  sctx.fillText('•  Digital preservation helps protect and share cultural heritage.', 135, 520);
  sctx.fillText('•  Interactive simulations support active, self-paced learning.', 135, 568);

  const sdgTex = new THREE.CanvasTexture(sdgCanvas);
  sdgTex.colorSpace = THREE.SRGBColorSpace;
  sdgTex.anisotropy = 8;
  const sdgGroup = new THREE.Group();
  sdgGroup.position.set(-0.25, 3.15, -23);
  sdgGroup.rotation.y = -Math.PI / 2; // front faces into the science wing (-X)
  const sdgGeometry = new THREE.PlaneGeometry(5.5, 2.95);
  const sdgMaterial = new THREE.MeshBasicMaterial({ map: sdgTex, toneMapped: false, side: THREE.FrontSide });
  const sdgMesh = new THREE.Mesh(sdgGeometry, sdgMaterial);
  sdgMesh.position.z = 0.008;
  sdgGroup.add(sdgMesh);
  const sdgBack = new THREE.Mesh(sdgGeometry, new THREE.MeshBasicMaterial({ map: sdgTex, toneMapped: false, side: THREE.FrontSide }));
  sdgBack.position.z = -0.008;
  sdgBack.rotation.y = Math.PI;
  sdgGroup.add(sdgBack);
  scene.add(sdgGroup);

  const sdgSpot = new THREE.SpotLight(0xaaffcc, 2.0, 12, 0.6, 0.4, 1.5);
  sdgSpot.position.set(-4.0, 5.6, -23);
  aimSpotlightAt(scene, sdgSpot, sdgMesh);
}
