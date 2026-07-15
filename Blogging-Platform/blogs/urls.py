from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('create/', views.create_blog, name='create_blog'),
    path('blog/<int:blog_id>/', views.blog_detail, name='blog_detail'),
    path('like/<int:blog_id>/', views.toggle_like, name='toggle_like'),
    path('my-blogs/', views.my_blogs, name='my_blogs'),
    path('edit/<int:blog_id>/', views.edit_blog, name='edit_blog'),
    path('delete/<int:blog_id>/', views.delete_blog, name='delete_blog'),
    
]