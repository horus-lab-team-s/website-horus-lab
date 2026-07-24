"""Nettoyage : suppression de l'ancienne app `applications` (page Candidature
retirée du site). On supprime la table héritée et ses enregistrements de
migration devenus orphelins. Idempotent et portable SQLite/PostgreSQL.
"""
from django.db import migrations


DROP_SQL = [
    "DROP TABLE IF EXISTS applications_application;",
    "DELETE FROM django_migrations WHERE app = 'applications';",
]


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(sql=stmt, reverse_sql=migrations.RunSQL.noop)
        for stmt in DROP_SQL
    ]
