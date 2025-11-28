import http from 'k6/http';
import { sleep } from 'k6';

//k6 run performance/stress-test.js
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // tăng lên 50 users
    { duration: '30s', target: 150 },  // tăng mạnh lên 150
    { duration: '30s', target: 300 },  // đẩy max lên 300
    { duration: '1m',  target: 300 },  // giữ ở mức rất cao
    { duration: '30s', target: 0 },    // giảm dần
  ],

  thresholds: {
    http_req_duration: ['p(95)<500'],   // P95 < 500ms là ok
    http_req_failed: ['rate<0.05'],      // lỗi < 5%
  }
};

export default function () {
  http.get('http://localhost:8080/api/products');
  sleep(1);
}
