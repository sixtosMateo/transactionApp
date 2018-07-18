# Generated by Django 2.0 on 2018-07-18 03:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0023_outgoingtransactionitem'),
    ]

    operations = [
        # migrations.AddField(
        #     model_name='incomingtransaction',
        #     name='subtotal',
        #     field=models.FloatField(blank=True, default=None),
        # ),
        # migrations.AddField(
        #     model_name='incomingtransaction',
        #     name='total',
        #     field=models.FloatField(blank=True, default=None),
        # ),
        # migrations.AddField(
        #     model_name='item',
        #     name='barcode',
        #     field=models.CharField(default=None, max_length=30, unique=True),
        # ),
        migrations.AlterField(
            model_name='incomingtransactionitem',
            name='transactionId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.IncomingTransaction'),
        ),
        # migrations.AlterField(
        #     model_name='outgoingtransactionitem',
        #     name='itemId',
        #     field=models.IntegerField(default=None, null=True),
        # ),
        # migrations.AlterField(
        #     model_name='outgoingtransactionitem',
        #     name='transactionId',
        #     field=models.IntegerField(default=0, null=True),
        # ),
        # migrations.AlterModelTable(
        #     name='employee',
        #     table=None,
        # ),
    ]
