FEISK PRODUCTIONS BUNKER PROTOTYPE
=================================

An early-2000s Flash-style / point-and-click interactive bunker built
in vanilla HTML, CSS and JavaScript. No frameworks, no build step.

MAIN FILES
----------
index.html
style.css
prop-placement.css
script.js
data.js

LOADING SCREEN FILES
---------------------
css/loading-screen.css
js/loading-screen.js

REQUIRED ASSET PATHS
--------------------
assets/ui/feisk-sign.png
assets/ui/hatch-closed.png
assets/ui/hatch-open.png

assets/backgrounds/bunker-room-final.png
assets/backgrounds/loading-jungle-portrait.png
assets/backgrounds/loading-jungle-landscape.png

assets/props/ contains individual prop reference images
(filing-cabinet.png, wall-safe.png, wall-mounted-lcd-monitors.png,
old-desktop-computer.png, swivel-desk-chair.png, rotary-telephone.png,
bookshelf.png, white-fluffy-rug.png). These are reference/source art;
the live scene currently uses props baked into the single
bunker-room-final.png background, with invisible hotspot buttons
(configured in data.js) layered on top for click areas.

HOW IT WORKS
------------
1. index.html loads css/loading-screen.css, style.css and
   prop-placement.css, then js/loading-screen.js, data.js and
   script.js in that order.
2. js/loading-screen.js declares the UI assets (sign + hatch images)
   that get preloaded before the hatch is clickable.
3. data.js is the single source of truth for background paths,
   hotspot placement/copy, and the computer-terminal icon content.
4. script.js preloads assets, controls the hatch/entry transition,
   renders hotspots from data.js, drives the info panel and computer
   overlay, and contains a hidden placement editor.

HIDDEN EDITOR
-------------
After entering the bunker, triple-click the ladder area (left side of
the scene, roughly 12-20% across) to toggle the placement editor.

Editor controls:
- Click a hotspot to select it.
- Drag the hotspot to move it.
- Drag the gold bottom-right handle to resize it.
- "Download data.js" exports the current coordinates as a
  replacement data.js file - copy the hotspot values back into your
  real data.js and commit it.

MOBILE / TABLET
----------------
Portrait screens up to 1024px wide (phones and most tablets in
portrait) get a horizontally pannable scene and a rotate-to-landscape
prompt, since the bunker is designed as a 16:9 point-and-click scene.
Landscape orientation (including desktop) fills the viewport width
directly with no panning needed.

DEPLOYMENT NOTE
----------------
Upload the contents of this folder into the root of your GitHub Pages
repository (or serve it as-is via Pages from the repo root). Keep all
asset filenames and folder paths exactly as listed above - paths are
case-sensitive on GitHub Pages.
