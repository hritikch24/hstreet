#!/usr/bin/env python3
"""
Copies the firm's own job photos from the owner's WhatsApp export into
public/work with descriptive names. The originals are never modified.

    python3 tools/prepare-photos.py [source-dir]

Default source: ~/Downloads/Highstreet. For each chosen photo it:
  - applies the camera orientation, then drops every byte of metadata
    (EXIF, GPS, camera model) by re-encoding the pixels only
  - straightens or crops where the list below says so, to remove a phone
    number, an alarm company's number, bystanders or the edge of a tilt
  - scales the long edge to 2000px and saves a progressive JPEG

Which photos were left out, and why, is recorded in CLAUDE.md.
Needs Pillow. A dev tool only; the site never imports it.
"""
import os
import sys

from PIL import Image, ImageFilter, ImageOps

SOURCE = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '~/Downloads/Highstreet')
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'work')
PREFIX = 'WhatsApp Image 2026-09-30 at '
LONG_EDGE = 2000

# (source stamp, output name, operations)
# crop = (left, top, right, bottom) as fractions of the oriented image.
# blur = list of fractional boxes to blur heavily.
# rotate = degrees anticlockwise, followed by the crop.
PHOTOS = [
    # Aluminium and glass shopfronts
    ('23.18.07', 'aluminium-glazing-sliding-doors-new-unit-night', {}),
    ('23.18.24', 'black-aluminium-shopfront-sliding-doors-daylight', {'blur': [(0.71, 0.06, 0.84, 0.24)]}),
    ('23.18.27', 'black-aluminium-shopfront-during-fit', {'blur': [(0.69, 0.0, 0.84, 0.11)]}),
    ('23.18.28 (4)', 'black-aluminium-shopfront-parade-obscured-glass', {}),
    ('23.18.02', 'aluminium-glazed-screen-new-unit-night', {}),
    ('23.18.04', 'tall-aluminium-glazed-screen-night', {}),
    ('23.18.01', 'pale-blue-aluminium-door-with-side-screen', {}),
    ('23.18.21', 'black-shopfront-convenience-store-ramp', {}),
    ('23.18.23', 'glass-frontage-stone-building-awning', {}),
    ('23.18.27 (2)', 'glass-frontage-under-pull-out-awning', {}),
    ('23.18.27 (5)', 'wide-glass-frontage-ornate-high-street', {}),
    ('23.18.28 (9)', 'black-aluminium-entrance-door-dark-cladding', {}),
    # Automatic and sliding doors
    ('23.18.11', 'black-automatic-sliding-doors-shop-interior', {}),
    ('23.18.26 (1)', 'automatic-sliding-doors-convenience-store-aisles', {}),
    ('23.18.17', 'automatic-sliding-doors-under-exit-sign', {}),
    ('23.18.05', 'automatic-sliding-doors-mid-installation', {'rotate': -27, 'crop': (0.2, 0.2, 0.8, 0.8)}),
    ('23.18.08', 'black-frontage-sliding-doors-shutter-box', {}),
    # Roller shutters
    ('23.17.59', 'black-roller-shutter-closed-corner-shop', {}),
    ('23.18.16', 'cream-roller-shutter-brick-frontage', {}),
    ('23.18.28 (11)', 'grey-roller-shutter-full-shop-frontage', {}),
    ('23.18.28 (12)', 'roller-shutter-curtain-against-sky', {}),
    ('23.18.28 (5)', 'purple-roller-shutter-closed', {}),
    ('23.18.28 (6)', 'purple-shutter-frontage-open', {}),
    ('23.18.28 (7)', 'silver-roller-shutter-standalone-opening', {}),
    ('23.18.28 (10)', 'black-roller-shutter-narrow-opening', {}),
    ('23.18.28 (8)', 'grey-roller-shutter-blockwork-side-door', {}),
    ('23.18.29', 'black-roller-shutter-brick-building', {}),
    ('23.18.27 (6)', 'maroon-roller-shutter-close', {}),
    ('23.18.29 (1)', 'maroon-roller-shutter-white-render', {}),
    ('23.17.53', 'white-roller-shutter-rear-door-brick', {'crop': (0.0, 0.0, 0.76, 1.0)}),
    ('23.18.28 (3)', 'white-roller-shutter-shop-front', {'crop': (0.0, 0.06, 0.895, 1.0)}),
    # Steel security doors and fire exits
    ('23.17.49 (1)', 'black-steel-double-fire-exit-doors', {}),
    ('23.18.27 (11)', 'white-fire-exit-door-push-bar', {}),
    ('23.18.26', 'dark-grey-steel-double-doors-cladding', {}),
    ('23.18.29 (5)', 'dark-grey-steel-doors-yard', {}),
    ('23.18.20', 'white-steel-door-single', {}),
    ('23.18.27 (3)', 'dark-blue-steel-door-single', {}),
    ('23.17.52', 'white-double-exit-doors-panel-above', {}),
    # Aluminium panel doors
    ('23.18.27 (4)', 'white-aluminium-panel-door-passage', {}),
    ('23.18.28', 'white-aluminium-panel-door-rendered-wall', {}),
    ('23.18.28 (1)', 'white-aluminium-double-panel-doors', {}),
    # Glazed doors and fit-outs
    ('23.17.49', 'black-aluminium-glazed-double-doors-lobby', {}),
    ('23.18.13', 'black-framed-glazed-double-doors-interior', {}),
    ('23.18.18', 'bronze-effect-aluminium-door-shopping-centre', {'crop': (0.0, 0.0, 0.54, 1.0)}),
    ('23.18.27 (9)', 'glazed-screen-slatted-timber-ceiling', {}),
]


def box(img, frac):
    w, h = img.size
    return (int(frac[0] * w), int(frac[1] * h), int(frac[2] * w), int(frac[3] * h))


def process(stamp, name, ops):
    src = os.path.join(SOURCE, f'{PREFIX}{stamp}.jpeg')
    with Image.open(src) as original:
        img = ImageOps.exif_transpose(original).convert('RGB')
    for region in ops.get('blur', []):
        b = box(img, region)
        img.paste(img.crop(b).filter(ImageFilter.GaussianBlur(24)), b)
    if 'rotate' in ops:
        img = img.rotate(ops['rotate'], resample=Image.BICUBIC, expand=False)
    if 'crop' in ops:
        img = img.crop(box(img, ops['crop']))
    img.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
    # A fresh image carries pixels only: no EXIF, GPS or maker notes.
    clean = Image.new('RGB', img.size)
    clean.paste(img)
    path = os.path.join(OUT, f'{name}.jpg')
    clean.save(path, 'JPEG', quality=82, optimize=True, progressive=True)
    return path, clean.size


def main():
    os.makedirs(OUT, exist_ok=True)
    names = [p[1] for p in PHOTOS]
    assert len(names) == len(set(names)), 'duplicate output name'
    for stamp, name, ops in PHOTOS:
        path, size = process(stamp, name, ops)
        print(f'{size[0]:5d}x{size[1]:<5d} {os.path.basename(path)}')
    print(f'{len(PHOTOS)} photos written to public/work')


if __name__ == '__main__':
    main()
