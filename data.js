/* Feisk Productions Vault data file.
   The bunker uses one flat image plus invisible interactive hotspots.
   x/y/width/height values are percentages relative to the background image.
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
      x: 4.1,
      y: 34.1,
      width: 7.4,
      height: 36.9,
      shape: 'rect',
      radius: 4
    },
    {
      id: 'wall-safe',
      label: 'Wall Safe',
      title: 'Locked Development Safe',
      kicker: 'In Development',
      body: 'The safe stores restricted files for Feisk projects and unreleased materials. Current archive notes include crime thriller Curi Makan, fantasy thriller Writers, desktop thriller Send Tudes, and satay-western Selendangs & Shotguns.',
      x: 20.7,
      y: 34.4,
      width: 9.3,
      height: 16.8,
      shape: 'rect',
      radius: 3
    },
    {
      id: 'lcd-monitors',
      label: 'LCD Monitors',
      title: 'Feisk Screen Array',
      kicker: 'Films / Platforms',
      body: 'Feisk Productions has produced content for film, television and digital platforms. The monitors act as the bunker interface for trailers, stills, platform notes and release records.',
      x: 36.7,
      y: 22.9,
      width: 20.2,
      height: 25.1,
      shape: 'rect',
      radius: 2
    },
    {
      id: 'old-desktop-computer',
      label: 'Old Desktop Computer',
      title: 'Old Desktop Computer',
      kicker: 'Main Terminal',
      body: 'The bunker terminal will eventually become the main interactive archive: films, biographies, project windows, hidden folders and contact access. For now, this prototype panel confirms the computer hotspot is working.',
      x: 41.7,
      y: 43.9,
      width: 16.8,
      height: 18.4,
      shape: 'rect',
      radius: 4
    },
    {
      id: 'rotary-telephone',
      label: 'Rotary Telephone',
      title: 'Rotary Telephone',
      kicker: 'Contact Line',
      body: 'A direct line to the surface. Feisk can be reached at get.creative@feisk.com.my for production enquiries, collaborations and archive access.',
      x: 31.2,
      y: 50.8,
      width: 6.2,
      height: 7.5,
      shape: 'ellipse'
    },
    {
      id: 'swivel-desk-chair',
      label: 'Swivel Desk Chair',
      title: 'Swivel Desk Chair',
      kicker: 'The Producers' Seat',
      body: 'Iskander Azizuddin is a Malaysian film producer with more than 15 years of creative and media industry experience. Feisal Azizuddin is a filmmaker whose short films often explore Malaysian social issues through horror, thriller and dramatic forms.',
      x: 37.0,
      y: 53.6,
      width: 12.2,
      height: 24.2,
      shape: 'ellipse'
    },
    {
      id: 'bookshelf',
      label: 'Bookshelf',
      title: 'Research Bookshelf',
      kicker: 'Reference Archive',
      body: 'A shelf of cinema books, treatment binders, research notes, festival catalogues, short-film references and odd props collected across years of independent production work.',
      x: 62.4,
      y: 19.7,
      width: 14.2,
      height: 50.2,
      shape: 'rect',
      radius: 3
    },
    {
      id: 'white-fluffy-rug',
      label: 'White Fluffy Rug',
      title: 'White Fluffy Rug',
      kicker: 'Festival Clue',
      body: 'A strange soft patch in an otherwise hard concrete room. Hidden beneath it: a reminder that Can You Love Me Most? won Best Short Film at the 32nd Festival Filem Malaysia in 2022.',
      x: 9.0,
      y: 70.5,
      width: 64.5,
      height: 21.3,
      shape: 'polygon',
      clipPath: 'polygon(8% 18%, 88% 0%, 100% 83%, 12% 100%, 0% 55%)'
    },
    {
      id: 'vault-door',
      label: 'Vault Door',
      title: 'Vault Door',
      kicker: 'Exit / Threshold',
      body: 'The heavy vault door marks the threshold between the public website and the hidden Feisk archive. Future versions can use this as a navigation route to external links, contact, or secret rooms.',
      x: 79.2,
      y: 24.7,
      width: 12.5,
      height: 46.8,
      shape: 'polygon',
      clipPath: 'polygon(18% 6%, 76% 0%, 100% 16%, 95% 92%, 30% 100%, 0% 82%, 4% 18%)'
    }
  ],  computerIcons: [
    {
      id: 'about-feisk',
      label: 'About Feisk',
      icon: '▣',
      title: 'Feisk Productions',
      kicker: 'Company File',
      body: 'Feisk Sdn Bhd was founded in December 2010 by brothers Iskander and Feisal Azizuddin. The company creates content for film, television and digital platforms.'
    },
    {
      id: 'feature-films',
      label: 'Feature Films',
      icon: '▤',
      title: 'Feature Films / Platforms',
      kicker: 'Distribution Records',
      body: 'The Feisk archive includes feature films and screen work connected to Netflix, Amazon Prime, VIU, Astro and Tubi. Future versions of this terminal can open film-specific folders, posters, trailers and production notes.'
    },
    {
      id: 'short-films',
      label: 'Short Films',
      icon: '◈',
      title: 'Notable Short Films',
      kicker: 'Festival Archive',
      body: 'Feisk regularly produces short films, mainly in the horror / thriller genre. Can You Love Me Most? won Best Short Film at the 32nd Festival Filem Malaysia in 2022.'
    },
    {
      id: 'development-slate',
      label: 'Dev Slate',
      icon: '⌘',
      title: 'Projects in Post / Development',
      kicker: 'Restricted Folder',
      body: 'Current archive notes list four feature films in post-production: crime thriller Curi Makan, fantasy thriller Writers, desktop thriller Send Tudes, and satay-western Selendangs & Shotguns.'
    },
    {
      id: 'iskander',
      label: 'Iskander',
      icon: '☉',
      title: 'Iskander Azizuddin',
      kicker: 'Producer Profile',
      body: 'Iskander is a Malaysian film producer with over 15 years of experience in the creative and media industry. His projects have been presented at Asian Film Market and Singapore\'s Southeast Asian Film Financing Forum, and he was selected as a Bucheon Fantastic Film School Fellow in 2019.'
    },
    {
      id: 'feisal',
      label: 'Feisal',
      icon: '✦',
      title: 'Feisal Azizuddin',
      kicker: 'Filmmaker Profile',
      body: 'Feisal is a Malaysia-based filmmaker whose short films often explore social issues through horror, thriller and dramatic forms. His work has screened at festivals including Jogja-NETPAC Asian Film Festival, Monterrey International Film Festival, Bangkok ASEAN Film Festival and George Town Festival.'
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '☎',
      title: 'Contact Line',
      kicker: 'Surface Communications',
      body: 'For production enquiries, collaborations and archive access: get.creative@feisk.com.my'
    }
  ]
};
window.FEISK_HOTSPOTS = window.FEISK_ASSETS.hotspots;
