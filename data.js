/*
  Feisk Productions Vault data
  - x, y, width, height are invisible click/tap areas as percentages of the bunker image.
  - dotX and dotY are the visible pulsing dot position as percentages of the bunker image.
  - The current bunker background is a two-floor portrait image: 941 × 1672.
*/

window.FEISK_CONFIG = {
  scene: {
    background: 'assets/backgrounds/bunker-room-final.png',
    aspectRatio: 941 / 1672
  },

  hotspots: [
    {
      id: 'wall-safe',
      label: 'Slate',
      title: 'Development Slate',
      kicker: 'In Development',
      x: 20.5,
      y: 20.2,
      width: 12.1,
      height: 14.1,
      dotX: 27.4,
      dotY: 26.9,
      body: `The wall safe contains locked development material and future project notes.

Feisk currently lists several upcoming feature projects, including Curi Makan, Writers, Send Tudes and Selendangs & Shotguns.`
    },
    {
      id: 'old-desktop-computer',
      label: 'Terminal',
      title: 'Feisk Terminal',
      kicker: 'Desktop Access',
      x: 43.0,
      y: 23.6,
      width: 20.5,
      height: 14.2,
      dotX: 54.0,
      dotY: 30.5,
      action: 'computer',
      body: `The old desktop terminal opens the Feisk archive operating system.`
    },
    {
      id: 'rotary-telephone',
      label: 'Contact',
      title: 'Direct Line',
      kicker: 'Contact',
      x: 31.2,
      y: 28.6,
      width: 8.4,
      height: 5.7,
      dotX: 34.8,
      dotY: 30.9,
      body: `The rotary telephone connects to Feisk Productions.

Email: get.creative@feisk.com.my`
    },
    {
      id: 'vault-door',
      label: 'Vault',
      title: 'Vault Door',
      kicker: 'Deep Archive',
      x: 76.1,
      y: 10.1,
      width: 17.3,
      height: 30.0,
      dotX: 84.0,
      dotY: 25.0,
      body: `The heavy vault door leads deeper into the Feisk archive.

Future versions can use this as navigation to another room, a films section, or a secret archive level.`
    },
    {
      id: 'filing-cabinet',
      label: 'Records',
      title: 'Company Records',
      kicker: 'Feisk Archive',
      x: 62.3,
      y: 60.0,
      width: 11.6,
      height: 26.0,
      dotX: 68.7,
      dotY: 74.0,
      body: `A locked cabinet of production records, release notes and archived material from Feisk Productions.

This is where visitors can discover the company history, past work and the foundation of the Feisk archive.`
    }
  ],

  desktopIcons: [
    {
      id: 'about-feisk',
      label: 'About Feisk',
      symbol: 'F',
      title: 'About Feisk Productions',
      kicker: 'Company File',
      body: `Feisk Sdn Bhd was founded in December 2010 by brothers Iskander and Feisal Azizuddin.

The company creates content for film, television and digital platforms.`
    },
    {
      id: 'feature-films',
      label: 'Feature Films',
      symbol: '🎞',
      title: 'Feature Films',
      kicker: 'Film Archive',
      body: `Feisk has feature films connected to platforms including Netflix, Amazon Prime, VIU, Astro and Tubi.

Use this window later as a browsable catalogue with posters, trailers, synopses and platform links.`
    },
    {
      id: 'short-films',
      label: 'Short Films',
      symbol: '▣',
      title: 'Notable Short Films',
      kicker: 'Festival Archive',
      body: `Feisk regularly produces short films, mainly in the horror and thriller genre.

CAN YOU LOVE ME MOST? won Best Short Film at the 32nd Festival Filem Malaysia in 2022.`
    },
    {
      id: 'development-slate',
      label: 'Development',
      symbol: '✦',
      title: 'Development Slate',
      kicker: 'Locked Projects',
      body: `Current projects listed by Feisk include Curi Makan, Writers, Send Tudes and Selendangs & Shotguns.

This folder can become a teaser area for future releases.`
    },
    {
      id: 'iskander-file',
      label: 'Iskander',
      symbol: 'I',
      title: 'Iskander Azizuddin',
      kicker: 'Producer Profile',
      body: `Iskander is a Malaysian film producer with over 15 years of experience in the creative and media industry.

His projects have been presented at markets and labs including Asian Film Market, Singapore's Southeast Asian Film Financing Forum and Luang Prabang Talent Lab.`
    },
    {
      id: 'feisal-file',
      label: 'Feisal',
      symbol: 'A',
      title: 'Feisal Azizuddin',
      kicker: 'Filmmaker Profile',
      body: `Feisal is a Malaysian filmmaker whose short films often explore social issues in Malaysia.

His work has screened at festivals including Jogja-NETPAC Asian Film Festival, Monterrey International Film Festival, Bangkok ASEAN Film Festival, Mini Film Festival, Kinosaurus Jakarta and George Town Festival.`
    },
    {
      id: 'contact-file',
      label: 'Contact',
      symbol: '@',
      title: 'Contact',
      kicker: 'Transmission Line',
      body: `Connect with Feisk Productions:

get.creative@feisk.com.my`
    }
  ]
};
