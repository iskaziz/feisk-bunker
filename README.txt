FEISK PRODUCTIONS BUNKER PROTOTYPE
=================================

This build integrates the image-based loading screen assets and keeps the bunker scene/editor data-driven.

MAIN FILES
----------
index.html
style.css
prop-placement.css
script.js
data.js
data.layer-b-props.js

NEW LOADING SCREEN FILES
------------------------
css/loading-screen.css
js/loading-screen.js
snippets/loading-screen-snippet.html

REQUIRED ASSET PATHS
--------------------
assets/ui/feisk-sign.png
assets/ui/hatch-closed.png
assets/ui/hatch-open.png

assets/backgrounds/bunker-room-background-reference.png
assets/backgrounds/bunker-with-props-preview.png

assets/props/filing-cabinet.png
assets/props/wall-safe.png
assets/props/white-fluffy-rug.png
assets/props/wall-mounted-lcd-monitors.png
assets/props/old-desktop-computer.png
assets/props/swivel-desk-chair.png
assets/props/rotary-telephone.png
assets/props/bookshelf.png

HOW IT WORKS
------------
1. index.html now uses the image-based loading screen markup from snippets/loading-screen-snippet.html.
2. css/loading-screen.css positions the Feisk sign, closed hatch, and open hatch.
3. js/loading-screen.js declares the UI assets so script.js preloads them before allowing entry.
4. script.js still controls preload progress, entry transition, bunker scene, info panels, and the hidden editor.
5. data.js remains the main source of truth for prop placement and panel content.

HIDDEN EDITOR
-------------
After entering the bunker, triple-click the far-right door area to enable the placement editor.

Editor controls:
- Click a prop to select it.
- Drag the prop or green top-left handle to move it.
- Drag the gold bottom-right handle to resize it.
- Arrow keys nudge selected prop.
- Shift + arrow keys nudge selected prop faster.
- Download data.js exports the current coordinates into a replacement data.js file.

MOBILE
------
Portrait mobile shows a rotate-to-landscape prompt first. Users can continue in portrait, but landscape is recommended because the bunker is designed as a 16:9 point-and-click scene.

UPLOAD NOTE
-----------
Upload the contents of this folder into the root of your GitHub Pages repository. Keep the asset filenames exactly as listed above.


LIVE FIX NOTES:
- data.js and data.layer-b-props.js now attach assets to window.FEISK_ASSETS, avoiding const redeclaration errors.
- script.js now uses a safe ACTIVE_FEISK_ASSETS fallback, so the loading screen will not remain stuck if one data filename is missing.
- Upload files to the repository root, not inside a nested folder.
