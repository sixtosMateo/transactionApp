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


from .models import (
    Item, Vendor, IncomingTransaction,
    Store, Employee, OutgoingTransaction, DamageItem, OutgoingTransactionItem)
from .serializers import (
    ItemSerializer, IncomingTransactionSerializer,
    OutgoingTransactionSerializer,
    OutgoingTransactionItemSerializer
    )
from .forms import (
    NewEmployeeForm, EditProfileForm, VendorForm,
    ItemForm, OutgoingTransactionForm, IncomingTransactionForm, DamageItemForm
    )
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.forms import (
    UserCreationForm,
    UserChangeForm,
    PasswordChangeForm
    )
# decorators are ways to provide functionality to one of your function
from django.contrib.auth.decorators import login_required

@login_required
def newEmployee(request, template_name = "createEmployee.html"):
    if request.method == 'POST':
        form = NewEmployeeForm(request.POST)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('employee')
    else:
        # the django default form is displayed
        form = NewEmployeeForm()

        args = {'form':form}
        return render(request, template_name, args )


@login_required
def changePassword(request, template = "changePassword.html"):
    if request.method == 'POST':
        # specify request.POST is supposed to receive thats why wen add data
        form = PasswordChangeForm(data=request.POST, user=request.user)
        if form.is_valid():
            print("form valid")
            # dont want request.user as parameter automatically set to anonymous
            # when form is updated
            update_session_auth_hash(request, form.user)
            return redirect('employeeProfile')

        else:
            return redirect('changePassword')

    else:
        form = PasswordChangeForm(user=request.user)
        args = {'form': form}
        return render(request, template, args)

#==============================Views Required ================================
@login_required
def editProfile(request, pk, template = "editProfile.html"):
    selectUser = get_object_or_404(User, pk=pk)
    if request.method == 'POST':
        form = EditProfileForm(request.POST, instance = selectUser)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('employees')
    else:
        form = EditProfileForm(instance=selectUser)
        # args = {'form': form}
        return render(request, template, {'selectUser': selectUser,
                                            'form': form})

@login_required
def deleteProfile(request, pk):
    selectUser = get_object_or_404(User, pk=pk)
    data = dict()
    if request.method == 'POST':
        selectUser.delete()
        return redirect('employees')
    else:
        context = {'selectUser': selectUser}
        data['html_form'] = render_to_string('deleteProfile.html',
										   context,
										   request=request,
										   )
    return JsonResponse(data)

# two scenarios some GET request for the page
# another would POST the form to edit profile
@login_required
def employeeProfile(request, pk, template = "employeeProfile.html"):
    selectUser = get_object_or_404(User, pk=pk)
    outTransactions = OutgoingTransaction.objects.all().filter(
                                                    employeeId=selectUser.id)
    # args = {'user': request.user}
    return render(request, template, {'selectUser': selectUser,
                    'outTransactions':outTransactions})

@login_required
def employees(request, template_name="employees.html"):
    users = User.objects.all()

    return render(request, template_name, {'users':users})

@login_required
def mainMenu(request, template_name="mainMenu.html"):

    return render(request, template_name)

@login_required
def inventory(request, template_name="inventory.html"):
    return render(request, template_name)

@login_required
def item(request, template_name="item.html"):

    return render(request, template_name)

@login_required
def editItem(request, pk, template_name="editItem.html"):
    item = get_object_or_404(Item, pk=pk)
    if request.method == 'POST':
        form = ItemForm(request.POST, instance = item)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('item')
    else:
        form =ItemForm(instance=item)
        # args = {'form': form}
        return render(request, template_name, {'item': item, 'form': form})

# maybe add another field that keeps track of who created this item
@login_required
def newItem(request,template_name="newItem.html"):
    vendors = Vendor.objects.all()
    stores = Store.objects.all()
    if request.method == 'POST':
        print("inside the post")
        form = ItemForm(request.POST)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('inventory')
        else:
            print('form is not validated')
    else:
        form = ItemForm()
        return render(request, template_name, {'form':form, 'vendors':vendors, 'stores':stores })

@login_required
def countCycle(request, template_name="countCycle.html"):
    return render(request, template_name)

@login_required
def damageItem(request, template_name="damageItem.html"):
    stores = Store.objects.all()
    # employee = Employee.objects.all()
    if request.method == 'POST':
        print("inside the post")
        form = DamageItemForm(request.POST)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('inventory')
        else:
            print('form is not validated')
    else:
        form = DamageItemForm()
        return render(request, template_name, {'form':form, 'user':request.user, 'stores':stores })

    return render(request, template_name)

@login_required
def outgoingTransaction(request, template_name="outgoingTransaction.html"):
    stores = Store.objects.all()
    employee = Employee.objects.all()

    # newTransaction = OutgoingTransaction.objects.create()
    # newTransactionItem = OutgoingTransactionItem.objects.create(itemId= 1, transactionId = newTransaction)
    form = OutgoingTransactionForm()
    args = {'form':form, 'employee': employee, 'stores':stores, 'user':request.user}
    return render(request, template_name, args)

@login_required
def viewOutgoingTransactionItems(request, pk,
                            template_name="viewOutgoingTransactionItems.html"):
    outTransactionItems = OutgoingTransactionItem.objects.all().filter(
                                                            transactionId=pk)
    return render(
            request, template_name, {'outTransactionItems':outTransactionItems})

@login_required
def incomingTransaction(request, template_name="incomingTransaction.html"):
    vendors = Vendor.objects.all()
    stores = Store.objects.all()
    form = IncomingTransactionForm()

    #there might be a switch with user and employee *needs attention*
    return render(request, template_name,{'form':form, 'vendors':vendors, 'stores': stores,'user':request.user})

@login_required
def vendor(request, template_name="vendor.html"):
    vendors= Vendor.objects.all()
    return render(request, template_name, {'vendors':vendors})

@login_required
def report(request, template_name="report.html"):
    return render(request, template_name)

@login_required
def newVendor(request, template_name='newVendor.html'):
    if request.method == 'POST':
        form = VendorForm(request.POST)
        if form.is_valid():
            print("Form is valid")
            form.save()
            return redirect('vendor')
    else:
        form = VendorForm()
        args = {'form':form}
        return render(request, template_name, args)

@login_required
def editVendor(request, pk, template_name="editVendor.html"):
    vendor = get_object_or_404(Vendor, pk=pk)
    if request.method == 'POST':
        form = VendorForm(request.POST, instance = vendor)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('vendor')
    else:
        form = VendorForm(instance=vendor)
        # args = {'form': form}
        return render(request, template_name, {'vendor':vendor, 'form': form})

@login_required
def deleteVendor(request, pk):
    vendor = get_object_or_404(Vendor, pk=pk)
    data = dict()
    if request.method == 'POST':
        vendor.delete()
        return redirect('vendor')
    else:
        context = {'vendor': vendor}
        data['html_form'] = render_to_string('deleteVendor.html',
                                       context,
                                       request=request,
                                       )
    return JsonResponse(data)

@login_required
def viewItemPlotly(request, template_name="plotlyItemGraph.html"):

    return render(request, template_name)

@login_required
def viewOutgoingTransactionReport(request, template_name="report.html"):

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
