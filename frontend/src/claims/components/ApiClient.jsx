
import axios from 'axios';
import { BASE_URL } from '../../config/Config';

const apiClient = axios.create({
  baseURL: `${BASE_URL}:9030`, // Ensure this is correct
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
