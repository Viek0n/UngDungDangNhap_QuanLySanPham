import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base URL
const api = axios.create({
    baseURL: BASE_URL
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    }
};

// Product Service
export const productService = {
    getAllProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (product) => {
        const response = await api.post('/products', product);
        return response.data;
    },

    updateProduct: async (id, product) => {
        const response = await api.put(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id) => {
        await api.delete(`/products/${id}`);
    }
};