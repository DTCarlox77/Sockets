from django.urls import path
from .views import main

urlpatterns = [
    path('room/<str:room_code>/', main, name='main'),
]