/*
  Feisk Productions Vault data file.
  The bunker now uses one flat background image plus invisible interactive hotspots.

  Hotspot x/y/width/height values are percentages relative to the 16:9 background.
  x and y are the top-left corner of the clickable area.
*/

window.FEISK_ASSETS = {
  backgrounds: {
    bunkerRoom: 'assets/backgrounds/bunker-room-final.png',
    loadingPortrait: 'assets/backgrounds/loading-jungle-portrait.png',
    loadingLandscape: 'assets/backgrounds/loading-jungle-landscape.png'
  },

  hotspots: [
    {
      id: 'filing-cabinet',
      label: 'Filing Cabinet',
      title: 'Production Filing Cabinet',
      kicker: 'Company Records',
      body: 'Feisk Sdn Bhd was founded in December 2010 by brothers Iskander and Feisal Azizuddin. These drawers hold the paper trail: call sheets, scripts, grant notes, festival submissions, invoices and old production maps.',
      x: 3.6,
      y: 31.2,
      width: 8.4,
      height: 45.6
    },
    {
      id: 'wall-safe',
      label: 'Wall Safe',
      title: 'Locked Development Safe',
      kicker: 'In Development',
      body: 'The safe stores restricted files for Feisk projects and unreleased materials. Current archive notes include crime thriller Curi Makan, fantasy thriller Writers, desktop thriller Send Tudes, and satay-western Selendangs & Shotguns.',
      x: 20.5,
      y: 36.6,
      width: 9.8,
      height: 19.4
    },
    {
      id: 'lcd-monitors',
      label: 'LCD Monitors',
      title: 'Feisk Screen Array',
      kicker: 'Films / Platforms',
      body: 'Feisk Productions has produced content for film, television and digital platforms. The monitors act as the bunker interface for trailers, stills, platform notes and release records.',
      x: 36.7,
      y: 26.6,
      width: 20.1,
      height: 25.1
    },
    {
      id: 'old-desktop-computer',
      label: 'Old Desktop Computer',
      title: 'Old Desktop Computer',
      kicker: 'Main Terminal',
      body: 'The bunker terminal will eventually become the main interactive archive: films, biographies, project windows, hidden folders and contact access. For now, this prototype panel confirms the computer hotspot is working.',
      x: 41.8,
      y: 51.7,
      width: 15.8,
      height: 15.2
    },
    {
      id: 'rotary-telephone',
      label: 'Rotary Telephone',
      title: 'Rotary Telephone',
      kicker: 'Contact Line',
      body: 'A direct line to the surface. Feisk can be reached at get.creative@feisk.com.my for production enquiries, collaborations and archive access.',
      x: 31.0,
      y: 56.0,
      width: 7.2,
      height: 9.4
    },
    {
      id: 'swivel-desk-chair',
      label: 'Swivel Desk Chair',
      title: 'Swivel Desk Chair',
      kicker: 'The Producers\' Seat',
      body: 'Iskander Azizuddin is a Malaysian film producer with more than 15 years of creative and media industry experience. Feisal Azizuddin is a filmmaker whose short films often explore Malaysian social issues through horror, thriller and dramatic forms.',
      x: 37.2,
      y: 61.6,
      width: 12.8,
      height: 25.8
    },
    {
      id: 'bookshelf',
      label: 'Bookshelf',
      title: 'Research Bookshelf',
      kicker: 'Reference Archive',
      body: 'A shelf of cinema books, treatment binders, research notes, festival catalogues, short-film references and odd props collected across years of independent production work.',
      x: 62.3,
      y: 23.8,
      width: 14.6,
      height: 55.6
    },
    {
      id: 'white-fluffy-rug',
      label: 'White Fluffy Rug',
      title: 'White Fluffy Rug',
      kicker: 'Festival Clue',
      body: 'A strange soft patch in an otherwise hard concrete room. Hidden beneath it: a reminder that Can You Love Me Most? won Best Short Film at the 32nd Festival Filem Malaysia in 2022.',
      x: 10.2,
      y: 76.2,
      width: 61.5,
      height: 20.5
    }
  ]
};

// Backwards-compatible alias for older script versions.
window.FEISK_HOTSPOTS = window.FEISK_ASSETS.hotspots;
