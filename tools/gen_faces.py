#!/usr/bin/env python3
"""Close-up FACE backdrops for Dr Smile — a ZOOM on the mouth: a big open mouth in
the middle with BIG teeth (the interactive area), and partial face around the edges
(eyes near the top, nose above the mouth, hair band at the very top, ears cropped at
the sides). The face fills the whole frame (it's cropped, not a tiny full face).
Portrait 900x1160. Only skin/hair/eye colours change per child."""
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets/img"
def mix(a, b, t): return tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3)) + (255,)
def dark(c, f): return tuple(max(0, int(c[i]*f)) for i in range(3)) + (255,)

W, H = 900, 1160
CX = 450

def draw_face(skin, hair, style, eye):
    im = Image.new("RGBA", (W, H), skin)              # skin fills the whole frame
    d = ImageDraw.Draw(im)
    skinD = dark(skin, 0.9); skinDD = dark(skin, 0.82)
    hairD = dark(hair, 0.8)
    lip = mix(skin, (196, 92, 110, 255), 0.55); lipD = dark(lip, 0.85)
    line = (84, 66, 70, 255)

    # gentle rounded shading at the side edges so it reads as a face, not a flat fill
    d.ellipse((-360, 120, 200, H - 80), fill=skinD)
    d.ellipse((W - 200, 120, W + 360, H - 80), fill=skinD)
    d.ellipse((90, 60, W - 90, H + 200), fill=skin)

    # ears, cropped at the side edges
    for ex in (24, W - 24):
        d.ellipse((ex - 70, 560, ex + 70, 760), fill=skin, outline=skinD, width=3)
        d.ellipse((ex - 34, 612, ex + 34, 712), fill=skinD)

    # hair band along the very top (+ a hint of the style at the top edge)
    d.rectangle((0, 0, W, 150), fill=hair)
    for fx in range(-20, W + 40, 70):
        d.ellipse((fx - 46, 120, fx + 46, 232), fill=hair)            # soft fringe
    if style == "bun":
        d.ellipse((CX - 78, -70, CX + 78, 96), fill=hair, outline=hairD, width=3)
    if style in ("pigtails", "ponytail"):
        d.ellipse((-40, 70, 150, 320), fill=hair, outline=hairD, width=3)
        d.ellipse((W - 150, 70, W + 40, 320), fill=hair, outline=hairD, width=3)
    if style == "curly":
        for fx in range(0, W + 1, 70):
            d.ellipse((fx - 52, 70, fx + 52, 200), fill=hair)

    # eyebrows + eyes near the top (looking down at the dentist)
    for sx in (-1, 1):
        ex = CX + sx * 150
        d.arc((ex - 56, 268, ex + 56, 330), 205, 335, fill=hairD, width=11)
        ey = 372
        d.ellipse((ex - 62, ey - 50, ex + 62, ey + 50), fill=(255, 255, 255, 255), outline=line, width=3)
        d.ellipse((ex - 32, ey - 18, ex + 32, ey + 42), fill=eye)               # iris (low → looking down)
        d.ellipse((ex - 17, ey - 2, ex + 17, ey + 30), fill=(30, 26, 30, 255))  # pupil
        d.ellipse((ex - 13, ey - 12, ex + 1, ey + 2), fill=(255, 255, 255, 255))# highlight
        d.chord((ex - 62, ey - 64, ex + 62, ey + 26), 180, 360, fill=skin)      # upper lid
        d.arc((ex - 62, ey - 50, ex + 62, ey + 50), 200, 340, fill=line, width=4)

    # nose just above the mouth
    d.ellipse((CX - 60, 470, CX + 60, 610), fill=skinD)
    d.ellipse((CX - 52, 500, CX + 52, 606), fill=skin)
    d.ellipse((CX - 44, 566, CX - 16, 596), fill=skinDD)
    d.ellipse((CX + 16, 566, CX + 44, 596), fill=skinDD)
    d.ellipse((CX - 40, 520, CX - 14, 552), fill=mix(skin, (255, 255, 255, 255), 0.16))

    # cheeks
    for sx in (-1, 1):
        d.ellipse((CX + sx*235 - 80, 700, CX + sx*235 + 80, 820), fill=mix(skin, (255, 140, 152, 255), 0.32))

    # ---- BIG open mouth in the middle (the interactive area) ----
    cy, RX, RY = 770, 272, 230
    d.ellipse((CX - 344, cy - 206, CX + 344, cy + 222), fill=lip)               # lips
    d.ellipse((CX - 310, cy - 186, CX + 310, cy + 200), fill=lipD)
    d.ellipse((CX - RX, cy - RY, CX + RX, cy + RY), fill=(150, 70, 86, 255))    # interior

    gum = mix(skin, (210, 96, 116, 255), 0.5)
    tooth = (255, 255, 255, 255); tline = (208, 216, 224, 255); tshade = (228, 236, 242, 255)
    def teeth_row(y0, y1, n, span, upper=True):
        x0, x1 = CX - span, CX + span; w = (x1 - x0) / n
        if upper: d.rounded_rectangle((x0 - 16, y0 - 34, x1 + 16, y0 + 40), 26, fill=gum)
        else:     d.rounded_rectangle((x0 - 16, y1 - 40, x1 + 16, y1 + 34), 26, fill=gum)
        for i in range(n):
            bx = x0 + i * w
            d.rounded_rectangle((bx + 5, y0, bx + w - 5, y1), 18, fill=tooth, outline=tline, width=3)
            d.line((bx + w*0.5, y0 + 10, bx + w*0.5, y1 - 10), fill=(238, 244, 248, 255), width=2)
            if upper: d.ellipse((bx + 11, y1 - 22, bx + w - 11, y1 - 5), fill=tshade)
            else:     d.ellipse((bx + 11, y0 + 5, bx + w - 11, y0 + 22), fill=tshade)
    teeth_row(cy - 180, cy - 40, 7, 180, upper=True)        # big upper teeth
    d.ellipse((CX - 170, cy - 14, CX + 170, cy + 140), fill=(235, 140, 158, 255), outline=(214, 116, 134, 255), width=5)
    d.ellipse((CX - 168, cy - 12, CX + 168, cy + 48), fill=(246, 162, 178, 255))
    d.line((CX, cy + 6, CX, cy + 116), fill=(214, 116, 134, 255), width=5)
    teeth_row(cy + 60, cy + 184, 6, 160, upper=False)       # big lower teeth

    # chin shading near the bottom edge
    d.ellipse((CX - 150, H - 230, CX + 150, H - 40), fill=mix(skin, (255,255,255,255), 0.08))
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
