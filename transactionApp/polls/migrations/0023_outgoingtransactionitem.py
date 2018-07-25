# Generated by Django 2.0 on 2018-07-17 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0022_auto_20180717_0727'),
    ]

    operations = [
        migrations.CreateModel(
            name='OutgoingTransactionItem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('itemId', models.IntegerField(default=None)),
                ('transactionId', models.IntegerField(blank=True, default=0)),
                ('quantitySold', models.IntegerField(blank=True, default=0)),
                ('price', models.FloatField(blank=True, default=None, null=True)),
                ('tax', models.FloatField(blank=True, default=0.0925, null=True)),
                ('createdAt', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'outgoing_transaction_item',
            },
        ),
    ]