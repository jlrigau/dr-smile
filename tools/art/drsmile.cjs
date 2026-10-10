/*
 * Dr Smile — all game art as parametric SVG (rendered to PNG).
 *   node .claude/skills/_shared/render-svg.cjs tools/art/drsmile.cjs [--only kid_,mouth_]
 * One source of truth per thing: each child (KIDS) drives its in-world sprite, its
 * happy sprite, its open-mouth close-up and its "after" smile; the tooth mascot
 * (tooth()) drives the app icon, the logo and the in-room signs.
 */
const K = require("../../.claude/skills/_shared/svg-kit.cjs");
const IK = require("../../.claude/skills/_shared/icon-kit.cjs");
const { sheet, job, shade, mix, lin, rad, glow, blur, rng, star } = K;

const INK = "#4a3a4e";                   // soft plum outline (friendlier than black)
const PINK = "#ff8fb3", MINT = "#5ec7bd", MINT_D = "#3da99e", CREAM = "#fff8ef";

/* ======================= Children ======================= */
const KIDS = {
  leo:   { skin: "#f6d2b5", hair: "#7a4a2a", style: "short",    shirt: "#5aa9e6", pants: "#3f5a8a", eyes: "#5a3a2a" },
  mila:  { skin: "#f9dcc4", hair: "#b5652e", style: "pigtails", shirt: "#ff8fb3", pants: "#ff8fb3", dress: true, eyes: "#4a6a3a" },
  sacha: { skin: "#e8b98f", hair: "#f2c94c", style: "messy",    shirt: "#6cc47a", pants: "#4a6b8a", eyes: "#3a5a8a" },
  lou:   { skin: "#8d5a3b", hair: "#2b1d16", style: "puff",     shirt: "#ffd24a", pants: "#7a5ab0", eyes: "#2a1a12" },
  tom:   { skin: "#f3c9a8", hair: "#d9622b", style: "cap",      shirt: "#ef6a6a", pants: "#3f5a8a", eyes: "#3a5a8a", cap: "#4a90d9" },
  zoe:   { skin: "#c98b62", hair: "#1f1a24", style: "bob",      shirt: "#b48ae6", pants: "#b48ae6", dress: true, eyes: "#2a1a12" },
};

// Hair drawn around a head centred at (cx,cy) of radius r. layer: "back" | "front".
function hair(k, cx, cy, r, layer, view) {
  const H = k.hair, HD = shade(H, -0.25), s = r / 30;
  const st = `stroke="${INK}" stroke-width="${3 * s}" stroke-linejoin="round"`;
  if (view === "back") {   // back of the head: the whole cap is hair
    let g = `<circle cx="${cx}" cy="${cy}" r="${r + 1.5 * s}" fill="${H}" ${st}/>`;
    if (k.style === "pigtails") g += `<circle cx="${cx - r * 1.05}" cy="${cy + r * 0.2}" r="${r * 0.42}" fill="${H}" ${st}/><circle cx="${cx + r * 1.05}" cy="${cy + r * 0.2}" r="${r * 0.42}" fill="${H}" ${st}/>`;
    if (k.style === "puff") g += `<circle cx="${cx}" cy="${cy - r * 1.0}" r="${r * 0.55}" fill="${H}" ${st}/>`;
    if (k.style === "cap") g += `<path d="M${cx - r * 1.02} ${cy - r * 0.05} A${r * 1.02} ${r * 1.02} 0 0 1 ${cx + r * 1.02} ${cy - r * 0.05} Z" fill="${k.cap}" ${st}/>`;
    return g;
  }
  if (layer === "back") {
    if (k.style === "pigtails") return `<circle cx="${cx - r * 1.08}" cy="${cy + r * 0.15}" r="${r * 0.42}" fill="${H}" ${st}/><circle cx="${cx + r * 1.08}" cy="${cy + r * 0.15}" r="${r * 0.42}" fill="${H}" ${st}/>
      <circle cx="${cx - r * 0.86}" cy="${cy - r * 0.2}" r="${r * 0.14}" fill="${PINK}" ${st}/><circle cx="${cx + r * 0.86}" cy="${cy - r * 0.2}" r="${r * 0.14}" fill="${PINK}" ${st}/>`;
    if (k.style === "puff") return `<circle cx="${cx}" cy="${cy - r * 1.0}" r="${r * 0.55}" fill="${H}" ${st}/>`;
    if (k.style === "bob") return `<path d="M${cx - r * 1.12} ${cy + r * 0.55} Q${cx - r * 1.25} ${cy - r * 1.2} ${cx} ${cy - r * 1.1} Q${cx + r * 1.25} ${cy - r * 1.2} ${cx + r * 1.12} ${cy + r * 0.55} Z" fill="${H}" ${st}/>`;
    return "";
  }
  // front fringe
  if (k.style === "short") return `<path d="M${cx - r} ${cy - r * 0.05} Q${cx - r * 1.05} ${cy - r * 1.15} ${cx} ${cy - r * 1.08} Q${cx + r * 1.05} ${cy - r * 1.15} ${cx + r} ${cy - r * 0.05} Q${cx + r * 0.6} ${cy - r * 0.6} ${cx + r * 0.1} ${cy - r * 0.45} Q${cx - r * 0.3} ${cy - r * 0.75} ${cx - r} ${cy - r * 0.05} Z" fill="${H}" ${st}/>`;
  if (k.style === "messy") {
    let d = `M${cx - r * 1.02} ${cy}`;
    const tips = [[-1.1, -0.6], [-0.85, -1.15], [-0.35, -1.0], [-0.1, -1.35], [0.3, -1.05], [0.75, -1.2], [1.08, -0.55]];
    tips.forEach(([a, b], i) => { d += ` Q${cx + (a - 0.12) * r} ${cy + (b + 0.25) * r} ${cx + a * r} ${cy + b * r}`; });
    d += ` L${cx + r * 1.02} ${cy} Q${cx + r * 0.4} ${cy - r * 0.55} ${cx} ${cy - r * 0.35} Q${cx - r * 0.5} ${cy - r * 0.6} ${cx - r * 1.02} ${cy} Z`;
    return `<path d="${d}" fill="${H}" ${st}/>`;
  }
  if (k.style === "pigtails" || k.style === "bob") return `<path d="M${cx - r * 1.03} ${cy + r * 0.1} Q${cx - r * 1.1} ${cy - r * 1.15} ${cx} ${cy - r * 1.1} Q${cx + r * 1.1} ${cy - r * 1.15} ${cx + r * 1.03} ${cy + r * 0.1} Q${cx + r * 0.95} ${cy - r * 0.45} ${cx + r * 0.3} ${cy - r * 0.42} L${cx + r * 0.15} ${cy - r * 0.62} L${cx - r * 0.05} ${cy - r * 0.4} Q${cx - r * 0.85} ${cy - r * 0.45} ${cx - r * 1.03} ${cy + r * 0.1} Z" fill="${H}" ${st}/>`;
  if (k.style === "puff") return `<path d="M${cx - r * 1.02} ${cy - r * 0.05} Q${cx - r * 1.0} ${cy - r * 1.1} ${cx} ${cy - r * 1.08} Q${cx + r * 1.0} ${cy - r * 1.1} ${cx + r * 1.02} ${cy - r * 0.05} Q${cx + r * 0.5} ${cy - r * 0.55} ${cx} ${cy - r * 0.55} Q${cx - r * 0.5} ${cy - r * 0.55} ${cx - r * 1.02} ${cy - r * 0.05} Z" fill="${H}" ${st}/>
      <path d="M${cx - r * 0.5} ${cy - r * 0.95} Q${cx} ${cy - r * 1.15} ${cx + r * 0.5} ${cy - r * 0.95}" fill="none" stroke="${PINK}" stroke-width="${5 * s}" stroke-linecap="round"/>`;
  if (k.style === "cap") return `<path d="M${cx - r * 1.0} ${cy - r * 0.12} Q${cx - r * 0.95} ${cy - r * 0.45} ${cx - r * 0.7} ${cy - r * 0.35} L${cx + r * 0.7} ${cy - r * 0.35} Q${cx + r * 0.95} ${cy - r * 0.45} ${cx + r * 1.0} ${cy - r * 0.12} Q${cx + r * 0.8} ${cy - r * 0.26} ${cx + r * 0.6} ${cy - r * 0.24} L${cx - r * 0.6} ${cy - r * 0.24} Q${cx - r * 0.8} ${cy - r * 0.26} ${cx - r * 1.0} ${cy - r * 0.12} Z" fill="${H}" ${st}/>
      <path d="M${cx - r * 1.04} ${cy - r * 0.3} A${r * 1.04} ${r * 1.04} 0 0 1 ${cx + r * 1.04} ${cy - r * 0.3} Z" fill="${k.cap}" ${st}/>
      <path d="M${cx - r * 1.15} ${cy - r * 0.32} Q${cx - r * 0.2} ${cy - r * 0.05} ${cx + r * 0.25} ${cy - r * 0.32} Z" fill="${shade(k.cap, -0.2)}" ${st}/>
      <circle cx="${cx}" cy="${cy - r * 1.04}" r="${r * 0.12}" fill="${shade(k.cap, -0.2)}"/>`;
  return "";
}

// A face (eyes, cheeks, mouth) for a head at (cx,cy,r). mood: "worried" | "happy" | "smile"
function face(k, cx, cy, r, mood, look) {
  const s = r / 30, lx = (look || 0) * r * 0.12;
  const ey = cy + r * 0.05, ex = r * 0.36;
  let g = "";
  if (mood === "happy") {
    [-1, 1].forEach((d) => { g += `<path d="M${cx + d * ex - r * 0.17 + lx} ${ey + r * 0.04} Q${cx + d * ex + lx} ${ey - r * 0.2} ${cx + d * ex + r * 0.17 + lx} ${ey + r * 0.04}" fill="none" stroke="${INK}" stroke-width="${3.4 * s}" stroke-linecap="round"/>`; });
  } else {
    [-1, 1].forEach((d) => {
      g += `<ellipse cx="${cx + d * ex + lx}" cy="${ey}" rx="${r * 0.12}" ry="${r * 0.16}" fill="${INK}"/>`;
      g += `<circle cx="${cx + d * ex + lx - r * 0.04}" cy="${ey - r * 0.06}" r="${r * 0.05}" fill="#fff"/>`;
    });
    if (mood === "worried") [-1, 1].forEach((d) => { g += `<path d="M${cx + d * (ex - r * 0.15) + lx} ${ey - r * 0.36} L${cx + d * (ex + r * 0.15) + lx} ${ey - r * 0.27}" stroke="${shade(k.hair, -0.1)}" stroke-width="${3 * s}" stroke-linecap="round"/>`; });
  }
  g += `<ellipse cx="${cx - r * 0.58 + lx}" cy="${cy + r * 0.32}" rx="${r * 0.15}" ry="${r * 0.09}" fill="#ff7f9a" opacity="${mood === "worried" ? 0.25 : 0.5}"/>`;
  g += `<ellipse cx="${cx + r * 0.58 + lx}" cy="${cy + r * 0.32}" rx="${r * 0.15}" ry="${r * 0.09}" fill="#ff7f9a" opacity="${mood === "worried" ? 0.25 : 0.5}"/>`;
  const my = cy + r * 0.42;
  if (mood === "worried") g += `<path d="M${cx - r * 0.18 + lx} ${my + r * 0.05} Q${cx - r * 0.09 + lx} ${my - r * 0.04} ${cx + lx} ${my + r * 0.04} Q${cx + r * 0.09 + lx} ${my + r * 0.12} ${cx + r * 0.18 + lx} ${my + r * 0.02}" fill="none" stroke="${INK}" stroke-width="${2.8 * s}" stroke-linecap="round"/>`;
  else g += `<path d="M${cx - r * 0.3 + lx} ${my - r * 0.06} Q${cx + lx} ${my + r * 0.36} ${cx + r * 0.3 + lx} ${my - r * 0.06} Z" fill="#9b3a4e" stroke="${INK}" stroke-width="${2.6 * s}" stroke-linejoin="round"/>
    <path d="M${cx - r * 0.24 + lx} ${my - r * 0.03} L${cx + r * 0.24 + lx} ${my - r * 0.03} L${cx + r * 0.2 + lx} ${my + r * 0.07} L${cx - r * 0.2 + lx} ${my + r * 0.07} Z" fill="#ffffff"/>`;
  return g;
}

// A kid, 3/4 front, in a 128×128 frame (feet ≈ y 122). step: -1..1 (walk), mood
function kid(k, step, mood, u) {
  const bob = Math.abs(step) * -2.5, cx = 64, hy = 44 + bob, r = 25;
  const st = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  const defs = rad(`${u}s`, [[0, shade(k.skin, 0.18)], [1, k.skin]], 0.4, 0.35, 0.7) + lin(`${u}c`, [[0, shade(k.shirt, 0.15)], [1, shade(k.shirt, -0.1)]]);
  let g = `<ellipse cx="64" cy="122" rx="${24 - Math.abs(step) * 3}" ry="5" fill="#000" opacity=".0"/>`;
  // legs + shoes
  [-1, 1].forEach((d) => {
    const lift = d === Math.sign(step) ? Math.abs(step) * 6 : 0;
    const x = cx + d * 9;
    g += `<rect x="${x - 5.5}" y="${98 + bob}" width="11" height="${20 - lift}" rx="5" fill="${k.dress ? k.skin : k.pants}" ${st}/>`;
    g += `<ellipse cx="${x + d * 1.5}" cy="${119 - lift}" rx="9" ry="5.5" fill="#6a5a7a" ${st}/>`;
  });
  // arms (swing opposite)
  [-1, 1].forEach((d) => {
    const sw = -d * step * 14;
    g += `<g transform="rotate(${d * 12 + sw} ${cx + d * 16} ${76 + bob})"><rect x="${cx + d * 16 - 5.5}" y="${74 + bob}" width="11" height="22" rx="5.5" fill="${k.shirt}" ${st}/><circle cx="${cx + d * 16}" cy="${97 + bob}" r="5.5" fill="${k.skin}" ${st}/></g>`;
  });
  // body (t-shirt or dress)
  if (k.dress) g += `<path d="M${cx - 15} ${70 + bob} L${cx + 15} ${70 + bob} L${cx + 24} ${104 + bob} Q${cx} ${110 + bob} ${cx - 24} ${104 + bob} Z" fill="url(#${u}c)" ${st}/><path d="M${cx - 19} ${96 + bob} Q${cx} ${101 + bob} ${cx + 19} ${96 + bob}" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>`;
  else g += `<rect x="${cx - 17}" y="${70 + bob}" width="34" height="32" rx="12" fill="url(#${u}c)" ${st}/><circle cx="${cx}" cy="${86 + bob}" r="5" fill="#fff" opacity=".75"/>`;
  // head
  g += hair(k, cx, hy, r, "back");
  g += `<circle cx="${cx}" cy="${hy}" r="${r}" fill="url(#${u}s)" ${st}/>`;
  g += `<ellipse cx="${cx - r}" cy="${hy + 3}" rx="5" ry="7" fill="${k.skin}" ${st}/><ellipse cx="${cx + r}" cy="${hy + 3}" rx="5" ry="7" fill="${k.skin}" ${st}/>`;
  g += face(k, cx, hy + 2, r, mood, -0.6);
  g += hair(k, cx, hy, r, "front");
  if (mood === "happy") g += `<path d="${star(cx + 30, hy - 26, 7, 2.6, 4)}" fill="#ffd24a" stroke="${INK}" stroke-width="1.5"/>`;
  return { defs, body: g };
}
function kidSheet(id, mood) {
  const k = KIDS[id];
  const steps = [0.0, 1, 0, -1];
  let defs = ""; const frames = steps.map((s, i) => { const r = kid(k, s, mood, `k${i}`); defs += r.defs; return r.body; });
  return job(`assets/sheet/kid_${id}${mood === "happy" ? "_happy" : ""}.png`, 512, 128, sheet(frames, 128, 128, 4), defs);
}

/* ======================= Dentists (LPC 9×4: up, left, down, right) ======================= */
const DOCS = {
  drsmile: { skin: "#f3cfb0", hair: "#5a3a26", style: "doc", coat: "#ffffff", trim: MINT, shirt: MINT, pants: "#4a5a7a", eyes: "#3a2a1a" },
  drsmile_pink: { skin: "#e6b08c", hair: "#2b1d16", style: "ponytail", coat: "#ffffff", trim: PINK, shirt: PINK, pants: "#6a5a8a", eyes: "#2a1a12" },
};
function docHair(k, cx, cy, r, dir, layer) {
  const H = k.hair, st = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  if (dir === "up") {
    let g = `<circle cx="${cx}" cy="${cy}" r="${r + 1.5}" fill="${H}" ${st}/>`;
    if (k.style === "ponytail") g += `<path d="M${cx - 9} ${cy + r * 0.2} Q${cx - 14} ${cy + r * 1.1} ${cx} ${cy + r * 1.45} Q${cx + 14} ${cy + r * 1.1} ${cx + 9} ${cy + r * 0.2} Z" fill="${H}" ${st}/><circle cx="${cx}" cy="${cy + r * 0.22}" r="5" fill="${PINK}" ${st}/>`;
    return g;
  }
  if (dir === "down") {
    if (layer === "back") return k.style === "ponytail" ? `<circle cx="${cx + r * 0.95}" cy="${cy - r * 0.1}" r="${r * 0.38}" fill="${H}" ${st}/>` : "";
    return `<path d="M${cx - r * 1.02} ${cy + r * 0.05} Q${cx - r * 1.05} ${cy - r * 1.18} ${cx} ${cy - r * 1.1} Q${cx + r * 1.05} ${cy - r * 1.18} ${cx + r * 1.02} ${cy + r * 0.05} Q${cx + r * 0.8} ${cy - r * 0.5} ${cx + r * 0.1} ${cy - r * 0.55} Q${cx - r * 0.4} ${cy - r * 0.35} ${cx - r * 0.75} ${cy - r * 0.62} Q${cx - r * 0.95} ${cy - r * 0.35} ${cx - r * 1.02} ${cy + r * 0.05} Z" fill="${H}" ${st}/>`;
  }
  // side (facing left): hair cap covering the back half
  let g = `<path d="M${cx - r * 0.75} ${cy - r * 0.65} Q${cx} ${cy - r * 1.25} ${cx + r * 0.95} ${cy - r * 0.45} Q${cx + r * 1.15} ${cy + r * 0.35} ${cx + r * 0.6} ${cy + r * 0.75} Q${cx + r * 0.25} ${cy + r * 0.1} ${cx - r * 0.1} ${cy - r * 0.35} Q${cx - r * 0.5} ${cy - r * 0.35} ${cx - r * 0.75} ${cy - r * 0.65} Z" fill="${H}" ${st}/>`;
  if (k.style === "ponytail") g = `<path d="M${cx + r * 0.85} ${cy - r * 0.2} Q${cx + r * 1.7} ${cy + r * 0.2} ${cx + r * 1.2} ${cy + r * 0.95} Q${cx + r * 1.0} ${cy + r * 0.4} ${cx + r * 0.75} ${cy + r * 0.25} Z" fill="${H}" ${st}/>` + g;
  return g;
}
function dentist(k, dir, phase, moving, u) {
  const step = moving ? Math.sin(phase) : 0, bob = moving ? -Math.abs(Math.sin(phase)) * 3 : 0;
  const cx = 64, hy = 38 + bob, r = 27;
  const st = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  const defs = rad(`${u}s`, [[0, shade(k.skin, 0.18)], [1, k.skin]], 0.4, 0.35, 0.7) + lin(`${u}c`, [[0, "#ffffff"], [1, "#e6eef2"]]);
  const side = dir === "left" || dir === "right";
  let g = "";
  // legs
  if (side) {
    [1, -1].forEach((d) => {
      const a = d * step * 26;
      g += `<g transform="rotate(${a} ${cx} ${96 + bob})"><rect x="${cx - 6}" y="${94 + bob}" width="12" height="25" rx="6" fill="${d > 0 ? shade(k.pants, -0.15) : k.pants}" ${st}/><ellipse cx="${cx - 3}" cy="${119 + bob}" rx="9.5" ry="5.5" fill="#5a4a6a" ${st}/></g>`;
    });
  } else {
    [-1, 1].forEach((d) => {
      const lift = moving ? Math.max(0, d * step) * 7 : 0;
      g += `<rect x="${cx + d * 9 - 6}" y="${94 + bob}" width="12" height="${25 - lift}" rx="6" fill="${k.pants}" ${st}/>`;
      g += `<ellipse cx="${cx + d * 10}" cy="${119 - lift + bob}" rx="9.5" ry="5.5" fill="#5a4a6a" ${st}/>`;
    });
  }
  // back arm (side view)
  const arm = (x, ang, front) => `<g transform="rotate(${ang} ${x} ${66 + bob})"><rect x="${x - 6}" y="${63 + bob}" width="12" height="28" rx="6" fill="${front ? k.coat : "#dfe7ec"}" ${st}/><circle cx="${x}" cy="${92 + bob}" r="6" fill="${k.skin}" ${st}/></g>`;
  if (side) g += arm(cx + 2, -step * 30, false);
  else g += arm(cx - 21, 10 + step * 14, true) + arm(cx + 21, -10 + step * 14, true);
  // coat body
  g += `<path d="M${cx - 20} ${62 + bob} Q${cx} ${56 + bob} ${cx + 20} ${62 + bob} L${cx + 23} ${101 + bob} Q${cx} ${106 + bob} ${cx - 23} ${101 + bob} Z" fill="url(#${u}c)" ${st}/>`;
  if (dir === "down") {
    g += `<path d="M${cx - 9} ${60 + bob} L${cx} ${78 + bob} L${cx + 9} ${60 + bob} Z" fill="${k.shirt}" ${st}/>`;
    g += `<path d="M${cx} ${78 + bob} L${cx} ${103 + bob}" stroke="${INK}" stroke-width="2"/>`;
    g += `<rect x="${cx + 6}" y="${84 + bob}" width="10" height="9" rx="2" fill="${k.trim}" opacity=".9"/>`;
    // little tooth badge
    g += `<path d="M${cx - 16} ${82 + bob} q2 -4 5 -1 q3 -3 5 1 q0 6 -2 9 q-1 -3 -3 -3 q-2 0 -3 3 q-2 -3 -2 -9 Z" fill="#fff" stroke="${k.trim}" stroke-width="1.6"/>`;
  } else if (side) {
    g += `<path d="M${cx - 18} ${64 + bob} L${cx - 12} ${100 + bob}" stroke="${k.trim}" stroke-width="3"/>`;
  } else {
    g += `<path d="M${cx} ${62 + bob} L${cx} ${103 + bob}" stroke="#d5dee4" stroke-width="2.5"/>`;
  }
  // head
  if (dir === "up") {
    g += docHair(k, cx, hy, r, "up");
    g += `<path d="M${cx - r} ${hy - 6} Q${cx} ${hy - 14} ${cx + r} ${hy - 6}" fill="none" stroke="#cfd8de" stroke-width="5"/>`;
  } else if (dir === "down") {
    g += docHair(k, cx, hy, r, "down", "back");
    g += `<circle cx="${cx}" cy="${hy}" r="${r}" fill="url(#${u}s)" ${st}/>`;
    g += `<ellipse cx="${cx - r}" cy="${hy + 3}" rx="5" ry="7" fill="${k.skin}" ${st}/><ellipse cx="${cx + r}" cy="${hy + 3}" rx="5" ry="7" fill="${k.skin}" ${st}/>`;
    g += face(k, cx, hy + 3, r, "smile", 0);
    g += docHair(k, cx, hy, r, "down");
    // the dentist's head mirror
    g += `<path d="M${cx - r * 0.95} ${hy - r * 0.45} Q${cx} ${hy - r * 0.78} ${cx + r * 0.95} ${hy - r * 0.45}" fill="none" stroke="#9fb3c0" stroke-width="3.5"/>`;
    g += `<circle cx="${cx + r * 0.38}" cy="${hy - r * 0.72}" r="${r * 0.3}" fill="#e8f6ff" stroke="${INK}" stroke-width="2.5"/><circle cx="${cx + r * 0.3}" cy="${hy - r * 0.8}" r="${r * 0.1}" fill="#fff"/>`;
  } else {
    const fl = dir === "right" ? `transform="translate(128,0) scale(-1,1)"` : "";
    g += `<g ${fl}>`;
    g += `<circle cx="${cx}" cy="${hy}" r="${r}" fill="url(#${u}s)" ${st}/>`;
    g += `<path d="M${cx - r * 0.9} ${hy - r * 0.02} Q${cx - r * 1.2} ${hy + r * 0.16} ${cx - r * 0.93} ${hy + r * 0.32}" fill="${k.skin}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    g += `<ellipse cx="${cx - r * 0.45}" cy="${hy + r * 0.05}" rx="${r * 0.11}" ry="${r * 0.15}" fill="${INK}"/><circle cx="${cx - r * 0.49}" cy="${hy - r * 0.02}" r="${r * 0.04}" fill="#fff"/>`;
    g += `<ellipse cx="${cx - r * 0.55}" cy="${hy + r * 0.38}" rx="${r * 0.13}" ry="${r * 0.08}" fill="#ff7f9a" opacity=".5"/>`;
    g += `<path d="M${cx - r * 0.75} ${hy + r * 0.5} Q${cx - r * 0.6} ${hy + r * 0.62} ${cx - r * 0.45} ${hy + r * 0.52}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
    g += docHair(k, cx, hy, r, "left");
    g += `<ellipse cx="${cx + r * 0.25}" cy="${hy + r * 0.1}" rx="${r * 0.14}" ry="${r * 0.18}" fill="${k.skin}" ${st}/>`;
    g += `<path d="M${cx - r * 0.9} ${hy - r * 0.5} Q${cx - r * 0.2} ${hy - r * 0.95} ${cx + r * 0.6} ${hy - r * 0.62}" fill="none" stroke="#9fb3c0" stroke-width="3.5"/>`;
    g += `<ellipse cx="${cx - r * 0.65}" cy="${hy - r * 0.72}" rx="${r * 0.14}" ry="${r * 0.28}" fill="#e8f6ff" stroke="${INK}" stroke-width="2.5"/>`;
    g += `</g>`;
    g += `<g ${fl}>${arm(cx - 2, step * 30, true)}</g>`;
  }
  return { defs, body: g };
}
function docSheet(name) {
  const k = DOCS[name], dirs = ["up", "left", "down", "right"];
  let defs = "", frames = [];
  dirs.forEach((d, r) => { for (let i = 0; i < 9; i++) { const res = dentist(k, d, ((i - 1) / 8) * Math.PI * 2, i > 0, `d${r}${i}`); defs += res.defs; frames.push(res.body); } });
  return job(`assets/sheet/${name}.png`, 128 * 9, 512, sheet(frames, 128, 128, 9), defs);
}
function docThumb(name) { const r = dentist(DOCS[name], "down", 0, false, "t"); return job(`assets/ui/${name}_thumb.png`, 128, 128, r.body, r.defs); }
function kidThumb(id) { const r = kid(KIDS[id], 0, "happy", "t"); return job(`assets/ui/kid_${id}.png`, 128, 128, r.body, r.defs); }

/* ======================= Close-up faces (open mouth / happy smile) ======================= */
// Geometry (900×1300): the open mouth is a "D" between corners (250,712) and (650,712).
// MOUTH_TEETH() returns the teeth boxes; `node tools/art/drsmile.cjs` prints the spot
// areas to paste into game.config.js (closeup.spots.area).
const FW = 900, FH = 1300;
const ML = { x: 212, y: 686 }, MR = { x: 688, y: 686 };
const topY = (x) => { const t = (x - ML.x) / (MR.x - ML.x); return ML.y - 4 * 66 * t * (1 - t) / 2; };   // quadratic, control (450,620)
// bottom edge: cubic (650,712) → (640,900) (260,900) → (250,712); sample to look up y(x)
const BOT = (() => { const pts = []; for (let i = 0; i <= 200; i++) { const t = i / 200, u = 1 - t;
  pts.push([u * u * u * 688 + 3 * u * u * t * 684 + 3 * u * t * t * 216 + t * t * t * 212, u * u * u * 686 + 3 * u * u * t * 990 + 3 * u * t * t * 990 + t * t * t * 686]); } return pts; })();
const botY = (x) => { let best = BOT[0]; BOT.forEach((p) => { if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p; }); return best[1]; };
// lower gum line: quadratic from (250, botY(250)-40) via (450, botY(450)+4) to (650, botY(650)-40)
const gumY = (x) => { const t = (x - 250) / 400, a = botY(250) - 40, c = botY(450) + 4, b = botY(650) - 40; return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b; };
const MOUTH_D = `M${ML.x} ${ML.y} Q450 620 ${MR.x} ${MR.y} C684 990 216 990 ${ML.x} ${ML.y} Z`;
function MOUTH_TEETH() {
  const up = [], lo = [];
  const uxs = [-180, -112, -38, 38, 112, 180];
  uxs.forEach((dx) => { const x = 450 + dx, w = Math.abs(dx) > 150 ? 62 : 72, y0 = topY(x) + 26, h = Math.abs(dx) > 150 ? 56 : (Math.abs(dx) > 80 ? 66 : 74); up.push({ x, w, y0, y1: y0 + h }); });
  const lxs = [-136, -68, 0, 68, 136];
  lxs.forEach((dx) => { const x = 450 + dx, w = 64, y1 = gumY(x) + 10, h = Math.abs(dx) > 100 ? 50 : 56; lo.push({ x, w, y0: y1 - h, y1 }); });
  return { up, lo };
}
function spotAreas() {
  const { up, lo } = MOUTH_TEETH();
  const box = (arr, inset) => { const xs = arr.slice(inset, arr.length - inset); const x0 = xs[0].x, x1 = xs[xs.length - 1].x; const y0 = Math.max(...xs.map((t) => t.y0)) + 14, y1 = Math.min(...xs.map((t) => t.y1)) - 14;
    return { x: +(x0 / FW).toFixed(3), y: +(y0 / FH).toFixed(3), w: +((x1 - x0) / FW).toFixed(3), h: +(Math.max(4, y1 - y0) / FH).toFixed(3) }; };
  return [box(up, 0), box(lo, 0)];
}
function bigFace(id, done) {
  const k = KIDS[id], R = 330, cx = 450, cy = 600, HY = cy + 20;        // head ellipse centre (450,620), rx 330, ry 360
  const st = (w) => `stroke="${INK}" stroke-width="${w || 10}" stroke-linejoin="round" stroke-linecap="round"`;
  const skinD = shade(k.skin, -0.14);
  const defs = lin("bg", [[0, "#fff1f6"], [1, "#e3f6f1"]]) + rad("fs", [[0, shade(k.skin, 0.2)], [0.75, k.skin], [1, shade(k.skin, -0.06)]], 0.45, 0.38, 0.7) +
    rad("mo", [[0, "#8a2a40"], [0.7, "#5c1a2c"], [1, "#3e1020"]], 0.5, 0.35, 0.75) + lin("tg", [[0, "#ff9fb0"], [1, "#e46f88"]]) + lin("th", [[0, "#ffffff"], [1, "#e9eef4"]]) +
    lin("ts", [[0, shade(k.shirt, 0.12)], [1, shade(k.shirt, -0.08)]]) + lin("nk", [[0, skinD], [0.35, k.skin], [1, k.skin]]) +
    `<clipPath id="mclip"><path d="${MOUTH_D}"/></clipPath>` + glow("sp", 8) + rad("halo", [[0, "#ffffff", 0.8], [1, "#ffffff", 0]]);
  let g = `<rect width="${FW}" height="${FH}" fill="url(#bg)"/>`;
  const Rr = rng(id.length * 13);
  for (let i = 0; i < 26; i++) { const x = Rr() * FW, y = Rr() * FH; g += `<circle cx="${x}" cy="${y}" r="${6 + Rr() * 10}" fill="${[PINK, MINT, "#ffd24a", "#a8d8ff"][i % 4]}" opacity=".18"/>`; }
  if (done) g += `<circle cx="${cx}" cy="${HY}" r="560" fill="url(#halo)"/>`;
  // shoulders + t-shirt (drawn first), then the neck rising INTO the head (overlaps the jaw)
  g += `<path d="M${cx - 430} ${FH + 10} L${cx - 410} ${1150} Q${cx - 380} ${1060} ${cx - 220} ${1040} L${cx + 220} ${1040} Q${cx + 380} ${1060} ${cx + 410} ${1150} L${cx + 430} ${FH + 10} Z" fill="url(#ts)" ${st()}/>`;
  g += `<path d="M${cx - 105} ${860} L${cx - 112} ${1050} Q${cx} ${1110} ${cx + 112} ${1050} L${cx + 105} ${860} Z" fill="url(#nk)" ${st()}/>`;
  g += `<path d="M${cx - 150} ${1038} Q${cx} ${1150} ${cx + 150} ${1038}" fill="none" stroke="${shade(k.shirt, -0.25)}" stroke-width="22" stroke-linecap="round"/>`;   // collar
  g += `<path d="M${cx - 150} ${1038} Q${cx} ${1150} ${cx + 150} ${1038}" fill="none" ${st(9)}/>`;
  // hair behind, ears, head
  g += hair(k, cx, cy, R, "back").replace(/stroke-width="[\d.]+"/g, 'stroke-width="10"');
  g += `<ellipse cx="${cx - R + 8}" cy="${HY + 30}" rx="56" ry="76" fill="${k.skin}" ${st()}/><ellipse cx="${cx + R - 8}" cy="${HY + 30}" rx="56" ry="76" fill="${k.skin}" ${st()}/>`;
  g += `<ellipse cx="${cx - R + 14}" cy="${HY + 30}" rx="24" ry="40" fill="${skinD}" opacity=".5"/><ellipse cx="${cx + R - 14}" cy="${HY + 30}" rx="24" ry="40" fill="${skinD}" opacity=".5"/>`;
  g += `<ellipse cx="${cx}" cy="${HY}" rx="${R}" ry="${R * 1.09}" fill="url(#fs)" ${st()}/>`;
  // eyes + brows
  const ey = 500;
  if (done) {
    [-1, 1].forEach((d) => { g += `<path d="M${cx + d * 125 - 60} ${ey + 16} Q${cx + d * 125} ${ey - 56} ${cx + d * 125 + 60} ${ey + 16}" fill="none" ${st(15)}/>`; });
  } else {
    [-1, 1].forEach((d) => {
      g += `<ellipse cx="${cx + d * 125}" cy="${ey}" rx="62" ry="70" fill="#fff" ${st(9)}/>`;
      g += `<circle cx="${cx + d * 125}" cy="${ey - 12}" r="40" fill="${k.eyes}"/><circle cx="${cx + d * 125}" cy="${ey - 12}" r="22" fill="#1c1420"/>`;
      g += `<circle cx="${cx + d * 125 - 14}" cy="${ey - 28}" r="12" fill="#fff"/><circle cx="${cx + d * 125 + 14}" cy="${ey}" r="6" fill="#fff" opacity=".8"/>`;
    });
  }
  [-1, 1].forEach((d) => { g += `<path d="M${cx + d * 125 - 54} ${ey - 104} Q${cx + d * 125} ${ey - 128} ${cx + d * 125 + 54} ${ey - 108}" fill="none" stroke="${shade(k.hair, -0.1)}" stroke-width="14" stroke-linecap="round"/>`; });
  // cheeks + nose
  g += `<ellipse cx="${cx - 228}" cy="${640}" rx="56" ry="32" fill="#ff7f9a" opacity="${done ? 0.5 : 0.34}"/><ellipse cx="${cx + 228}" cy="${640}" rx="56" ry="32" fill="#ff7f9a" opacity="${done ? 0.5 : 0.34}"/>`;
  g += `<path d="M${cx - 22} ${598} Q${cx} ${616} ${cx + 22} ${598}" fill="none" ${st(8)}/>`;
  // ---- the mouth: everything inside is clipped to the lips ----
  const { up, lo } = MOUTH_TEETH();
  const tooth = (t, down) => {
    const r = 12;
    return down
      ? `<path d="M${t.x - t.w / 2} ${t.y0 - 6} L${t.x + t.w / 2} ${t.y0 - 6} L${t.x + t.w / 2 - 2} ${t.y1 - r} Q${t.x + t.w / 2 - 3} ${t.y1} ${t.x} ${t.y1} Q${t.x - t.w / 2 + 3} ${t.y1} ${t.x - t.w / 2 + 2} ${t.y1 - r} Z" fill="url(#th)" stroke="#cdbfcb" stroke-width="3.5"/><path d="M${t.x - t.w / 2 + 10} ${t.y0 + 6} L${t.x - t.w / 2 + 10} ${t.y1 - 16}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`
      : `<path d="M${t.x - t.w / 2} ${t.y1 + 6} L${t.x + t.w / 2} ${t.y1 + 6} L${t.x + t.w / 2 - 2} ${t.y0 + r} Q${t.x + t.w / 2 - 3} ${t.y0} ${t.x} ${t.y0} Q${t.x - t.w / 2 + 3} ${t.y0} ${t.x - t.w / 2 + 2} ${t.y0 + r} Z" fill="url(#th)" stroke="#cdbfcb" stroke-width="3.5"/>`;
  };
  g += `<g clip-path="url(#mclip)">`;
  g += `<path d="${MOUTH_D}" fill="url(#mo)"/>`;
  if (done) {
    g += `<ellipse cx="450" cy="920" rx="200" ry="90" fill="url(#tg)"/>`;
    g += `<path d="M${ML.x} ${ML.y - 20} Q450 600 ${MR.x} ${MR.y - 20} L${MR.x} ${MR.y + 80} Q450 700 ${ML.x} ${ML.y + 80} Z" fill="url(#th)"/>`;   // one clean row of shiny teeth
    up.forEach((t) => { g += `<path d="M${t.x + t.w / 2 + 2} ${topY(t.x) + 6} L${t.x + t.w / 2 + 2} ${topY(t.x) + 72}" stroke="#d9d0d8" stroke-width="3.5"/>`; });
    g += `<path d="M${ML.x} ${ML.y + 80} Q450 700 ${MR.x} ${MR.y + 80}" fill="none" stroke="#d9d0d8" stroke-width="4"/>`;
  } else {
    g += `<ellipse cx="450" cy="900" rx="190" ry="80" fill="url(#tg)"/><path d="M450 860 L450 912" stroke="#d9607a" stroke-width="6" stroke-linecap="round"/>`;
    g += `<path d="M${ML.x} ${ML.y} Q450 620 ${MR.x} ${MR.y} L${MR.x} ${MR.y + 46} Q450 652 ${ML.x} ${ML.y + 46} Z" fill="#ff9fb0"/>`;          // upper gum
    // lower gum: a band along the bottom edge, in front of the tongue, behind the teeth roots
    g += `<path d="M250 ${botY(250) - 40} Q450 ${botY(450) + 4} 650 ${botY(650) - 40} L700 1000 L200 1000 Z" fill="#ff9fb0"/>`;
    lo.forEach((t) => { g += tooth(t, false); });
    up.forEach((t) => { g += tooth(t, true); });
  }
  g += `</g>`;
  g += `<path d="${MOUTH_D}" fill="none" stroke="#e8858f" stroke-width="22" stroke-linejoin="round"/>`;   // lips
  g += `<path d="${MOUTH_D}" fill="none" ${st(9)}/>`;
  if (done) [[cx - 140, 690, 28], [cx + 110, 682, 22], [cx + 330, 300, 44], [cx - 340, 330, 36], [cx + 300, 1000, 30], [cx - 300, 1010, 26]].forEach(([x, y, s2]) => { g += `<path d="${star(x, y, s2, s2 * 0.3, 4)}" fill="#fff6b8" filter="url(#sp)"/>`; });
  // hair in front (fringe)
  g += hair(k, cx, cy - (k.style === "cap" ? 70 : 10), R, "front").replace(/stroke-width="[\d.]+"/g, 'stroke-width="10"');
  return job(`assets/img/mouth_${id}${done ? "_done" : ""}.png`, FW, FH, g, defs);
}
if (require.main === module) console.log("closeup.spots.area =", JSON.stringify(spotAreas()));

/* ======================= Germs, brush, bubble ======================= */
function germ(file, col, seed) {
  const R = rng(seed);
  const defs = rad("gm", [[0, shade(col, 0.45)], [0.7, col], [1, shade(col, -0.2)]], 0.38, 0.32, 0.75);
  let g = "";
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283 + R() * 0.3, x1 = 64 + Math.cos(a) * 40, y1 = 66 + Math.sin(a) * 38, x2 = 64 + Math.cos(a) * 54, y2 = 66 + Math.sin(a) * 52; g += `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="6.5" fill="${col}" stroke="${INK}" stroke-width="3.5"/>`; }
  g += `<path d="${K.blob(64, 66, 42, 39, 10, 0.08, R)}" fill="url(#gm)" stroke="${INK}" stroke-width="4.5"/>`;
  g += `<ellipse cx="50" cy="48" rx="10" ry="6" fill="#fff" opacity=".6" transform="rotate(-25 50 48)"/>`;
  g += `<circle cx="52" cy="64" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="77" cy="64" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  g += `<circle cx="54" cy="66" r="4" fill="${INK}"/><circle cx="75" cy="66" r="4" fill="${INK}"/>`;
  g += `<path d="M55 80 Q64 86 73 80" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><path d="M60 82 L62 87 L64 82" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  return job(`assets/img/${file}.png`, 128, 128, g, defs);
}
function brush() {
  const defs = lin("bh", [[0, "#7fd8ff"], [1, "#3a9be0"]], 0, 0, 1, 0) + glow("bgl", 2);
  // diagonal toothbrush, bristle head at the top-left (brushTip ≈ 0.21, 0.27)
  let g = `<g transform="rotate(-40 128 128)">`;
  g += `<rect x="112" y="98" width="32" height="150" rx="16" fill="url(#bh)" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="118" y="140" width="20" height="60" rx="10" fill="#ffffff" opacity=".35"/>`;
  g += `<rect x="116" y="20" width="24" height="90" rx="10" fill="url(#bh)" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="84" y="18" width="34" height="62" rx="8" fill="#ffffff" stroke="${INK}" stroke-width="4.5"/>`;
  for (let i = 0; i < 5; i++) g += `<path d="M${88 + i * 6.5} 24 L${88 + i * 6.5} 74" stroke="${i % 2 ? MINT : "#a8e6ff"}" stroke-width="4" stroke-linecap="round"/>`;
  g += `</g>`;
  // toothpaste foam on the bristles
  [[54, 66, 16], [40, 80, 12], [68, 52, 11], [36, 58, 9]].forEach(([x, y, r]) => { g += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="#bfe7f4" stroke-width="2.5"/>`; });
  g += `<path d="${star(84, 26, 10, 3.4, 4)}" fill="#fff6b8" filter="url(#bgl)"/>`;
  return job("assets/img/brush.png", 256, 256, g, defs);
}
function tooth(cx, cy, s, o = {}) {
  // the Dr Smile mascot: a chubby molar with a happy face (one shared drawing)
  const st = `stroke="${o.outline || "#c9d3dc"}" stroke-width="${6 * s}" stroke-linejoin="round"`;
  let g = `<path d="M${cx - 92 * s} ${cy - 40 * s} C${cx - 112 * s} ${cy - 120 * s} ${cx - 30 * s} ${cy - 140 * s} ${cx} ${cy - 104 * s} C${cx + 30 * s} ${cy - 140 * s} ${cx + 112 * s} ${cy - 120 * s} ${cx + 92 * s} ${cy - 40 * s} C${cx + 84 * s} ${cy + 20 * s} ${cx + 80 * s} ${cy + 70 * s} ${cx + 58 * s} ${cy + 120 * s} C${cx + 44 * s} ${cy + 140 * s} ${cx + 22 * s} ${cy + 128 * s} ${cx + 18 * s} ${cy + 100 * s} C${cx + 12 * s} ${cy + 70 * s} ${cx - 12 * s} ${cy + 70 * s} ${cx - 18 * s} ${cy + 100 * s} C${cx - 22 * s} ${cy + 128 * s} ${cx - 44 * s} ${cy + 140 * s} ${cx - 58 * s} ${cy + 120 * s} C${cx - 80 * s} ${cy + 70 * s} ${cx - 84 * s} ${cy + 20 * s} ${cx - 92 * s} ${cy - 40 * s} Z" fill="url(#${o.grad || "tw"})" ${st}/>`;
  g += `<path d="M${cx - 62 * s} ${cy - 76 * s} Q${cx - 50 * s} ${cy - 104 * s} ${cx - 22 * s} ${cy - 100 * s}" fill="none" stroke="#fff" stroke-width="${10 * s}" stroke-linecap="round"/>`;
  const ink = INK;
  [-1, 1].forEach((d) => { g += `<ellipse cx="${cx + d * 34 * s}" cy="${cy - 18 * s}" rx="${13 * s}" ry="${17 * s}" fill="${ink}"/><circle cx="${cx + d * 34 * s - 4 * s}" cy="${cy - 24 * s}" r="${5 * s}" fill="#fff"/>`; });
  g += `<ellipse cx="${cx - 62 * s}" cy="${cy + 10 * s}" rx="${16 * s}" ry="${10 * s}" fill="#ff8fa8" opacity=".6"/><ellipse cx="${cx + 62 * s}" cy="${cy + 10 * s}" rx="${16 * s}" ry="${10 * s}" fill="#ff8fa8" opacity=".6"/>`;
  g += `<path d="M${cx - 30 * s} ${cy + 6 * s} Q${cx} ${cy + 46 * s} ${cx + 30 * s} ${cy + 6 * s} Z" fill="#9b3a4e" stroke="${ink}" stroke-width="${4 * s}" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${cy + 26 * s}" rx="${13 * s}" ry="${7 * s}" fill="#ff8fa8"/>`;
  return g;
}
const TOOTH_DEFS = lin("tw", [[0, "#ffffff"], [1, "#eef3f7"]]);
function wantBubble() {
  const defs = TOOTH_DEFS + glow("wg", 2) + rad("gm", [[0, "#c8f59a"], [1, "#6cc04a"]]);
  let g = `<path d="M16 10 H112 Q122 10 122 20 V84 Q122 94 112 94 H76 L64 112 L52 94 H16 Q6 94 6 84 V20 Q6 10 16 10 Z" fill="#ffffff" stroke="${MINT_D}" stroke-width="5" stroke-linejoin="round"/>`;
  g += tooth(56, 56, 0.27, { outline: "#b9c4cc" });
  g += `<circle cx="88" cy="40" r="13" fill="url(#gm)" stroke="${INK}" stroke-width="3"/><circle cx="84" cy="38" r="2.6" fill="${INK}"/><circle cx="92" cy="38" r="2.6" fill="${INK}"/><path d="M84 46 Q88 43 92 46" fill="none" stroke="${INK}" stroke-width="2"/>`;
  return job("assets/img/want.png", 128, 118, g, defs);
}

/* ======================= The clinic ======================= */
function floor() {   // honey wood planks, tileable 512
  const R = rng(21), S = 512, PH = 64;
  let g = `<rect width="${S}" height="${S}" fill="#f3d9b1"/>`;
  for (let row = 0; row < S / PH; row++) {
    const off = (row % 2) * 128 + (row % 3) * 64;
    for (let x = -256; x < S + 256; x += 256) {
      const px = ((x + off) % S + S) % S - (x + off < 0 ? 0 : 0);
      const c = mix("#f1d3a6", "#f7e1bf", R());
      [px, px - S].forEach((xx) => { g += `<rect x="${xx + 2}" y="${row * PH + 2}" width="252" height="${PH - 4}" rx="6" fill="${c}"/>`; });
    }
    g += `<rect x="0" y="${row * PH}" width="${S}" height="2" fill="#d9b88a"/>`;
  }
  for (let i = 0; i < 70; i++) { const x = R() * S, y = Math.floor(R() * 8) * PH + 12 + R() * 40; g += `<path d="M${x} ${y} q20 ${R() * 4 - 2} 40 0" fill="none" stroke="#e2c091" stroke-width="2" opacity=".55"/>`; }
  for (let row = 0; row < S / PH; row++) { const off = (row % 2) * 128 + (row % 3) * 64; for (let x = 0; x < S; x += 256) { const sx = (x + off) % S; g += `<rect x="${sx - 1}" y="${row * PH}" width="3" height="${PH}" fill="#d9b88a"/>`; } }
  return job("assets/img/floor.png", S, S, g);
}
function rug(w, h) {  // the care-room rug = zone floor (drawn at 1.5×)
  const W = w * 1.5, H = h * 1.5, r = 110;
  const defs = rad("rg", [[0, "#dff6f0"], [1, "#bfe9df"]], 0.5, 0.45, 0.8) + TOOTH_DEFS +
    `<pattern id="dots" width="90" height="90" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="6" fill="#ffffff" opacity=".7"/><circle cx="65" cy="65" r="4" fill="${PINK}" opacity=".35"/></pattern>`;
  let g = `<rect x="10" y="16" width="${W - 20}" height="${H - 20}" rx="${r}" fill="#000" opacity=".08"/>`;
  g += `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="${r}" fill="${PINK}"/>`;
  g += `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="${r - 20}" fill="url(#rg)"/>`;
  g += `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="${r - 20}" fill="url(#dots)"/>`;
  g += `<rect x="52" y="52" width="${W - 104}" height="${H - 104}" rx="${r - 36}" fill="none" stroke="#ffffff" stroke-width="7" stroke-dasharray="2 22" stroke-linecap="round"/>`;
  return job("assets/img/rug.png", W, H, g, defs);
}
function wall(W) {   // back wall of the clinic, 1400 × 280 (drawn at 1×; tall enough for the desk)
  const H = 280;
  const defs = lin("wl", [[0, "#cdeee6"], [1, "#b9e5db"]]) + lin("sky", [[0, "#8fd3ff"], [1, "#d7f1ff"]]) + TOOTH_DEFS + lin("wd", [[0, "#ffffff"], [1, "#f1f4f6"]]);
  let g = `<rect width="${W}" height="${H}" fill="url(#wl)"/>`;
  for (let x = 0; x < W; x += 56) g += `<rect x="${x}" y="0" width="28" height="${H - 70}" fill="#ffffff" opacity=".18"/>`;
  // windows
  [[210, 50], [W - 330, 50]].forEach(([x, y]) => {
    g += `<rect x="${x - 6}" y="${y - 6}" width="132" height="122" rx="18" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${x + 6}" y="${y + 6}" width="108" height="98" rx="10" fill="url(#sky)"/>`;
    g += `<g fill="#fff"><circle cx="${x + 40}" cy="${y + 50}" r="14"/><circle cx="${x + 58}" cy="${y + 44}" r="18"/><circle cx="${x + 76}" cy="${y + 52}" r="12"/><rect x="${x + 30}" y="${y + 50}" width="56" height="14" rx="7"/></g>`;
    g += `<circle cx="${x + 92}" cy="${y + 28}" r="12" fill="#ffd24a"/>`;
    g += `<path d="M${x + 60} ${y + 6} V${y + 104} M${x + 6} ${y + 55} H${x + 114}" stroke="#fff" stroke-width="7"/>`;
    g += `<path d="M${x - 14} ${y - 10} Q${x + 10} ${y + 60} ${x - 8} ${y + 130} L${x - 22} ${y + 130} L${x - 22} ${y - 10} Z M${x + 134} ${y - 10} Q${x + 110} ${y + 60} ${x + 128} ${y + 130} L${x + 142} ${y + 130} L${x + 142} ${y - 10} Z" fill="${PINK}" stroke="${INK}" stroke-width="4" opacity=".95"/>`;
  });
  // big smiling tooth poster over the desk + a clock
  g += `<rect x="${W / 2 - 80}" y="20" width="160" height="150" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="${W / 2 - 66}" y="34" width="132" height="122" rx="12" fill="#fff0f5"/>`;
  g += tooth(W / 2, 98, 0.4);
  [[W / 2 - 50, 50], [W / 2 + 52, 60], [W / 2 + 40, 140]].forEach(([x, y]) => { g += `<path d="${star(x, y, 9, 3.2, 4)}" fill="#ffd24a"/>`; });
  g += `<circle cx="${W / 2 + 260}" cy="80" r="40" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${W / 2 + 260}" cy="80" r="32" fill="#fff8e8"/>`;
  g += `<path d="M${W / 2 + 260} 80 V56 M${W / 2 + 260} 80 L${W / 2 + 276} 88" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  g += `<rect x="${W / 2 - 330}" y="60" width="90" height="70" rx="10" fill="#fff" stroke="${INK}" stroke-width="4" transform="rotate(-4 ${W / 2 - 285} 95)"/>`;
  g += `<g transform="rotate(-4 ${W / 2 - 285} 95)"><path d="M${W / 2 - 312} 116 L${W / 2 - 296} 86 L${W / 2 - 282} 106 L${W / 2 - 270} 92 L${W / 2 - 254} 116 Z" fill="${MINT}"/><circle cx="${W / 2 - 262}" cy="78" r="8" fill="#ffd24a"/></g>`;
  // wainscot + baseboard
  g += `<rect x="0" y="${H - 80}" width="${W}" height="62" fill="url(#wd)"/>`;
  for (let x = 20; x < W; x += 100) g += `<rect x="${x}" y="${H - 70}" width="80" height="42" rx="8" fill="none" stroke="#e1e8ec" stroke-width="3"/>`;
  g += `<rect x="0" y="${H - 84}" width="${W}" height="8" fill="${PINK}"/>`;
  g += `<rect x="0" y="${H - 20}" width="${W}" height="20" fill="#e9d2b8"/><rect x="0" y="${H - 20}" width="${W}" height="4" fill="#d9b88a"/>`;
  return job("assets/img/wall.png", W, H, g, defs);
}
function sideWall(file, H, flip) {   // thin side wall strip (40 px wide)
  const defs = lin("sw", [[0, "#a9dccf"], [1, "#c6ece3"]], flip ? 1 : 0, 0, flip ? 0 : 1, 0);
  const g = `<rect width="40" height="${H}" fill="url(#sw)"/><rect x="${flip ? 0 : 32}" width="8" height="${H}" fill="${PINK}"/>`;
  return job(`assets/img/${file}.png`, 40, H, g, defs);
}
function bottomWall(W) {  // bottom wall strip with the entrance doorway in the middle
  const H = 60, gap = 200;
  const defs = lin("bw", [[0, "#c6ece3"], [1, "#a9dccf"]]);
  let g = `<rect x="0" y="0" width="${(W - gap) / 2}" height="${H}" fill="url(#bw)"/><rect x="${(W + gap) / 2}" y="0" width="${(W - gap) / 2}" height="${H}" fill="url(#bw)"/>`;
  g += `<rect x="0" y="0" width="${(W - gap) / 2}" height="8" fill="${PINK}"/><rect x="${(W + gap) / 2}" y="0" width="${(W - gap) / 2}" height="8" fill="${PINK}"/>`;
  g += `<rect x="${(W - gap) / 2 - 16}" y="0" width="16" height="${H}" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="${(W + gap) / 2}" y="0" width="16" height="${H}" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  return job("assets/img/wall_bottom.png", W, H, g, defs);
}
function doormat() {
  const defs = lin("dm", [[0, "#ffb3cb"], [1, "#ff8fb3"]]);
  let g = `<rect x="6" y="6" width="188" height="88" rx="22" fill="url(#dm)" stroke="${INK}" stroke-width="4"/>`;
  g += `<rect x="20" y="20" width="160" height="60" rx="14" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="10 10"/>`;
  g += tooth(100, 52, 0.17, { outline: "#e0c0cc" });
  return job("assets/img/doormat.png", 200, 100, g, defs + TOOTH_DEFS);
}
function chair() {    // the dentist chair (centrepiece)
  const W = 300, H = 300;
  const defs = lin("ch", [[0, "#7fded3"], [1, MINT_D]]) + lin("mt", [[0, "#e6edf2"], [1, "#a9b8c4"]]) + rad("lp", [[0, "#fffbe0"], [1, "#ffe48a"]]) + glow("lg", 6);
  let g = `<ellipse cx="150" cy="270" rx="96" ry="18" fill="#000" opacity=".12"/>`;
  // lamp arm
  g += `<path d="M232 250 L232 70 Q232 40 200 40 L150 40" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M232 250 L232 70 Q232 40 200 40 L150 40" fill="none" stroke="url(#mt)" stroke-width="9" stroke-linecap="round"/>`;
  g += `<ellipse cx="136" cy="44" rx="34" ry="22" fill="url(#mt)" stroke="${INK}" stroke-width="5"/><ellipse cx="136" cy="54" rx="24" ry="10" fill="url(#lp)" filter="url(#lg)"/>`;
  // base
  g += `<ellipse cx="150" cy="262" rx="70" ry="16" fill="url(#mt)" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="134" y="200" width="32" height="62" rx="8" fill="url(#mt)" stroke="${INK}" stroke-width="5"/>`;
  // seat + backrest + leg rest
  g += `<path d="M70 190 Q60 120 90 90 Q110 70 140 76 Q160 82 158 110 L156 160 Z" fill="url(#ch)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  g += `<ellipse cx="112" cy="84" rx="30" ry="16" fill="#9ff0e6" stroke="${INK}" stroke-width="5"/>`;
  g += `<path d="M64 186 Q66 210 110 212 L210 212 Q236 210 236 188 L236 176 Q236 166 222 166 L80 166 Q64 166 64 186 Z" fill="url(#ch)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  g += `<path d="M84 176 Q140 170 222 176" stroke="#b8f4ec" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  // little tray with a mirror & toothbrush
  g += `<rect x="30" y="140" width="56" height="14" rx="6" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M58 140 V200" stroke="${INK}" stroke-width="6"/>`;
  g += `<circle cx="44" cy="132" r="8" fill="#e8f6ff" stroke="${INK}" stroke-width="3"/><rect x="58" y="126" width="22" height="7" rx="3" fill="${PINK}" stroke="${INK}" stroke-width="2.5"/>`;
  return job("assets/img/chair.png", W, H, g, defs);
}
function reception() {   // the welcome desk with the big golden bell
  const W = 320, H = 230;
  const defs = lin("dk", [[0, "#ffffff"], [1, "#f2f5f7"]]) + lin("dp", [[0, "#ffc2d6"], [1, PINK]]) + rad("bl", [[0, "#fff6c2"], [0.5, "#ffd24a"], [1, "#e0a020"]], 0.4, 0.3, 0.8) + glow("blg", 5) + TOOTH_DEFS;
  let g = `<ellipse cx="160" cy="214" rx="150" ry="14" fill="#000" opacity=".12"/>`;
  g += `<path d="M20 110 Q20 90 40 90 L280 90 Q300 90 300 110 L300 200 Q300 214 286 214 L34 214 Q20 214 20 200 Z" fill="url(#dk)" stroke="${INK}" stroke-width="5"/>`;
  g += `<path d="M10 92 Q10 74 30 74 L290 74 Q310 74 310 92 L310 100 Q310 108 300 108 L20 108 Q10 108 10 100 Z" fill="url(#dp)" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="40" y="128" width="240" height="70" rx="16" fill="#fff0f5" stroke="${PINK}" stroke-width="4"/>`;
  g += tooth(160, 160, 0.21);
  [[90, 150], [232, 170], [214, 140], [104, 180]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 10 - (i % 2) * 3, 3.5, 4)}" fill="${i % 2 ? MINT : "#ffd24a"}"/>`; });
  // bell
  g += `<ellipse cx="160" cy="76" rx="44" ry="9" fill="#c99418" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M124 74 Q122 30 160 26 Q198 30 196 74 Z" fill="url(#bl)" stroke="${INK}" stroke-width="5" filter="url(#blg)"/>`;
  g += `<circle cx="160" cy="20" r="9" fill="url(#bl)" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M138 60 Q138 40 154 36" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>`;
  // pen pot + plant
  g += `<rect x="252" y="46" width="30" height="30" rx="6" fill="${MINT}" stroke="${INK}" stroke-width="4"/><path d="M260 46 L256 26 M268 46 L270 22 M276 46 L282 30" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  g += `<rect x="36" y="50" width="34" height="26" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="46" cy="40" r="12" fill="#7fd08a" stroke="${INK}" stroke-width="3.5"/><circle cx="62" cy="36" r="10" fill="#9fe0a8" stroke="${INK}" stroke-width="3.5"/>`;
  return job("assets/img/reception.png", W, H, g, defs);
}
function plant(file, potCol, kind) {
  const W = 160, H = 200;
  const defs = lin("pt", [[0, shade(potCol, 0.2)], [1, shade(potCol, -0.1)]]) + lin("lf", [[0, "#8fe39a"], [1, "#4fb36a"]]);
  let g = `<ellipse cx="80" cy="190" rx="44" ry="8" fill="#000" opacity=".12"/>`;
  if (kind === "monstera") {
    const leaf = (x, y, a, s) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0 Q-34 -20 -26 -66 Q0 -92 26 -66 Q34 -20 0 0 Z" fill="url(#lf)" stroke="${INK}" stroke-width="4"/><path d="M0 -4 L0 -70" stroke="#3f9a58" stroke-width="3"/><path d="M-20 -40 L-8 -38 M20 -40 L8 -38 M-18 -58 L-6 -54 M18 -58 L6 -54" stroke="#3f9a58" stroke-width="3"/></g>`;
    g += leaf(80, 128, -50, 1.1) + leaf(80, 128, 45, 1.05) + leaf(80, 128, -12, 1.25) + leaf(80, 128, 20, 0.9);
  } else {
    // round bush with flowers
    g += `<circle cx="58" cy="96" r="34" fill="url(#lf)" stroke="${INK}" stroke-width="4"/><circle cx="102" cy="92" r="36" fill="url(#lf)" stroke="${INK}" stroke-width="4"/><circle cx="80" cy="64" r="38" fill="url(#lf)" stroke="${INK}" stroke-width="4"/>`;
    [[60, 70], [96, 58], [104, 100], [62, 104], [82, 86]].forEach(([x, y], i) => { const c = [PINK, "#ffd24a", "#fff", PINK, "#ffb36a"][i]; g += `<g>${[0, 1, 2, 3, 4].map((j) => `<circle cx="${x + Math.cos(j * 1.256) * 6}" cy="${y + Math.sin(j * 1.256) * 6}" r="5" fill="${c}" stroke="${INK}" stroke-width="2"/>`).join("")}<circle cx="${x}" cy="${y}" r="3.5" fill="#ffd24a"/></g>`; });
  }
  g += `<path d="M46 124 L114 124 L106 186 Q80 192 54 186 Z" fill="url(#pt)" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`;
  g += `<rect x="40" y="116" width="80" height="16" rx="7" fill="${shade(potCol, 0.1)}" stroke="${INK}" stroke-width="4.5"/>`;
  return job(`assets/img/${file}.png`, W, H, g, defs);
}
function toothSign() {
  const W = 160, H = 230;
  const defs = TOOTH_DEFS + glow("tsg", 4);
  let g = `<ellipse cx="80" cy="222" rx="30" ry="6" fill="#000" opacity=".12"/>`;
  g += `<rect x="72" y="130" width="16" height="92" rx="6" fill="#c9a27a" stroke="${INK}" stroke-width="4"/>`;
  g += `<circle cx="80" cy="82" r="72" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="80" cy="82" r="62" fill="#fff0f5" stroke="${PINK}" stroke-width="4"/>`;
  g += tooth(80, 86, 0.36);
  g += `<path d="${star(130, 36, 12, 4, 4)}" fill="#ffd24a" filter="url(#tsg)"/>`;
  return job("assets/img/toothsign.png", W, H, g, defs);
}
function bench() {
  const W = 260, H = 150;
  const defs = lin("bn", [[0, "#ffd6e4"], [1, PINK]]);
  let g = `<ellipse cx="130" cy="140" rx="116" ry="9" fill="#000" opacity=".12"/>`;
  [40, 220].forEach((x) => { g += `<rect x="${x - 8}" y="96" width="16" height="44" rx="5" fill="#c9a27a" stroke="${INK}" stroke-width="4"/>`; });
  g += `<rect x="16" y="20" width="228" height="60" rx="22" fill="url(#bn)" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="10" y="74" width="240" height="34" rx="14" fill="url(#bn)" stroke="${INK}" stroke-width="5"/>`;
  g += `<path d="M90 26 V76 M170 26 V76" stroke="#ff6f9c" stroke-width="3"/>`;
  return job("assets/img/bench.png", W, H, g, defs);
}
function toybox() {
  const W = 180, H = 170;
  let g = `<ellipse cx="90" cy="160" rx="80" ry="8" fill="#000" opacity=".12"/>`;
  g += `<circle cx="62" cy="58" r="26" fill="#ffd24a" stroke="${INK}" stroke-width="4"/><path d="M40 52 Q62 40 84 52" stroke="#ff6f6f" stroke-width="6" fill="none"/>`;
  g += `<rect x="96" y="30" width="38" height="38" rx="6" fill="#7fc8ff" stroke="${INK}" stroke-width="4" transform="rotate(12 115 49)"/><text x="108" y="58" font-family="Arial" font-weight="700" font-size="22" fill="#fff" transform="rotate(12 115 49)">A</text>`;
  g += `<rect x="18" y="70" width="144" height="88" rx="14" fill="#ff9e7a" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="10" y="62" width="160" height="22" rx="10" fill="#ffb89a" stroke="${INK}" stroke-width="5"/>`;
  [[50, 120, "#ffd24a"], [90, 112, "#7fd08a"], [130, 120, "#7fc8ff"]].forEach(([x, y, c]) => { g += `<path d="${star(x, y, 14, 6)}" fill="${c}" stroke="${INK}" stroke-width="3"/>`; });
  return job("assets/img/toybox.png", W, H, g);
}
// ---- unlockable decorations (the clinic gets richer with each star) ----
function balloons() {
  const W = 160, H = 240;
  const defs = glow("bgl", 2);
  let g = `<ellipse cx="80" cy="232" rx="18" ry="5" fill="#000" opacity=".12"/>`;
  const b = (x, y, c, s) => `<path d="M${x} ${y + 34 * s} Q${x + 8} ${y + 90} 80 222" fill="none" stroke="${INK}" stroke-width="2.5"/><ellipse cx="${x}" cy="${y}" rx="${28 * s}" ry="${34 * s}" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M${x - 6} ${y + 33 * s} L${x} ${y + 40 * s} L${x + 6} ${y + 33 * s} Z" fill="${c}" stroke="${INK}" stroke-width="3"/><ellipse cx="${x - 10 * s}" cy="${y - 12 * s}" rx="${7 * s}" ry="${11 * s}" fill="#fff" opacity=".6"/>`;
  g += b(48, 78, "#7fc8ff", 1) + b(112, 72, "#ffd24a", 1) + b(80, 50, PINK, 1.1);
  g += `<rect x="66" y="214" width="28" height="18" rx="5" fill="${MINT}" stroke="${INK}" stroke-width="4"/>`;
  return job("assets/img/balloons.png", W, H, g, defs);
}
function aquarium() {
  const W = 240, H = 230;
  const defs = lin("aq", [[0, "#bff0ff"], [1, "#5cc3ea"]]) + glow("ag", 3);
  let g = `<ellipse cx="120" cy="222" rx="100" ry="8" fill="#000" opacity=".12"/>`;
  g += `<rect x="34" y="140" width="172" height="80" rx="10" fill="#c9a27a" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="20" y="30" width="200" height="118" rx="16" fill="url(#aq)" stroke="${INK}" stroke-width="5"/>`;
  g += `<path d="M30 132 Q60 118 90 132 T150 132 T210 132 L210 140 L30 140 Z" fill="#f3d9a6"/>`;
  g += `<path d="M60 136 Q50 100 62 80 M70 136 Q80 104 70 90 M176 136 Q166 96 182 72" stroke="#4fb36a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const fish = (x, y, c, f) => `<g transform="translate(${x} ${y}) scale(${f} 1)"><ellipse cx="0" cy="0" rx="18" ry="11" fill="${c}" stroke="${INK}" stroke-width="3"/><path d="M16 0 L30 -10 L30 10 Z" fill="${c}" stroke="${INK}" stroke-width="3"/><circle cx="-8" cy="-3" r="3" fill="${INK}"/></g>`;
  g += fish(110, 70, "#ffb347", 1) + fish(160, 100, PINK, -1) + fish(80, 104, "#ffd24a", -1);
  [[130, 50], [140, 40], [124, 36]].forEach(([x, y], i) => { g += `<circle cx="${x}" cy="${y}" r="${4 - i}" fill="none" stroke="#fff" stroke-width="2"/>`; });
  g += `<path d="M36 44 L60 44" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
  return job("assets/img/aquarium.png", W, H, g, defs);
}
function teddy() {
  const W = 170, H = 180;
  const defs = rad("td", [[0, "#e7b98a"], [1, "#c58b5a"]], 0.4, 0.35, 0.8);
  let g = `<ellipse cx="85" cy="170" rx="62" ry="8" fill="#000" opacity=".12"/>`;
  g += `<circle cx="40" cy="150" r="20" fill="url(#td)" stroke="${INK}" stroke-width="4"/><circle cx="130" cy="150" r="20" fill="url(#td)" stroke="${INK}" stroke-width="4"/>`;
  g += `<ellipse cx="85" cy="122" rx="48" ry="44" fill="url(#td)" stroke="${INK}" stroke-width="4"/><ellipse cx="85" cy="128" rx="28" ry="26" fill="#f4dcc0"/>`;
  g += `<circle cx="34" cy="104" r="16" fill="url(#td)" stroke="${INK}" stroke-width="4"/><circle cx="136" cy="104" r="16" fill="url(#td)" stroke="${INK}" stroke-width="4"/>`;
  g += `<circle cx="48" cy="34" r="17" fill="url(#td)" stroke="${INK}" stroke-width="4"/><circle cx="122" cy="34" r="17" fill="url(#td)" stroke="${INK}" stroke-width="4"/><circle cx="48" cy="34" r="8" fill="#f4dcc0"/><circle cx="122" cy="34" r="8" fill="#f4dcc0"/>`;
  g += `<circle cx="85" cy="62" r="42" fill="url(#td)" stroke="${INK}" stroke-width="4"/><ellipse cx="85" cy="76" rx="18" ry="13" fill="#f4dcc0"/>`;
  g += `<circle cx="70" cy="56" r="5" fill="${INK}"/><circle cx="100" cy="56" r="5" fill="${INK}"/><ellipse cx="85" cy="70" rx="6" ry="4.5" fill="${INK}"/><path d="M78 80 Q85 86 92 80" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  g += `<path d="M66 100 L85 108 L104 100 L104 116 L85 108 L66 116 Z" fill="${PINK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  return job("assets/img/teddy.png", W, H, g, defs);
}
function rainbowRug() {
  const W = 420, H = 260;
  let g = "";
  const cols = ["#ff8f8f", "#ffbf6a", "#ffe27a", "#9fe39a", "#8fd0ff", "#c3a6ff"];
  cols.forEach((c, i) => { g += `<path d="M${30 + i * 26} 230 A${180 - i * 26} ${180 - i * 26} 0 0 1 ${390 - i * 26} 230 Z" fill="${c}"/>`; });
  g += `<path d="M186 230 A24 24 0 0 1 234 230 Z" fill="#fff8ef"/>`;
  g += `<path d="M30 230 A180 180 0 0 1 390 230" fill="none" stroke="${INK}" stroke-width="5" opacity=".25"/>`;
  [[60, 236], [360, 236], [210, 240]].forEach(([x, y]) => { g += `<g fill="#fff"><circle cx="${x - 22}" cy="${y}" r="16"/><circle cx="${x}" cy="${y - 10}" r="22"/><circle cx="${x + 22}" cy="${y}" r="16"/></g>`; });
  return job("assets/img/rainbow_rug.png", W, H, g);
}
function trophy() {
  const W = 170, H = 230;
  const defs = rad("gd", [[0, "#fff6c2"], [0.5, "#ffd24a"], [1, "#e0a020"]], 0.4, 0.3, 0.8) + glow("trg", 6) + TOOTH_DEFS;
  let g = `<ellipse cx="85" cy="222" rx="54" ry="7" fill="#000" opacity=".12"/>`;
  g += `<rect x="40" y="188" width="90" height="32" rx="8" fill="#b98a5a" stroke="${INK}" stroke-width="4"/>`;
  g += `<rect x="70" y="150" width="30" height="42" rx="6" fill="url(#gd)" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M34 40 Q20 40 20 62 Q22 90 50 96 M136 40 Q150 40 150 62 Q148 90 120 96" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M34 40 Q20 40 20 62 Q22 90 50 96 M136 40 Q150 40 150 62 Q148 90 120 96" fill="none" stroke="#ffd24a" stroke-width="6" stroke-linecap="round"/>`;
  g += `<path d="M30 24 L140 24 Q140 120 85 150 Q30 120 30 24 Z" fill="url(#gd)" stroke="${INK}" stroke-width="5" filter="url(#trg)"/>`;
  g += tooth(85, 76, 0.24, { outline: "#e0b040" });
  [[30, 14], [150, 30], [140, 160]].forEach(([x, y]) => { g += `<path d="${star(x, y, 10, 3.5, 4)}" fill="#fff6b8" filter="url(#trg)"/>`; });
  return job("assets/img/trophy.png", W, H, g, defs);
}

/* ======================= Icons & logo (the shared tooth mascot) ======================= */
function icon(file, size) {
  const defs = TOOTH_DEFS + lin("ib", [[0, "#ffd9e6"], [1, "#c8efe6"]]) + glow("ig", size / 60);
  let g = `<rect width="${size}" height="${size}" fill="url(#ib)"/>`;
  g += tooth(size / 2, size * 0.53, size / 340, { outline: "#d5dde4" });
  g += `<path d="${star(size * 0.8, size * 0.2, size * 0.075, size * 0.026, 4)}" fill="#ffd24a" filter="url(#ig)"/>`;
  g += `<path d="${star(size * 0.18, size * 0.3, size * 0.045, size * 0.016, 4)}" fill="#ffffff" filter="url(#ig)"/>`;
  return job(file, size, size, g, defs);
}
function logo() {
  const W = 420, H = 300;
  const defs = TOOTH_DEFS + glow("lg", 5) + lin("bh", [[0, "#7fd8ff"], [1, "#3a9be0"]], 0, 0, 1, 0) + rad("lh", [[0, "#ffffff", 0.9], [1, "#ffffff", 0]]);
  let g = `<ellipse cx="210" cy="160" rx="200" ry="130" fill="url(#lh)"/>`;
  g += `<g transform="rotate(28 300 150)"><rect x="296" y="60" width="26" height="170" rx="13" fill="url(#bh)" stroke="${INK}" stroke-width="5"/><rect x="290" y="20" width="38" height="56" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3].map((i) => `<path d="M${298 + i * 7.5} 26 V70" stroke="${i % 2 ? MINT : "#a8e6ff"}" stroke-width="4.5" stroke-linecap="round"/>`).join("")}</g>`;
  g += tooth(190, 160, 0.95, { outline: "#d5dde4" });
  [[70, 60, 16], [340, 250, 14], [60, 240, 12], [210, 24, 13]].forEach(([x, y, s], i) => { g += `<path d="${star(x, y, s, s * 0.33, 4)}" fill="${i % 2 ? PINK : "#ffd24a"}" filter="url(#lg)"/>`; });
  [[330, 70, 14], [348, 100, 9], [316, 104, 7]].forEach(([x, y, r]) => { g += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#bfe7f4" stroke-width="3"/>`; });
  return job("assets/img/logo.png", W, H, g, defs);
}


/* ======================= UI icons (shared kit, pastel palette) + game icons ======================= */
const PAL = { ink: INK, pink: "#ff7fa8", teal: MINT, blue: "#5ab4f0", purple: "#b08cf0", gold: "#ffc93c", green: "#6cd18c" };
function toothIcon() { return IK.job("assets/ui/icons/tooth.png", tooth(64, 66, 0.36, { outline: INK }), TOOTH_DEFS); }
function brushIcon() {
  const defs = lin("bi", [[0, "#7fd8ff"], [1, "#3a9be0"]], 0, 0, 1, 0);
  let g = `<g transform="rotate(40 64 64)"><rect x="54" y="40" width="20" height="84" rx="10" fill="url(#bi)" stroke="${INK}" stroke-width="7"/><rect x="48" y="6" width="32" height="40" rx="9" fill="#fff" stroke="${INK}" stroke-width="7"/>${[0, 1, 2].map((i) => `<path d="M${56 + i * 8} 12 V38" stroke="${i % 2 ? MINT : "#a8e6ff"}" stroke-width="5" stroke-linecap="round"/>`).join("")}</g>`;
  [[30, 30, 12], [18, 46, 8], [42, 16, 7]].forEach(([x, y, r]) => { g += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="4"/>`; });
  return IK.job("assets/ui/icons/brush.png", g, defs);
}
function germIcon() {
  const r = germ("x", "#9be36a", 3);   // reuse the germ drawing, framed as an icon
  return { file: "assets/ui/icons/germ.png", width: 128, height: 128, svg: r.svg };
}
function kidIcon() { const r = kid(KIDS.leo, 0, "happy", "ki"); return IK.job("assets/ui/icons/kid.png", `<g transform="translate(64 64) scale(1.05) translate(-64 -60)">${r.body}</g>`, r.defs); }

/* ======================= Home splash (portrait, behind the logo + bottom sheet) ======================= */
function splash() {
  const W = 900, H = 1600;
  let defs = lin("sw", [[0, "#d9f3ec"], [1, "#bfe8de"]]) + lin("sky", [[0, "#8fd3ff"], [1, "#d7f1ff"]]) + TOOTH_DEFS + glow("sg", 6) + lin("fl", [[0, "#f6dcb3"], [1, "#eccb99"]]);
  let g = `<rect width="${W}" height="${H}" fill="url(#sw)"/>`;
  for (let x = 0; x < W; x += 70) g += `<rect x="${x}" y="0" width="35" height="${H}" fill="#ffffff" opacity=".22"/>`;
  // a big round window with sky and clouds
  g += `<circle cx="${W / 2}" cy="470" r="250" fill="#fff" stroke="${INK}" stroke-width="10"/><circle cx="${W / 2}" cy="470" r="222" fill="url(#sky)"/>`;
  g += `<g fill="#fff"><circle cx="360" cy="510" r="44"/><circle cx="420" cy="490" r="58"/><circle cx="480" cy="516" r="40"/><rect x="330" y="510" width="180" height="40" rx="20"/></g>`;
  g += `<circle cx="560" cy="350" r="46" fill="#ffd24a"/>`;
  g += `<path d="M${W / 2} 248 V692 M${W / 2 - 222} 470 H${W / 2 + 222}" stroke="#fff" stroke-width="14"/>`;
  // bunting
  const cols = [PINK, "#ffd24a", MINT, "#a8d8ff", "#c3a6ff"];
  g += `<path d="M0 120 Q${W / 2} 230 ${W} 120" fill="none" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 11; i++) { const t = (i + 0.5) / 11, x = t * W, y = 120 + 110 * 4 * t * (1 - t) * 0.92; g += `<path d="M${x - 26} ${y - 4} L${x + 26} ${y - 4} L${x} ${y + 44} Z" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; }
  // floor + rug
  g += `<rect x="0" y="880" width="${W}" height="${H - 880}" fill="url(#fl)"/>`;
  for (let y = 880; y < H; y += 64) g += `<rect x="0" y="${y}" width="${W}" height="3" fill="#d9b88a"/>`;
  g += `<rect x="0" y="860" width="${W}" height="26" fill="#fff"/><rect x="0" y="856" width="${W}" height="8" fill="${PINK}"/>`;
  g += `<ellipse cx="${W / 2}" cy="1010" rx="400" ry="90" fill="${PINK}"/><ellipse cx="${W / 2}" cy="1010" rx="372" ry="74" fill="#dff6f0"/>`;
  // happy children standing on the floor
  const kids = [["lou", 450, 985, 2.15], ["mila", 265, 1030, 2.45], ["leo", 640, 1030, 2.45]];   // inside the phone crop (x 80–820)
  kids.forEach(([id, x, y, sc], i) => { const r = kid(KIDS[id], 0, "happy", "sp" + i); defs += r.defs; g += `<g transform="translate(${x} ${y}) scale(${sc}) translate(-64 -122)">${r.body}</g>`; });
  [[130, 330, 26], [780, 300, 22], [150, 720, 18], [760, 740, 20]].forEach(([x, y, r2]) => { g += `<path d="${star(x, y, r2, r2 * 0.33, 4)}" fill="#ffd24a" filter="url(#sg)"/>`; });
  return K.job("assets/img/splash.png", W, H, g, defs);
}

module.exports = () => {
  const jobs = [];
  Object.keys(KIDS).forEach((id) => jobs.push(kidSheet(id, "worried"), kidSheet(id, "happy"), kidThumb(id), bigFace(id, false), bigFace(id, true)));
  Object.keys(DOCS).forEach((n) => jobs.push(docSheet(n), docThumb(n)));
  jobs.push(floor(), rug(740, 540), wall(1400), sideWall("wall_left", 1100, false), sideWall("wall_right", 1100, true), bottomWall(1400), doormat(),
    chair(), reception(), plant("plant", "#ff9eb8", "monstera"), plant("plant_b", "#7fc8ff", "bush"), toothSign(), bench(), toybox(),
    balloons(), aquarium(), teddy(), rainbowRug(), trophy(),
    germ("germ_green", "#9be36a", 3), germ("germ_purple", "#c79bff", 8), germ("germ_orange", "#ffb35c", 12),
    brush(), wantBubble(), icon("assets/favicon.png", 512), icon("assets/apple-touch-icon.png", 180), logo(), splash(),
    toothIcon(), brushIcon(), germIcon(), kidIcon(),
    ...IK.jobs(PAL, ["star", "heart", "heartEmpty", "sound", "soundOff", "help", "avatar", "goals", "close", "play", "resume", "check", "gift", "hand", "sparkle", "bell", "refresh", "arrow", "trophy", "joy"]));
  return jobs;
};
