# Generated by Django 2.0 on 2018-09-25 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0031_auto_20180902_2345'),
    ]

    operations = [
        migrations.AlterField(
            model_name='outgoingtransactionitem',
            name='transactionId',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
