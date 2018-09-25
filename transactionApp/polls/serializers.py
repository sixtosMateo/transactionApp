from rest_framework import serializers
from.models import (Item, IncomingTransaction,
                    OutgoingTransaction, OutgoingTransactionItem)

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

# class IncomingTransactionItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = IncomingTransactionItem
#         fields = '__all__'


class OutgoingTransactionItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OutgoingTransactionItem
        fields = '__all__'

class OutgoingTransactionSerializer(serializers.ModelSerializer):
    #tells that there can be more than one object in queryset
    # transactionItems = OutgoingTransactionItemSerializer(many=True)
    class Meta:
        model = OutgoingTransaction
        fields = ('transactionId', 'storeId', 'employeeId',
                    'tax', 'subtotal','total')
