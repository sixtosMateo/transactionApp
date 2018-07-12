from django.conf.urls import url, include
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
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
    url(r'^$', views.mainMenu),
    url(r'^login/$', login, {'template_name':'index.html'}),
    url(r'^logout/$', logout, {'template_name':'logout.html'}),
    url(r'^employees/$', views.employees, name='employees'),
    url(r'^employeeProfile/(?P<pk>\d+)$', views.employeeProfile, name='employeeProfile'),
    url(r'^editProfile/(?P<pk>\d+)$', views.editProfile, name='editProfile'),
    url(r'^deleteProfile/(?P<pk>\d+)$', views.deleteProfile, name='deleteProfile'),
    url(r'^newEmployee/$', views.newEmployee, name='newEmployee'),
    url(r'^changePassword/$', views.changePassword, name='changePassword'),
    url(r'^resetPassword/$', password_reset, name='resetPassword'),
    url(r'^resetPassword/done/$', password_reset_done, name='password_reset_done'),
    # when sending the link to email it sends a token and uidb64 in the url
    # so the app knows that its the user changing the user (these two args are
    # place in the link therefore needing this regular expression)
    url(r'^resetPassword/confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
    password_reset_confirm, name='password_reset_confirm'),
    url(r'^resetPassword/complete/$', password_reset_complete, name='password_reset_complete'),
    url(r'^mainMenu/$', views.mainMenu, name='mainMenu'),
    url(r'^item/$', views.item, name='item'),
    url(r'^items/$', views.ItemList.as_view(), name='items'),
    url(r'^editItem/(?P<pk>\d+)$', views.editItem, name='editItem'),
    url(r'^inventory/$', views.inventory, name='inventory'),
    url(r'^newItem/$', views.newItem, name='newItem'),
    url(r'^countCycle/$', views.countCycle, name='countCycle'),
    url(r'^damageItem/$', views.damageItem, name='damageItem'),
    url(r'^outgoingTransaction/$', views.outgoingTransaction, name='outgoingTransaction'),
    url(r'^outgoingTransactions/$', views.outgoingTransactionList.as_view(), name='outgoingTransactions'),
    url(r'^incomingTransaction/$', views.incomingTransaction, name='incomingTransaction'),
    # url(r'^incomingTransactions/$', views.incomingTransactionList.as_view(), name='incomingTransactions'),
    url(r'^vendor/$', views.vendor, name='vendor'),
    url(r'^editVendor/(?P<pk>\d+)$', views.editVendor, name='editVendor'),
    url(r'^deleteVendor/(?P<pk>\d+)$', views.deleteVendor, name='deleteVendor')
]

urlpatterns = format_suffix_patterns(urlpatterns)
