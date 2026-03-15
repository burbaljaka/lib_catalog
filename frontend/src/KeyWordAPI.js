import axios from 'axios';
import { toSnakeParams, toCamelResponse } from './utils/apiParams';

const API_URL = 'http://localhost:8000/api/v1/lib/key_word/';

export default class KeyWordManager {
  getKeyWords(params = {}) {
    const drfParams = toSnakeParams(params);
    return axios.get(API_URL, { params: drfParams }).then((response) => toCamelResponse(response.data));
  }

  getKeyWordsForDropdown(params = {}) {
    return this.getKeyWords({ ...params, pageSize: 500 }).then((data) => data.results || []);
  }

  getKeyWord(key_word) {
    const url = API_URL + key_word + '/';
    return axios.get(url).then((response) => toCamelResponse(response.data));
  }

  createKeyWord(key_word) {
    return axios.post(API_URL, key_word);
  }

  updateKeyWord(key_word) {
    const url = API_URL + key_word.pk + '/';
    return axios.patch(url, key_word);
  }

  deleteKeyWord(key_word) {
    const url = API_URL + key_word + '/';
    return axios.delete(url);
  }
}
