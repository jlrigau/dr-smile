/* =========================================================
   GAME DEFINITION — "Dr Smile"
   ---------------------------------------------------------
   This file is the ENTIRE game: data + asset references.
   The engine (engine.js) contains no game content; it reads
   this `window.GAME` object.

   Dr Smile — a gentle dentist game for a 6–7 year old who is
   starting to read (French). You are "Dr Smile" in a cosy
   little clinic. Tap a child: you walk over and the view
   ZOOMS onto their open mouth; cute little germs sit on the
   teeth and the child scrubs them off with a finger. When
   every tooth is clean → sparkles, the patient beams a huge
   smile, leaves radiant, and you earn a star. Stars make
   the clinic grow richer (balloons, aquarium, teddy…).
   No stress, no failure, nothing scary, almost no text.

   All art is generated from tools/art/drsmile.cjs (SVG → PNG, CC0).
   ========================================================= */

window.GAME = {
  /* ---- Identity, theming, UI strings (French) ---- */
  meta: {
    title: "Dr Smile",
    titleIcon: "tooth",
    logo: "assets/img/logo.webp",
    splash: "assets/img/splash.webp",   // full-screen illustration behind the home & create screens
    shortName: "Dr Smile",
    tagline: "Brosse les dents et rends tout le monde heureux !",
    saveKey: "dr-smile",
    audience: { minAge: 6, notes: "young kids (6–7), gentle, cute, no stress, no fear, no pain/blood/scary tools, minimal text" },
    assetVersion: "v29",
    theme: { home: "#ffe0e9", play: "#cdeee6", closeup: "#fff1f6" },

    showCoins: true,
    coinIcon: "star",                  // "stars": one per patient made to smile
    showDay: false,                    // keep the HUD tiny for young kids
    showCreatureCount: false,

    namePrompt: { label: "Nomme ton cabinet :", placeholder: "Cabinet Tout Sourire" },
    startName: "Mon cabinet",
    namePromptYou: "Ton prénom",
    avatarPrompt: "Choisis ton ou ta dentiste",
    createTitle: "Choisis ton ou ta dentiste",
    createOkLabel: "C'est parti !",
    startLabel: "Jouer",
    continueLabel: "Continuer",
    continueHint: "Tes patients t'attendent !",
    helpTitle: "{i:help} Comment jouer",
    ageUnit: "", and: "et",

    nightMessage: "{i:sparkle}",
    restBlockedHint: "Occupe-toi d'abord d'un enfant !",
    neglectMessage: "De nouveaux enfants arrivent !",
    morningMessage: "{i:sparkle} De nouveaux sourires t'attendent !",
    idleHint: "Appuie sur un enfant pour le soigner",
    strings: {
      closeLabel: "Fermer", soundLabel: "Son", coinsLabel: "Étoiles", noSave: "Pas de partie sauvegardée.", refreshLabel: "Rafraîchir",
    },
  },

  /* ---- Illustrated UI icons (tools/art/drsmile.cjs → assets/ui/icons). Any text can embed {i:key}. ---- */
  icons: {
    star: "assets/ui/icons/star.webp", heart: "assets/ui/icons/heart.webp", heartEmpty: "assets/ui/icons/heartEmpty.webp", sound: "assets/ui/icons/sound.webp",
    soundOff: "assets/ui/icons/soundOff.webp", help: "assets/ui/icons/help.webp", avatar: "assets/ui/icons/avatar.webp", goals: "assets/ui/icons/goals.webp",
    close: "assets/ui/icons/close.webp", play: "assets/ui/icons/play.webp", resume: "assets/ui/icons/resume.webp", check: "assets/ui/icons/check.webp",
    gift: "assets/ui/icons/gift.webp", hand: "assets/ui/icons/hand.webp", sparkle: "assets/ui/icons/sparkle.webp", bell: "assets/ui/icons/bell.webp",
    refresh: "assets/ui/icons/refresh.webp", arrow: "assets/ui/icons/arrow.webp", trophy: "assets/ui/icons/trophy.webp", joy: "assets/ui/icons/joy.webp",
    tooth: "assets/ui/icons/tooth.webp", brush: "assets/ui/icons/brush.webp", germ: "assets/ui/icons/germ.webp", kid: "assets/ui/icons/kid.webp",
  },

  /* ---- Look & feel: soft hi-res art, gentle sunlight motes ---- */
  render: {
    pixelArt: false,
    vignette: 0.1,
    selectColor: "#ff8fb3",
    text: { color: "#ffffff", stroke: "#4a3a4e" },
    label: { bg: "#ffffff", color: "#3da99e", border: "#ff8fb3", alpha: 0.95, size: 20 },
    ambient: { particle: "soft", colors: ["#ffffff", "#fff3b0", "#ffd6e6"], count: 16, speed: 7, drift: "up", alpha: [0.15, 0.45], scale: [0.4, 1.0] },
    confetti: ["#ff8fb3", "#5ec7bd", "#ffd24a", "#a8d8ff", "#c3a6ff", "#ffffff"],
  },

  /* ---- Sound: soft procedural sounds + a cheerful little tune ---- */
  audio: {
    volume: 0.65,
    music: { tempo: 100, root: 60, scale: "majorPenta", progression: [0, 5, 7, 5], pad: "sine", lead: "triangle", density: 0.45, volume: 0.16 },
  },

  /* ---- A bouncing arrow shows which child needs you (non-readers) ---- */
  guide: { idle: 3, color: "#ff6f9c", scale: 1.4 },

  /* ---- World: a small cosy clinic (a closed room) ---- */
  world: { width: 1400, height: 1100, groundTile: "floor", bg: "#f3d9b1" },
  camera: { fitW: 560, fitH: 660, min: 0.6, max: 1.25, clampToWorld: true },

  /* ---- Assets (all generated, CC0) ---- */
  assets: {
    images: {
      floor: { path: "assets/img/floor.webp", res: 2 }, rug: "assets/img/rug.webp", doormat: { path: "assets/img/doormat.webp", res: 2 },
      wall: { path: "assets/img/wall.webp", res: 2 }, wall_left: { path: "assets/img/wall_left.webp", res: 2 }, wall_right: { path: "assets/img/wall_right.webp", res: 2 }, wall_bottom: { path: "assets/img/wall_bottom.webp", res: 2 },
      chair: { path: "assets/img/chair.webp", res: 2 }, reception: { path: "assets/img/reception.webp", res: 2 },
      plant: { path: "assets/img/plant.webp", res: 2 }, plant_b: { path: "assets/img/plant_b.webp", res: 2 }, toothsign: { path: "assets/img/toothsign.webp", res: 2 },
      bench: { path: "assets/img/bench.webp", res: 2 }, toybox: { path: "assets/img/toybox.webp", res: 2 },
      // unlockable decorations (the clinic grows with each star)
      balloons: { path: "assets/img/balloons.webp", res: 2 }, aquarium: { path: "assets/img/aquarium.webp", res: 2 }, teddy: { path: "assets/img/teddy.webp", res: 2 },
      rainbow_rug: { path: "assets/img/rainbow_rug.webp", res: 2 }, trophy: { path: "assets/img/trophy.webp", res: 2 },
      // close-up mini-scene: each child's open mouth + their big smile afterwards
      mouth_leo: { path: "assets/img/mouth_leo.webp", res: 2 }, mouth_leo_done: { path: "assets/img/mouth_leo_done.webp", res: 2 },
      mouth_mila: { path: "assets/img/mouth_mila.webp", res: 2 }, mouth_mila_done: { path: "assets/img/mouth_mila_done.webp", res: 2 },
      mouth_sacha: { path: "assets/img/mouth_sacha.webp", res: 2 }, mouth_sacha_done: { path: "assets/img/mouth_sacha_done.webp", res: 2 },
      mouth_lou: { path: "assets/img/mouth_lou.webp", res: 2 }, mouth_lou_done: { path: "assets/img/mouth_lou_done.webp", res: 2 },
      mouth_tom: { path: "assets/img/mouth_tom.webp", res: 2 }, mouth_tom_done: { path: "assets/img/mouth_tom_done.webp", res: 2 },
      mouth_zoe: { path: "assets/img/mouth_zoe.webp", res: 2 }, mouth_zoe_done: { path: "assets/img/mouth_zoe_done.webp", res: 2 },
      germ_green: "assets/img/germ_green.webp", germ_purple: "assets/img/germ_purple.webp", germ_orange: "assets/img/germ_orange.webp",
      brush: "assets/img/brush.webp",
      want: { path: "assets/img/want.webp", res: 2 },       // "needs care" bubble floating over a child with dirty teeth
    },
    sheets: {
      drsmile: { path: "assets/sheet/drsmile.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      drsmile_pink: { path: "assets/sheet/drsmile_pink.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      // the child patients — a worried sheet (arriving) and a happy sheet (cured)
      kid_leo: { path: "assets/sheet/kid_leo.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_leo_happy: { path: "assets/sheet/kid_leo_happy.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_mila: { path: "assets/sheet/kid_mila.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_mila_happy: { path: "assets/sheet/kid_mila_happy.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_sacha: { path: "assets/sheet/kid_sacha.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_sacha_happy: { path: "assets/sheet/kid_sacha_happy.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_lou: { path: "assets/sheet/kid_lou.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_lou_happy: { path: "assets/sheet/kid_lou_happy.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_tom: { path: "assets/sheet/kid_tom.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_tom_happy: { path: "assets/sheet/kid_tom_happy.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_zoe: { path: "assets/sheet/kid_zoe.webp", frameWidth: 128, frameHeight: 128, res: 2 },
      kid_zoe_happy: { path: "assets/sheet/kid_zoe_happy.webp", frameWidth: 128, frameHeight: 128, res: 2 },
    },
  },

  /* ---- Player (Dr Smile) ---- */
  player: {
    scale: 0.92,
    speed: { walk: 240, run: 400 },
    spawn: { x: 700, y: 990 },
    nameY: -128,
    shadow: { w: 40, h: 12 },
  },
  characters: [
    { id: "mint", name: "Dr Smile", sheet: "drsmile", thumb: "assets/ui/drsmile_thumb.webp" },
    { id: "rose", name: "Dr Rose", sheet: "drsmile_pink", thumb: "assets/ui/drsmile_pink_thumb.webp" },
  ],

  /* ---- Patients: tap a child → walk over → the open-mouth mini-scene starts ----
     "propre" + "sourire" drive their mood and are filled to 100 when the mouth is
     fully cleaned. No bars, no reading. */
  creature: {
    label: "enfants", icon: "kid",
    sheet: "kid_leo",                 // base/fallback sheet (every patient has a variant)
    scale: 0.9,
    origin: { x: 0.5, y: 0.95 },
    headY: 100,
    shadow: { w: 52, h: 14 },
    walk: { start: 0, end: 3, frameRate: 6, hop: 4, hopPeriod: 240, speed: 42 },
    arrive: { speed: 130 },
    tapAction: "treat",               // one tap on a child = walk over AND open the mouth (young kids)
    // Above each child: a "needs care" bubble (tooth + germ) — it pops up now and then
    // (intermittent, desynced per child) while their teeth are dirty, and stops once cured.
    wantBubble: { sprite: "want", need: "propre", below: 100, scale: 0.55, lift: 6,
                  intermittent: true, showFor: 2.5, hideMin: 4, hideMax: 9 },
    moodNeed: "sourire",
    moodFrom: ["propre", "sourire"],
    moodDay: { base: 0, lowPenalty: 0, lowAt: 0, highBonus: 0, highAt: 200 },
    showBars: false,                  // young kids: no bars
    showMood: false,                  // the "needs care" bubble already says it all
    needs: [
      { id: "propre", icon: "tooth", start: 0, perDay: -95 },   // arrives with dirty teeth
      { id: "sourire", icon: "joy", start: 25, perDay: -60 }, // arrives a bit worried
    ],
    actions: [
      { id: "treat", type: "closeup", label: "Soigner", icon: "brush", color: "#5ec7bd",
        closeup: {
          bg: "mouth_leo", bgDone: "mouth_leo_done",              // overridden per child (variant.closeupBg / closeupBgDone)
          spotSprites: ["germ_green", "germ_purple", "germ_orange"], brush: "brush",
          brushTip: { x: 0.21, y: 0.27 },   // active scrub point = the bristle head of the brush sprite
          // germs ramp up as the child cures more patients (the progression)
          spots: { base: 3, growEvery: 2, max: 8, rubs: 3, size: 86, minGap: 0.06,
                   // two rows (fractions of the face image): upper + lower teeth
                   area: [ { x: 0.30, y: 0.548, w: 0.40, h: 0.02 },     // printed by `node tools/art/drsmile.cjs`
                           { x: 0.349, y: 0.626, w: 0.302, h: 0.006 } ] },
          finishParticles: ["star", "heart", "sparkle", "joy"],
          popParticles: ["sparkle", "star"],
          foam: { colors: ["#ffffff", "#e8fbff", "#dff6f0"] },
        },
        effects: { propre: 100, sourire: 100 }, reward: 1, stat: "smile",
        message: "{i:star}",
        celebrateMessage: "{i:joy} Bravo ! {name} a un sourire tout neuf !" },
    ],
    celebrate: { mode: "hop", particle: "heart", colors: ["#ff9ec4", "#ffd24a", "#a8e6ff", "#7fd06f"], count: 12 },
    // After being cured & celebrating, the child walks out happily through the door.
    depart: { to: { x: 700, y: 1170 }, speed: 130,
              emptyMessage: "{i:bell} Bravo ! Sonne la cloche pour faire venir d'autres enfants !" },

    // The child patients: boys & girls, each a person with their own sprite, face and name.
    variants: [
      { id: "leo", name: "Léo", fixedName: true, sheet: "kid_leo", happySheet: "kid_leo_happy", closeupBg: "mouth_leo", closeupBgDone: "mouth_leo_done", thumb: "assets/ui/kid_leo.webp", color: "#5aa9e6" },
      { id: "mila", name: "Mila", fixedName: true, sheet: "kid_mila", happySheet: "kid_mila_happy", closeupBg: "mouth_mila", closeupBgDone: "mouth_mila_done", thumb: "assets/ui/kid_mila.webp", color: "#ff8fb3" },
      { id: "sacha", name: "Sacha", fixedName: true, sheet: "kid_sacha", happySheet: "kid_sacha_happy", closeupBg: "mouth_sacha", closeupBgDone: "mouth_sacha_done", thumb: "assets/ui/kid_sacha.webp", color: "#6cc47a" },
      { id: "lou", name: "Lou", fixedName: true, sheet: "kid_lou", happySheet: "kid_lou_happy", closeupBg: "mouth_lou", closeupBgDone: "mouth_lou_done", thumb: "assets/ui/kid_lou.webp", color: "#ffd24a" },
      { id: "tom", name: "Tom", fixedName: true, sheet: "kid_tom", happySheet: "kid_tom_happy", closeupBg: "mouth_tom", closeupBgDone: "mouth_tom_done", thumb: "assets/ui/kid_tom.webp", color: "#ef6a6a" },
      { id: "zoe", name: "Zoé", fixedName: true, sheet: "kid_zoe", happySheet: "kid_zoe_happy", closeupBg: "mouth_zoe", closeupBgDone: "mouth_zoe_done", thumb: "assets/ui/kid_zoe.webp", color: "#b48ae6" },
    ],

    names: ["Nina", "Hugo", "Jade", "Sami", "Lina", "Noé"],
    startCount: 3,                     // a few children to start; ring the bell for more
    startCreatures: [
      { name: "Léo", variant: "leo" },
      { name: "Mila", variant: "mila" },
      { name: "Lou", variant: "lou" },
    ],
  },

  /* ---- The care room: a soft rug where patients wait ---- */
  zones: [
    { id: "room", home: true, rect: { x: 330, y: 430, w: 740, h: 540 }, floor: "rug" },
  ],

  /* ---- Reception desk: ring the big golden bell to bring a fresh group of children ---- */
  stations: [
    { type: "desk", x: 700, y: 352, sprite: "reception", scale: 0.9, label: "Accueil", labelY: 30, icon: "bell", color: "#ff8fb3", hint: "La cloche fait entrer de nouveaux enfants",
      box: { dx: -138, dy: -66, w: 276, h: 70 }, reach: 130, tapRadius: 110,
      action: "spawn", actionLabel: "Sonner la cloche",
      spawn: { min: 3, max: 4, cap: 6, from: { x: 700, y: 1090 },
               message: "{i:bell} Ding ! De nouveaux enfants arrivent !",
               fullMessage: "Le cabinet est déjà plein !" } },
  ],

  /* ---- The clinic: walls, door, the big chair (centrepiece), plants & toys ---- */
  scenery: [
    { x: 0, y: 0, sprite: "wall", origin: { x: 0, y: 0 }, depth: 0, box: { dx: 0, dy: 0, w: 1400, h: 262 } },
    { x: 0, y: 0, sprite: "wall_left", origin: { x: 0, y: 0 }, depth: 5, box: false },
    { x: 1360, y: 0, sprite: "wall_right", origin: { x: 0, y: 0 }, depth: 5, box: false },
    { x: 0, y: 1040, sprite: "wall_bottom", origin: { x: 0, y: 0 }, depth: 1200, box: false },
    { x: 700, y: 1000, sprite: "doormat", ground: true, scale: 0.9 },
    { x: 700, y: 700, sprite: "chair", scale: 0.78, box: { dx: -64, dy: -46, w: 128, h: 50 } },
    { x: 100, y: 360, sprite: "plant", scale: 0.85, anim: "sway", box: { dx: -28, dy: -14, w: 56, h: 18 } },
    { x: 1300, y: 360, sprite: "plant_b", scale: 0.85, anim: "sway", box: { dx: -28, dy: -14, w: 56, h: 18 } },
    { x: 110, y: 990, sprite: "plant_b", scale: 0.8, anim: "sway", box: { dx: -26, dy: -14, w: 52, h: 18 } },
    { x: 1290, y: 990, sprite: "plant", scale: 0.8, anim: "sway", box: { dx: -26, dy: -14, w: 52, h: 18 } },
    { x: 180, y: 600, sprite: "bench", scale: 0.68, box: { dx: -84, dy: -30, w: 168, h: 34 } },
    { x: 1215, y: 620, sprite: "toybox", scale: 0.7, box: { dx: -56, dy: -30, w: 112, h: 34 } },
    { x: 400, y: 1010, sprite: "toothsign", scale: 0.55, anim: "sway", box: { dx: -12, dy: -8, w: 24, h: 12 } },
  ],

  /* ---- Unlocks: every few stars the clinic gets a new surprise (no reading needed) ---- */
  unlocks: [
    { id: "balloons", when: { stat: "smile", atLeast: 2 }, message: "{i:gift} Des ballons pour le cabinet !",
      scenery: { x: 500, y: 410, sprite: "balloons", scale: 0.68, anim: "bob", box: { dx: -14, dy: -10, w: 28, h: 12 } } },
    { id: "aquarium", when: { stat: "smile", atLeast: 4 }, message: "{i:gift} Un aquarium avec des poissons !",
      scenery: { x: 1210, y: 860, sprite: "aquarium", scale: 0.7, box: { dx: -72, dy: -24, w: 144, h: 28 } } },
    { id: "teddy", when: { stat: "smile", atLeast: 6 }, message: "{i:gift} Un gros nounours tout doux !",
      scenery: { x: 200, y: 830, sprite: "teddy", scale: 0.68, anim: "breathe", box: { dx: -40, dy: -14, w: 80, h: 18 } } },
    { id: "rainbow", when: { stat: "smile", atLeast: 9 }, message: "{i:gift} Un tapis arc-en-ciel !",
      scenery: { x: 1020, y: 1000, sprite: "rainbow_rug", ground: true, scale: 0.55 } },
    { id: "trophy", when: { stat: "smile", atLeast: 12 }, message: "{i:trophy} Le trophée du meilleur dentiste !",
      scenery: { x: 900, y: 420, sprite: "trophy", scale: 0.6, glow: "#ffd24a", glowY: 70, box: { dx: -26, dy: -12, w: 52, h: 16 } } },
  ],

  /* ---- No objectives screen: too much reading for this age (kept off). ---- */

  /* ---- Help screen (short sentences for early readers / a parent) ---- */
  help: [
    "<b>Bienvenue chez Dr Smile !</b>",
    "{i:hand} <b>Appuie sur un enfant</b> : tu vas vers lui et sa bouche s'ouvre en grand.",
    "{i:brush} <b>Frotte les microbes</b> {i:germ} avec ton doigt pour les faire partir !",
    "{i:star} <b>Bravo !</b> L'enfant a un grand sourire et tu gagnes une étoile.",
    "{i:gift} <b>Surprises</b> : avec les étoiles, ton cabinet se remplit de cadeaux.",
    "{i:bell} <b>La cloche</b> de l'accueil fait entrer de nouveaux enfants.",
    "{i:avatar} {i:sound} change de dentiste ou coupe le son. Le jeu se sauvegarde tout seul.",
  ],
};
