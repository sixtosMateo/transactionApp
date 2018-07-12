from rest_framework import serializers
from.models import Item, IncomingTransaction, IncomingTransactionItem, OutgoingTransaction, OutgoingTransactionItem

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

class OutgoingTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutgoingTransaction
        fields = '__all__'

class OutgoingTransactionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutgoingTransactionItem
        fields = '__all__'
