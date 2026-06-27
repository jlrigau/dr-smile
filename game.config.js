/* =========================================================
   GAME DEFINITION — "Dr Smile"
   ---------------------------------------------------------
   This file is the ENTIRE game: data + asset references.
   The engine (engine.js) contains no game content; it reads
   this `window.GAME` object. Swap this file + assets to make
   a brand-new game from the same engine.

   Dr Smile — a gentle dentist game for a 6–7 year old who is
   starting to read (French). You are "Dr Smile" in a cosy
   little clinic. Patients arrive a bit grumpy with dirty
   teeth; you take care of them in 4 easy steps, always in the
   same order, until their smile shines:
     👀 Regarder → 🪥 Brosser → 💧 Rincer → ✨ Sourire
   Each smile given = one star (🌟). No stress, no failure,
   nothing scary. Collect "sticker" goals and climb the
   ranks: Dr Smile débutant → confirmé → champion du sourire.

   All textures are generated (Pillow) and original (CC0).
   ========================================================= */

window.GAME = {
  /* ---- Identity, theming, UI strings (French) ---- */
  meta: {
    title: "Dr Smile",
    titleIcon: "🦷",
    shortName: "Dr Smile",
    tagline: "Prends soin des dents et rends tout le monde heureux !",
    saveKey: "dr-smile",
    audience: { minAge: 6, notes: "young kids (6–7), gentle, cute, no stress, no fear, no pain/blood/scary tools" },
    assetVersion: "v1",
    theme: { home: "#ffe0e9", play: "#eaf6f2" },

    showCoins: true,
    coinIcon: "🌟",                    // "stars" earned, one per smile given

    namePrompt: { label: "Nomme ton cabinet :", placeholder: "Cabinet Tout Sourire" },
    startName: "Mon cabinet",
    namePromptYou: "Ton prénom",
    avatarPrompt: "Choisis ton ou ta dentiste",
    createTitle: "🦷 Choisis ton ou ta dentiste",
    createOkLabel: "✅ C'est parti !",
    startLabel: "▶ Nouvelle partie",
    continueLabel: "📂 Continuer",
    continueHint: "Une partie est sauvegardée : appuie sur « Continuer ». 🦷",
    helpTitle: "❓ Comment jouer",
    ageUnit: "", and: "et",

    nightMessage: "✨ Les patients rentrent chez eux, tout fiers ! ✨",
    restBlockedHint: "Occupe-toi d'abord d'un patient ! 😊",
    neglectMessage: "🌅 Jour {day} : {names} ont hâte de voir Dr Smile ! 😄",
    morningMessage: "🌅 Jour {day} : de nouveaux sourires t'attendent ! ✨",
    idleHint: "Promène-toi 👣 et va voir un patient pour t'occuper de ses dents.",
  },

  /* ---- World: a small cosy clinic ---- */
  world: {
    width: 1400, height: 1000, groundTile: "floor", bg: "#eaf6f2",
  },
  camera: { fitW: 720, fitH: 760, min: 0.55, max: 1.1 },

  /* ---- Assets (all generated, CC0) ---- */
  assets: {
    images: {
      floor: "assets/img/floor.png",
      chair: "assets/img/chair.png",
      plant: "assets/img/plant.png",
      toothsign: "assets/img/toothsign.png",
      reception: "assets/img/reception.png",
    },
    sheets: {
      drsmile: { path: "assets/sheet/drsmile.png", frameWidth: 64, frameHeight: 64 },
      drsmile_pink: { path: "assets/sheet/drsmile_pink.png", frameWidth: 64, frameHeight: 64 },
      patient: { path: "assets/sheet/patient.png", frameWidth: 64, frameHeight: 64 },
    },
  },

  /* ---- Player (Dr Smile) ---- */
  player: {
    scale: 1.6,
    speed: { walk: 200, run: 360 },
    spawn: { x: 700, y: 760 },
  },
  characters: [
    { id: "mint", name: "Dr Smile", sheet: "drsmile", thumb: "drsmile_thumb" },
    { id: "rose", name: "Dr Rose", sheet: "drsmile_pink", thumb: "drsmile_pink_thumb" },
  ],

  /* ---- Patients (the creature system): 4 gentle care steps, always in order ----
     "propre" doubles as the cleanliness bar AND the step gate (each step needs the
     previous one done). "sourire" is the mood: patients arrive grumpy and leave radiant. */
  creature: {
    label: "patients", icon: "🦷",
    sheet: "patient",
    scale: 1.0,
    origin: { x: 0.5, y: 0.9 },
    walk: { start: 0, end: 3, frameRate: 5 },
    moodIcon: "heart",
    moodNeed: "sourire",
    moodFrom: ["propre", "sourire"],
    // overnight rule neutralised (decay handled by needs.perDay below)
    moodDay: { base: 0, lowPenalty: 0, lowAt: 0, highBonus: 0, highAt: 200 },
    needs: [
      { id: "propre", icon: "🦷", start: 0, perDay: -95 },   // arrives with dirty teeth
      { id: "sourire", icon: "😊", start: 25, perDay: -60 }, // arrives a bit grumpy
    ],
    actions: [
      { id: "look", label: "Regarder", icon: "👀",
        effects: { propre: 10, sourire: 8 }, stat: "look",
        anim: { motion: "nod", particle: "bubble", colors: ["#bfe9ff", "#ffffff"], count: 4, y0: 40 },
        message: "Oh, des petites taches sur les dents ! 🦷" },

      { id: "brush", label: "Brosser", icon: "🪥",
        require: { propre: 10 }, tooLow: "Regarde d'abord dans la bouche ! 👀",
        effects: { propre: 40, sourire: 22 }, stat: "brush",
        anim: { motion: "bounce", particle: "spark", colors: ["#ffffff", "#bff3ff", "#fff2a8"], count: 8, y0: 42 },
        message: "Frotte frotte… les taches s'en vont ! ✨" },

      { id: "rinse", label: "Rincer", icon: "💧",
        require: { propre: 50 }, tooLow: "Brosse d'abord les dents ! 🪥",
        effects: { propre: 50, sourire: 25 }, stat: "rinse",
        anim: { motion: "nod", particle: "bubble", colors: ["#9fd8ff", "#d8f1ff", "#ffffff"], count: 9, y0: 44 },
        message: "Glou glou… les dents brillent toutes blanches ! 💧" },

      { id: "smile", label: "Sourire", icon: "✨",
        require: { propre: 100 }, tooLow: "Rince d'abord les dents ! 💧",
        effects: { sourire: 100 }, reward: 1, stat: "smile",
        anim: { motion: "hop", particle: "star", colors: ["#fff2a8", "#ffd24a", "#ff9ec4", "#a8e6ff"], count: 10 },
        message: "Quel beau sourire ! Tu gagnes une étoile ! 🌟",
        celebrateMessage: "{name} rayonne de bonheur ! 💖🌟" },
    ],
    celebrate: { mode: "hop", particle: "heart", colors: ["#ff9ec4", "#ffd24a", "#a8e6ff", "#7fd06f"], count: 10,
      message: "💖 Hourra, un sourire tout neuf ! 💖" },

    // Different-coloured patients (tints of the one patient sheet) for variety.
    variants: [
      { id: "sun", name: "Soleil", color: "#ffd86b", tint: "#ffe39a" },
      { id: "sky", name: "Ciel", color: "#86c8ff", tint: "#a7d8ff" },
      { id: "leaf", name: "Pomme", color: "#9fe08f", tint: "#b6e8b0" },
      { id: "rose", name: "Bonbon", color: "#ff9fc0", tint: "#ffc4d6" },
      { id: "lilac", name: "Myrtille", color: "#c0a8ff", tint: "#d3c1ff" },
    ],

    names: ["Léo", "Mila", "Pilou", "Lou", "Nino", "Doudou", "Bibou", "Gribouille", "Câlin", "Zoé", "Tom", "Lila"],
    startCount: 4,
    startCreatures: [
      { name: "Léo", variant: "sky" },
      { name: "Mila", variant: "rose" },
      { name: "Pilou", variant: "sun" },
      { name: "Lou", variant: "leaf" },
    ],
  },

  /* ---- The care room (no fence: a cosy rug where patients gather) ---- */
  zones: [
    { id: "room", home: true, rect: { x: 360, y: 280, w: 680, h: 520 },
      fence: false, tint: "#bfe6df", tintAlpha: 0.55, label: "Cabinet de Dr Smile" },
  ],

  /* ---- Reception desk: ring the bell to welcome the next patients (new day) ---- */
  stations: [
    { type: "rest", x: 700, y: 165, sprite: "reception", scale: 1.0, label: "Accueil",
      box: { dx: -58, dy: -56, w: 116, h: 70 },
      action: "nextDay", actionLabel: "🔔 Faire entrer les patients" },
  ],

  /* ---- Cosy scenery: the big chair (centrepiece) + plants & happy-tooth signs ---- */
  scenery: [
    [700, 560, "chair", 1.4, { dx: -26, dy: -20, w: 52, h: 28 }],
    [420, 350, "plant", 1.2, { dx: -12, dy: -8, w: 24, h: 12 }],
    [990, 350, "plant", 1.2, { dx: -12, dy: -8, w: 24, h: 12 }],
    [410, 740, "toothsign", 1.1, { dx: -10, dy: -8, w: 20, h: 12 }],
    [1000, 740, "toothsign", 1.1, { dx: -10, dy: -8, w: 20, h: 12 }],
    [200, 520, "plant", 1.3, { dx: -12, dy: -8, w: 24, h: 12 }],
    [1210, 520, "plant", 1.3, { dx: -12, dy: -8, w: 24, h: 12 }],
  ],

  /* ---- Sticker album = goals; finishing a level is a little reward party ---- */
  objectives: {
    levels: [
      { name: "Dr Smile débutant", goals: [
        { id: "look1", name: "👀 Premier coup d'œil", desc: "Regarder dans une bouche", check: (s) => s.stats.look >= 1 },
        { id: "brush1", name: "🪥 Brosse magique", desc: "Brosser des dents", check: (s) => s.stats.brush >= 1 },
        { id: "smile1", name: "🌟 Premier sourire", desc: "Rendre un sourire", check: (s) => s.stats.smile >= 1 },
      ] },
      { name: "Dr Smile confirmé", goals: [
        { id: "stars5", name: "🦷 Dent en or", desc: "Gagner 5 étoiles", check: (s) => s.coins >= 5 },
        { id: "rinse5", name: "💧 Pro du rinçage", desc: "Rincer 5 fois", check: (s) => s.stats.rinse >= 5 },
        { id: "radiant3", name: "💖 Trois sourires éclatants", desc: "Rendre 3 patients radieux", check: (s) => s.creatures.filter((c) => c.sourire >= 100).length >= 3 },
      ] },
      { name: "Champion du sourire", goals: [
        { id: "stars12", name: "🌈 Brosse arc-en-ciel", desc: "Gagner 12 étoiles", check: (s) => s.coins >= 12 },
        { id: "smile10", name: "🏆 Dix sourires", desc: "Rendre 10 sourires", check: (s) => s.stats.smile >= 10 },
        { id: "allhappy", name: "😄 Cabinet tout heureux", desc: "Tout le monde radieux en même temps", check: (s) => s.creatures.length > 0 && s.creatures.every((c) => c.sourire >= 100) },
      ] },
    ],
  },

  /* ---- Help screen (short sentences for early readers) ---- */
  help: [
    "<b>Bienvenue chez Dr Smile ! 🦷</b>",
    "<b>👣 Bouge :</b> appuie où tu veux aller. Tu peux aussi appuyer sur un patient.",
    "<b>🪑 Un patient :</b> va tout près, puis fais ses soins dans l'ordre :",
    "<b>1) 👀 Regarder</b> · <b>2) 🪥 Brosser</b> · <b>3) 💧 Rincer</b> · <b>4) ✨ Sourire</b>",
    "<b>🌟 Étoiles :</b> chaque sourire rendu te donne une étoile !",
    "<b>🔔 Accueil :</b> sonne la cloche pour faire entrer de nouveaux patients.",
    "<b>🎯 Autocollants :</b> gagne des autocollants et deviens champion du sourire !",
    "<b>🦷 (en haut) :</b> change de dentiste. 💾 Le jeu se sauvegarde tout seul.",
  ],
};
