# Generated by Django 2.0 on 2018-08-01 06:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0026_auto_20180801_0614'),
    ]

    operations = [
        migrations.AddField(
            model_name='damageitem',
            name='description',
            field=models.CharField(default=None, max_length=500),
        ),
    ]
