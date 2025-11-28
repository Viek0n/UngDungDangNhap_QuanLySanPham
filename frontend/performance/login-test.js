import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

//k6 run performance/login-test.js
// Metric custom để theo dõi response time
let loginResponseTime = new Trend('login_response_time');

export let options = {
    stages: [
        { duration: '30s', target: 100 },  // 100 VUs
        { duration: '30s', target: 500 },  // 500 VUs
        { duration: '30s', target: 1000 }, // 1000 VUs
        { duration: '1m', target: 1200 },  // Stress test
        { duration: '30s', target: 0 },    // Ramp down
    ],
    thresholds: {
        'login_response_time': ['p(95)<500'], // 95% request dưới 500ms
        'http_req_failed': ['rate<0.05'],     // <5% failed requests
    },
};

const BASE_URL = 'http://localhost:8080/api';

export default function () {
    // Payload login
    let payload = JSON.stringify({
        username: 'admin',
        password: 'admin123'
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Gửi request login
    let res = http.post(`${BASE_URL}/auth/login`, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'token returned': (r) => r.json('token') !== undefined,
    });

    loginResponseTime.add(res.timings.duration);

    sleep(1);
}
