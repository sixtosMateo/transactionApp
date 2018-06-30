from django.conf.urls import url, include
from . import views
from django.contrib.auth.views import (
    login,
    logout,
    #with these two we can send an email to user with clickable link
    password_reset,
    password_reset_done,
    password_reset_confirm,
    password_reset_complete
    )

urlpatterns = [
    # login view comes from default django
    url(r'^login$', login, {'template_name':'index.html'}),
    url(r'^logout$', logout, {'template_name':'logout.html'}),
    url(r'^employeeProfile$', views.employeeProfile, name='employeeProfile'),
    url(r'^editProfile$', views.editProfile, name='editProfile'),
    url(r'^newEmployee$', views.newEmployee, name='newEmployee'),
    url(r'^changePassword$', views.changePassword, name='changePassword'),
    url(r'^resetPassword$', password_reset, name='resetPassword'),
    url(r'^resetPassword/done$', password_reset_done, name='password_reset_done'),
    # when sending the link to email it sends a token and uidb64 in the url
    # so the app knows that its the user changing the user (these two args are
    # place in the link therefore needing this regular expression)
    url(r'^resetPassword/confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
    password_reset_confirm, name='password_reset_confirm'),
    url(r'^resetPassword/complete$', password_reset_complete, name='password_reset_complete'),
    url(r'^mainMenu$', views.mainMenu, name='mainMenu'),
    url(r'^item$', views.item, name='item'),
    url(r'^newItem$', views.newItem, name='newItem'),
    url(r'^damageItem$', views.damageItem, name='damageItem'),
    url(r'^outgoingTransaction$', views.outgoingTransaction, name='outgoingTransaction'),
    url(r'^incomingTransaction$', views.incomingTransaction, name='incomingTransaction')
]
