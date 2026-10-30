# 🏛️ Virtual Reality-Based Virtual Museum Experience

**Course:** Foundations of Virtual Reality  
**Project Category:** CIAP (Course Integrated Application Project)  
**Tech Stack:** HTML5 · CSS3 · Modern JavaScript (ES6 Modules) · Three.js (r158) · WebGL · Web Audio API · WebXR  
**SDG Alignment:** UN Sustainable Development Goal 4 (Quality Education)  

---

## Quick Start — How to Run the Project

You can run the project using **any** of the following simple methods. Because the project uses modern JavaScript ES Modules (`import / export`), it must be served through a local HTTP server rather than opening `file:///` directly.

### Method 1: VS Code "Live Server" Extension (Recommended & Easiest)
1. Open Visual Studio Code.
2. If you don't already have it, install the extension **"Live Server"** (by *Ritwick Dey*).
3. In VS Code, click **File → Open Folder...** and select the extracted project folder — the folder that directly contains `index.html`, `css/`, and `js/`.
4. In the left file explorer, right-click **`index.html`** and select **"Open with Live Server"** (or click **"Go Live"** in the bottom-right status bar).
5. Your default browser will immediately open `http://127.0.0.1:5500/` with the museum running!

---

### Method 2: Python HTTP Server (Built into Python)
1. Open PowerShell or Command Prompt.
2. Navigate to the project directory:
   ```powershell
   cd path\to\your\extracted\arvr-main
   ```
3. Start the built-in HTTP server:
   ```powershell
   python -m http.server 8000
   ```
4. Open your browser and go to:
   [http://localhost:8000](http://localhost:8000)

---

### Method 3: Node.js (npx or http-server)
1. Open PowerShell in the project directory:
   ```powershell
   cd path\to\your\extracted\arvr-main
   ```
2. Run any static server:
   ```powershell
   npx serve .
   ```
   *or*
   ```powershell
   npx http-server -p 8000
   ```
3. Open the link displayed in your terminal (usually `http://localhost:3000` or `http://localhost:8000`).

---

## Exploration Controls (Touchpad-Friendly)

The default mode keeps the cursor visible and does **not** require a physical mouse or browser pointer lock.

| Control | Action |
|---|---|
| **W / A / S / D** or arrow keys | Walk forward / left / backward / right |
| **Shift** (hold) | Sprint |
| **Touchpad click + drag** | Look around; drag on the 3D view to rotate the camera |
| **Click / tap an exhibit** | Open its educational information panel |
| **E** | Inspect the exhibit currently under the pointer |
| **P** | Pause / resume walking |
| **G** | Open the gallery directory and jump directly to a wing |
| **F** or Fullscreen button | Enter / exit fullscreen |
| **Sound** button | Toggle ambient audio and footsteps |
| **?** button | Open the controls and gallery guide |

### Run locally

1. Open the project folder in VS Code (the folder containing `index.html`).
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Click **Enter Virtual Museum**. Use the touchpad drag and keyboard controls described above.

Alternatively, run `py -m http.server 8000` in the project folder and visit `http://localhost:8000`.

No `npm install`, build step, or Node.js runtime is required for the museum experience. Three.js is loaded from its pinned CDN import map, so an internet connection is required when the page first loads.

---

## 🏛️ Comprehensive Project Report & Viva Preparation Guide

### 1. Project Title
**Virtual Reality-Based Virtual Museum Experience**  
An interactive, browser-native 3D virtual museum designed to provide students, researchers, and cultural enthusiasts with an immersive educational journey across art, ancient history, and modern science.

---

### 2. Problem Statement
Physical museum visits face fundamental real-world constraints:
- **Geographic Isolation:** Billions of students live far from major metropolitan cultural centers (e.g., Louvre, British Museum, MoMA).
- **Economic Barriers:** Travel costs, museum entry tickets, and lodging make educational field trips cost-prohibitive for underprivileged schools.
- **Physical Accessibility:** Persons with disabilities often encounter physical architectural barriers in historic heritage buildings.
- **2D Web Limitations:** Traditional museum websites consist of static flat 2D image grids and text, which fail to deliver spatial intuition, sense of scale, or experiential engagement.

---

### 3. Objective
1. To engineer a full-fledged, real-time 3D virtual environment operating smoothly in standard web browsers.
2. To build an architectural museum space featuring **6 distinct, interconnected museum zones** with realistic architectural moldings, fluted columns, procedural floors, and museum lighting.
3. To implement touchpad-first first-person navigation with click-and-drag camera look, keyboard locomotion, optional pointer-lock compatibility, and collision detection.
4. To integrate **15 curated interactive exhibits** spanning fine art, archaeology, quantum physics, celestial mechanics, and spatial computing.
5. To develop procedural canvas textures and Web Audio API synthesizers to generate exhibit artwork, signage, and floor textures locally without external image-file dependencies. The Three.js engine and web fonts are loaded from CDNs and therefore require internet access.
6. To directly champion **United Nations SDG 4 (Quality Education)** by demonstrating how WebXR and Three.js democratize cultural and scientific learning.

---

### 4. Proposed Solution
A modern Single Page Application (SPA) utilizing:
- **WebGL via Three.js (r158):** Hardware-accelerated browser rendering. Actual frame rate depends on the visitor’s GPU, browser, resolution, and device power settings.
- **Physically Based Rendering (PBR):** `MeshStandardMaterial` with roughness, metalness, and bump characteristics modeling marble, oak parquet, limestone, glass, and gold leaf.
- **Dynamic Raycasting (`THREE.Raycaster`):** Cursor-position raycasting in touchpad mode (and centre-screen raycasting in pointer-lock compatibility mode) detects interactive exhibits within 6.8 meters and drives hover highlighting and inspection prompts.
- **Interactive Modals:** Detailed glassmorphism educational dialogs with historical context, technical breakthroughs, and "Did You Know?" facts.
- **Procedural Audio Synthesizer:** Real-time Web Audio API oscillators and noise buffers generating ambient room reverb, marble footstep echoes, and UI chimes with zero external audio files.
- **HUD Mini-Map Radar:** Real-time 2D canvas radar tracking visitor coordinates and viewing direction across all wings.

---

### 5. Technologies Used
- **HTML5:** Semantic document structure, modal dialogs, and HTML5 Canvas API for real-time texture generation.
- **CSS3:** Custom properties (CSS variables), glassmorphism (`backdrop-filter`), responsive typography (`clamp`), and smooth UI keyframe animations.
- **JavaScript (ES6 Modules):** Modular object-oriented architecture (`main.js`, `museum.js`, `controls.js`, `exhibits.js`, `interaction.js`, `audio.js`).
- **Three.js (r158):** Industry-standard 3D WebGL library.
- **Touchpad-first camera controls:** Pointer Events map click-and-drag movement to camera yaw and pitch, keeping the cursor visible. `PointerLockControls` remains available as an optional compatibility path.
- **Web Audio API:** OscillatorNodes, BiquadFilterNodes, and GainNodes synthesizing procedural spatial audio.
- **WebXR Device API:** Native VR session support for Oculus/Meta Quest headsets.

---

### 6. Why Three.js Was Selected
1. **Zero Client Installation:** Operates instantly inside Google Chrome, Microsoft Edge, Firefox, and Safari without software downloads or browser extensions.
2. **WebGL Abstraction:** Eliminates thousands of lines of low-level GLSL shader boilerplate while providing complete control over buffers, materials, and lighting.
3. **Cross-Platform Compatibility:** Runs equally well across Windows, macOS, Linux, and ChromeOS.
4. **Active Ecosystem:** Robust add-ons including `PointerLockControls`, `WebXRManager`, and post-processing tone mappers.
5. **No Backend or Database Overhead:** All calculations and rendering occur client-side, making it lightning fast and simple to deploy.

---

### 7. How Three.js Works in This Project
The application establishes a continuous execution pipeline:
```
Index.html
    │
    ▼
main.js (Initializes Scene, Camera, WebGLRenderer, Clock)
    ├── museum.js    ──> Generates 3D architecture, floors, walls, and lighting
    ├── exhibits.js  ──> Builds 15 3D artifacts, paintings, and labels
    ├── controls.js  ──> Processes WASD keyboard input & enforces collision bounds
    ├── interaction.js ──> Fires a ray from the cursor position to detect hovered exhibits in touchpad mode
    └── audio.js     ──> Synthesizes footstep audio and ambient room acoustics
    │
    ▼
Three.js Animation Loop (standard display or XR session; frame rate depends on device)
    ├── Update camera position with delta-time smoothing
    ├── Test AABB collision bounds with wall-sliding physics
    ├── Update rotating celestial/atomic animations
    ├── Check raycaster intersections and update crosshair
    ├── Draw mini-map radar with visitor position beacon
    └── renderer.render(scene, camera)
```

---

### 8. What is a 3D Scene?
In Three.js, a `THREE.Scene` represents the root container of the scene graph — a hierarchical tree structure where all 3D entities reside (meshes, groups, lights, cameras). Every element possesses a local transformation matrix containing `position (x, y, z)`, `rotation (Euler / Quaternion)`, and `scale (x, y, z)`. Transforming a parent node automatically cascades down to all child objects.

---

### 9. Camera Architecture
The project employs a `THREE.PerspectiveCamera` designed to mimic natural human vision:
- **Field of View (FOV):** 72° — optimized for natural peripheral awareness without wide-angle fish-eye distortion.
- **Aspect Ratio:** `window.innerWidth / window.innerHeight` (dynamically updated on window resize).
- **Near Clipping Plane:** 0.1 meters — objects closer than 10 cm are clipped to prevent near-surface visual tearing.
- **Far Clipping Plane:** 140 meters — balanced with `scene.fog` (starting at 82m and reaching full density at 145m) to reduce GPU draw calls and enhance atmospheric museum depth.
- **Eye Height:** Locked at 1.7 meters (average human eye level).

---

### 10. WebGLRenderer & Display Pipeline
The `THREE.WebGLRenderer` compiles 3D geometry into 2D rasterized screen pixels:
- **Antialiasing (`antialias: true`):** Employs Multi-Sample Anti-Aliasing (MSAA) for crisp edges on paintings and columns.
- **Shadow Mapping (`PCFSoftShadowMap`):** Percentage-Closer Soft Shadows for realistic penumbra under pedestals.
- **Tone Mapping (`ACESFilmicToneMapping`):** Academy Color Encoding System tone reproduction mimicking cinematic film exposure.
- **Color Space (`THREE.SRGBColorSpace`):** True-to-life sRGB gamma correction for painting pigments and gilded frames.
- **Pixel Ratio:** Capped at `Math.min(window.devicePixelRatio, 1.75)` to deliver razor-sharp graphics on Retina/4K screens without GPU overheating.

---

### 11. Museum Lighting Design
Real museums use layered illumination to highlight masterpieces and guide visitor circulation:
1. **Ambient Light (`0xfff7ed`, 0.62 intensity):** Warm diffused base fill preventing harsh pitch-black shadows.
2. **Hemisphere Light (`0xe5efff` sky, `0x87745d` ground, 0.55 intensity):** Models atmospheric bounce light between skylights and polished marble floors.
3. **Directional Sunbeam (`0xfff7e8`, 1.0 intensity):** Casts clean architectural shadows from the central skylight.
4. **Zone-Specific Point Lights:**
   - Art & History Wings: Warm golden illumination (`0xffecc0`, 3000K).
   - Science Wing: Cool futuristic cyan/blue glow (`0x90d4ff`, 6500K).
5. **Focused Exhibit Spotlights (`THREE.SpotLight`):** Tight directional beams (35° cone, soft penumbra) aimed at every painting, sarcophagus, and pedestal.

---

### 12. Raycasting & Interactive Hit Detection
`THREE.Raycaster` calculates intersections between 3D objects and an invisible mathematical ray:
```javascript
// Cast ray straight through the viewport center (crosshair)
raycaster.setFromCamera(pointerNDC, camera); // cursor position in touchpad mode
const intersects = raycaster.intersectObjects(exhibitObjects, false);

if (intersects.length > 0 && intersects[0].distance < 6.8) {
  // Visitor is actively looking at an exhibit within range!
  highlightExhibit(intersects[0].object);
  showPrompt(intersects[0].object.userData.exhibitData.title);
}
```
When hovering an exhibit, its material's `emissive` color is boosted and the crosshair expands. Pressing <kbd>E</kbd> or left-clicking triggers the educational modal.

---

### 13. Touchpad-First View Control
The default mode keeps the cursor visible and does not request browser pointer lock. Pointer Events convert a touchpad click-and-drag gesture into camera yaw and pitch; the raycaster follows the cursor so visitors can click or tap an exhibit directly. Keyboard WASD / arrow movement remains active. The `PointerLockControls` dependency remains in the project for future optional immersive-mode work, but is not required by the default experience.

---

### 14. Procedural Textures & Materials
Rather than relying on risky external image URLs that can fail, expire, or trigger CORS errors, museum floor, signage, and artwork textures are synthesized on-the-fly using the HTML5 Canvas 2D API:
- **Lobby & Atrium Floor:** Polished Italian Carrera marble with randomized crystalline veins and gold geometric borders.
- **Art Gallery Floor:** Hardwood herringbone oak parquet with individual plank tones and fine wood grain lines.
- **History Gallery Floor:** Porous Roman travertine limestone slabs with weathered joints.
- **Science Wing Floor:** Dark slate composite tiles with glowing cyan cybernetic circuit lines.
- **Paintings:** Multi-layer procedural canvas art (Van Gogh's swirling night sky, Mona Lisa's sfumato tones, Hokusai's foaming wave crests, Vermeer's luminous pearl, Mondrian's De Stijl grids).

---

### 15. 3D Exhibit Models
The museum contains **15 distinct interactive exhibits**:
- **Art Gallery:**
  1. *The Starry Night* (Vincent van Gogh, 1889)
  2. *Mona Lisa (La Gioconda)* (Leonardo da Vinci, 1503)
  3. *The Great Wave off Kanagawa* (Katsushika Hokusai, 1831)
  4. *Girl with a Pearl Earring* (Johannes Vermeer, 1665)
  5. *Composition with Red, Blue, and Yellow* (Piet Mondrian, 1930)
- **Historical Artifacts Gallery:**
  6. *Egyptian Golden Sarcophagus* of Tutankhamun with lapis lazuli bands and crook & flail.
  7. *The Rosetta Stone* with 3 distinct engraved scripts on granodiorite slab.
  8. *Roman Imperial Bust of Emperor Augustus* in carved Carrara marble.
  9. *Norse Viking Bearded Battle Axe & Round Shield* with pattern-welded iron.
- **Science & Technology Wing:**
  10. *The Bohr Atomic Model* with glowing nucleus and 3 multi-axis orbiting electrons.
  11. *The DNA Double Helix* with twisting sugar-phosphate backbones and A-T / G-C rungs.
  12. *Virtual Reality Headset & Spatial Computing* with Fresnel lenses and headstrap.
- **Central Atrium & Central Exhibition Hall:**
  13. *Interactive Planet Earth & Orbiting Satellite* with detailed continent textures and Rayleigh atmosphere glow.
  14. *The Solar System Orrery* with Sun and 6 planets in real-time Keplerian orbits.
  15. *The Great Pyramid of Giza* with 5 stepped monumental tiers and gold pyramidion.

---

### 16. WebXR Virtual Reality Integration
The application checks for WebXR hardware support via:
```javascript
if ('xr' in navigator) {
  navigator.xr.isSessionSupported('immersive-vr').then(supported => {
    if (supported) {
      renderer.xr.enabled = true;
      // Show "Enter VR" button for Meta Quest / HTC Vive headsets
    }
  });
}
```
VR mode works out-of-the-box on VR headsets while maintaining 100% full desktop functionality.

---

### 17. Project Architecture & File Organization
```
virtual-museum/
│
├── index.html          ← Entry HTML markup, HUD, modals, importmap
│
├── css/
│   └── style.css       ← Modern dark museum styling, glassmorphism, animations
│
├── js/
│   ├── main.js         ← Three.js scene orchestration, render loop, minimap
│   ├── museum.js       ← 3D architectural geometry, procedural floors, lighting
│   ├── controls.js     ← First-person movement, sprint, AABB collision detection
│   ├── exhibits.js     ← 15 interactive 3D exhibits, canvas paintings, labels
│   ├── interaction.js  ← Raycasting hover detection, info modal open/close
│   └── audio.js        ← Web Audio API procedural sound synthesizer
│
└── README.md           ← Complete project report & viva preparation guide
```

---

### 18. Main Features Checklist
- [x] 6 Connected Museum Zones (Lobby, Atrium, Art, History, Science, Exhibition Hall).
- [x] Smooth Doorway Archways with Colonnades and Gold Moldings.
- [x] Procedural Floor Textures (Marble, Parquet, Travertine, Cyber-Grid).
- [x] First-Person WASD + Shift Sprint Controls with Height Locking.
- [x] AABB Walkable Zone Collision Detection with Smooth Wall Sliding.
- [x] Procedural Footstep Audio & Reverb Ambience via Web Audio API.
- [x] Cursor-Position Raycaster with Hover Feedback and Distance Checks.
- [x] Emissive Hover Highlights on Hovered Exhibits.
- [x] 15 Curated Exhibits with Physical Brass Wall Plaques.
- [x] Rich Information Modals with Context, Facts, and SDG 4 Highlights.
- [x] Rotating 3D Models (Bohr Atom, DNA Helix, Earth Globe, Solar Orrery, Pyramid).
- [x] Real-Time Multi-Axis Electron & Planetary Orbit Animations.
- [x] HUD Mini-Map Radar with Real-Time Visitor Position & View Cone.
- [x] Audio Mute/Unmute & Fullscreen Toggle Buttons.
- [x] Touchpad click-and-drag look without pointer lock.
- [x] Click / tap exhibit inspection using cursor-position raycasting.
- [x] Quick gallery directory with direct travel to all six zones.
- [x] Pause / resume using <kbd>P</kbd>.
- [x] Gallery Transition Toast Banners on Crossing Wings.
- [x] WebXR VR Mode Support.

---

### 19. UN SDG 4: Quality Education Connection
**Goal:** *"Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all."*

**How This Project Delivers on SDG 4:**
1. **Universal Accessibility:** Students in rural or economically developing regions can explore world-class art and archaeology without travel expenses or visa restrictions.
2. **Active Spatial Learning:** Interactive 3D navigation gives learners a way to explore scale, spatial relationships, and exhibits through active discovery rather than static 2D reading.
3. **Multidisciplinary STEAM Curriculum:** Integrates fine arts, history, physics, genetics, astronomy, and computer science in a unified virtual environment.
4. **Cultural Heritage Preservation:** Digital twin 3D models permanently safeguard humanity's cultural treasures against climate disasters, war, or physical degradation.

---

### 20. Advantages of the Project
- **Zero Install / Zero Setup:** Pure browser-native application.
- **Low Asset Dependency:** Artwork, signage, and floor textures are generated locally; the Three.js engine and Google Fonts are loaded from CDNs and require internet access.
- **Device-Adaptive Rendering:** Resolution is capped to balance visual clarity and GPU load; actual frame rate varies by device and browser.
- **Educational Depth:** Every exhibit features researched descriptions, historical contexts, and verifiable scientific facts.

---

### 21. Limitations
- Advanced VR hand-tracking gestures require specialized VR hardware controllers.
- Procedural canvas paintings represent stylized interpretations rather than billion-pixel gigapixel scans.
- Current build is single-visitor (multiplayer shared avatars require WebSockets).

---

### 22. Future Scope
1. **Multiplayer Spatial Networking:** WebSocket-powered shared avatar exploration and voice chat for virtual school field trips.
2. **AI Virtual Museum Docent:** Integration with a conversational AI agent answering visitor questions about exhibits in real time.
3. **Interactive Quizzes:** Educational checkpoint quizzes at the end of each wing offering student completion badges.
4. **Photogrammetry Scans:** Importing ultra-high-resolution scanned GLTF/USDZ 3D models with LOD (Level of Detail) optimization.

---

### 23. Viva Voce Questions & Answers (Frequently Asked by Examiners)

**Q1: What is Three.js and what role does it play in this project?**
> **Answer:** Three.js is an open-source, high-level JavaScript 3D library that abstracts the complex low-level WebGL API. In this project, Three.js manages the scene graph, camera transformations, materials, lights, shadow mapping, raycasting, and hardware-accelerated rendering inside an HTML5 `<canvas>`.

**Q2: How does the first-person camera and movement system work?**
> **Answer:** The default mode uses Pointer Events to convert touchpad click-and-drag movement into camera yaw and pitch without hiding the cursor. The raycaster follows the actual cursor position for click / tap inspection. Keyboard movement is calculated from WASD / arrow key states, the camera's horizontal forward and right vectors, walking speed, and frame delta-time (`clock.getDelta()`).

**Q3: How is collision detection implemented without a heavy physics engine?**
> **Answer:** We implemented an Axis-Aligned Bounding Box (AABB) "Walkable Zone" system. The museum's floor plan is represented as an array of overlapping rectangular boundaries. Each frame, proposed new X and Z positions are tested independently against `isPositionWalkable(x, z)`. Checking axes independently allows smooth sliding along walls rather than abrupt sticking.

**Q4: How does the Raycasting interaction system work?**
> **Answer:** `THREE.Raycaster` projects a mathematical ray from the camera origin through normalized device coordinates `(0, 0)` (the center crosshair). It tests for intersections against our `exhibitObjects` array. If an exhibit is detected within 6.8 meters, the system activates the golden crosshair, boosts the object's emissive intensity, and prompts the user to press <kbd>E</kbd> to inspect.

**Q5: Why did you use procedural Canvas textures instead of loading image files?**
> **Answer:** External image files often fail due to CORS (Cross-Origin Resource Sharing) restrictions when opened from local file systems, or break when external image hosts go down. By painting marble veins, wood grain, stone flecks, and master artworks dynamically using the HTML5 Canvas 2D API (`CanvasTexture`), our application is 100% self-contained, lightning fast, and guaranteed to run with zero missing asset errors.

**Q6: What is ACES Filmic Tone Mapping and why did you enable it?**
> **Answer:** WebGL performs lighting calculations in High Dynamic Range (HDR) linear space, but computer monitors can only display Standard Dynamic Range (SDR). `ACESFilmicToneMapping` compresses HDR luminance values into a film-like photographic curve, preventing blown-out highlights on spotlights while preserving rich shadow contrast.

**Q7: How did you implement sound without external audio files?**
> **Answer:** We used the browser's native **Web Audio API**. We synthesized ambient room drone using low-frequency sine and triangle oscillators, footstep clicks using filtered pseudo-random white noise buffers, and exhibit chimes using arpeggiated sine frequencies. This completely avoids 404 audio errors.

**Q8: What is the significance of SDG 4 in your project?**
> **Answer:** United Nations Sustainable Development Goal 4 aims to ensure inclusive, equitable quality education for all. Virtual reality democratizes knowledge by removing geographical, financial, and physical barriers. Any student with a web browser can explore world-class art, ancient history, and advanced physics in a 3D spatial format that dramatically improves conceptual understanding.

---

*Foundations of Virtual Reality · CIAP Project · Virtual Reality-Based Virtual Museum Experience*


## Visual repair update

- Framed paintings now use dedicated front/back canvas planes instead of a textured box mesh, improving predictable UV mapping and avoiding blank/dark artwork faces.
- Artwork can be inspected from either side of the frame.
- Exhibit plaques and wayfinding signs use separately oriented front/back text faces so the lettering remains readable from both directions instead of appearing mirrored.
- The *Girl with a Pearl Earring* procedural artwork now uses a lifted blue-green backdrop to improve subject contrast.
- Existing touchpad click-and-drag camera navigation and mouse support are intentionally retained.

Run through a local web server (for example, VS Code Live Server). A browser/WebGL visual test is still required on the target laptop after extraction.


## Visual upgrade — 30 October 2026

- Art-gallery canvases now request faithful Wikimedia Commons reproductions for The Starry Night, Mona Lisa, The Great Wave off Kanagawa, Girl with a Pearl Earring, and Mondrian's Composition with Red, Yellow, and Blue. The built-in procedural art remains as an offline fallback; an internet connection is needed for the photographic reproductions. Sources are listed in `ARTWORK_SOURCES.md`.
- The Mona Lisa frame ratio was corrected to better match the original portrait format.
- The solar-system exhibit now includes all eight planets in the correct outward order, individual orbital tracks, differentiated display sizes and surface colours, Saturn's rings, Uranus's faint rings, planet name tags, animated orbits, and per-planet educational inspection panels. Display dimensions are deliberately compressed and are not astronomically to scale.
- The SDG 4 board was moved off the central divider column to an unobstructed wall in the science wing. Its title and explanation now clearly identify it as the United Nations Sustainable Development Goal 4: Quality Education.
- The Augustus bust received additional facial and drapery details to improve recognition as a classical marble portrait.
- Lobby layout, science exhibits, and touchpad click-and-drag navigation were otherwise kept unchanged.


## Artwork image delivery (30 October 2026)

The five gallery reproductions are requested from Wikimedia Commons through the wsrv.nl image-resizing proxy so the browser can use them as Canvas/WebGL textures. The locally generated CanvasTexture illustrations remain as an offline or request-failure fallback. The photographic reproductions are not bundled in the ZIP and therefore require an internet connection and availability of the image service. See `ARTWORK_SOURCES.md` for the individual public-domain source pages.
