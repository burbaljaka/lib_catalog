import axios from 'axios';
import { toSnakeParams, toCamelResponse } from './utils/apiParams';

const API_URL = 'http://localhost:8000/api/v1/lib/publishing_house/';

export default class PubManager {
  getPubs(params = {}) {
    const drfParams = toSnakeParams(params);
    return axios.get(API_URL, { params: drfParams }).then((response) => toCamelResponse(response.data));
  }

  getPubsForDropdown(params = {}) {
    return this.getPubs({ ...params, pageSize: 500 }).then((data) => data.results || []);
  }

  getPub(pub) {
    const url = API_URL + pub + '/';
    return axios.get(url).then((response) => toCamelResponse(response.data));
  }

  createPub(pub) {
    return axios.post(API_URL, pub);
  }

  updatePub(pub) {
    const url = API_URL + pub.pk + '/';
    return axios.patch(url, pub);
  }

  deletePub(pub) {
    const url = API_URL + pub.id + '/';
    return axios.delete(url);
  }
}
