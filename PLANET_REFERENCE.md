# Solar System Exhibit — Planet Reference

The model contains the Sun and all eight planets in the correct outward order. Radii and orbital radii below are Three.js scene units used by this display. The model intentionally compresses astronomical scale so every planet can be seen and inspected; it must not be interpreted as a scale-accurate astronomy model.

| Body | Display radius | Orbit radius from Sun | Main display colour / surface | Distinguishing detail |
|---|---:|---:|---|---|
| Sun | 0.48 | — | Emissive gold `#FFC247` | Central light and glow |
| Mercury | 0.065 | 0.86 | Grey `#A4A5A1` | Cratered surface |
| Venus | 0.095 | 1.28 | Pale ochre `#E5C27F` | Cloud bands |
| Earth | 0.105 | 1.72 | Blue `#4C9BE8` | Green continents and clouds |
| Mars | 0.078 | 2.16 | Rust red `#C75B3E` | Surface markings and polar cap |
| Jupiter | 0.245 | 2.82 | Cream / brown `#D8B58E` | Atmospheric bands and Great Red Spot |
| Saturn | 0.215 | 3.52 | Pale gold `#E2D09B` | Broad rings |
| Uranus | 0.155 | 4.18 | Pale cyan `#8ED8DC` | Faint narrow rings |
| Neptune | 0.150 | 4.82 | Deep blue `#315FBD` | Dark storm marking |

Each planet has its own moving orbital path, a visible name tag and an interactive information panel. The planet surfaces are generated locally with CanvasTexture, so they do not require external texture downloads.
