#!/usr/bin/env python
"""
Database Converter & Migration Utility for Urvixa / AgriSense backend.
Converts and migrates pre-existing SQLite database (db.sqlite3) to PostgreSQL (or vice-versa).
"""

import os
import sys
import json
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrisense.settings')
django.setup()

from django.core.management import call_command
from django.db import connections, transaction
from django.contrib.auth.models import User
from api.models import (
    Profile, Farm, SoilReport, DiseaseAnalysis,
    CropRecommendation, EquipmentBooking, CommunityPost,
    CommunityComment, Notification
)

MODELS = [
    User,
    Profile,
    Farm,
    SoilReport,
    DiseaseAnalysis,
    CropRecommendation,
    EquipmentBooking,
    CommunityPost,
    CommunityComment,
    Notification
]

def export_sqlite_to_json(output_filename="sqlite_export.json"):
    """Exports SQLite database tables into a clean JSON fixture file."""
    print(f"📦 Exporting SQLite database data to '{output_filename}'...")
    try:
        with open(output_filename, 'w') as f:
            call_command('dumpdata', 'auth.User', 'api', indent=2, stdout=f, database='sqlite')
        print(f"✅ Successfully exported SQLite database data to '{output_filename}'.")
        return True
    except Exception as e:
        print(f"❌ Failed to export SQLite database: {e}")
        return False

def migrate_target_db(target_alias='default'):
    """Applies schema migrations to target database."""
    print(f"🛠️  Applying schema migrations to target database '{target_alias}'...")
    try:
        call_command('migrate', database=target_alias, interactive=False)
        print(f"✅ Schema migrations successfully applied to '{target_alias}'.")
        return True
    except Exception as e:
        print(f"❌ Failed schema migration on '{target_alias}': {e}")
        return False

def copy_sqlite_to_target(source_alias='sqlite', target_alias='default'):
    """Directly copies records from source database (SQLite) to target database (PostgreSQL/Default)."""
    if source_alias == target_alias:
        print("⚠️ Source and Target database aliases are identical. No conversion needed.")
        return True

    print(f"🔄 Converting and transferring data from '{source_alias}' -> '{target_alias}'...")

    if not migrate_target_db(target_alias):
        return False

    total_transferred = 0

    try:
        with transaction.atomic(using=target_alias):
            for model in MODELS:
                model_name = model._meta.verbose_name_plural.capitalize()
                source_qs = model.objects.using(source_alias).all()
                count = source_qs.count()
                
                if count == 0:
                    print(f"  • {model_name}: 0 records (Skipped)")
                    continue

                records = list(source_qs)
                
                # Bulk create or update in target database
                model.objects.using(target_alias).bulk_create(
                    records,
                    ignore_conflicts=True
                )
                print(f"  • {model_name}: {count} records transferred")
                total_transferred += count

        print(f"🎉 Database Conversion Complete! Total records converted: {total_transferred}")
        return True

    except Exception as e:
        print(f"❌ Error during database conversion: {e}")
        return False

def main():
    print("=" * 65)
    print(" 🌾 Urvixa SQLite <-> PostgreSQL Database Converter Utility")
    print("=" * 65)

    # 1. Export SQLite fixture backup
    export_sqlite_to_json()

    # 2. Convert and copy data to default target database
    target_engine = connections['default'].settings_dict['ENGINE']
    target_db_name = connections['default'].settings_dict['NAME']

    print(f"ℹ️  Current Active Target Database Engine: {target_engine}")
    print(f"ℹ️  Target Database Name: {target_db_name}")

    if 'postgresql' in target_engine:
        print("\n🚀 PostgreSQL target detected! Starting conversion from SQLite -> PostgreSQL...")
        success = copy_sqlite_to_target(source_alias='sqlite', target_alias='default')
    else:
        print("\nℹ️  Target is SQLite. Ensuring SQLite schema and seed records are up-to-date...")
        migrate_target_db('default')
        call_command('loaddata', 'sqlite_export.json', database='default')
        success = True

    if success:
        print("\n✅ Database conversion script finished successfully!")

if __name__ == '__main__':
    main()
