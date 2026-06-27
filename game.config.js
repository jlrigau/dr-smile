/* =========================================================
   GAME DEFINITION — "Dr Smile"
   ---------------------------------------------------------
   This file is the ENTIRE game: data + asset references.
   The engine (engine.js) contains no game content; it reads
   this `window.GAME` object.

   Dr Smile — a gentle dentist game for a 6–7 year old who is
   starting to read (French). You are "Dr Smile" in a cosy
   little clinic. Walk up to a patient, then the view ZOOMS
   onto their open mouth: little stains appear on the teeth
   and the child scrubs them off one by one with a finger.
   When every tooth is clean → sparkles, the patient leaves
   radiant, and you earn a star (🌟). No stress, no failure,
   nothing scary, almost no text — it's all touch + visuals.

   All textures are generated (Pillow) and original (CC0).
   ========================================================= */

window.GAME = {
  /* ---- Identity, theming, UI strings (French) ---- */
  meta: {
    title: "Dr Smile",
    titleIcon: "🦷",
    shortName: "Dr Smile",
    tagline: "Brosse les dents et rends tout le monde heureux !",
    saveKey: "dr-smile",
    audience: { minAge: 6, notes: "young kids (6–7), gentle, cute, no stress, no fear, no pain/blood/scary tools, minimal text" },
    assetVersion: "v3",
    theme: { home: "#ffe0e9", play: "#eaf6f2" },

    showCoins: true,
    coinIcon: "🌟",                    // "stars": one per patient made to smile
    showDay: false,                    // keep the HUD tiny for young kids
    showCreatureCount: false,

    namePrompt: { label: "Nomme ton cabinet :", placeholder: "Cabinet Tout Sourire" },
    startName: "Mon cabinet",
    namePromptYou: "Ton prénom",
    avatarPrompt: "Choisis ton ou ta dentiste",
    createTitle: "🦷 Choisis ton ou ta dentiste",
    createOkLabel: "✅ C'est parti !",
    startLabel: "▶ Jouer",
    continueLabel: "📂 Continuer",
    continueHint: "Appuie sur « Continuer » pour reprendre. 🦷",
    helpTitle: "❓ Comment jouer",
    ageUnit: "", and: "et",

    nightMessage: "✨",
    restBlockedHint: "Occupe-toi d'abord d'un patient ! 😊",
    neglectMessage: "🌅 De nouveaux patients arrivent ! 😄",
    morningMessage: "🌅 De nouveaux sourires t'attendent ! ✨",
    idleHint: "Va voir un patient pour t'occuper de ses dents ! 🦷",
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
      // close-up mini-scene
      mouth: "assets/img/mouth.png",
      spot: "assets/img/spot.png",
      brush: "assets/img/brush.png",
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

  /* ---- Patients: one big tap-friendly action → the open-mouth mini-scene ----
     "propre" + "sourire" drive the mood heart (grumpy red → radiant green) and
     are filled to 100 when the mouth is fully cleaned. No bars, no reading. */
  creature: {
    label: "patients", icon: "🦷",
    sheet: "patient",
    scale: 1.0,
    origin: { x: 0.5, y: 0.9 },
    walk: { start: 0, end: 3, frameRate: 5 },
    moodIcon: "heart",
    moodNeed: "sourire",
    moodFrom: ["propre", "sourire"],
    moodDay: { base: 0, lowPenalty: 0, lowAt: 0, highBonus: 0, highAt: 200 },
    showBars: false,                  // young kids: rely on the mood heart, not bars
    needs: [
      { id: "propre", icon: "🦷", start: 0, perDay: -95 },   // arrives with dirty teeth
      { id: "sourire", icon: "😊", start: 25, perDay: -60 }, // arrives a bit grumpy
    ],
    actions: [
      { id: "treat", type: "closeup", label: "Soigner", icon: "🦷",
        closeup: {
          bg: "mouth", spotSprite: "spot", brush: "brush",
          // spots ramp up as the child cures more patients (the progression)
          spots: { base: 4, growEvery: 2, max: 8, rubs: 3, size: 64,
                   area: { x: 0.30, y: 0.375, w: 0.40, h: 0.09 } },   // upper teeth only
          finishParticles: ["⭐", "💖", "✨", "🌟", "😄"],
        },
        effects: { propre: 100, sourire: 100 }, reward: 1, stat: "smile",
        message: "🌟",
        celebrateMessage: "💖 Bravo ! {name} a un sourire tout neuf ! 🌟" },
    ],
    celebrate: { mode: "hop", particle: "heart", colors: ["#ff9ec4", "#ffd24a", "#a8e6ff", "#7fd06f"], count: 10 },

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

  /* ---- Reception desk: ring the bell to welcome new patients ---- */
  stations: [
    { type: "rest", x: 700, y: 165, sprite: "reception", scale: 1.0, label: "Accueil",
      box: { dx: -58, dy: -56, w: 116, h: 70 },
      action: "nextDay", actionLabel: "🔔 Nouveaux patients" },
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

  /* ---- No objectives screen: too much reading for this age (kept off). ---- */

  /* ---- Help screen (short sentences for early readers / a parent) ---- */
  help: [
    "<b>Bienvenue chez Dr Smile ! 🦷</b>",
    "<b>👣 Va voir un patient</b> : appuie sur lui ou marche jusqu'à lui.",
    "<b>🦷 Soigner</b> : la bouche s'ouvre en grand.",
    "<b>🪥 Frotte les taches</b> avec ton doigt pour toutes les enlever !",
    "<b>🌟 Bravo !</b> Le patient repart avec un beau sourire et tu gagnes une étoile.",
    "<b>🔔 La cloche</b> fait entrer de nouveaux patients.",
    "<b>🦷 (en haut)</b> : change de dentiste. 💾 Le jeu se sauvegarde tout seul.",
  ],
};
