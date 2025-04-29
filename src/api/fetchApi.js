import axios from 'axios';

const fetchApi = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
});

export default fetchApi;
