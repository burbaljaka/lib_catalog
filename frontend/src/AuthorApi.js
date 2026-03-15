import axios from 'axios';
import { toSnakeParams, toCamelResponse } from './utils/apiParams';

const API_URL = 'http://localhost:8000/api/v1/lib/author/';

export default class AuthorManager {
  getAuthors(params = {}) {
    const drfParams = toSnakeParams(params);
    return axios.get(API_URL, { params: drfParams }).then((response) => toCamelResponse(response.data));
  }

  getAuthorsForDropdown(params = {}) {
    return this.getAuthors({ ...params, pageSize: 500 }).then((data) => data.results || []);
  }

  getAuthor(author) {
    const url = API_URL + author + '/';
    return axios.get(url).then((response) => toCamelResponse(response.data));
  }

  createAuthor(author) {
    return axios.post(API_URL, author);
  }

  updateAuthor(author) {
    const url = API_URL + author.pk + '/';
    return axios.patch(url, author);
  }

  deleteAuthor(author) {
    const url = API_URL + author.id + '/';
    return axios.delete(url);
  }
}
