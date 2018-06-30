from __future__ import unicode_literals
from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import UserChangeForm
from .forms import NewEmployeeForm, LoginAttemptForm

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
def employeeProfile(request, template = "employeeProfile.html"):
    args = {'user': request.user}
    return render(request, template, args)

def editProfile(request, template = "editProfile.html"):
    if request.method == 'POST':
        form = UserChangeForm(request.POST, instance=request.user)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('employeeProfile')
    else:
        form = UserChangeForm(instance=request.user)
        args = {'form': form}
        return render(request, template, args)


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
