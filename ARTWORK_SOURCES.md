# Artwork Sources and Image Loading

The art gallery uses faithful reproductions of public-domain paintings hosted by Wikimedia Commons. The project loads resized copies over HTTPS through the wsrv.nl image service when the museum is opened with an internet connection. This avoids using Wikimedia raw-media URLs directly as WebGL textures, which are not CORS-enabled. The CanvasTexture code keeps its built-in procedural illustration as a fallback if an image request fails or the museum is run offline. The artwork files are not bundled in this ZIP; the remote image service is therefore an online dependency for the faithful reproductions.

| Gallery work | Artist | Source |
|---|---|---|
| The Starry Night (1889) | Vincent van Gogh | https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_Starry_Night.jpg |
| Mona Lisa (c. 1503–1506) | Leonardo da Vinci | https://commons.wikimedia.org/wiki/File:Mona_Lisa.jpg |
| The Great Wave off Kanagawa | Katsushika Hokusai | https://commons.wikimedia.org/wiki/File:The_Great_Wave_off_Kanagawa.jpg |
| Girl with a Pearl Earring (c. 1665) | Johannes Vermeer | https://commons.wikimedia.org/wiki/File:Girl_with_a_Pearl_Earring.jpg |
| Composition with Red, Yellow, and Blue | Piet Mondrian | https://commons.wikimedia.org/wiki/File:Composition_with_Red,_Yellow,_and_Blue.jpg |

The Commons file pages contain the reproduction details and copyright-status notes. Recheck the individual file page before redistributing the project or changing an artwork source.

Image delivery documentation: https://wsrv.nl/docs/ (the service fetches and resizes remote images). The service is third-party infrastructure and may occasionally be unavailable; in that case the local CanvasTexture fallback remains visible.
