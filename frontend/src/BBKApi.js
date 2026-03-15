import axios from 'axios';
import { toSnakeParams, toCamelResponse } from './utils/apiParams';

const API_URL = 'http://localhost:8000/api/v1/lib/bbk/';

export default class BBKManager {
  getBBKs(params = {}) {
    const drfParams = toSnakeParams(params);
    return axios.get(API_URL, { params: drfParams }).then((response) => toCamelResponse(response.data));
  }

  getBBKsForDropdown(params = {}) {
    return this.getBBKs({ ...params, pageSize: 500 }).then((data) => data.results || []);
  }

  getBBK(bbk) {
    const url = API_URL + bbk + '/';
    return axios.get(url).then((response) => toCamelResponse(response.data));
  }

  createBBK(bbk) {
    return axios.post(API_URL, bbk);
  }

  updateBBK(bbk) {
    const url = API_URL + bbk.pk + '/';
    return axios.patch(url, bbk);
  }

  deleteBBK(bbk) {
    const url = API_URL + bbk + '/';
    return axios.delete(url);
  }
}
