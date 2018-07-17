from django import forms
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Vendor, Item, OutgoingTransaction, OutgoingTransactionItem, IncomingTransaction


# we are going to inherit from django UserCreationForm's fields from User
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

class ItemForm(forms.ModelForm):
    # define the metadata that relates to this class
    class Meta:
        model = Item
        fields = (
        'barcode',
        'name',
        'inStockQty',
        'picture',
        'color',
        'ageRequirement',
        'purchasedPrice',
        'salePrice',
        'department',
        'vendorId',
        'locationId'
        )
        db_table = 'item'

class VendorForm(forms.ModelForm):
    # define the metadata that relates to this class
    class Meta:
        model = Vendor
        fields = (
        'address',
        'phoneNumber',
        'name',
        'hoursOpen'
        )
        db_table = 'vendor'

class EditProfileForm(UserChangeForm):
# the fields(or exclude) element allows to customize what fields can be edited
    class Meta:
        model = User
        fields = (
        'email',
        'first_name',
        'last_name',
        'password'
        )

class OutgoingTransactionForm(forms.ModelForm):
    class Meta:
        model = OutgoingTransaction
        fields = (
        'storeId',
        'employeeId',
        'tax',
        'subtotal',
        'total'
        )

class OutgoingTransactionItemForm(forms.ModelForm):
    class Meta:
        model = OutgoingTransactionItem
        fields = (
        'transactionId',
        'quantitySold',
        'price',
        'tax',
        'itemId'
        )

class IncomingTransactionForm(forms.ModelForm):
    class Meta:
        model = IncomingTransaction
        fields = (
        'vendorId',
        'employeeId',
        'tax',
        'subtotal',
        'total'
        )
        db_table = "incoming_transaction"
