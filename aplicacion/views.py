from django.shortcuts import render

# Create your views here.
def main(request, room_code):
    
    return render(request, 'main.html')