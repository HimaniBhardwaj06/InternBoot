from django.shortcuts import render, redirect, get_object_or_404
from .models import Blog, Comment, Like
from django.shortcuts import render, redirect
from .forms import BlogForm, CommentForm


from .models import Blog


def home(request):

    blogs = Blog.objects.all().order_by('-created_at')

    return render(request, 'home.html', {
        'blogs': blogs
    })



def create_blog(request):

    if request.method == "POST":

        form = BlogForm(request.POST)

        if form.is_valid():

            blog = form.save(commit=False)

            blog.author = request.user

            blog.save()

            form.save_m2m()

            return redirect('home')

    else:
        form = BlogForm()


    return render(request, 'blogs/create_blog.html', {
        'form': form
    })

def blog_detail(request, blog_id):

    blog = get_object_or_404(Blog, id=blog_id)

    if request.method == 'POST':

        form = CommentForm(request.POST)

        if form.is_valid():

            comment = form.save(commit=False)

            comment.blog = blog

            comment.user = request.user

            comment.save()

            return redirect('blog_detail', blog_id=blog.id)

    else:

        form = CommentForm()

    comments = Comment.objects.filter(blog=blog).order_by('-created_at')

    liked = False

    if request.user.is_authenticated:

        liked = Like.objects.filter(
            blog=blog,
            user=request.user
        ).exists()

    return render(request, 'blog_detail.html', {

        'blog': blog,
        'form': form,
        'comments': comments,
        'liked': liked,

    })

from django.contrib.auth.decorators import login_required


@login_required
def toggle_like(request, blog_id):

    blog = get_object_or_404(Blog, id=blog_id)

    like = Like.objects.filter(
        blog=blog,
        user=request.user
    )

    if like.exists():
        like.delete()
    else:
        Like.objects.create(
            blog=blog,
            user=request.user
        )

    return redirect('blog_detail', blog_id=blog.id)

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden

@login_required
def edit_blog(request, blog_id):

    blog = get_object_or_404(Blog, id=blog_id)

    if blog.author != request.user:
        return HttpResponseForbidden("You are not allowed to edit this blog.")

    if request.method == "POST":

        form = BlogForm(request.POST, instance=blog)

        if form.is_valid():

            form.save()

            return redirect("blog_detail", blog_id=blog.id)

    else:

        form = BlogForm(instance=blog)

    return render(request, "edit_blog.html", {

        "form": form,

        "blog": blog,

    })

@login_required
def delete_blog(request, blog_id):

    blog = get_object_or_404(Blog, id=blog_id)

    if blog.author != request.user:
        return HttpResponseForbidden(
            "You are not allowed to delete this blog."
        )

    if request.method == "POST":

        blog.delete()

        return redirect("home")

    return render(
        request,
        "delete_blog.html",
        {
            "blog": blog
        }
    )