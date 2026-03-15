from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from .models import Author, Book, PublishingHouse, IssueCity, KeyWord, BBK
from rest_framework.viewsets import ModelViewSet
from .serializers import BookSerializer, AuthorSerializer, PublishingHouseSerializer, BBKSerializer, KeyWordSerializer, \
    IssueCitySerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

# Create your views here.


def _resolve_keyword(key_word):
    """Resolve a keyword payload (id or name) to a KeyWord instance, creating if needed."""
    if 'id' in key_word:
        return KeyWord.objects.get(pk=key_word['id'])
    if 'name' in key_word:
        list_names = KeyWord.objects.filter(name=key_word['name'])
        if list_names:
            return list_names.first()
        return KeyWord.objects.create(name=key_word['name'])
    return None


class BookViewSet(ModelViewSet):
    queryset = Book.objects.all().order_by('name')
    serializer_class = BookSerializer
    filterset_fields = ['bbk__code', 'author_sign', 'publishing_house__name']
    search_fields = ['author__lname', 'author__fname', 'name', 'issue_year', 'key_word__name']
    ordering_fields = ['id', 'name', 'issue_year', 'author_sign']

    def perform_update(self, serializer):
        book = serializer.save()
        data = dict(self.request.data)

        if 'keywords' in data:
            key_words = data.pop('keywords', [])
            book.keywords.clear()
            try:
                for key_word in key_words:
                    kw = _resolve_keyword(key_word)
                    if kw:
                        book.keywords.add(kw)
            except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
                raise ValidationError({'keywords': str(e)})

        if 'bbk' in data:
            book.bbk.clear()
            try:
                for bbk in data.get('bbk', []):
                    bbk_to_assign = BBK.objects.get(pk=bbk['id'])
                    book.bbk.add(bbk_to_assign)
            except (ObjectDoesNotExist, MultipleObjectsReturned, KeyError) as e:
                raise ValidationError({'bbk': str(e)})

        if 'issue_city' in data:
            try:
                payload = data.get('issue_city')
                if payload and payload.get('id') is not None:
                    book.issue_city = IssueCity.objects.get(pk=payload['id'])
                else:
                    book.issue_city = None
            except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
                raise ValidationError({'issue_city': str(e)})

        if 'publishing_house' in data:
            try:
                payload = data.get('publishing_house')
                if payload and payload.get('id') is not None:
                    book.publishing_house = PublishingHouse.objects.get(pk=payload['id'])
                else:
                    book.publishing_house = None
            except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
                raise ValidationError({'publishing_house': str(e)})

        if 'author' in data:
            book.author.clear()
            try:
                for author in data.get('author', []):
                    author_to_assign = Author.objects.get(pk=author['id'])
                    book.author.add(author_to_assign)
            except (ObjectDoesNotExist, MultipleObjectsReturned, KeyError) as e:
                raise ValidationError({'author': str(e)})

        book.save()

    def create(self, request):
        serializer = BookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book = Book(**serializer.validated_data)
        book.save()
        data = dict(request.data)

        try:
            if data.get('publishing_house') and data['publishing_house'].get('id') is not None:
                book.publishing_house = PublishingHouse.objects.get(pk=data['publishing_house']['id'])
            if data.get('issue_city') and data['issue_city'].get('id') is not None:
                book.issue_city = IssueCity.objects.get(pk=data['issue_city']['id'])

            author_sign = data.get('author_sign') or ''
            if author_sign != '':
                book.author_sign = author_sign
            elif data.get('author') and len(data['author']) > 0 and data['author'][0].get('id') is not None:
                book.author_sign = Author.objects.get(pk=data['author'][0]['id']).author_code or ''

            for key_word in data.get('keywords') or []:
                kw = _resolve_keyword(key_word)
                if kw:
                    book.keywords.add(kw)

            for bbk in data.get('bbk') or []:
                if bbk.get('id') is not None:
                    book.bbk.add(BBK.objects.get(pk=bbk['id']))

            for author in data.get('author') or []:
                if author.get('id') is not None:
                    book.author.add(Author.objects.get(pk=author['id']))
        except (ObjectDoesNotExist, MultipleObjectsReturned, KeyError) as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        book.save()
        return Response(BookSerializer(book).data, status=status.HTTP_201_CREATED)


class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all().order_by('lname')
    serializer_class = AuthorSerializer
    filterset_fields = ['lname']
    ordering_fields = ['id', 'lname', 'fname', 'author_code']

    def create(self, request, *args, **kwargs):
        serializer = AuthorSerializer(data=request.data)
        serializer.is_valid()
        author = Author.objects.create(**serializer.validated_data)
        author.save()
        fname_initials_list = author.fname.split(' ')
        fname_initials = ''
        for i in range(len(fname_initials_list)):
            if i == 0:
                fname_initials = fname_initials_list[i][0] + '.'
            else:
                fname_initials += ' ' + fname_initials_list[i][0] + '.'
        initial_name = author.lname + ' ' + fname_initials

        author.short_name = initial_name
        author.save()


        return Response(AuthorSerializer(author).data)


class PublishingHouseViewSet(ModelViewSet):
    queryset = PublishingHouse.objects.all().order_by('name')
    serializer_class = PublishingHouseSerializer
    ordering_fields = ['id', 'name']


class BBKViewSet(ModelViewSet):
    queryset = BBK.objects.all().order_by('code')
    serializer_class = BBKSerializer
    ordering_fields = ['id', 'code', 'description']


class KeyWordViewSet(ModelViewSet):
    queryset = KeyWord.objects.all()
    serializer_class = KeyWordSerializer
    ordering_fields = ['id', 'name']


class IssueCityViewSet(ModelViewSet):
    queryset = IssueCity.objects.all().order_by('name')
    serializer_class = IssueCitySerializer
    ordering_fields = ['id', 'name']
