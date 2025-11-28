import http from 'k6/http';
import { sleep } from 'k6';
//k6 run performance/responsetime-test.js
export const options = {
  vus: 20,               // 20 users
  duration: '20s',       // chạy 20 giây

  thresholds: {
    http_req_duration: [
      'avg<300',   // Avg < 300ms
      'p(90)<500', // P90 < 500ms
      'p(95)<700', // P95 < 700ms
      'p(99)<1200'
    ]
  }
};

export default function () {
  http.get('http://localhost:8080/api/products');
  sleep(1);
}
