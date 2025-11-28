import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};
//k6 run performance/load-test.js

export default function () {
  const res = http.get('http://localhost:8080/api/products');

  // Optional: check status
  // console.log(res.status);

  sleep(1);
}
