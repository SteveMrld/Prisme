#!/usr/bin/env python3
"""
Vérifie l'intégrité des articles vs leur backup.
Lance automatiquement après chaque modification de lib/content/
"""
import os, re, json, sys

BACKUP_DIR = 'scripts/backup'
errors = []

arts = json.load(open('lib/articles.json'))
visual_formats = ['cygne', 'ia', 'overton', 'predateurs']  # cartes interactives, pas de corps

for a in arts:
    slug = a['slug']
    current_path = f'lib/content/{slug}.html'
    backup_path = f'{BACKUP_DIR}/{slug}.html'
    
    if not os.path.exists(current_path):
        errors.append(f'[{slug}] FICHIER MANQUANT')
        continue
    
    current = open(current_path, encoding='utf-8').read()
    
    # Check 1: contenu minimum
    text = re.sub(r'<[^>]+>', '', current).strip()
    min_chars = 200 if slug in visual_formats else 1000
    if len(text) < min_chars:
        errors.append(f'[{slug}] CONTENU TROP COURT: {len(text)} chars (min {min_chars})')
    
    # Check 2: div balance
    opens = len(re.findall(r'<div[^>]*>', current))
    closes = len(re.findall(r'</div>', current))
    if opens != closes:
        errors.append(f'[{slug}] DIV IMBALANCE: {opens}o/{closes}c')
    
    # Check 3: comparaison avec backup (si existe)
    if os.path.exists(backup_path):
        backup = open(backup_path, encoding='utf-8').read()
        backup_text = re.sub(r'<[^>]+>', '', backup).strip()
        current_text = re.sub(r'<[^>]+>', '', current).strip()
        # Si le texte visible a diminué de plus de 30%, c'est suspect
        if len(backup_text) > 500 and len(current_text) < len(backup_text) * 0.7:
            errors.append(f'[{slug}] CONTENU RÉDUIT: {len(current_text)} chars vs {len(backup_text)} en backup ({int(len(current_text)/len(backup_text)*100)}%)')

if errors:
    print(f'\n🔴 {len(errors)} PROBLÈME(S) DÉTECTÉ(S):')
    for e in errors: print(f'  ❌ {e}')
    print('\nPour restaurer un article: python3 scripts/restore_article.py [slug]')
    sys.exit(1)
else:
    print(f'✅ {len(arts)} articles vérifiés — intégrité OK')
