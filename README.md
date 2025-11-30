# UngDungDangNhap_QuanLySanPham

## **Testing Guide**

---

## **1. Frontend Tests**

### **1.1. Chạy Unit Test**
Dùng để kiểm thử logic, component và validation của frontend.

```bash
cd frontend
npm test
```

---

### **1.2. Chạy E2E Test (Cypress)**
Kiểm thử toàn bộ luồng người dùng (login, CRUD sản phẩm, UI).

```bash
cd frontend
npx cypress open
```

---

### **1.3. Chạy Load Test / API Test (k6)**

#### **Login:**
```bash
cd frontend
k6 run login-test.js
```

#### **Product API:**
```bash
cd frontend
k6 run productapi-test.js
```

---

## **2. Backend Tests**

### **2.1. Chạy Unit Test (Maven)**
Kiểm thử logic controller, service và repository.

```bash
cd backend
mvn test
```

---

## **Lưu ý**
- Backend cần chạy trước khi thực hiện Cypress hoặc k6.  
- Các test script phải tồn tại đúng đường dẫn trong dự án.  
- Node, Java, Maven, k6 và Cypress phải được cài đặt đầy đủ.  
