/*
  Feisk Productions Vault data file
  Keep all clickable scene objects configured here.

  Position and size values are percentages relative to the 16:9 scene.
  Replace placeholder asset paths when final PNGs are ready.
*/

const FEISK_ASSETS = {
  backgrounds: {
    bunkerRoom: 'assets/backgrounds/bunker-room.png'
  },
  props: [
    {
      id: 'computer-terminal',
      title: 'Computer Terminal',
      kicker: 'Production Archive',
      body: 'Access project files, development notes, screen tests, production logs, and secret bunker records from Feisk Productions.',
      src: 'assets/props/computer-terminal.png',
      alt: 'Clickable computer terminal',
      x: 58,
      y: 48,
      width: 18,
      height: 23
    },
    {
      id: 'notice-board',
      title: 'Notice Board',
      kicker: 'Mission Wall',
      body: 'A wall of pinned clues, schedules, treatments, posters, references, and plans from current and upcoming Feisk Productions projects.',
      src: 'assets/props/notice-board.png',
      alt: 'Clickable notice board',
      x: 16,
      y: 18,
      width: 21,
      height: 28
    },
    {
      id: 'film-reel',
      title: 'Film Reel',
      kicker: 'Screening Vault',
      body: 'Recovered footage, trailers, behind-the-scenes material, festival cuts, and fragments from the Feisk Productions cinematic archive.',
      src: 'assets/props/film-reel.png',
      alt: 'Clickable film reel',
      x: 75,
      y: 69,
      width: 11,
      height: 15
    }
  ]
};
