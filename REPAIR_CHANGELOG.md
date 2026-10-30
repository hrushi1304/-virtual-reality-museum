# Visual Repair Changelog

## Repairs in this build

1. **Painting canvases no longer detach from their frames**
   - Kept artwork surfaces as explicit UV-stable `PlaneGeometry` faces on the framed-painting group.
   - Added correctly oriented front and reverse faces and registered both faces for exhibit interaction.
   - Corrected the painting spotlight targets so they are independent scene objects; the artwork mesh remains inside its frame group.

2. **Critical exhibit-group preservation fix**
   - Replaced direct use of child meshes/groups as `SpotLight.target` in the painting, history, science, and central-hall exhibits.
   - A separate `THREE.Object3D` now receives the target's world position. This avoids Three.js reparenting the actual exhibit mesh out of its parent group when the light target is added to the scene.
   - This preserves the existing models and their grouping; the science wing, history gallery, central exhibits, and lobby were not redesigned.

3. **Readable exhibit plaques and wayfinding**
   - Kept separately oriented front/back plaque faces to avoid mirrored lettering from the reverse side.
   - Kept separately oriented reverse faces for gallery direction signs and the lobby banner.

4. **Pearl Earring artwork contrast**
   - Changed the procedural backdrop from near-black to a deep blue-green gradient with a subtle vignette.

5. **Controls preserved**
   - Existing touchpad/mouse click-and-drag look controls and keyboard movement were left unchanged.

## Verification performed

- `node --check` passed for all six JavaScript modules and the screenshot-capture script.
- Confirmed all exhibit spotlight targets use independent scene objects; no direct exhibit-mesh target reparenting remains.
- HTML parsed successfully; no duplicate element IDs were found.
- ZIP integrity check passed.

## Verification limitation

A live Chromium/WebGL run could not be completed in this build environment because browser navigation to the local test server was blocked by the environment's administrator policy. The bundled screenshots are baseline captures from before the current repair, not proof of the current rendered appearance. Run the ZIP locally with VS Code Live Server and verify the galleries before using those screenshots as final project evidence.

The paintings are still procedural CanvasTexture illustrations rather than photographic reproductions. No historical/scientific artefact was remodelled in this pass; the existing layouts and models were preserved, while the spotlight-target bug that could detach model parts was corrected.


## Visual upgrade — 30 October 2026

- Art-gallery canvases now request faithful Wikimedia Commons reproductions for The Starry Night, Mona Lisa, The Great Wave off Kanagawa, Girl with a Pearl Earring, and Mondrian's Composition with Red, Yellow, and Blue. The built-in procedural art remains as an offline fallback; an internet connection is needed for the photographic reproductions. Sources are listed in `ARTWORK_SOURCES.md`.
- The Mona Lisa frame ratio was corrected to better match the original portrait format.
- The solar-system exhibit now includes all eight planets in the correct outward order, individual orbital tracks, differentiated display sizes and surface colours, Saturn's rings, Uranus's faint rings, planet name tags, animated orbits, and per-planet educational inspection panels. Display dimensions are deliberately compressed and are not astronomically to scale.
- The SDG 4 board was moved off the central divider column to an unobstructed wall in the science wing. Its title and explanation now clearly identify it as the United Nations Sustainable Development Goal 4: Quality Education.
- The Augustus bust received additional facial and drapery details to improve recognition as a classical marble portrait.
- Lobby layout, science exhibits, and touchpad click-and-drag navigation were otherwise kept unchanged.


## 30 October 2026 — artwork CORS handling and exhibit refinements

- Routed public-domain Wikimedia reproductions through wsrv.nl for CORS-compatible Canvas/WebGL use; retained local procedural fallback illustrations.
- Refined the Augustus bust head profile and aligned facial features with the tapered head geometry.
- Positioned all eight planets on their orbits at startup and reduced floating label size/depth overlap.
- Preserved the science-wing SDG 4 Quality Education board on the divider wall, clear of the central column.
