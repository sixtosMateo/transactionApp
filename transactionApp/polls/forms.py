from django import forms
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


# we are going to inherit from django User model
class NewEmployeeForm(UserCreationForm):
    email = forms.EmailField(required=True)

    # define the metadata that relates to this class
    class Meta:
        model = User
        fields = (
        'username',
        'first_name',
        'last_name',
        'email',
        'is_staff',
        'is_active',
        'password1',
        'password2'
        )
    def save(self, commit=True):
        user = super(NewEmployeeForm, self).save(commit=False)
        #make sures theres no code(sql injection) and clean input
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.email = self.cleaned_data['email']

        if commit:
            user.save()
        return user

class LoginAttemptForm(forms.ModelForm):
    class Meta:
        model = User
        fields=('username', 'password')
        db_table = 'auth_user'
