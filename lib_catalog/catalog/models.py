from django.db import models

# Create your models here.

class Book(models.Model):
    book_name               = models.CharField()
    book_author             = models.CharField()
    book_code               = models.CharField()
    book_issue_year         = models.IntegerField()
    book_keywords           = models.CharField()
    book_description        = models.CharField()
    book_issue_city         = models.CharField()
    book_publishing_house   = models.CharField()
    book_place              = models.CharField()
    book_catalog            = models.CharField()
    book_picture            = models.CharField()
    book_pages              = models.IntegerField()
    book_author_sign        = models.CharField()

    def __str__(self):
        return self.book_name
