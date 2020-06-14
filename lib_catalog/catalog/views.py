from django.shortcuts import render
from .models import Author, Book, PublishingHouse, IssueCity, KeyWord, BBK
from rest_framework.viewsets import ModelViewSet
from .serializers import BookSerializer, AuthorSerializer, PublishingHouseSerializer, BBKSerializer, KeyWordSerializer, \
    IssueCitySerializer
from rest_framework.response import Response

# Create your views here.

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all().order_by('name')
    serializer_class = BookSerializer
    filterset_fields = ['bbk__code', 'author_sign', 'publishing_house__name']
    search_fields = ['author__name', 'name', 'issue_year', 'key_word__name']

    def perform_update(self, serializer):
        book = serializer.save()

        if 'key_words' in self.request.data:
            key_words = self.request.data.pop('key_words')
            book.keywords.clear()
            for key_word in key_words:
                if 'id' in key_word:
                    key_word_to_assign = KeyWord.objects.get(pk=key_word['id'])
                elif 'name' in key_word:
                    list_names = KeyWord.objects.filter(name=key_word['name'])

                    if len(list_names) > 0:
                        key_word_to_assign = KeyWord.objects.get(pk=key_word['id'])
                    else:
                        key_word_to_assign = KeyWord.objects.create(name=key_word['name'])
                        key_word_to_assign.save()

                book.keywords.add(key_word_to_assign)

        if 'bbks' in self.request.data:
            book.bbk.clear()
            for bbk in self.request.data['bbks']:
                bbk_to_assign = BBK.objects.get(pk=bbk['id'])
                book.bbk.add(bbk_to_assign)

        if 'issue_city' in self.request.data:
            book.issue_city = IssueCity.objects.get(pk=self.request.data.pop('issue_city')['id'])

        if 'publishing_house' in self.request.data:
            book.publishing_house = PublishingHouse.objects.get(pk=self.request.data.pop('publishing_house')['id'])

        if 'author' in self.request.data:
            book.author.clear()
            for author in self.request.data['author']:
                author_to_assign = Author.objects.get(pk=author['id'])
                book.author.add(author_to_assign)

        book.save()

    def create(self, request):
        print(request)
        key_words = request.data.pop('keywords')
        authors = request.data.pop('author')
        bbks = request.data.pop('bbk')
        publishing_house = PublishingHouse.objects.get(pk=request.data.pop('publishing_house')['id'])
        issue_city = IssueCity.objects.get(pk=request.data.pop('issue_city')['id'])

        serializer = BookSerializer(data=request.data)
        serializer.is_valid()
        book = Book(**serializer.validated_data)
        if not 'author_sign' in request.data:
            book.author_sign = Author.objects.get(pk=authors[0]['id']).author_code
        book.save()

        for key_word in key_words:
            if 'id' in key_word:
                key_word_to_assign = KeyWord.objects.get(pk=key_word['id'])
            elif 'name' in key_word:
                list_names = KeyWord.objects.filter(name=key_word['name'])

                if len(list_names) > 0:
                    key_word_to_assign = KeyWord.objects.get(pk=key_word['id'])
                else:
                    key_word_to_assign = KeyWord.objects.create(name=key_word['name'])
                    key_word_to_assign.save()

            book.keywords.add(key_word_to_assign)

        for bbk in bbks:
            bbk_to_assign = BBK.objects.get(pk=bbk['id'])
            book.bbk.add(bbk_to_assign)

        for author in authors:
            author_to_assign = Author.objects.get(pk=author['id'])
            book.author.add(author_to_assign)

        for bbk in bbks:
            bbk_to_assign = BBK.objects.get(pk=bbk['id'])
            book.bbk.add(bbk_to_assign)

        book.publishing_house = publishing_house
        book.issue_city = issue_city

        book.save()

        return Response(BookSerializer(book).data)


class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all().order_by('lname')
    serializer_class = AuthorSerializer
    filterset_fields = ['lname']

    def create(self, request, *args, **kwargs):
        serializer = AuthorSerializer(data=request.data)
        serializer.is_valid()
        author = Author.objects.create(**serializer.validated_data)
        author.save()
        initial_name = author.lname + ' ' + author.fname[0].upper() + '.'

        if author.mname is not None:
            initial_name += author.mname[0].upper() + '.'

        author.short_name = initial_name
        author.save()


        return Response(AuthorSerializer(author).data)


class PublishingHouseViewSet(ModelViewSet):
    queryset = PublishingHouse.objects.all()
    serializer_class = PublishingHouseSerializer


class BBKViewSet(ModelViewSet):
    queryset = BBK.objects.all()
    serializer_class = BBKSerializer


class KeyWordViewSet(ModelViewSet):
    queryset = KeyWord.objects.all()
    serializer_class = KeyWordSerializer


class IssueCityViewSet(ModelViewSet):
    queryset = IssueCity.objects.all()
    serializer_class = IssueCitySerializer
