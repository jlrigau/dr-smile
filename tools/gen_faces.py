#!/usr/bin/env python3
"""Close-up FACE backdrops for Dr Smile — one per child (their own skin tone).
Portrait 900x1160 so it fills a phone screen: nose + cheeks + chin around an
open mouth in the middle. Teeth stay inside the lips; spots only land on teeth."""
import os, math
from PIL import Image, ImageDraw

OUT = "/home/user/dr-smile/assets/img"

def mix(a, b, t): return tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3)) + (255,)
def dark(c, f): return tuple(max(0, int(c[i]*f)) for i in range(3)) + (255,)

def draw_face(skin):
    W, H = 900, 1160
    im = Image.new("RGBA", (W, H), skin)
    d = ImageDraw.Draw(im)
    cx, cy = 450, 640
    skinD = dark(skin, 0.9); skinDD = dark(skin, 0.8)
    lip = mix(skin, (196, 92, 110, 255), 0.55)
    lipD = dark(lip, 0.85)

    # soft side shading so it reads as a rounded face, not a flat fill
    d.ellipse((-200, 120, 200, H - 60), fill=skinD)
    d.ellipse((W - 200, 120, W + 200, H - 60), fill=skinD)
    d.ellipse((140, 60, W - 140, H - 20), fill=skin)

    # nose: a soft rounded tip with nostrils (no harsh bridge line)
    d.ellipse((cx - 70, 255, cx + 70, 412), fill=skinD)                              # broad soft shadow
    d.ellipse((cx - 56, 300, cx + 56, 410), fill=skin)                               # rounded tip
    d.ellipse((cx - 47, 372, cx - 20, 399), fill=skinDD)                             # nostrils
    d.ellipse((cx + 20, 372, cx + 47, 399), fill=skinDD)
    d.ellipse((cx - 42, 322, cx - 16, 354), fill=mix(skin, (255, 255, 255, 255), 0.16))  # highlight

    # cheeks (rosy)
    d.ellipse((150, 560, 320, 720), fill=mix(skin, (255, 150, 160, 255), 0.30))
    d.ellipse((W - 320, 560, W - 150, 720), fill=mix(skin, (255, 150, 160, 255), 0.30))

    # ---- open mouth ----
    RX, RY = 255, 190
    d.ellipse((cx - 318, cy - 168, cx + 318, cy + 182), fill=lip)            # outer lip
    d.ellipse((cx - 286, cy - 150, cx + 286, cy + 162), fill=lipD)           # lip inner edge
    d.ellipse((cx - RX, cy - RY, cx + RX, cy + RY), fill=(150, 70, 86, 255))  # interior (reddish)

    gum = mix(skin, (210, 96, 116, 255), 0.5)
    tooth = (255, 255, 255, 255); tline = (208, 216, 224, 255); tshade = (228, 236, 242, 255)

    def teeth_row(y0, y1, n, span, upper=True):
        x0, x1 = cx - span, cx + span
        w = (x1 - x0) / n
        if upper: d.rounded_rectangle((x0 - 14, y0 - 30, x1 + 14, y0 + 34), 22, fill=gum)
        else:     d.rounded_rectangle((x0 - 14, y1 - 34, x1 + 14, y1 + 30), 22, fill=gum)
        for i in range(n):
            bx = x0 + i * w
            d.rounded_rectangle((bx + 4, y0, bx + w - 4, y1), 15, fill=tooth, outline=tline, width=3)
            d.line((bx + w*0.5, y0 + 9, bx + w*0.5, y1 - 9), fill=(238, 244, 248, 255), width=2)
            if upper: d.ellipse((bx + 9, y1 - 18, bx + w - 9, y1 - 4), fill=tshade)
            else:     d.ellipse((bx + 9, y0 + 4, bx + w - 9, y0 + 18), fill=tshade)

    teeth_row(cy - 150, cy - 35, 8, 150, upper=True)
    # tongue in the middle, between the jaws
    d.ellipse((cx - 140, cy - 12, cx + 140, cy + 118), fill=(235, 140, 158, 255), outline=(214, 116, 134, 255), width=5)
    d.ellipse((cx - 138, cy - 10, cx + 138, cy + 40), fill=(246, 162, 178, 255))
    d.line((cx, cy + 8, cx, cy + 96), fill=(214, 116, 134, 255), width=5)
    teeth_row(cy + 40, cy + 150, 7, 138, upper=False)

    # chin highlight / soft crease
    d.ellipse((cx - 120, 980, cx + 120, 1110), fill=mix(skin, (255,255,255,255), 0.10))
    d.arc((cx - 70, cy + 200, cx + 70, cy + 300), 20, 160, fill=skinD, width=4)
    return im

KIDS = {
    "leo":   (255, 216, 178, 255),
    "mila":  (255, 224, 196, 255),
    "sacha": (232, 184, 138, 255),
    "lou":   (176, 122, 79, 255),
    "tom":   (138, 90, 60, 255),
    "zoe":   (255, 219, 186, 255),
}
for nm, skin in KIDS.items():
    draw_face(skin).save(f"{OUT}/mouth_{nm}.png")
print("face backdrops generated:", ", ".join("mouth_" + k for k in KIDS))
