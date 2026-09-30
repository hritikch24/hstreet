#!/usr/bin/env python3
"""
Checks the photographs this site publishes (public/work) for near-duplicates:

  1. against every image in the other repos in the portfolio registry, and
  2. against each other, so the same shot is never published twice.

Uses a 256-bit difference hash. Resized or recompressed copies of one photo
usually sit under 30 bits apart; different photos 60 or more. Anything at or
under --max (default 40) fails.

    python3 tools/check-photo-dupes.py [--max=40]

Needs Pillow. A dev tool only; not a dependency of the site.
"""
import json
import warnings
import os
import sys

from PIL import Image, ImageOps

warnings.filterwarnings("ignore", category=UserWarning)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SELF = 'highstreet'
EXT = ('.jpg', '.jpeg', '.png', '.webp')
SKIP = {'node_modules', '.next', '.git', '.vercel'}


def fingerprint(path, size=16):
    with Image.open(path) as im:
        grey = ImageOps.exif_transpose(im).convert('L').resize((size + 1, size), Image.LANCZOS)
    px = list(grey.getdata())
    bits = 0
    for r in range(size):
        for c in range(size):
            bits = (bits << 1) | (px[r * (size + 1) + c] > px[r * (size + 1) + c + 1])
    return bits


def images(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP]
        for f in filenames:
            if f.lower().endswith(EXT):
                yield os.path.join(dirpath, f)


def other_repos():
    reg_path = os.environ.get('PORTFOLIO_REGISTRY', os.path.join(ROOT, '..', 'seo-plan', 'portfolio-registry.json'))
    with open(reg_path) as fh:
        reg = json.load(fh)
    repos = []
    for site in reg['sites']:
        if site['key'] == SELF:
            continue
        path = os.path.expanduser(site['repo'])
        if os.path.isdir(path):
            repos.append((site['key'], path))
        else:
            print(f'  (skipping {site["key"]}: no repo at {path})')
    return repos


def main(argv):
    limit = 40
    for a in argv:
        if a.startswith('--max='):
            limit = int(a.split('=', 1)[1])

    ours = {p: fingerprint(p) for p in sorted(images(os.path.join(ROOT, 'public', 'work')))}
    theirs = {}
    for key, repo in other_repos():
        for p in images(repo):
            try:
                theirs[p] = (key, fingerprint(p))
            except Exception:
                pass

    print(f'Photo check: {len(ours)} of ours against {len(theirs)} images in other repos (limit {limit} bits).')
    failures = 0

    for p, h in ours.items():
        best = min(((bin(h ^ th).count('1'), key, op) for op, (key, th) in theirs.items()), default=(256, None, None))
        if best[0] <= limit:
            failures += 1
            print(f'  NEAR-DUPLICATE {best[0]:3d}  {os.path.basename(p)}  ~  [{best[1]}] {best[2]}')

    names = list(ours)
    closest_pair = (256, None, None)
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            d = bin(ours[a] ^ ours[b]).count('1')
            closest_pair = min(closest_pair, (d, a, b))
            if d <= limit:
                failures += 1
                print(f'  REPEATED IN REPO {d:3d}  {os.path.basename(a)}  ~  {os.path.basename(b)}')

    nearest_other = min(
        (min((bin(h ^ th).count('1') for _, th in theirs.values()), default=256) for h in ours.values()),
        default=256,
    )
    print(f'  closest match in another repo: {nearest_other} bits')
    if closest_pair[1]:
        print(f'  closest pair within this repo: {closest_pair[0]} bits '
              f'({os.path.basename(closest_pair[1])}, {os.path.basename(closest_pair[2])})')
    if failures:
        print(f'\n{failures} problem(s).')
        return 1
    print('No near-duplicates.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
