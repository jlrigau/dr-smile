#!/usr/bin/env python3
"""Shared Dr Smile mascot: a big happy molar tooth.

One source of truth so the app icon (gen_icon.py) and the in-scene signs
(gen_world.py) draw the exact same tooth. `tooth_layer()` returns a transparent
RGBA image of the tooth; `tight_tooth()` crops it to its bounding box so callers
can scale it to fill any frame."""
from PIL import Image, ImageDraw

WHITE = (255, 255, 255, 255)


def tooth_layer(px=512, face=True, sparkle=True, shadow=True, notch=True, outline=(210, 216, 222, 255)):
    """A molar tooth (two humps + body + two roots) drawn on a transparent canvas.

    `notch=False` keeps a smooth rounded base (no roots) — reads more clearly as a
    tooth at very small sizes (the deep root notch otherwise looks like an envelope)."""
    ss = 4
    S = px * ss
    k = S / 512.0
    def u(v): return v * k

    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))

    # silhouette on its own layer so the notch can be punched out transparently
    tl = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    dt = ImageDraw.Draw(tl)
    dt.ellipse((u(108), u(86), u(286), u(280)), fill=WHITE)               # left top hump
    dt.ellipse((u(226), u(86), u(404), u(280)), fill=WHITE)              # right top hump
    dt.rounded_rectangle((u(132), u(170), u(380), u(432)), radius=u(40), fill=WHITE)  # body + roots
    if notch:
        dt.polygon([(u(212), u(440)), (u(256), u(312)), (u(300), u(440))], fill=(0, 0, 0, 0))  # notch → 2 roots
    im.alpha_composite(tl)

    # soft shadow at the base, masked to the tooth so it can't spill out
    if shadow:
        sh = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        ImageDraw.Draw(sh).ellipse((u(170), u(330), u(342), u(420)), fill=(225, 232, 238, 90))
        a = sh.split()[3]
        a2 = Image.composite(a, Image.new("L", (S, S), 0), tl.split()[3])
        sh.putalpha(a2)
        im.alpha_composite(sh)

    d = ImageDraw.Draw(im)
    if face:
        eye = (54, 48, 60, 255)
        for ex in (216, 296):
            d.ellipse((u(ex - 30), u(214), u(ex + 30), u(276)), fill=WHITE, outline=outline, width=int(u(3)))
            d.ellipse((u(ex - 16), u(232), u(ex + 16), u(272)), fill=eye)
            d.ellipse((u(ex - 10), u(236), u(ex - 1), u(248)), fill=WHITE)
        d.ellipse((u(176), u(280), u(206), u(304)), fill=(255, 150, 165, 190))   # cheeks
        d.ellipse((u(306), u(280), u(336), u(304)), fill=(255, 150, 165, 190))
        d.chord((u(220), u(278), u(292), u(330)), 0, 180, fill=(150, 70, 86, 255))   # open smile
        d.ellipse((u(236), u(308), u(276), u(332)), fill=(255, 150, 165, 255))       # tongue
    if sparkle:
        sx, sy = u(360), u(150)
        d.polygon([(sx, sy - u(30)), (sx + u(9), sy - u(9)), (sx + u(30), sy),
                   (sx + u(9), sy + u(9)), (sx, sy + u(30)), (sx - u(9), sy + u(9)),
                   (sx - u(30), sy), (sx - u(9), sy - u(9))], fill=(255, 214, 92, 255))
        d.ellipse((sx - u(7), sy - u(7), sx + u(7), sy + u(7)), fill=WHITE)

    return im.resize((px, px), Image.LANCZOS)


def tight_tooth(px=512, **kw):
    """The tooth cropped to its bounding box (so it can be scaled to fill a frame)."""
    t = tooth_layer(px=px, **kw)
    return t.crop(t.getbbox())
