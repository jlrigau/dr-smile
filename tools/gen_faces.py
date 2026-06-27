#!/usr/bin/env python3
"""Close-up FACE backdrops for Dr Smile — a nice child's face (hair, eyes, nose,
cheeks, ears) with a BIG open mouth roughly centred. The skin fills the whole frame
edge to edge (no background, no head outline). The engine displays it with
object-fit:cover so it fills the whole screen; spots are placed cover-aware so they
stay on the teeth. Portrait 900x1160. Only skin / hair / eye colours change per child."""
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets/img"
def mix(a, b, t): return tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3)) + (255,)
def dark(c, f): return tuple(max(0, int(c[i]*f)) for i in range(3)) + (255,)

W, H = 900, 1160
CX = 450

def draw_face(skin, hair, style, eye):
    im = Image.new("RGBA", (W, H), skin)                 # skin fills the WHOLE frame
    d = ImageDraw.Draw(im)
    skinD = dark(skin, 0.92); skinDD = dark(skin, 0.82)
    hairD = dark(hair, 0.8)
    lip = mix(skin, (196, 92, 110, 255), 0.55); lipD = dark(lip, 0.85)
    line = (84, 66, 70, 255)

    # very soft jaw/temple shading (no hard outline — the face just rounds off)
    d.ellipse((-560, 60, 180, H + 260), fill=skinD)
    d.ellipse((W - 180, 60, W + 560, H + 260), fill=skinD)
    d.ellipse((30, -260, W - 30, H + 60), fill=skin)

    # subtle ears at the sides
    for ex in (16, W - 16):
        d.ellipse((ex - 60, 520, ex + 60, 700), fill=skin, outline=skinD, width=2)
        d.ellipse((ex - 28, 566, ex + 28, 654), fill=skinD)

    # hair: just a clean band along the top + a soft fringe (no top-of-head bumps —
    # the actual hairstyle is shown on the board sprite, not in this extreme close-up).
    d.rectangle((0, 0, W, 150), fill=hair)
    for fx in range(-20, W + 40, 70):
        d.ellipse((fx - 48, 120, fx + 48, 236), fill=hair)
    if style == "curly":
        for fx in range(-10, W + 20, 64):
            d.ellipse((fx - 50, 60, fx + 50, 196), fill=hair)

    # eyebrows + eyes (big, looking down)
    for sx in (-1, 1):
        ex = CX + sx * 150
        d.arc((ex - 58, 268, ex + 58, 330), 205, 335, fill=hairD, width=11)
        ey = 372
        d.ellipse((ex - 64, ey - 52, ex + 64, ey + 52), fill=(255, 255, 255, 255), outline=line, width=3)
        d.ellipse((ex - 33, ey - 16, ex + 33, ey + 46), fill=eye)
        d.ellipse((ex - 17, ey, ex + 17, ey + 34), fill=(30, 26, 30, 255))
        d.ellipse((ex - 13, ey - 10, ex + 1, ey + 5), fill=(255, 255, 255, 255))
        d.chord((ex - 64, ey - 64, ex + 64, ey + 28), 180, 360, fill=skin)
        d.arc((ex - 64, ey - 52, ex + 64, ey + 52), 198, 342, fill=line, width=4)

    # nose just above the mouth
    d.ellipse((CX - 60, 470, CX + 60, 612), fill=skinD)
    d.ellipse((CX - 52, 502, CX + 52, 608), fill=skin)
    d.ellipse((CX - 46, 566, CX - 18, 596), fill=skinDD)
    d.ellipse((CX + 18, 566, CX + 46, 596), fill=skinDD)
    d.ellipse((CX - 42, 522, CX - 16, 556), fill=mix(skin, (255, 255, 255, 255), 0.16))

    # cheeks
    for sx in (-1, 1):
        d.ellipse((CX + sx*236 - 84, 660, CX + sx*236 + 84, 792), fill=mix(skin, (255, 140, 152, 255), 0.30))

    # ---- BIG open mouth, roughly centred ----
    cy, RX, RY = 700, 274, 224
    d.ellipse((CX - 344, cy - 200, CX + 344, cy + 216), fill=lip)
    d.ellipse((CX - 312, cy - 180, CX + 312, cy + 196), fill=lipD)
    d.ellipse((CX - RX, cy - RY, CX + RX, cy + RY), fill=(150, 70, 86, 255))

    gum = mix(skin, (210, 96, 116, 255), 0.5); gumD = dark(gum, 0.88)
    tooth = (252, 252, 250, 255); tline = (214, 220, 226, 255); tshade = (228, 235, 242, 255)
    def teeth_row(y0, y1, weights, span, upper=True):
        # real-ish teeth: varied widths (incisors wider), touching, rounded biting edge,
        # emerging from a gum that covers the roots; soft per-tooth shading.
        total = float(sum(weights)); x = CX - span; cells = []
        for wgt in weights:
            tw = 2 * span * wgt / total; cells.append((x, x + tw)); x += tw
        for (xa, xb) in cells:
            r = int(min(14, (xb - xa) / 2.6))
            d.rounded_rectangle((int(xa) + 1, int(y0), int(xb) - 1, int(y1)), radius=r, fill=tooth, outline=tline, width=2)
            d.line((int(xa) + 6, int(y0) + 8, int(xa) + 6, int(y1) - 12), fill=(255, 255, 255, 255), width=3)   # highlight
            d.line((int(xb) - 4, int(y0) + 6, int(xb) - 4, int(y1) - 8), fill=(214, 222, 230, 255), width=2)    # side shadow
            if upper: d.ellipse((int(xa) + 5, int(y1) - 18, int(xb) - 5, int(y1) - 3), fill=tshade)             # biting-edge shade
            else:     d.ellipse((int(xa) + 5, int(y0) + 3, int(xb) - 5, int(y0) + 18), fill=tshade)
        if upper:
            d.rounded_rectangle((CX - span - 16, y0 - 46, CX + span + 16, y0 + 20), 26, fill=gum)
            d.line((CX - span - 4, y0 + 20, CX + span + 4, y0 + 20), fill=gumD, width=3)
        else:
            d.rounded_rectangle((CX - span - 16, y1 - 20, CX + span + 16, y1 + 46), 26, fill=gum)
            d.line((CX - span - 4, y1 - 20, CX + span + 4, y1 - 20), fill=gumD, width=3)
    UW = [0.9, 1.05, 1.25, 1.25, 1.05, 0.9]; LW = [1.0, 1.2, 1.3, 1.2, 1.0]
    teeth_row(cy - 150, cy - 56, UW, 206, upper=True)
    # tongue resting between the jaws
    d.ellipse((CX - 168, cy - 6, CX + 168, cy + 128), fill=(235, 140, 158, 255), outline=(214, 116, 134, 255), width=5)
    d.ellipse((CX - 166, cy - 4, CX + 166, cy + 52), fill=(246, 162, 178, 255))
    d.line((CX, cy + 8, CX, cy + 108), fill=(214, 116, 134, 255), width=5)
    teeth_row(cy + 60, cy + 150, LW, 182, upper=False)

    # chin highlight
    d.ellipse((CX - 150, 930, CX + 150, 1130), fill=mix(skin, (255, 255, 255, 255), 0.07))
    return im

KIDS = {
    "leo":   ((255,216,178,255), (120,82,48,255),  "short",    (96,150,205,255)),
    "mila":  ((255,224,196,255), (140,90,54,255),  "pigtails", (120,82,52,255)),
    "sacha": ((232,184,138,255), (232,198,106,255),"short",    (130,95,60,255)),
    "lou":   ((176,122,79,255),  (58,42,34,255),   "ponytail", (74,52,42,255)),
    "tom":   ((138,90,60,255),   (42,32,24,255),   "curly",    (64,48,40,255)),
    "zoe":   ((255,219,186,255), (168,84,46,255),  "bun",      (118,80,52,255)),
}
for nm, (skin, hair, style, eye) in KIDS.items():
    draw_face(skin, hair, style, eye).save(f"{OUT}/mouth_{nm}.png")
print("face backdrops generated:", ", ".join("mouth_" + k for k in KIDS))
