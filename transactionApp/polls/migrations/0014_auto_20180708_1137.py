# Generated by Django 2.0 on 2018-07-08 11:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0013_auto_20180708_1136'),
    ]

    operations = [
        migrations.AlterField(
            model_name='outgoingtransaction',
            name='employeeId',
            field=models.CharField(default=None, max_length=30, null=True),
        ),
    ]