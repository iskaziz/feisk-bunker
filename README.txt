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


EDITOR MODE
-----------
After entering the bunker, triple-click the far-right door area to unlock the placement editor.

In editor mode:
- Click a prop to select it.
- Drag the selected prop to move it.
- Drag the small gold bottom-right handle to resize it.
- Use arrow keys to nudge selected props. Hold Shift for larger nudges.
- Click “Copy placement” to copy the updated x/y/width/height values.
- The editor also saves temporary placement values to this browser via localStorage.

Mobile panel fix:
The information panel now has max-height, internal scrolling, smaller mobile typography, and safe-area spacing so it fits within portrait and landscape phone screens.

EDITOR EXPORT UPDATE
--------------------
This version adds a “Download data.js” button inside the hidden editor.
After moving/resizing props, click “Download data.js” and replace the existing data.js file in your GitHub Pages repository with the downloaded file.

Editor handles:
- Green top-left handle: move prop. Useful on mobile where dragging the transparent PNG area can be awkward.
- Gold bottom-right handle: resize prop.

Portrait mobile panel update:
The information panel is now fixed to the phone viewport in portrait mode and the body text scrolls inside the panel, so longer text should remain reachable.
