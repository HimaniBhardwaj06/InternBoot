from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.views import LoginView
from .forms import LoginForm
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegisterForm
from .models import Profile


def register(request):

    if request.method == 'POST':

        form = RegisterForm(request.POST)

        if form.is_valid():

            user = form.save()

            Profile.objects.create(
                user=user,
                role='Reader'
            )

            login(request, user)

            return redirect('home')

    else:

        form = RegisterForm()

    return render(request, 'registration/register.html', {
        'form': form
    })

class CustomLoginView(LoginView):
    template_name = 'registration/login.html'
    authentication_form = LoginForm

class CustomLogoutView(LogoutView):
    pass