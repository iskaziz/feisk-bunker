/*
  Feisk Productions Bunker - Layer B Prop Placement
  -------------------------------------------------
  Coordinates are percentages relative to the 16:9 bunker stage.
  Keep prop placement data-driven here instead of hard-coding item positions in CSS.

  Expected prop folder:
  assets/props/
    filing-cabinet.png
    wall-safe.png
    white-fluffy-rug.png
    wall-mounted-lcd-monitors.png
    old-desktop-computer.png
    swivel-desk-chair.png
    rotary-telephone.png
    bookshelf.png
*/

const LAYER_B_PROPS = [
  {
    id: "filing-cabinet",
    label: "Filing Cabinet",
    src: "assets/props/filing-cabinet.png",
    x: 2.4,
    y: 40.5,
    width: 10.2,
    zIndex: 5,
    panel: "archives"
  },
  {
    id: "wall-safe",
    label: "Wall Safe",
    src: "assets/props/wall-safe.png",
    x: 20.6,
    y: 42.5,
    width: 10.4,
    zIndex: 6,
    panel: "vault"
  },
  {
    id: "wall-mounted-lcd-monitors",
    label: "LCD Monitors",
    src: "assets/props/wall-mounted-lcd-monitors.png",
    x: 36.6,
    y: 29.4,
    width: 20.7,
    zIndex: 6,
    panel: "screening-room"
  },
  {
    id: "old-desktop-computer",
    label: "Old Desktop Computer",
    src: "assets/props/old-desktop-computer.png",
    x: 42.0,
    y: 56.3,
    width: 16.5,
    zIndex: 8,
    panel: "computer-terminal"
  },
  {
    id: "rotary-telephone",
    label: "Rotary Telephone",
    src: "assets/props/rotary-telephone.png",
    x: 30.0,
    y: 62.0,
    width: 7.2,
    zIndex: 8,
    panel: "contact"
  },
  {
    id: "swivel-desk-chair",
    label: "Swivel Desk Chair",
    src: "assets/props/swivel-desk-chair.png",
    x: 38.4,
    y: 65.0,
    width: 14.8,
    zIndex: 10,
    panel: "director-chair"
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    src: "assets/props/bookshelf.png",
    x: 62.2,
    y: 26.2,
    width: 14.8,
    zIndex: 5,
    panel: "library"
  },
  {
    id: "white-fluffy-rug",
    label: "White Fluffy Rug",
    src: "assets/props/white-fluffy-rug.png",
    x: 14.0,
    y: 75.3,
    width: 70.5,
    zIndex: 3,
    panel: "hidden-floor"
  }
];

// Browser global fallback for non-module scripts.
window.LAYER_B_PROPS = LAYER_B_PROPS;
