from __future__ import unicode_literals
from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
#helps web app make sure that user is still logged in after change password
from django.contrib.auth import update_session_auth_hash
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
def employeeProfile(request, template = "employeeProfile.html"):
    args = {'user': request.user}
    return render(request, template, args)

@login_required
def editProfile(request, template = "editProfile.html"):
    if request.method == 'POST':
        form = EditProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            print("form valid")
            form.save()
            return redirect('employeeProfile')
    else:
        form = EditProfileForm(instance=request.user)
        args = {'form': form}
        return render(request, template, args)

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
    return render(request, template_name)

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
    return render(request, template_name)
