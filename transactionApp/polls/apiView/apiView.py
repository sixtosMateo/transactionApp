from __future__ import unicode_literals
from django.template.defaultfilters import slugify
from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
#helps web app make sure that user is still logged in after change password
from django.contrib.auth import update_session_auth_hash
from django.http import JsonResponse
from django.template import loader
from django.template.loader import render_to_string

from django.views.decorators.http import require_http_methods


from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import serializers

#provides us many views
from rest_framework import generics
from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework import status, viewsets
from django.utils.six import BytesIO

from django.db.models import Sum

import json
import datetime
import time
from collections import OrderedDict

from ..models import (
    Item, Vendor, IncomingTransaction,
    Store, Employee, OutgoingTransaction, DamageItem, OutgoingTransactionItem)
from ..serializers import (
    ItemSerializer, IncomingTransactionSerializer,
    OutgoingTransactionSerializer,
    OutgoingTransactionItemSerializer
    )


# decorators are ways to provide functionality to one of your function
from django.contrib.auth.decorators import login_required


@login_required
def viewItemPlotly(request, template_name="plotlyReports/plotlyItemGraph.html"):

    return render(request, template_name)

@login_required
def viewIncomingTransactionReport(request, template_name="plotlyReports/plotlyIncomingTransactionReport.html"):

    return render(request, template_name)

@login_required
def viewOutgoingTransactionReport(request, template_name="plotlyReports/plotlyOutgoingTransactionReport.html"):

    return render(request, template_name)


class ItemList(APIView):
    def post(self, request):
        serializers = ItemSerializer(data =request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.erros, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        items = Item.objects.all()
        serializers = ItemSerializer(items, many=True)
        return Response(serializers.data)

class ItemPlotly(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, format=None):
        items = dict()
        for item in Item.objects.all():
            items[item.itemId] = item.inStockQty
        items = sorted(items.items(), key=lambda x: x[1])
        items = dict(items)

        # for i,j in items.items():
        #     print(j)
        data = {
            "itemId": items.keys(),
            "inStockQty" : items.values(),
        }

        return Response(data)

class OutgoingTransactionQty(APIView):
    def get(self, request, format=None):
        transactionQty = dict()
        transactions = OutgoingTransaction.objects.values('createdAt').annotate(Sum('total'))

        for transaction in transactions:
            if(transaction['createdAt'].month in transactionQty):
                transactionQty[transaction['createdAt'].month] += transaction['total__sum']
            else:
                transactionQty[transaction['createdAt'].month] = transaction['total__sum']

        data={
            "month": transactionQty.keys(),
            "transactionQty" : transactionQty.values()
        }

        return Response(data)

class IncomingTransactionQty(APIView):
    def get(self, request, format=None):
        transactionQty = dict()
        transactions = IncomingTransaction.objects.values('createdAt').annotate(Sum('total'))

        for transaction in transactions:
            if(transaction['createdAt'].month in transactionQty):
                transactionQty[transaction['createdAt'].month] += transaction['total__sum']
            else:
                transactionQty[transaction['createdAt'].month] = transaction['total__sum']
        print(transactionQty)
        transactionQty = OrderedDict(sorted(transactionQty.items(), key=lambda x: x[0]))
        # transactionQty = dict(transactionQty)
        print(transactionQty)
        data={
            "month": transactionQty.keys(),
            "transactionQty" : transactionQty.values()
        }
        # print(data['month']
        return Response(data)

class incomingTransactionList(APIView):
    def post(self, request):
        serializers = IncomingTransactionSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.erros, status=status.HTTP_400_BAD_REQUEST)

# class incomingTransactionItemList(APIView):
#     def post(self, request):
#         serializers = IncomingTransactionItemSerializer(data=request.data)
#         if serializers.is_valid():
#             serializers.save()
#             return Response(serializers.data, status=status.HTTP_201_CREATED)
#         return Response(serializers.erros, status=status.HTTP_400_BAD_REQUEST)


class outgoingTransactionList(APIView):
    def post(self, request):
        serializers = OutgoingTransactionSerializer(data=request.data)
        # print(request.data.get('outTransactionItems'))

        # Return a 400 response if the data was invalid.
        if serializers.is_valid(raise_exception=True):
            #put in a variable by setting it as an argument from save(arg)
            serializers.save()
            print(serializers.data)
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.erros, status=status.HTTP_400_BAD_REQUEST)
