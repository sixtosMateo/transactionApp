from django.conf.urls import url, include
from . import views
from django.contrib.auth.views import login

urlpatterns = [
    # login view comes from default django
    url(r'^login$', login, {'template_name':'index.html'}),
    url(r'^authenticateCredentials$', views.authenticateCredentials, name='authenticateCredentials'),
    url(r'^newEmployee$', views.newEmployee, name='newEmployee'),
    url(r'^mainMenu$', views.mainMenu, name='mainMenu'),
    url(r'^item$', views.item, name='item'),
    url(r'^newItem$', views.newItem, name='newItem'),
    url(r'^damageItem$', views.damageItem, name='damageItem'),
    url(r'^outgoingTransaction$', views.outgoingTransaction, name='outgoingTransaction'),
    url(r'^incomingTransaction$', views.incomingTransaction, name='incomingTransaction'),
    url(r'^saveEmployee$', views.saveEmployee, name='saveEmployee')
]
