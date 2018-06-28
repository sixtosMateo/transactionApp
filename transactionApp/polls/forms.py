from django import forms
from django.db import models
from django.contrib.auth.models import User

class NewEmployeeForm(forms.ModelForm):
    class Meta:
        model = User
        fields=('password','username','first_name','last_name','email','is_staff','is_active')
        db_table = 'auth_user'

class LoginAttemptForm(forms.ModelForm):
    class Meta:
        model = User
        fields=('username', 'password')
        db_table = 'auth_user'
