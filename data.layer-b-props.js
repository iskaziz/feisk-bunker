/*
  Feisk Productions Vault data file
  Keep all clickable scene objects configured here.

  Position and size values are percentages relative to the 16:9 scene.
  x/y mark the centre point of the clickable PNG on the stage.
*/

const FEISK_ASSETS = {
  backgrounds: {
    // Use the clean room background for the actual prototype.
    // The preview image can be used separately as a visual alignment guide.
    bunkerRoom: 'assets/backgrounds/bunker-room-background-reference.png',
    bunkerPreview: 'assets/backgrounds/bunker-with-props-preview.png'
  },

  props: [
    {
      id: 'old-desktop-computer',
      title: 'Old Desktop Computer',
      kicker: 'Production Terminal',
      body: 'The bunker terminal stores Feisk Productions project files, release notes, treatment drafts, encrypted pitch materials, and hidden production logs.',
      src: 'assets/props/old-desktop-computer.png',
      alt: 'Clickable old desktop computer',
      x: 55,
      y: 58,
      width: 18,
      height: 22
    },
    {
      id: 'wall-mounted-lcd-monitors',
      title: 'Wall Mounted LCD Monitors',
      kicker: 'Surveillance Wall',
      body: 'A bank of dusty LCD monitors cycles through trailers, bunker feeds, behind-the-scenes footage, and fragments from the Feisk archive.',
      src: 'assets/props/wall-mounted-lcd-monitors.png',
      alt: 'Clickable wall mounted LCD monitors',
      x: 55,
      y: 28,
      width: 27,
      height: 20
    },
    {
      id: 'filing-cabinet',
      title: 'Filing Cabinet',
      kicker: 'Development Files',
      body: 'Metal drawers filled with scripts, call sheets, location notes, contracts, receipts, and old production paperwork from completed and abandoned projects.',
      src: 'assets/props/filing-cabinet.png',
      alt: 'Clickable filing cabinet',
      x: 18,
      y: 63,
      width: 15,
      height: 32
    },
    {
      id: 'wall-safe',
      title: 'Wall Safe',
      kicker: 'Locked Vault',
      body: 'A concealed wall safe protecting confidential materials: unreleased concepts, passwords, private links, and classified bunker entries.',
      src: 'assets/props/wall-safe.png',
      alt: 'Clickable wall safe',
      x: 82,
      y: 36,
      width: 11,
      height: 15
    },
    {
      id: 'white-fluffy-rug',
      title: 'White Fluffy Rug',
      kicker: 'Floor Detail',
      body: 'The oddly clean rug softens the concrete bunker floor. It feels decorative, suspicious, and just out of place enough to be worth inspecting.',
      src: 'assets/props/white-fluffy-rug.png',
      alt: 'Clickable white fluffy rug',
      x: 51,
      y: 82,
      width: 30,
      height: 17
    },
    {
      id: 'swivel-desk-chair',
      title: 'Swivel Desk Chair',
      kicker: 'Director\'s Seat',
      body: 'A worn swivel chair facing the production terminal. Someone has spent many late nights in here assembling worlds frame by frame.',
      src: 'assets/props/swivel-desk-chair.png',
      alt: 'Clickable swivel desk chair',
      x: 43,
      y: 67,
      width: 14,
      height: 25
    },
    {
      id: 'rotary-telephone',
      title: 'Rotary Telephone',
      kicker: 'Direct Line',
      body: 'An old rotary telephone connected to an unknown line. It suggests secret calls, old deals, urgent updates, and bunker-to-surface communication.',
      src: 'assets/props/rotary-telephone.png',
      alt: 'Clickable rotary telephone',
      x: 69,
      y: 62,
      width: 10,
      height: 12
    },
    {
      id: 'bookshelf',
      title: 'Bookshelf',
      kicker: 'Reference Archive',
      body: 'A shelf of cinema books, research binders, tapes, festival catalogues, visual references, and strange objects collected during development.',
      src: 'assets/props/bookshelf.png',
      alt: 'Clickable bookshelf',
      x: 88,
      y: 61,
      width: 17,
      height: 34
    }
  ]
};
