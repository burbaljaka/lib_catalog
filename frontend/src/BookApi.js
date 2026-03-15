import axios from 'axios';
import { toSnakeParams, toCamelResponse } from './utils/apiParams';

const API_URL = 'http://localhost:8000/api/v1/lib/book/';

export default class BookManager {
  getBooks(params = {}) {
    const drfParams = toSnakeParams(params);
    return axios.get(API_URL, { params: drfParams }).then((response) => toCamelResponse(response.data));
  }

  getBook(book) {
    const url = API_URL + book + '/';
    return axios.get(url).then((response) => toCamelResponse(response.data));
  }

  createBook(book) {
    return axios.post(API_URL, book);
  }

  updateBook(book) {
    const url = API_URL + book.pk + '/';
    return axios.patch(url, book);
  }

  deleteBook(book) {
    const url = API_URL + book + '/';
    return axios.delete(url);
  }
}
