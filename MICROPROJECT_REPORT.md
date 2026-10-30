# CIAP MICROPROJECT REPORT
## VIRTUAL REALITY-BASED VIRTUAL MUSEUM EXPERIENCE

**Course:** Foundations of Virtual Reality  
**Class:** B.Tech9  
**Submitted By:** Hari Bait  
**Student Name:** Hari Bait  
**Roll Number:** [Roll Number Placeholder]  
**PRN:** [PRN Number Placeholder]  
**Department:** [Department of Computer Engineering / Information Technology]  
**College / Institution:** [College Name Placeholder]  
**Faculty / Mentor:** [Faculty / Mentor Name Placeholder]  
**Academic Year:** [2024–2025 / 2025–2026]  
**United Nations Sustainable Development Goal:** SDG 4 – Quality Education  

---

## CERTIFICATE OF COMPLETION

This is to certify that the CIAP Microproject entitled **"Virtual Reality-Based Virtual Museum Experience"** has been successfully completed and submitted by **Hari Bait** (Class: **B.Tech9**, Roll No.: **[Roll Number]**, PRN: **[PRN Number]**) in partial fulfillment of the academic requirements for the course **Foundations of Virtual Reality** during the Academic Year **[2024–2025 / 2025–2026]**.

The microproject represents a genuine and self-contained implementation of an interactive 3D virtual environment built using modern web-based graphics standards (HTML5 Canvas, CSS3, JavaScript ES Modules, and Three.js), addressing **United Nations Sustainable Development Goal 4 (SDG 4 – Quality Education)**.

**Date:** [Date of Submission]  
**Place:** [College Location]  

| _______________________ | _______________________ | _______________________ |
| :---: | :---: | :---: |
| **[Faculty Guide Name]** | **[HOD Name]** | **[Principal Name]** |
| Project Guide / Faculty | Head of Department | Principal / Director |
| Foundations of VR | [Department Name] | [College Name] |

---

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude and heartfelt appreciation to our esteemed course faculty and project mentor, **[Faculty Mentor Name]**, for their invaluable guidance, encouragement, constructive critiques, and continuous support throughout the conceptualization, development, and completion of this CIAP microproject on **"Virtual Reality-Based Virtual Museum Experience"**.

I extend my heartfelt thanks to **[Head of Department Name]**, Head of the **[Department Name]**, and our respected Principal, **[Principal Name]**, for providing state-of-the-art laboratory facilities, uninterrupted computing infrastructure, and an encouraging academic environment that fostered practical, project-based engineering learning.

I am also grateful to the open-source community, particularly the maintainers of the **Three.js** 3D graphics library and the **Khronos Group WebGL / WebXR** initiative, whose freely accessible documentation, specifications, and reference implementations made the development of this browser-based interactive 3D virtual environment possible.

Finally, I express my deepest gratitude to my parents, family, and peers in Class **B.Tech9** for their constant encouragement, insightful discussions during development testing, and moral support throughout the course of this microproject.

**Hari Bait**  
Class: B.Tech9  
Course: Foundations of Virtual Reality  

---

## ABSTRACT

The **"Virtual Reality-Based Virtual Museum Experience"** is an interactive, browser-based three-dimensional digital heritage and educational environment developed for the course *Foundations of Virtual Reality*. Traditional physical museums are constrained by geographical distance, admission fees, opening hours, physical accessibility limitations, and security glass barriers that prevent close-range interactive observation. This project eliminates those constraints by constructing a digital museum complex accessible through standard modern web browsers without requiring proprietary downloads, plugins, or external asset dependencies.

The application is engineered using **HTML5**, **CSS3**, **modular JavaScript (ES6)**, and **Three.js (r158)**. The virtual museum features six interconnected spatial wings: a Grand Main Lobby, a Central Atrium Hub, an Art Gallery (West Wing), a Historical Artifacts Gallery (East Wing), a Science and Technology Wing (South-West), and a Central Exhibition Hall (South-East). Users navigate the museum using a touchpad-first first-person camera (click-and-drag look without cursor capture), keyboard locomotion (WASD with sprint capabilities), real-time Axis-Aligned Bounding Box (AABB) collision handling, cursor-position raycasting for click/tap exhibit inspection, a quick gallery directory, and a dynamic HUD with a real-time mini-map.

Interactive inspection is driven by screen-center `Raycaster` mathematics that dynamically highlight 3D artifacts and historical paintings with emissive glows and trigger informational modals containing historical context, technical notes, and key facts. Audio immersion is synthesized entirely in real time using the `Web Audio API`, delivering procedural ambient room acoustics, physical footstep sounds, and modal chimes. The project is mapped directly to **United Nations Sustainable Development Goal 4 (SDG 4 – Quality Education)**, proving that spatial 3D and Virtual Reality principles can democratize equitable, immersive, and zero-cost cultural and scientific education for students worldwide.

*Keywords:* Virtual Reality, Three.js, WebGL, 3D Interactive Environment, Touchpad Navigation, Raycasting, Procedural Textures, Web Audio API, SDG 4 (Quality Education).

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
   - 1.1 Background of Virtual Reality
   - 1.2 Concept and Significance of Virtual Museums
   - 1.3 Purpose of the Project
2. [Problem Statement](#2-problem-statement)
3. [Objectives of the Project](#3-objectives-of-the-project)
4. [Existing System vs. Proposed System](#4-existing-system-vs-proposed-system)
   - 4.1 Analysis of the Existing System
   - 4.2 Features of the Proposed System
5. [Technologies Used](#5-technologies-used)
6. [System Requirements](#6-system-requirements)
   - 6.1 Hardware Requirements
   - 6.2 Software Requirements
7. [System Architecture & Project Workflow](#7-system-architecture--project-workflow)
   - 7.1 Architectural Block Diagram
   - 7.2 Application Flowchart
8. [Module Description](#8-module-description)
9. [Implementation Details](#9-implementation-details)
   - 9.1 3D Scene, Camera, and WebGL Pipeline
   - 9.2 Procedural Canvas Texture Generation
   - 9.3 First-Person Kinematics & AABB Collision System
   - 9.4 Raycasting Interaction & Emissive Feedback
   - 9.5 Procedural Web Audio Synthesis
10. [User Interface & Project Exhibits](#10-user-interface--project-exhibits)
11. [Testing & Verification](#11-testing--verification)
12. [Results and Discussion](#12-results-and-discussion)
13. [SDG Mapping (SDG 4 – Quality Education)](#13-sdg-mapping-sdg-4--quality-education)
14. [Advantages and Limitations](#14-advantages-and-limitations)
15. [Future Scope](#15-future-scope)
16. [Conclusion](#16-conclusion)
17. [References](#17-references)

---

## 1. INTRODUCTION

### 1.1 Background of Virtual Reality
Virtual Reality (VR) is a computer-generated simulation of a three-dimensional environment with which a person can interact in a seemingly real or physical manner. Unlike traditional flat screen interfaces that present information passively on a two-dimensional surface, VR technology immerses the user directly inside the digital environment. In VR systems, human sensory channels—predominantly vision and audition—are coupled dynamically to computer-rendered spatial representations. By recalculating the visual projection in real time as the user tilts, rotates, or translates their point of view, the system synthesizes visual immersion and spatial presence.

In modern engineering practice, Virtual Reality has evolved from specialized, cost-prohibitive head-mounted displays into standard web technologies through the Khronos Group's **WebGL (Web Graphics Library)** and **WebXR Device API** specifications. WebGL enables low-level direct access to the graphics processing unit (GPU) from standard web browsers via the HTML5 canvas element, eliminating third-party binary plugins. High-level JavaScript graphics abstractions, notably **Three.js**, have made it feasible to design complex architectural spaces, multi-source illumination models, and interactive kinematics that run efficiently on standard consumer hardware.

### 1.2 Concept and Significance of Virtual Museums
A **Virtual Museum** is an interactive digital entity that mirrors or augments the characteristics of a physical museum to provide access to historical, scientific, and cultural knowledge. While physical museums serve as vital centers of civilization, they face fundamental limitations. Physical collections are static, geographical travel is expensive, vulnerable historical artifacts degrade under atmospheric exposure, and crowded galleries restrict sustained observation.

A 3D virtual museum overcomes these barriers by transforming education from passive rote memorization into active, self-paced spatial exploration. In an immersive virtual museum, visitors can approach exhibits at close range, inspect artifacts from any angle, trigger interactive multi-tier educational descriptions, and transition seamlessly across different chronological eras and scientific domains—such as moving from the Italian High Renaissance directly into quantum physics and astronomical scale models.

### 1.3 Purpose of the Project
This microproject, completed for the course *Foundations of Virtual Reality*, designs, implements, and evaluates a fully functional, self-contained 3D Virtual Museum. The application is built from first principles using HTML5, CSS3, JavaScript (ES6 Modules), and Three.js. It requires zero external network-loaded 3D mesh files or third-party image hosting, synthesizing all textures, architectural structures, and audio procedurally in the browser. The system demonstrates the practical application of 3D transformation matrices, perspective projection, scene graph management, raycasting collision and selection mathematics, and procedural Web Audio synthesis within an engineering-grade educational framework.

---

## 2. PROBLEM STATEMENT

Access to high-quality cultural, artistic, and scientific museum exhibitions is inequitably distributed across the globe. Traditional physical museums require physical attendance, which imposes substantial economic costs, travel time, and logistical hurdles for students, particularly those in rural or underfunded educational institutions. Furthermore, physical museums are constrained by limited floor space, fixed operating hours, restrictive glass barriers around fragile artifacts, and lack of interactive multimedial feedback.

Conversely, conventional museum websites typically offer only two-dimensional, static photographic catalogues or non-interactive 360-degree panoramic photos (such as Google Street View imagery), which lack genuine depth perception, physical locomotion, spatial presence, and engaging interactive feedback.

Therefore, there is an acute educational need for a lightweight, accessible, zero-cost, and fully interactive **3D Virtual Museum environment** that operates directly within standard modern web browsers. Such an application must provide realistic first-person navigation, responsive collision boundaries, spatial exhibit inspection, rich educational contextualization, and integrated audio feedback without requiring high-end graphics hardware, paid software licenses, or complex installations.

---

## 3. OBJECTIVES OF THE PROJECT

The primary engineering and educational objectives of this microproject are:

1. **Architectural Environment Modeling:** To design and construct an interconnected, realistic six-zone 3D museum complex incorporating distinct flooring materials (polished marble, hardwood parquet, travertine stone, and high-tech grid), fluted classical colonnades, architectural archways, benches, and directional signboards.
2. **First-Person Locomotion and Controls:** To implement smooth first-person camera movement (WASD keyboard navigation and shift sprint) with touchpad click-and-drag camera look, cursor-based exhibit selection, and a stable 1.7-meter eye height.
3. **Axis-Aligned Bounding Box (AABB) Collision System:** To develop an independent multi-zone collision boundary algorithm that constrains the player within walkable gallery boundaries while allowing fluid wall-sliding motion.
4. **Interactive Raycasting & Emissive Feedback:** To implement real-time screen-center raycasting to detect hover focus over artifacts, visually highlighting target meshes through emissive shader modification and dynamic crosshair expansion.
5. **Multidisciplinary Educational Content:** To integrate 15 detailed exhibits spanning Art History, Ancient Archaeology, Quantum Physics, Molecular Biology, and Space Astronomy, accompanied by structured educational modal panels.
6. **Procedural Audio Synthesis:** To engineer a zero-dependency procedural audio engine using the `Web Audio API` that generates ambient room harmonics, dynamic footstep sounds, and interactive UI feedback chimes without external audio assets.
7. **Alignment with SDG 4 (Quality Education):** To demonstrate how spatial computing democratizes access to equitable, high-quality, and immersive learning resources.

---

## 4. EXISTING SYSTEM VS. PROPOSED SYSTEM

### 4.1 Analysis of the Existing System
Existing approaches to museum dissemination generally fall into two categories:
- **Physical Museums:** Offer irreplaceable physical authenticity but are geographically immobile, subject to entrance fees, closed outside scheduled hours, and often overcrowded. Visitors cannot touch exhibits or inspect artifacts closely due to velvet stanchions and protective vitrines.
- **Traditional Museum Websites & Digital Catalogues:** Present exhibits as 2D digital photographs alongside static blocks of HTML text. While accessible over the internet, they lack spatial dimensionality, depth cues, and exploration agency. The user acts as an observer flipping through an online catalogue rather than an active explorer discovering an exhibit space.
- **Panoramic 360-Degree Virtual Tours:** While providing photographic fidelity, pre-rendered 360-degree tours (such as Matterport scans) restrict the user to discrete "teleportation" jumps between fixed nodes. Users cannot move freely, inspect 3D geometry from custom vantage points, or experience real-time dynamic lighting and orbital physics.

### 4.2 Features of the Proposed System

| Feature Parameter | Existing Traditional / 2D Web Systems | Proposed 3D Virtual Museum |
| :--- | :--- | :--- |
| **Spatial Immersion** | Low; flat 2D layout or pre-rendered fixed panoramic nodes. | **High;** continuous 3D coordinate space with drag-based 360° camera look and real-time perspective rendering. |
| **User Locomotion** | None or discrete mouse clicking on pre-set waypoints. | **Continuous First-Person Navigation;** keyboard WASD movement with sprint and natural wall sliding. |
| **Exhibit Interaction** | Static page scroll or hyperlinked popups. | **Spatial Raycasting;** screen-center hovering, dynamic crosshair activation, emissive mesh glowing, and modal inspect. |
| **Audio Atmosphere** | Silent or loop-playback MP3 audio files prone to loading errors. | **Procedural Web Audio API;** synthesized room resonance, dynamic footsteps, and real-time interactive UI audio. |
| **Cost & Accessibility** | Physical visits cost money; heavy VR apps require proprietary software. | **100% Free & Open;** runs natively in any modern browser via standard WebGL/HTML5. |
| **Asset Dependencies** | Heavy external downloads susceptible to 404/CORS errors. | **Fully Procedural;** self-contained canvas textures and mathematical geometries. |

---

## 5. TECHNOLOGIES USED

The project is developed using modern, standards-compliant web technologies without external framework overhead:

- **HTML5 (HyperText Markup Language 5):** Provides the semantic backbone of the application. It hosts the `<canvas>` rendering context for Three.js, structures the Heads-Up Display (HUD), mini-map, modal dialogue boxes, help screens, and loading overlay. Additionally, hidden HTML5 2D canvas elements are utilized programmatically as procedural texture rendering surfaces.
- **CSS3 (Cascading Style Sheets 3):** Formats the user interface with an elegant contemporary museum visual aesthetic. Utilizes modern CSS variables, CSS grid and flexbox models, `backdrop-filter` blur effects for semi-transparent frosted HUD panels, custom keyframe animations (such as floating loading icons), and responsive modal styling.
- **JavaScript (ECMAScript 6+ / ES Modules):** Powers all client-side computational logic, split cleanly across modular scripts:
  - `main.js`: Master orchestrator, animation render loop, state management, and HUD mini-map canvas renderer.
  - `museum.js`: Architectural synthesis, wall geometry, floor zoning, lighting configuration, colonnades, and procedural texture generators.
  - `controls.js`: Event listener bindings, first-person kinematic calculations, and Axis-Aligned Bounding Box (AABB) collision checks.
  - `exhibits.js`: 3D exhibit modeling, procedural artwork canvas painting, pedestal generation, and comprehensive educational catalogue data.
  - `interaction.js`: Three.js `Raycaster` target evaluation, emissive highlight shader modification, dynamic crosshairs, and modal display handling.
  - `audio.js`: Synthesized audio engine using the browser's native `Web Audio API` (oscillators, biquad filters, and noise buffers).
- **Three.js (Release 158):** The industry-standard JavaScript 3D engine. Utilized for scene graph management, `PerspectiveCamera` projection, `WebGLRenderer` rasterization, PCF soft shadow mapping, ACES Filmic tone mapping, standard PBR materials (`MeshStandardMaterial`), and `PointerLockControls`.
- **WebGL (Web Graphics Library):** The underlying low-level browser API that executes hardware-accelerated vertex and fragment shaders on the visitor's local GPU.
- **WebXR Device API:** Included within `main.js` as an optional hardware abstraction layer that probes for connected immersive VR headsets (e.g., Oculus/Meta Quest or HTC Vive) via `navigator.xr.isSessionSupported('immersive-vr')`.

---

## 6. SYSTEM REQUIREMENTS

### 6.1 Hardware Requirements
- **Processor (CPU):** Dual-Core Intel Core i3 / AMD Ryzen 3 or equivalent (Quad-Core 2.0 GHz or higher recommended).
- **Random Access Memory (RAM):** Minimum 4 GB RAM (8 GB recommended; actual frame rate depends on GPU and browser).
- **Graphics Hardware (GPU):** Integrated Intel UHD Graphics 620 / AMD Radeon Vega or dedicated NVIDIA GeForce / AMD Radeon GPU supporting WebGL 2.0 and hardware-accelerated 3D rendering.
- **Input Peripherals:** Standard keyboard and laptop touchpad (or touchscreen); a physical mouse is not required for the default mode. Touchpad click-and-drag rotates the camera while the cursor remains visible.
- **Audio:** Standard audio output (speakers or headphones) for procedural Web Audio feedback.
- **Optional Hardware:** WebXR-compliant VR Headset (Meta Quest, Pico, or PC-tethered VR headset).

### 6.2 Software Requirements
- **Operating System:** Microsoft Windows 10/11, macOS, Linux, or ChromeOS.
- **Web Browser:** Any modern browser supporting WebGL and ES6 modules (Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, or Safari 15+).
- **Development Environment:** Visual Studio Code (VS Code) or any modern text editor.
- **Local Web Server:** Live Server extension for VS Code, Node.js `http-server`, or Python `python -m http.server` (required to serve JavaScript ES Modules without local file protocol CORS restrictions).

---

## 7. SYSTEM ARCHITECTURE & PROJECT WORKFLOW

### 7.1 Architectural Block Diagram

```
+-------------------------------------------------------------------------+
|       USER INPUT (WASD Locomotion & Touchpad Drag / 360° Look)          |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|          WEB BROWSER CLIENT (DOM Events, Canvas Context, Web Audio)      |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                     JAVASCRIPT MODULAR ENGINE                           |
|                                                                         |
| [Drag Look / Pointer Lock] [AABB Collision] [Raycaster] [Web Audio]   |
|   FPS Camera & Angles     Walkable Math      Screen Ray    Oscillators  |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                    THREE.JS 3D SCENE GRAPH                              |
|   • Camera (FOV 72°, Y=1.7m)          • Directional & Zone Lights       |
|   • Architectural Walls & Floors      • 15 Procedural Exhibits          |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                    HARDWARE-ACCELERATED WebGL RENDERER                  |
|    (PCF Soft Shadow Mapping, ACES Filmic Tone Mapping, sRGB Buffer)     |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                 SCREEN OUTPUT & HEADS-UP DISPLAY (HUD)                  |
|   (3D Canvas Viewport + Interactive Crosshair + Mini-Map Radar + Modals)|
+-------------------------------------------------------------------------+
```

### 7.2 Application Flowchart

```
[START: User Opens Application in Browser]
       │
       ▼
[Stage 1: Loading Screen Displayed]
       │──> Procedural Texture Canvas Synthesis (Marble, Parquet, Stone, Tech)
       │──> Three.js Scene, Camera, and WebGLRenderer Compilation
       │──> Architectural Walls, Floors, Pillars, and Spotlights Built
       │──> 15 Exhibit Meshes & Dynamic Plaques Constructed
       ▼
[Stage 2: Welcome Landing Screen]
       │──> Shows Title, SDG 4 Badge, Navigation Guide (WASD, Touchpad Drag, Click, P, G, F)
       │──> User clicks "Enter Virtual Museum" button (Explicit User Gesture)
       ▼
[Stage 3: Synchronous Activation]
       │──> Web Audio Context Initialized (SoundManager.init())
       │──> Touchpad-first controls activated; cursor remains visible
       │──> HUD Display, Crosshair, and Mini-map Activated
       ▼
[Stage 4: XR-Aware Three.js Animation Loop (device-dependent frame rate)]
       ├──> Delta Time Update (THREE.Clock)
       ├──> WASD Kinematic Step Calculation + AABB Collision Detection
       ├──> Dynamic Gallery Zone Detection (Triggers Transition Banners)
       ├──> Cursor-Position / Screen-Centre Raycasting (Tests Exhibit Intersection < 6.8m)
       ├──> Emissive Highlight / Scale Shader Feedback on Hovered Exhibit
       ├──> 2D Mini-Map Radar Redraw with View Direction Cone
       ├──> Continuous Celestial & Subatomic Rotations (Planets, Atom, DNA)
       └──> WebGLRenderer.render(scene, camera)
       │
       ├───────────────────────────────────────────┐
       ▼ [User Clicks / Taps Exhibit]             ▼ [User Presses 'P']
[Stage 5: Exhibit Modal Opened]             [Stage 6: Pause Screen Displayed]
       │──> Cursor Remains Available               │──> Walking Input Disabled
       │──> Chime Tone Played (audio.js)           │──> Resume Button / Press 'P'
       │──> Reads Title, Description, SDG Fact     │──> Keyboard Movement Resumes
       │──> Close Button / Click Backdrop          │
       └──> Return to Touchpad Exploration         └───────────────────────────┘
```

---

## 8. MODULE DESCRIPTION

### A. Museum Architectural Environment Module (`museum.js`)
- **Purpose:** Constructs the entire architectural shell of the museum, including floors, partition walls, archways, colonnade pillars, viewing benches, directional signboards, and multi-source lighting.
- **Working:** Employs procedural HTML5 Canvas texture generation (`createMarbleTexture`, `createParquetTexture`, `createStoneTexture`, `createTechFloorTexture`) that runs entirely client-side. Constructs 6 distinct interconnected gallery zones: Main Lobby, Central Atrium, Art Gallery, History Gallery, Science Wing, and Central Exhibition Hall.
- **Lighting Model:** Integrates warm ambient light (0.62 intensity), hemisphere sky/ground light (0.55 intensity), directional sunlight (1.0 intensity) with 1024² PCF soft shadows, and 8 zone-specific point lights plus broad fill lights and dedicated painting spotlights for dramatic museum illumination.

### B. Locomotion & Collision Module (`controls.js`)
- **Purpose:** Handles user navigation, velocity, sprint mode, touchpad camera look, and spatial collision constraints.
- **Working:** Uses Pointer Events for click-and-drag camera rotation by default, while preserving the `PointerLockControls` compatibility path. Movement is constrained by an array of Axis-Aligned Bounding Boxes (`WALKABLE_ZONES`). Evaluates X and Z displacement axes independently:
  ```javascript
  if (isPositionWalkable(nextX, camera.position.z)) camera.position.x = nextX;
  if (isPositionWalkable(camera.position.x, nextZ)) camera.position.z = nextZ;
  ```
  This independent axis testing prevents the player from becoming stuck when walking into walls at an angle, producing a natural wall-sliding effect. Altitude is locked at 1.7 meters.

### C. Exhibition Catalogue & 3D Modeling Module (`exhibits.js`)
- **Purpose:** Constructs the 15 3D interactive exhibits, procedural artwork canvases, gilded picture frames, display vitrines, and educational plaques.
- **Working:** Combines Three.js standard primitive geometries and procedural canvas textures to build:
  1. *Art Gallery:* Starry Night, Mona Lisa, Great Wave off Kanagawa, Girl with a Pearl Earring, Mondrian Composition.
  2. *History Gallery:* King Tutankhamun's Golden Sarcophagus in glass vitrine, Rosetta Stone with 3 script registers, Roman Bust of Augustus, Norse Viking Bearded Battle Axe.
  3. *Science Wing:* Bohr Quantum Atomic Model with 3 rotating electron shells, DNA Double Helix with 64 base rungs, Modern Spatial Computing VR Headset.
  4. *Central Hall & Atrium:* Planet Earth Globe with orbiting telecommunications satellite, Solar System Orrery with 6 orbiting planets, Great Pyramid of Giza.

### D. Interaction & Raycasting Module (`interaction.js`)
- **Purpose:** Manages cursor-position / screen-centre raycasting, hover highlights, selection feedback, and modal dialogue display.
- **Working:** Uses `THREE.Raycaster` through the cursor's normalized-device coordinates in touchpad mode (or the screen centre in pointer-lock mode). If an exhibit is detected within 6.8 meters, it displays a HUD prompt and activates a highlight. Clicking or tapping the exhibit, or pressing `E`, plays an audio chime and displays its metadata modal.

### E. Procedural Web Audio Engine (`audio.js`)
- **Purpose:** Delivers real-time procedural audio effects without external media files.
- **Working:** Uses browser `AudioContext` to generate:
  - *Ambient Room Resonance:* 55 Hz sine oscillator + 110 Hz triangle oscillator passed through a 220 Hz lowpass filter.
  - *Synthesized Footsteps:* 60ms white-noise buffer passed through an 800–1000 Hz lowpass filter with exponential gain decay.
  - *UI Chimes:* Two-tone arpeggiated sine sweeps (E5–B5 for opening, D5–A4 for closing).

### F. Master Orchestration & Mini-Map Module (`main.js`)
- **Purpose:** Orchestrates the render loop, handles browser resize, tracks gallery zones, and renders the 2D HUD radar.
- **Working:** Operates the Three.js animation loop via `renderer.setAnimationLoop`, tracks camera XZ coordinates against gallery boundary zones to display golden toast transitions, and draws a real-time mini-map onto `<canvas id="minimap-canvas">` with an orientation cone showing the player's line of sight.

---

## 9. IMPLEMENTATION DETAILS

### 9.1 Three.js Scene, Camera, and WebGL Pipeline
The rendering pipeline is configured with ACES Filmic tone mapping and PCF soft shadow maps to achieve photographic lighting realism:

```javascript
// Master Scene Setup (js/main.js)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0914);
scene.fog = new THREE.Fog(0x0a0914, 28, 75);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

### 9.2 Procedural Canvas Texture Generation
Textures are synthesized in off-screen HTML5 canvases and converted into `THREE.CanvasTexture` objects with repeat wrapping, eliminating network latency and CORS errors:

```javascript
// Procedural Parquet Hardwood Generator (js/museum.js)
function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#3a2312';
  ctx.fillRect(0, 0, 512, 512);

  const plankW = 64, plankH = 16;
  const woodTones = ['#452b16', '#3e2614', '#4b3019', '#351f0f', '#52341b'];
  for (let y = 0; y < 512; y += plankH) {
    for (let x = 0; x < 512; x += plankW) {
      ctx.fillStyle = woodTones[(x / plankW + y / plankH) % woodTones.length];
      ctx.fillRect(x + 1, y + 1, plankW - 2, plankH - 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
```

### 9.3 Raycasting & Emissive Selection
Screen-center raycasting evaluates distance and modifies mesh materials dynamically:

```javascript
// Screen-Center Raycast Evaluation (js/interaction.js)
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
const hits = raycaster.intersectObjects(exhibitList, false);

if (hits.length > 0 && hits[0].distance < 6.8) {
  const hitObj = hits[0].object;
  // Apply warm emissive highlight
  if (hitObj.material && hitObj.material.emissive) {
    hitObj.material.emissive.set(0x664411);
    hitObj.material.emissiveIntensity = 1.2;
  }
}
```

---

## 10. USER INTERFACE & PROJECT SCREENSHOTS

The user interface combines a high-performance WebGL 3D canvas viewport with an unobtrusive, responsive 2D Heads-Up Display (HUD). The following figures are baseline screenshots included with the original repository. They predate the lighting and touchpad-control changes in this upgraded build; recapture these figures from the updated application before using them as evidence of the new visual presentation:

### Figure 10.1: Welcome Landing Screen & User Control Guide
![Figure 10.1: Welcome Landing Screen](assets/images/screenshot_1_welcome.png)  
*Figure 10.1: The welcome screen provides the entry portal to the virtual museum, displaying the CIAP project metadata, UN SDG 4 badge, and navigation key bindings prior to entering first-person mode.*

### Figure 10.2: First-Person View of Main Entrance Lobby & Colonnades
![Figure 10.2: Main Entrance Lobby](assets/images/screenshot_2_lobby.png)  
*Figure 10.2: The visitor enters the Grand Lobby facing the central corridor, featuring polished marble floors with procedural veining, fluted classical pillars, and the overhead welcome directory banner.*

### Figure 10.3: Central Atrium Hub & Planetary Earth Showcase
![Figure 10.3: Central Atrium & Earth Showcase](assets/images/screenshot_3_atrium.png)  
*Figure 10.3: The central connecting crossroads showcases the rotating procedural Earth globe with an orbiting satellite, directional wing signboards, and the United Nations SDG 4 educational feature board.*

### Figure 10.4: Classical Art Gallery Wing (West Wing)
![Figure 10.4: Classical Art Gallery](assets/images/screenshot_4_art_gallery.png)  
*Figure 10.4: The Art Gallery features warm herringbone parquet flooring, multi-tiered gilded frames (housing Van Gogh's Starry Night and Da Vinci's Mona Lisa), overhead brass picture lamps, and dedicated wall spotlights.*

### Figure 10.5: Historical Artifacts Gallery (East Wing)
![Figure 10.5: Historical Artifacts Gallery](assets/images/screenshot_5_history_gallery.png)  
*Figure 10.5: Ancient travertine stone floors support museum display pedestals showcasing King Tutankhamun's golden sarcophagus inside a transparent vitrine, the Rosetta Stone, Roman Bust of Augustus, and Viking relics.*

### Figure 10.6: Science & Technology Wing (South-West)
![Figure 10.6: Science & Technology Wing](assets/images/screenshot_6_science_wing.png)  
*Figure 10.6: The high-tech gallery features a cybernetic floor grid with glowing seams, exhibiting the Bohr quantum atom model with 3 electron orbits, the twisting DNA double helix, and a modern spatial computing VR headset.*

### Figure 10.7: Central Exhibition Hall (South-East)
![Figure 10.7: Central Exhibition Hall](assets/images/screenshot_7_exhibition_hall.png)  
*Figure 10.7: The astronomical exhibition hall features the dynamic Solar System Orrery with 6 orbiting planets and orbital tracks, alongside the monumental five-tiered Great Pyramid of Giza topped with a golden pyramidion.*

### Figure 10.8: Interactive Exhibit Information Modal Dialogue
![Figure 10.8: Interactive Exhibit Information Modal Dialogue](assets/images/screenshot_8_info_modal.png)  
*Figure 10.8: Upon inspecting an exhibit, a structured dialogue presents the exhibit category, historical and technical context, key takeaway facts, and specific SDG 4 educational connections.*

### Figure 10.9: Museum Guide & Exploration Controls Reference Overlay
![Figure 10.9: Museum Guide & Exploration Controls Reference Overlay](assets/images/screenshot_9_help_guide.png)  
*Figure 10.9: Accessible via the HUD help button, this comprehensive overlay provides visitors with an on-demand controls reference table, gallery wing descriptions, and SDG 4 pedagogical goals.*

---

## 11. TESTING & VERIFICATION

| Test ID | Feature Under Test | Test Procedure | Expected Result | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Application Boot | Launch `index.html` via local web server. | Loading bar reaches 100%; textures compile without errors. | **PASSED** |
| **TC-02** | Enter Touchpad Navigation | Click "Enter Virtual Museum" button. | HUD activates; cursor remains visible; touchpad drag and keyboard controls are available. | **IMPLEMENTED — VERIFY LOCALLY** |
| **TC-03** | Keyboard Locomotion | Press W, A, S, D and Arrow keys. | Camera moves forward, left, back, and right at 5.5 m/s. | **PASSED** |
| **TC-04** | Sprint Mode | Hold `Shift` while moving forward. | Speed increases from 5.5 m/s to 8.5 m/s; footsteps accelerate. | **PASSED** |
| **TC-05** | Collision Handling | Walk directly into walls and columns. | Camera stops at boundary; sliding occurs smoothly along walls. | **PASSED** |
| **TC-06** | Raycast Hover Detection | Move the cursor over exhibits within 6.8m. | Target mesh highlights; a contextual inspection prompt displays near the bottom of the view. | **PASSED** |
| **TC-07** | Exhibit Modal | Click / tap an exhibit or press `E` while hovering. | Cursor-position raycast selects exhibit; modal opens with details; chime plays. | **IMPLEMENTED — VERIFY LOCALLY** |
| **TC-08** | Zone Transitions | Walk through archways between gallery wings. | Current gallery badge updates; golden transition banner animates. | **PASSED** |
| **TC-09** | Mini-Map Radar | Walk and look around while observing radar. | Player beacon tracks position; orientation cone tracks view angle. | **PASSED** |
| **TC-10** | Procedural Audio | Toggle audio button on HUD and move. | Ambient drone and footsteps mute/unmute cleanly without distortion. | **PASSED** |
| **TC-11** | Pause / Resume | Press `P`, then click Resume. | Pause overlay displays and movement resumes without pointer lock. | **IMPLEMENTED — VERIFY LOCALLY** |
| **TC-12** | Responsive Resize | Resize browser window to various resolutions. | Aspect ratio adjusts; 3D viewport rescales without distortion. | **PASSED** |

---

## 12. RESULTS AND DISCUSSION

### 12.1 Performance Metrics
Museum artwork and several environmental textures are generated locally, while Three.js and Google Fonts are loaded from CDNs. Frame rate and memory usage depend on the target device, browser, and resolution. The numerical benchmarks in the original report were not independently reproduced for this upgraded build; measure on the target laptop before presenting specific values.

| Hardware Configuration | Screen Resolution | Average FPS | Memory Footprint | Shadow Quality |
| :--- | :---: | :---: | :---: | :---: |
| Target laptop (record exact CPU / GPU) | Record actual resolution | Record using HUD FPS counter | Measure with browser tools | 1024² PCF soft shadows |

### 12.2 Immersion and Educational Value
The combination of human eye-level camera height (1.7m), natural movement physics, wall-sliding collision handling, and procedural sound creates a convincing sense of architectural presence. The ability to seamlessly explore art, archaeology, quantum physics, and astronomy in one unified environment demonstrates the potential of virtual environments to support interdisciplinary STEAM education.

---

## 13. SDG MAPPING (SDG 4 – QUALITY EDUCATION)

> **UN SDG Goal 4: Quality Education**  
> *"Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all."*

This microproject directly advances the objectives of **UN SDG 4** through the following mechanisms:

1. **Democratizing Access to Global Heritage:** Traditional physical museum visits to institutions like the Louvre, the British Museum, or the Met are financially impossible for most students globally. This project brings digital representations of world heritage directly into any classroom for free.
2. **Promoting Interdisciplinary STEAM Learning:** The museum curates exhibits across art, archaeology, atomic physics, genetics, and cosmology, fostering well-rounded cross-disciplinary thinking.
3. **Enhancing Cognitive Retention:** Cognitive science demonstrates that active spatial discovery produces superior information retention compared to passive 2D reading. Navigating through 3D space anchors educational knowledge in spatial memory.
4. **Self-Paced and Inclusive Exploration:** Visitors can explore at their own pace without crowd pressure, inspecting artifacts and reading structured takeaway facts.
5. **Zero Hardware Barriers:** By running natively in standard web browsers without requiring expensive VR headsets or specialized GPUs, the project avoids the digital divide and provides truly equitable access.

---

## 14. ADVANTAGES AND LIMITATIONS

### 14.1 Advantages
- **Locally Generated Content:** Procedural canvas textures and audio reduce external asset dependencies. Three.js and Google Fonts are delivered through CDNs and require internet access.
- **Cross-Platform Compatibility:** Runs seamlessly on Windows, macOS, Linux, and ChromeOS in any modern web browser.
- **Ultra-Lightweight Footprint:** Instantaneous initial load time over modest network connections (< 2 MB code footprint).
- **Smooth Kinematics:** Independent-axis AABB collision prevents camera snagging and enables natural wall sliding.
- **Procedural Audio Feedback:** Native Web Audio synthesis provides ambient room resonance, footsteps, and UI chimes.
- **Comprehensive Educational Context:** Every exhibit includes historical context, technical notes, facts, and SDG 4 mappings.

### 14.2 Limitations
- **Procedural Geometric Approximations:** Complex artifacts (e.g., Tutankhamun's sarcophagus or the Roman bust) are constructed from primitive geometric combinations rather than ultra-high-resolution photogrammetric 3D scans.
- **Single-User Experience:** Does not currently feature multi-user networked avatars for collaborative group tours.
- **Absence of Spoken Audio Narration:** Relies on text-based informational modals rather than spoken voiceover audio tours.
- **Input Requirements:** Keyboard locomotion is still based on WASD / arrow keys. Touchscreen users can look and inspect by touch; an on-screen joystick would be a future improvement for mobile walking.

---

## 15. FUTURE SCOPE

The modular architecture of this project provides a solid foundation for future enhancements:
1. **Photogrammetric 3D Asset Integration:** Incorporating high-fidelity GLTF/GLB models scanned via LiDAR to present artifacts with millimeter-level accuracy.
2. **Multiplayer Guided Classrooms:** Integrating WebSockets or WebRTC to allow teachers to guide groups of student avatars with synchronized voice chat.
3. **Multilingual Speech Synthesis:** Leveraging the Web Speech Synthesis API to provide spoken audio guides in multiple languages.
4. **Conversational AI Museum Docent:** Embedding a large-language-model virtual guide to answer visitors' questions interactively in real time.
5. **Mobile Touchscreen Controls:** Adding on-screen virtual joysticks and device orientation sensor support for smartphones and tablets.
6. **New Exhibition Wings:** Adding dedicated wings for Paleontology, Marine Biology, and Renewable Energy Technologies.

---

## 16. CONCLUSION

The **"Virtual Reality-Based Virtual Museum Experience"** successfully demonstrates how modern web-based 3D graphics technologies can create an engaging, accessible, and pedagogically rich educational environment. Developed for the course *Foundations of Virtual Reality*, the microproject synthesizes computer graphics theory—including perspective camera transformations, scene graph hierarchy, multi-light illumination, procedural canvas texturing, axis-aligned bounding box collision kinematics, screen-center raycasting, and Web Audio API synthesis—into a cohesive, functional system.

By eliminating heavy external 3D asset downloads, proprietary plugins, and expensive hardware requirements, the project embodies the core ideals of **United Nations Sustainable Development Goal 4 (SDG 4 – Quality Education)**: breaking down geographical, physical, and financial barriers to bring world-class cultural, artistic, and scientific exhibitions directly to students worldwide. The resulting application serves as a practical, submission-ready testament to the transformative potential of Virtual Reality in modern engineering and democratic education.

---

## 17. REFERENCES

1. **Three.js Documentation and Reference Manual (r158):**  
   Cabello, R. (Mr.doob) et al. Three.js JavaScript 3D Library.  
   URL: [https://threejs.org/docs/](https://threejs.org/docs/) (Accessed October 2024).
2. **MDN Web Docs – WebGL: 2D and 3D Graphics for the Web:**  
   Mozilla Developer Network (MDN). WebGL API Architecture and Pipeline Specifications.  
   URL: [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).
3. **MDN Web Docs – Web Audio API:**  
   Mozilla Developer Network (MDN). AudioContext, OscillatorNode, and BiquadFilterNode Specifications.  
   URL: [https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).
4. **W3C Pointer Lock API Specification:**  
   World Wide Web Consortium (W3C). Pointer Lock 2.0 Recommendation.  
   URL: [https://www.w3.org/TR/pointerlock-2/](https://www.w3.org/TR/pointerlock-2/).
5. **United Nations Sustainable Development Goals – Goal 4: Quality Education:**  
   United Nations Department of Economic and Social Affairs (UNDESA). Sustainable Development Goal 4 Targets and Indicators.  
   URL: [https://sdgs.un.org/goals/goal4](https://sdgs.un.org/goals/goal4).
6. **Foundations of Virtual Reality – Course Curriculum and Pedagogical Guidelines:**  
   Department of Computer Engineering, Academic Year 2024–2025.

