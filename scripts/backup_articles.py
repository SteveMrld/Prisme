#!/usr/bin/env python3
"""
Sauvegarde tous les articles dans scripts/backup/
À lancer AVANT tout script qui touche lib/content/
"""
import os, shutil, json
from datetime import datetime

BACKUP_DIR = 'scripts/backup'
os.makedirs(BACKUP_DIR, exist_ok=True)

arts = json.load(open('lib/articles.json'))
saved = 0
for a in arts:
    src = f'lib/content/{a["slug"]}.html'
    if not os.path.exists(src): continue
    dst = f'{BACKUP_DIR}/{a["slug"]}.html'
    shutil.copy2(src, dst)
    saved += 1

print(f'✓ {saved} articles sauvegardés dans {BACKUP_DIR}/')
