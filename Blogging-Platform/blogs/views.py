from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.db.models import Q
from django.core.paginator import Paginator

from .models import Blog, Comment, Like, Category, Tag
from .forms import BlogForm, CommentForm
from django.http import JsonResponse




def home(request):

    query = request.GET.get('q')
    category = request.GET.get('category')
    tag = request.GET.get('tag')


    if query and category and tag:

        blogs = Blog.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query),
            category__name=category,
            tags__name=tag
        ).distinct().order_by('-created_at')


    elif query and category:

        blogs = Blog.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query),
            category__name=category
        ).order_by('-created_at')


    elif query and tag:

        blogs = Blog.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query),
            tags__name=tag
        ).distinct().order_by('-created_at')


    elif category:

        blogs = Blog.objects.filter(
            category__name=category
        ).order_by('-created_at')


    elif tag:

        blogs = Blog.objects.filter(
            tags__name=tag
        ).distinct().order_by('-created_at')


    elif query:

        blogs = Blog.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query)
        ).order_by('-created_at')


    else:

        blogs = Blog.objects.all().order_by('-created_at')


    categories = Category.objects.all()
    tags = Tag.objects.all()

    authors_count = Blog.objects.values('author').distinct().count()
    comments_count = Comment.objects.count()

    blogs_count = blogs.count()

    paginator = Paginator(blogs, 4)
    page_number = request.GET.get('page')
    blogs = paginator.get_page(page_number)

    if request.user.is_authenticated:

        for blog in blogs:

            blog.liked = Like.objects.filter(
                blog=blog,
                user=request.user
            ).exists()


    return render(request, 'home.html', {

        'blogs': blogs,

        'categories': categories,

        'tags': tags,

        'authors_count': authors_count,

        'comments_count': comments_count,

        'query': query,

        'blogs_count': blogs_count,

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


@login_required
def toggle_like(request, blog_id):

    blog = get_object_or_404(Blog, id=blog_id)

    liked = Like.objects.filter(
        blog=blog,
        user=request.user
    )

    if liked.exists():
        liked.delete()
        is_liked = False
    else:
        Like.objects.create(
            blog=blog,
            user=request.user
        )
        is_liked = True

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":

        return JsonResponse({

            "liked": is_liked,
            "likes_count": blog.like_set.count()

        })

    return redirect("blog_detail", blog_id=blog.id)



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

    return render( request, "delete_blog.html", { "blog": blog })


@login_required
def my_blogs(request):

    blogs = Blog.objects.filter(
        author=request.user
    ).order_by('-created_at')

    return render(request, 'my_blogs.html', {

        'blogs': blogs

    })