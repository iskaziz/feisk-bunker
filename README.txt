FEISK PRODUCTIONS BUNKER PROTOTYPE - LAYER B ALIGNMENT PASS

Files:
- index.html
- style.css
- script.js
- data.js
- data.layer-b-props.js

Asset folders expected:
assets/backgrounds/
  bunker-room-background-reference.png
  bunker-with-props-preview.png

assets/props/
  filing-cabinet.png
  wall-safe.png
  white-fluffy-rug.png
  wall-mounted-lcd-monitors.png
  old-desktop-computer.png
  swivel-desk-chair.png
  rotary-telephone.png
  bookshelf.png

Important notes:
1. Props are configured in data.js only.
2. x/y/width/height are percentages of the 16:9 scene stage.
3. The bunker scene now uses a 16:9 stage wrapper so prop placement stays locked to the reference image.
4. Portrait mobile now shows a rotate prompt first. Users may continue in portrait, then horizontally drag/pan the widescreen room.
5. Replace the approximate placement values in data.js after testing against the final exported background and final transparent PNG sizes.

Deployment:
Upload the contents of this folder to your GitHub Pages repository root.
