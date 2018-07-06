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
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework import status
from .models import Item, Vendor, IncomingTransaction, IncomingTransactionItem
from .serializers import ItemSerializer, IncomingTransactionSerializer,IncomingTransactionItemSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .forms import NewEmployeeForm, EditProfileForm
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
            return redirect('mainMenu')
    else:
        # the django default form is displayed
        form = NewEmployeeForm()

        args = {'form':form}
        return render(request, template_name, args )

# two scenarios some GET request for the page
# another would POST the form to edit profile
@login_required
def employeeProfile(request, pk, template = "employeeProfile.html"):
    selectUser = get_object_or_404(User, pk=pk)
    # args = {'user': request.user}
    return render(request, template, {'selectUser': selectUser})

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
        return render(request, template, {'selectUser': selectUser, 'form': form})

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
    return render(request, template_name )


@login_required
def editItem(request, template_name="editItem.html"):
    return render(request, template_name)

@login_required
def newItem(request, template_name="newItem.html"):
    return render(request, template_name)

@login_required
def countCycle(request, template_name="countCycle.html"):
    return render(request, template_name)

@login_required
def damageItem(request, template_name="damageItem.html"):
    return render(request, template_name)

@login_required
def outgoingTransaction(request, template_name="outgoingTransaction.html"):
    return render(request, template_name)

@login_required
def incomingTransaction(request, template_name="incomingTransaction.html"):
    vendors = Vendor.objects.all()
    #there might be a switch with user and employee *needs attention*
    return render(request, template_name,{'vendors':vendors, 'user':request.user})


@login_required
def vendor(request, template_name="vendor.html"):
    vendors= Vendor.objects.all()
    return render(request, template_name, {'vendors':vendors})


class ItemList(APIView):
    def get(self, request):
        items = Item.objects.all()
        serializers = ItemSerializer(items, many=True)
        return Response(serializers.data)

class incomingTransactionList(APIView):
    def get(self,request):
        incomingTransactions = IncomingTransaction.objects.all()
        serializers = IncomingTransactionSerializer(incomingTransactions, many=True)
        return Response(serializers.data)


class incomingTransactionItemLists(APIView):
    def get(self):
        pass
