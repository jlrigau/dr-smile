#!/usr/bin/env python3
"""Close-up FACE backdrops for Dr Smile — an EXTREME zoom on the mouth.
The skin fills the whole frame edge to edge (no background, no head outline, no ears,
no hair): a BIG open mouth in the centre with BIG teeth, and only the parts of the
face near it (eyes high up, nose above the mouth, cheeks, chin) drawn around it.
Portrait 900x1160. Only skin / eye colours change per child."""
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets/img"
def mix(a, b, t): return tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3)) + (255,)
def dark(c, f): return tuple(max(0, int(c[i]*f)) for i in range(3)) + (255,)

W, H = 900, 1160
CX = 450

def draw_face(skin, brow, eye):
    im = Image.new("RGBA", (W, H), skin)                 # skin fills the WHOLE frame
    d = ImageDraw.Draw(im)
    skinD = dark(skin, 0.9); skinDD = dark(skin, 0.82)
    lip = mix(skin, (196, 92, 110, 255), 0.55); lipD = dark(lip, 0.85)
    line = (84, 66, 70, 255)

    # soft face-roundness shading at the edges (no hard outline)
    d.ellipse((-540, -300, 230, H + 300), fill=skinD)
    d.ellipse((W - 230, -300, W + 540, H + 300), fill=skinD)
    d.ellipse((-200, H - 150, W + 200, H + 500), fill=skinD)
    d.ellipse((40, -340, W - 40, H + 120), fill=skin)

    # eyes high up (looking down at the dentist) + brows near the top edge
    for sx in (-1, 1):
        ex = CX + sx * 156
        d.arc((ex - 60, 150, ex + 60, 214), 205, 335, fill=brow, width=12)
        ey = 268
        d.ellipse((ex - 66, ey - 52, ex + 66, ey + 52), fill=(255, 255, 255, 255), outline=line, width=3)
        d.ellipse((ex - 34, ey - 16, ex + 34, ey + 46), fill=eye)                  # iris (low → looking down)
        d.ellipse((ex - 18, ey + 2, ex + 18, ey + 36), fill=(30, 26, 30, 255))     # pupil
        d.ellipse((ex - 14, ey - 8, ex + 1, ey + 7), fill=(255, 255, 255, 255))    # highlight
        d.chord((ex - 66, ey - 66, ex + 66, ey + 28), 180, 360, fill=skin)         # upper lid
        d.arc((ex - 66, ey - 52, ex + 66, ey + 52), 198, 342, fill=line, width=4)

    # nose just above the mouth
    d.ellipse((CX - 66, 440, CX + 66, 600), fill=skinD)
    d.ellipse((CX - 56, 474, CX + 56, 596), fill=skin)
    d.ellipse((CX - 48, 548, CX - 18, 582), fill=skinDD)
    d.ellipse((CX + 18, 548, CX + 48, 582), fill=skinDD)
    d.ellipse((CX - 44, 498, CX - 16, 534), fill=mix(skin, (255, 255, 255, 255), 0.16))

    # cheeks
    for sx in (-1, 1):
        d.ellipse((CX + sx*250 - 90, 660, CX + sx*250 + 90, 800), fill=mix(skin, (255, 140, 152, 255), 0.30))

    # ---- BIG open mouth in the centre (the interactive area) ----
    cy, RX, RY = 790, 300, 255
    d.ellipse((CX - 372, cy - 228, CX + 372, cy + 244), fill=lip)
    d.ellipse((CX - 338, cy - 206, CX + 338, cy + 222), fill=lipD)
    d.ellipse((CX - RX, cy - RY, CX + RX, cy + RY), fill=(150, 70, 86, 255))

    gum = mix(skin, (210, 96, 116, 255), 0.5)
    tooth = (255, 255, 255, 255); tline = (208, 216, 224, 255); tshade = (228, 236, 242, 255)
    def teeth_row(y0, y1, n, span, upper=True):
        x0, x1 = CX - span, CX + span; w = (x1 - x0) / n
        if upper: d.rounded_rectangle((x0 - 18, y0 - 38, x1 + 18, y0 + 44), 28, fill=gum)
        else:     d.rounded_rectangle((x0 - 18, y1 - 44, x1 + 18, y1 + 38), 28, fill=gum)
        for i in range(n):
            bx = x0 + i * w
            d.rounded_rectangle((bx + 5, y0, bx + w - 5, y1), 20, fill=tooth, outline=tline, width=3)
            d.line((bx + w*0.5, y0 + 11, bx + w*0.5, y1 - 11), fill=(238, 244, 248, 255), width=2)
            if upper: d.ellipse((bx + 12, y1 - 24, bx + w - 12, y1 - 6), fill=tshade)
            else:     d.ellipse((bx + 12, y0 + 6, bx + w - 12, y0 + 24), fill=tshade)
    teeth_row(cy - 200, cy - 50, 7, 200, upper=True)        # big upper teeth
    d.ellipse((CX - 188, cy - 16, CX + 188, cy + 150), fill=(235, 140, 158, 255), outline=(214, 116, 134, 255), width=5)
    d.ellipse((CX - 186, cy - 14, CX + 186, cy + 52), fill=(246, 162, 178, 255))
    d.line((CX, cy + 6, CX, cy + 126), fill=(214, 116, 134, 255), width=5)
    teeth_row(cy + 66, cy + 200, 6, 178, upper=False)       # big lower teeth

    # chin highlight near the bottom edge
    d.ellipse((CX - 160, H - 200, CX + 160, H + 30), fill=mix(skin, (255, 255, 255, 255), 0.08))
    return im

KIDS = {
    "leo":   ((255,216,178,255), (120,82,48,255),  (96,150,205,255)),
    "mila":  ((255,224,196,255), (140,90,54,255),  (120,82,52,255)),
    "sacha": ((232,184,138,255), (190,150,80,255),  (130,95,60,255)),
    "lou":   ((176,122,79,255),  (58,42,34,255),   (74,52,42,255)),
    "tom":   ((138,90,60,255),   (42,32,24,255),   (64,48,40,255)),
    "zoe":   ((255,219,186,255), (150,80,46,255),  (118,80,52,255)),
}
for nm, (skin, brow, eye) in KIDS.items():
    draw_face(skin, brow, eye).save(f"{OUT}/mouth_{nm}.png")
print("face backdrops generated:", ", ".join("mouth_" + k for k in KIDS))
