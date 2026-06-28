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
    assetVersion: "v21",
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
    closeLabel: "Fermer",              // aria-label of the close-up's ✖ button (a11y)
    ageUnit: "", and: "et",

    nightMessage: "✨",
    restBlockedHint: "Occupe-toi d'abord d'un enfant ! 😊",
    neglectMessage: "🌅 De nouveaux enfants arrivent ! 😄",
    morningMessage: "🌅 De nouveaux sourires t'attendent ! ✨",
    idleHint: "Va voir un enfant 🦷, ou sonne la cloche 🔔 à l'accueil pour en faire venir d'autres.",
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
      // close-up mini-scene: one face backdrop per child + the spot & brush
      mouth_leo: "assets/img/mouth_leo.png",
      mouth_mila: "assets/img/mouth_mila.png",
      mouth_sacha: "assets/img/mouth_sacha.png",
      mouth_lou: "assets/img/mouth_lou.png",
      mouth_tom: "assets/img/mouth_tom.png",
      mouth_zoe: "assets/img/mouth_zoe.png",
      spot: "assets/img/spot.png",
      brush: "assets/img/brush.png",
      want: "assets/img/want.png",       // "needs care" bubble floating over a child with dirty teeth
    },
    sheets: {
      drsmile: { path: "assets/sheet/drsmile.png", frameWidth: 64, frameHeight: 64 },
      drsmile_pink: { path: "assets/sheet/drsmile_pink.png", frameWidth: 64, frameHeight: 64 },
      // the child patients — each its own 4-frame sheet (boys & girls)
      kid_leo: { path: "assets/sheet/kid_leo.png", frameWidth: 64, frameHeight: 64 },
      kid_mila: { path: "assets/sheet/kid_mila.png", frameWidth: 64, frameHeight: 64 },
      kid_sacha: { path: "assets/sheet/kid_sacha.png", frameWidth: 64, frameHeight: 64 },
      kid_lou: { path: "assets/sheet/kid_lou.png", frameWidth: 64, frameHeight: 64 },
      kid_tom: { path: "assets/sheet/kid_tom.png", frameWidth: 64, frameHeight: 64 },
      kid_zoe: { path: "assets/sheet/kid_zoe.png", frameWidth: 64, frameHeight: 64 },
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
    label: "enfants", icon: "🦷",
    sheet: "kid_leo",                 // base/fallback sheet (every patient has a variant)
    scale: 1.0,
    origin: { x: 0.5, y: 0.9 },
    walk: { start: 0, end: 3, frameRate: 5 },
    // Above each child: a "needs care" bubble (dirty tooth) instead of an abstract mood heart.
    // It pops up now and then (intermittent, desynced per child) while their teeth are dirty —
    // like the kids occasionally piping up "viens t'occuper de moi" — and stops once cured.
    wantBubble: { sprite: "want", need: "propre", below: 100, scale: 0.6, lift: 8,
                  intermittent: true, showFor: 2.5, hideMin: 5, hideMax: 12 },
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
          bg: "mouth_leo", spotSprite: "spot", brush: "brush",   // bg overridden per child (variant.closeupBg)
          brushTip: { x: 0.28, y: 0.16 },   // active scrub point = the bristle head of the brush sprite
          // spots ramp up as the child cures more patients (the progression)
          spots: { base: 4, growEvery: 2, max: 8, rubs: 3, size: 56,
                   // two zones (fractions of the face image): upper + lower teeth.
                   // Spots alternate between them so both rows get dirty.
                   area: [ { x: 0.36, y: 0.50, w: 0.28, h: 0.045 },
                           { x: 0.37, y: 0.665, w: 0.26, h: 0.038 } ] },
          finishParticles: ["⭐", "💖", "✨", "🌟", "😄"],
        },
        effects: { propre: 100, sourire: 100 }, reward: 1, stat: "smile",
        message: "🌟",
        celebrateMessage: "💖 Bravo ! {name} a un sourire tout neuf ! 🌟" },
    ],
    celebrate: { mode: "hop", particle: "heart", colors: ["#ff9ec4", "#ffd24a", "#a8e6ff", "#7fd06f"], count: 10 },
    // After being cured & celebrating, the child walks out happily and leaves.
    depart: { to: { x: 700, y: 1080 },
              emptyMessage: "🔔 Bravo ! Sonne la cloche pour faire venir d'autres enfants !" },

    // The child patients: boys & girls, each its own sprite (animated per-variant).
    variants: [
      { id: "leo", name: "Léo", sheet: "kid_leo", closeupBg: "mouth_leo", color: "#5aa9e6" },       // boy
      { id: "mila", name: "Mila", sheet: "kid_mila", closeupBg: "mouth_mila", color: "#ff8fb3" },   // girl
      { id: "sacha", name: "Sacha", sheet: "kid_sacha", closeupBg: "mouth_sacha", color: "#6cc47a" }, // boy
      { id: "lou", name: "Lou", sheet: "kid_lou", closeupBg: "mouth_lou", color: "#ffd24a" },       // girl
      { id: "tom", name: "Tom", sheet: "kid_tom", closeupBg: "mouth_tom", color: "#ef6a6a" },       // boy
      { id: "zoe", name: "Zoé", sheet: "kid_zoe", closeupBg: "mouth_zoe", color: "#b48ae6" },       // girl
    ],

    names: ["Léo", "Mila", "Sacha", "Lou", "Tom", "Zoé", "Nina", "Hugo", "Jade", "Sami", "Lina", "Noé"],
    startCount: 4,                     // a few children to start; ring the bell for more
    startCreatures: [
      { name: "Léo", variant: "leo" },
      { name: "Mila", variant: "mila" },
      { name: "Sacha", variant: "sacha" },
      { name: "Lou", variant: "lou" },
    ],
  },

  /* ---- The care room (no fence: a cosy rug where patients gather) ---- */
  zones: [
    { id: "room", home: true, rect: { x: 360, y: 280, w: 680, h: 520 },
      fence: false, tint: "#bfe6df", tintAlpha: 0.55, label: "Cabinet dentaire" },
  ],

  /* ---- Reception desk: ring the bell to bring a fresh group of children ---- */
  stations: [
    { type: "desk", x: 700, y: 165, sprite: "reception", scale: 1.0, label: "Accueil",
      box: { dx: -58, dy: -56, w: 116, h: 70 },
      action: "spawn", actionLabel: "🔔 Faire venir des enfants",
      spawn: { min: 3, max: 5, cap: 6,
               message: "🔔 De nouveaux enfants arrivent ! 😄",
               fullMessage: "Le cabinet est déjà plein ! 😊" } },
  ],

  /* ---- Cosy scenery: the big chair (centrepiece) + plants & happy-tooth signs ---- */
  scenery: [
    [700, 560, "chair", 1.4, { dx: -26, dy: -20, w: 52, h: 28 }],
    [420, 350, "plant", 1.2, { dx: -12, dy: -8, w: 24, h: 12 }],
    [990, 350, "plant", 1.2, { dx: -12, dy: -8, w: 24, h: 12 }],
    [410, 740, "toothsign", 0.55, { dx: -10, dy: -8, w: 20, h: 12 }],
    [1000, 740, "toothsign", 0.55, { dx: -10, dy: -8, w: 20, h: 12 }],
    [200, 520, "plant", 1.3, { dx: -12, dy: -8, w: 24, h: 12 }],
    [1210, 520, "plant", 1.3, { dx: -12, dy: -8, w: 24, h: 12 }],
  ],

  /* ---- No objectives screen: too much reading for this age (kept off). ---- */

  /* ---- Help screen (short sentences for early readers / a parent) ---- */
  help: [
    "<b>Bienvenue chez Dr Smile ! 🦷</b>",
    "<b>👣 Va voir un enfant</b> : appuie sur lui ou marche jusqu'à lui.",
    "<b>🦷 Soigner</b> : la bouche s'ouvre en grand.",
    "<b>🪥 Frotte les taches</b> avec ton doigt pour toutes les enlever !",
    "<b>🌟 Bravo !</b> L'enfant repart avec un beau sourire et tu gagnes une étoile.",
    "<b>🔔 La cloche</b> fait entrer de nouveaux enfants.",
    "<b>🦷 (en haut)</b> : change de dentiste. 💾 Le jeu se sauvegarde tout seul.",
  ],
};
