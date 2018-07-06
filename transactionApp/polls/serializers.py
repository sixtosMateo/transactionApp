from rest_framework import serializers
from.models import Item, IncomingTransaction, IncomingTransactionItem

# converting data into JSON from a model
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        # fields=('name','inStockQty','salePrice')

class IncomingTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingTransaction
        fields = '__all__'

class IncomingTransactionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingTransactionItem
        fields = '__all__'
