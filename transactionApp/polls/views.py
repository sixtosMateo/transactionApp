from __future__ import unicode_literals
from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from .forms import NewEmployeeForm, LoginAttemptForm

@csrf_exempt
def authenticateCredentials(request):
    from django.contrib.auth.models import User

    if request.method == 'POST':
        form = LoginAttemptForm(request.POST)
        print(form['username'])


@csrf_exempt
def newEmployee(request, template_name="createEmployee.html"):

    return render(request, template_name)

# need to save the storeId therefore find a way to append another variable to User object
@csrf_exempt
def saveEmployee(request):
    from django.contrib.auth.models import User

    if request.method == 'POST':
        form = NewEmployeeForm(request.POST)
        print(form.fields)
        if form.is_valid():
            new_employee = form.save()

            return redirect('mainMenu')
        else:
            print('form is not validated')
            return render(request, 'createEmployee.html', {'form': form})

# this function determine wether the credential is true or not

def mainMenu(request, template_name="mainMenu.html"):

    return render(request, template_name)

def item(request, template_name="item.html"):
    return render(request, template_name)

def newItem(request, template_name="newItem.html"):
    return render(request, template_name)

def damageItem(request, template_name="damageItem.html"):
    return render(request, template_name)

def outgoingTransaction(request, template_name="outgoingTransaction.html"):
    return render(request, template_name)

def incomingTransaction(request, template_name="incomingTransaction.html"):
    return render(request, template_name)
