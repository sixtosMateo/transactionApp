# Generated by Django 2.0 on 2018-07-06 23:00

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0005_auto_20180706_1420'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='createdAt',
            field=models.DateTimeField(default=django.utils.timezone.now),
        )
    ]
