# Generated by Django 2.0 on 2018-07-12 06:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0018_auto_20180708_1148'),
    ]

    operations = [
        migrations.AddField(
            model_name='outgoingtransactionitem',
            name='tax',
            field=models.FloatField(blank=True, default=0.0925, null=True),
        ),
    ]
