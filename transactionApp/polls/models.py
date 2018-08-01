from __future__ import unicode_literals
from django.db import models
import datetime
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.utils import timezone


# need to add age, partTime/fullTime, .... when added it has to be added to the views
class Employee(models.Model):
    #user is coming from Django default User
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key= True, default=None)
    employeeId = models.CharField(max_length = 30, default=None)
    firstName = models.CharField(max_length = 30, default=None)
    lastName = models.CharField(max_length = 30, default=None)
    storeId = models.IntegerField(default = 0, blank=True)
    createdAt = models.DateTimeField(default=timezone.now)


def create_employee(sender,**kwargs):
    if kwargs['created']:
        #its creating the associate user into Employee model
        employee = Employee.objects.create(user = kwargs['instance'])

post_save.connect(create_employee, sender=User)


class Store(models.Model):
    storeId = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 30, default=None)
    address = models.CharField(max_length = 50, default=None)
    hoursOpen =  models.CharField(max_length = 150, default=None)
    phoneNumber = models.CharField(max_length = 30, default=None)

    class Meta:
        db_table = 'store'

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(Store, self).save(using='store_master')

    def __unicode__(self):
        return "{0} {1} {2} {3} {4}".format(
            self.pk, self.name, self.address, self.hoursOpen, self.phoneNumber)


class OutgoingTransaction(models.Model):
    transactionId = models.AutoField(primary_key=True)
    createdAt = models.DateTimeField(auto_now=True)
    storeId = models.IntegerField(default = 0, blank=True)
    employeeId = models.CharField(null=True, max_length = 30, default=None)
    tax = models.FloatField(null=True, blank=True, default=0.0925)
    subtotal = models.FloatField(null=True, blank=True, default=None)
    total = models.FloatField(null=True, blank=True, default=None)

    class Meta:
        db_table = 'outgoing_transaction'

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(OutgoingTransaction, self).save(using='karis_db')

    def __unicode__(self):
        return "{0} {1} {2} {3} {4} {5} {6}".format(
            self.pk, self.createdAt, self.storeId, self.employeeId,
            self.tax, self.total, self.subtotal)


class OutgoingTransactionItem(models.Model):
    id = models.AutoField(primary_key=True)
    itemId = models.IntegerField(null=True,default=None)
    transactionId = models.ForeignKey(OutgoingTransaction, on_delete=models.CASCADE)
    quantitySold = models.IntegerField(default = 0, blank=True)
    price = models.FloatField(null=True, blank=True, default=None)
    tax = models.FloatField(null=True, blank=True, default=0.0925)
    createdAt = models.DateTimeField(auto_now=True)


    class Meta:
        db_table = "outgoing_transaction_item"
    def save(self, *args, **kwargs):
        print('save() is called.')
        super(OutgoingTransactionItem, self).save(using='karis_db')

    def __unicode__(self):
        return "{0} {1} {2} {3} {4} {5} {6}".format(
            self.pk, self.transactionId, self.quantitySold, self.price, self.tax,
            self.createdAt, self.itemId)


class Item(models.Model):
    itemId = models.AutoField(primary_key=True)
    barcode = models.CharField(unique=True, max_length=30, default=None)
    name = models.CharField(max_length = 30, default=None)
    inStockQty = models.IntegerField(default = 0, blank=True)
    picture = models.CharField(max_length = 30, default=None)
    color = models.CharField(max_length = 30, default=None)
    ageRequirement = models.CharField(max_length = 30, default=None)
    purchasedPrice = models.FloatField(default = 0.0, blank=True)
    salePrice = models.FloatField(default = 0.0, blank=True)
    department = models.CharField(max_length = 30, default=None)
    vendorId = models.IntegerField(default = 0, blank=True)
    locationId = models.IntegerField(default = 0, blank=True)
    createdAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "item"

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(Item, self).save(using='karis_db')

    def __unicode__(self):
        return "{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {10} {11} {12}".format(
            self.itemId, self.name, self.inStockQty, self.picture, self.color,
            self.ageRequirement, self.purchasedPrice, self.salePrice,
            self.department, self.vendorId, self.barcode, self.locationId,
            self.createdAt)

class Vendor(models.Model):
    vendorId = models.AutoField(primary_key=True)
    address = models.CharField(max_length = 100, default=None)
    phoneNumber = models.CharField(max_length = 30, default=None)
    name = models.CharField(max_length = 30, default=None)
    hoursOpen = models.CharField(max_length = 150, default=None)

    class Meta:
        db_table = "vendor"

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(Vendor,self).save(using="karis_db")

    def __unicode__(self):
        return "{0} {1} {2} {3} {4}".format(
            self.vendorId, self.address, self.phoneNumber, self.name,
            self.hoursOpen)




class IncomingTransaction(models.Model):
    transactionId = models.AutoField(primary_key=True)
    createdAt = models.DateTimeField(auto_now=True)
    vendorId = models.IntegerField(default = 0, blank=True)
    employeeId = models.CharField(max_length = 30, default=None)
    total = models.FloatField(blank=True, default=None)
    subtotal = models.FloatField(blank=True, default=None)
    tax = models.FloatField(null=True, blank=True, default=None)

    class Meta:
        db_table = "incoming_transaction"

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(IncomingTransaction, self).save(using="karis_db")

    def __unicode__(self):
        return "{0} {1} {2} {3} {4} {5} {6}".format(
            self.transactionId, self.createdAt, self.vendorId, self.employeeId,
            self.tax, self.total, self.subtotal)


class IncomingTransactionItem(models.Model):
    itemId = models.AutoField(primary_key=True)
    transactionId = models.ForeignKey(IncomingTransaction, on_delete=models.CASCADE)
    quantityBought = models.IntegerField(default = 0, blank=True)
    storeId = models.IntegerField(default = 0, blank=True)
    purchasedPrice = models.FloatField(null=True, blank=True, default=None)
    createdAt = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "incoming_transaction_item"

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(IncomingTransactionItem, self).save(using="store_master")

    def __unicode__(self):
        return "{0} {1} {2} {3} {4} {5}".format(
            self.itemId, self.transactionId, self.quantityBought, self.storeId,
            self.purchasedPrice, self.createdAt)

class Location(models.Model):
    locationId = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 30, default=None)
    address = models.CharField(max_length = 30, default=None)
    storeId = models.IntegerField(default = 0, blank=True)

    class Meta:
        db_table = "location"

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(Location, self).save(using="store_master")

    def __unicode__(self):
        return "{0} {1} {2} {3} ".format(
            self.locationId, self.name, self.address, self.storeId)

class LocationItem(models.Model):
    locationId =models.IntegerField(default = 0, blank=True)
    itemId = models.IntegerField(default = 0, blank=True)
    locationQty= models.IntegerField(default = 0, blank=True)
    employeeId = models.CharField(max_length = 30, default=None)

    class Meta:
        db_table = "LocationItem"

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(LocationItem, self).save(using="store_master")

    def __unicode__(self):
        return "{0} {1} {2} {3} ".format(
            self.locationId, self.itemId, self.locationQty, self.employeeId)

class DamageItem(models.Model):
    itemId = models.AutoField(primary_key=True)
    qtyDamage = models.IntegerField(default = 0, blank=True)
    createdAt = models.DateTimeField(auto_now=True)
    employeeId = models.CharField(max_length = 30, default=None)
    storeId = models.IntegerField(default = 0, blank=True)
    locationId = models.IntegerField(default = 0, blank=True)
    barcode = models.CharField(unique=True, max_length = 30, default=None)

    class Meta:
        db_table = "damage_item"

    def save(self, *args, **kwargs):
        print('save() is called.')
        super(DamageItem,self).save(using="karis_db")

    def __unicode__(self):
        return "{0} {1} {2} {3} {4} {5} {6}".format(
            self.itemId, self.qtyDamage, self.createdAt, self.employeeId,
            self.storeId, self.locationId, self.barcode)
