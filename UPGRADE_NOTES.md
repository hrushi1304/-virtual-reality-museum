# Virtual Museum — Enhanced Build Notes

This ZIP preserves the supplied Three.js virtual museum and upgrades its navigation, presentation, accessibility, and rendering loop. It is an enhanced derivative of the original `Harshbait/arvr` repository.

## What changed

### Touchpad-first controls
- Removed mandatory pointer lock from the default entry flow. The cursor stays visible, so a laptop touchpad can operate the HUD and browser fullscreen button.
- Hold the touchpad click while dragging on the 3D canvas to look around. WASD / arrow keys move; Shift sprints.
- Cursor-position raycasting highlights exhibits. A short click or tap opens the exhibit information panel; `E` inspects the exhibit under the cursor.
- Added `P` pause / resume, `G` gallery directory, and `F` fullscreen shortcuts.
- The application resets held movement keys if the browser loses focus.

### Navigation and interaction
- Added an Explore directory with direct travel to all six museum zones.
- Improved destination labels so the HUD matches the active gallery names.
- Kept the fullscreen button state synchronized with the browser's real fullscreen state and added a visible failure message if the browser blocks the request.

### Visual presentation
- Increased and balanced ambient, hemisphere, directional, and zone lighting.
- Lightened the gallery wall and floor palette to make the rooms easier to read.
- Switched artwork canvases and exhibit plaques to unlit display materials so their designed colours and text remain legible under changing scene lighting.
- Set procedural CanvasTextures to sRGB and added anisotropic filtering to improve texture clarity at oblique viewing angles.

### Rendering and VR
- Cached animated and orbital objects instead of traversing the full scene graph every frame.
- Reused movement vectors and skip movement calculations when no movement key is pressed.
- Switched to Three.js `renderer.setAnimationLoop`, which is the appropriate render-loop entry point for standard display rendering and WebXR sessions.
- The VR entry button appears only when the browser reports immersive-VR support; session errors are surfaced in the UI.

## Run the project

1. Extract the ZIP.
2. Open the extracted `arvr-virtual-museum-enhanced` folder in VS Code (the folder containing `index.html`).
3. Run `index.html` with Live Server, or open a terminal in this folder and run `py -m http.server 8000`.
4. Visit `http://localhost:8000` if using Python, then click **Enter Virtual Museum**.

The museum itself does not need `npm install`. Three.js r158 and Google Fonts are loaded from pinned CDN URLs, so an internet connection is required while the page loads. WebXR requires a compatible headset, browser, permissions, and a secure context; `localhost` is considered secure by modern browsers.

## Controls

- `W A S D` / arrow keys: walk
- `Shift`: sprint
- Touchpad click + drag on the 3D view: look around
- Move the pointer over an exhibit: highlight it
- Click / tap a highlighted exhibit: inspect it
- `E`: inspect the exhibit under the cursor
- `G`: open the six-zone directory and jump to a gallery
- `P`: pause / resume
- `F` or the Fullscreen HUD button: enter / exit fullscreen
- `?`: open the controls reference

## Validation status

The edited JavaScript modules pass Node.js syntax checks. The HTML files parse, CSS braces balance, DOM references resolve to existing IDs, and local file / JavaScript module paths exist. The external Three.js CDN could not be fetched in the build environment, so I could not run an end-to-end WebGL browser test here. Verify touchpad drag, exhibit click / tap, gallery travel, lighting, fullscreen, audio, and headset behavior on the target laptop.

The report screenshots in `assets/images/` are baseline images from the original ZIP, not screenshots of the upgraded build. Re-capture them after running the enhanced version before submitting the report as evidence of the upgraded appearance.

## Attribution and reuse

This is a modified derivative of the supplied `Harshbait/arvr` project. The provided archive did not include a `LICENSE` file. Preserve the original attribution and check the original author's reuse terms before publishing a public derivative.


## Follow-up visual repair

- Replaced painting BoxGeometry texture surfaces with explicit UV-stable PlaneGeometry canvases on both sides.
- Added separately oriented reverse faces to artwork plaques, gallery direction signs and the lobby banner to prevent mirrored lettering.
- Improved contrast in the procedural *Girl with a Pearl Earring* artwork.
- Kept click-and-drag touchpad and mouse controls unchanged.
- Browser/WebGL appearance must be verified locally; this archive was checked for source structure and syntax, not executed in a full browser.


## Additional repair — spotlight target hierarchy

A source audit found that several spotlights used child exhibit meshes directly as `SpotLight.target` and then added those targets to the scene root. Three.js reparents an object when it is added to another parent, which detached the targeted meshes from their exhibit groups. The repaired build instead creates a separate `THREE.Object3D` at each target's world position. This correction covers the art gallery, historical gallery, science wing, central exhibition hall, and SDG display board. Existing room layouts, object designs, and the lobby presentation are preserved.

The project’s screenshot files remain baseline captures from before the latest repair. Re-capture the nine screenshots with `node capture_screenshots.js` after installing the declared development dependency (`npm install`) and setting `CHROME_EXECUTABLE_PATH` if Chrome/Chromium is not installed in a standard location. Do not treat the bundled baseline screenshots as proof of the repaired render.


## Visual upgrade — 30 October 2026

- Art-gallery canvases now request faithful Wikimedia Commons reproductions for The Starry Night, Mona Lisa, The Great Wave off Kanagawa, Girl with a Pearl Earring, and Mondrian's Composition with Red, Yellow, and Blue. The built-in procedural art remains as an offline fallback; an internet connection is needed for the photographic reproductions. Sources are listed in `ARTWORK_SOURCES.md`.
- The Mona Lisa frame ratio was corrected to better match the original portrait format.
- The solar-system exhibit now includes all eight planets in the correct outward order, individual orbital tracks, differentiated display sizes and surface colours, Saturn's rings, Uranus's faint rings, planet name tags, animated orbits, and per-planet educational inspection panels. Display dimensions are deliberately compressed and are not astronomically to scale.
- The SDG 4 board was moved off the central divider column to an unobstructed wall in the science wing. Its title and explanation now clearly identify it as the United Nations Sustainable Development Goal 4: Quality Education.
- The Augustus bust received additional facial and drapery details to improve recognition as a classical marble portrait.
- Lobby layout, science exhibits, and touchpad click-and-drag navigation were otherwise kept unchanged.
