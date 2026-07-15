from django import forms
from .models import Blog, Comment

class BlogForm(forms.ModelForm):

    class Meta:

        model = Blog

        fields = [
            'title',
            'content',
            'category',
            'tags',
        ]


        widgets = {

            'title': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'placeholder':'Enter blog title'
                }
            ),


            'content': forms.Textarea(
                attrs={
                    'class':'form-control',
                    'rows':8,
                    'placeholder':'Write your thoughts here...'
                }
            ),


            'category': forms.Select(
                attrs={
                    'class':'form-select'
                }
            ),


            'tags': forms.SelectMultiple(
                attrs={
                    'class':'form-select'
                }
            ),

        }

class CommentForm(forms.ModelForm):

    class Meta:

        model = Comment

        fields = ['comment']

        widgets = {

            'comment': forms.Textarea(

                attrs={

                    'class': 'form-control',

                    'rows': 4,

                    'placeholder': 'Write your comment...'

                }

            )

        }
