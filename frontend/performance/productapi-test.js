import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

let productResponseTime = new Trend('product_response_time');

export let options = {
    stages: [
        { duration: '30s', target: 100 },  // 100 VUs
        { duration: '30s', target: 500 },  // 500 VUs
        { duration: '30s', target: 1000 }, // 1000 VUs
        { duration: '1m', target: 1200 },  // Stress test
        { duration: '30s', target: 0 },    // Ramp down
    ],
    thresholds: {
        'product_response_time': ['p(95)<500'],
        'http_req_failed': ['rate<0.05'],
    },
};

const BASE_URL = 'http://localhost:8080/api';

// Login để lấy token trước khi test Product API
function login() {
    const payload = JSON.stringify({
        username: 'admin',
        password: 'admin123',
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    let res = http.post(`${BASE_URL}/auth/login`, payload, params);

    if (res.status === 200 && res.body.length > 0) {
        try {
            return JSON.parse(res.body).token;
        } catch (e) {
            console.warn('Failed to parse token');
            return null;
        }
    } else {
        console.warn(`Login failed! Status: ${res.status}`);
        return null;
    }
}

export default function () {
    const token = login();
    if (!token) {
        return; // nếu login thất bại thì skip test
    }

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    // 1. GET all products
    let resAll = http.get(`${BASE_URL}/products`, params);
    check(resAll, { 'GET /products status 200': (r) => r.status === 200 });
    productResponseTime.add(resAll.timings.duration);

    // 2. POST create product
    let newProduct = JSON.stringify({
        name: 'Test Product',
        description: 'Performance test product',
        price: 1000,
        quantity: 10,
        category: 'Test'
    });
    let resCreate = http.post(`${BASE_URL}/products`, newProduct, params);
    check(resCreate, { 'POST /products status 201': (r) => r.status === 201 || r.status === 200 });
    productResponseTime.add(resCreate.timings.duration);

    let createdId = 0;
    if (resCreate.status === 200 || resCreate.status === 201) {
        try {
            let body = JSON.parse(resCreate.body);
            createdId = body.id || 1;
        } catch (e) {
            console.warn('Failed to parse created product ID');
        }
    }

    // 3. GET product by id
    let resSingle = http.get(`${BASE_URL}/products/1`, params);
    check(resSingle, { 'GET /products/1 status 200': (r) => r.status === 200 });
    productResponseTime.add(resSingle.timings.duration);

    // 4. PUT update product
    // GET product by id (dùng ID vừa tạo)
    if (createdId) {
        let resSingle = http.get(`${BASE_URL}/products/${createdId}`, params);
        check(resSingle, { 'GET /products/:id status 200': (r) => r.status === 200 });
        productResponseTime.add(resSingle.timings.duration);
    }


    // 5. DELETE product
    if (createdId) {
        let resDelete = http.del(`${BASE_URL}/products/${createdId}`, null, params);
        check(resDelete, { 'DELETE /products/:id status 200': (r) => r.status === 200 || r.status === 204 });
        productResponseTime.add(resDelete.timings.duration);
    }

    sleep(1);
}
