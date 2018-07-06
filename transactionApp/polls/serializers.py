from rest_framework import serializers
from.models import Item

# converting data into JSON from a model
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__' 
        # fields=('name','inStockQty','salePrice')
