import axios from 'axios';
import { toSnakeParams, toCamelResponse } from './utils/apiParams';

const API_URL = 'http://localhost:8000/api/v1/lib/issue_city/';

export default class CityManager {
  getCities(params = {}) {
    const drfParams = toSnakeParams(params);
    return axios.get(API_URL, { params: drfParams }).then((response) => toCamelResponse(response.data));
  }

  getCitiesForDropdown(params = {}) {
    return this.getCities({ ...params, pageSize: 500 }).then((data) => data.results || []);
  }

  getCity(city) {
    const id = typeof city === 'object' ? (city?.id ?? city?.pk) : city;
    const url = API_URL + id + '/';
    return axios.get(url).then((response) => toCamelResponse(response.data));
  }

  createCity(city) {
    return axios.post(API_URL, city);
  }

  updateCity(city) {
    const id = typeof city === 'object' ? (city?.id ?? city?.pk) : city;
    const url = API_URL + id + '/';
    return axios.patch(url, city);
  }

  deleteCity(city) {
    const id = typeof city === 'object' ? (city?.id ?? city?.pk) : city;
    const url = API_URL + id + '/';
    return axios.delete(url);
  }
}
