from django.urls import path
from . views import *
urlpatterns = [
    path('login/', LoginView.as_view(),name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LoyoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),

]