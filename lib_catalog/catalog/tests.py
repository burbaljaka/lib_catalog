from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Author, Book, PublishingHouse, IssueCity, KeyWord, BBK


class PaginationOrderingTestCase(TestCase):
    """Tests for pagination and ordering on list endpoints."""

    def setUp(self):
        self.client = APIClient()
        for i in range(25):
            Author.objects.create(lname=f'Author{i}', fname='Test')
        for i in range(25):
            PublishingHouse.objects.create(name=f'Pub{i}')
        for i in range(25):
            IssueCity.objects.create(name=f'City{i}')
        for i in range(25):
            KeyWord.objects.create(name=f'Keyword{i}')
        for i in range(25):
            BBK.objects.create(code=f'BBK{i}', description=f'Desc{i}')

    def test_book_list_returns_paginated_response(self):
        resp = self.client.get('/api/v1/lib/book/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('count', resp.json())
        self.assertIn('next', resp.json())
        self.assertIn('previous', resp.json())
        self.assertIn('results', resp.json())

    def test_author_list_returns_paginated_response(self):
        resp = self.client.get('/api/v1/lib/author/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        self.assertIn('count', data)
        self.assertIn('next', data)
        self.assertIn('results', data)

    def test_ordering_param_changes_sort_order(self):
        resp_asc = self.client.get('/api/v1/lib/author/', {'ordering': 'lname'})
        resp_desc = self.client.get('/api/v1/lib/author/', {'ordering': '-lname'})
        self.assertEqual(resp_asc.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_desc.status_code, status.HTTP_200_OK)
        results_asc = resp_asc.json()['results']
        results_desc = resp_desc.json()['results']
        if len(results_asc) >= 2 and len(results_desc) >= 2:
            self.assertNotEqual(results_asc[0]['lname'], results_desc[0]['lname'])

    def test_page_param_returns_second_page(self):
        resp = self.client.get('/api/v1/lib/author/', {'page': 2})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.json()
        self.assertIn('results', data)
        self.assertIsNotNone(data.get('previous'))

    def test_page_size_param_respects_request(self):
        resp = self.client.get('/api/v1/lib/author/', {'page_size': 5})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.json()['results']), 5)
