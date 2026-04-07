#!/usr/bin/env python3
"""
Restaure un article depuis le backup.
Usage: python3 scripts/restore_article.py [slug]
       python3 scripts/restore_article.py all
"""
import os, shutil, sys

BACKUP_DIR = 'scripts/backup'

if len(sys.argv) < 2:
    print('Usage: python3 scripts/restore_article.py [slug|all]')
    sys.exit(1)

target = sys.argv[1]

if target == 'all':
    slugs = [f.replace('.html','') for f in os.listdir(BACKUP_DIR) if f.endswith('.html')]
else:
    slugs = [target]

for slug in slugs:
    src = f'{BACKUP_DIR}/{slug}.html'
    dst = f'lib/content/{slug}.html'
    if not os.path.exists(src):
        print(f'[{slug}] ✗ pas de backup')
        continue
    shutil.copy2(src, dst)
    print(f'[{slug}] ✓ restauré')
