# HƯỚNG DẪN CHUNG
1. Cài đặt VSCode

2. Giải nén thư mục "src.zip"

3. Mở thư mục "src" trong VSCode


# HƯỚNG DẪN TẠO DATABASE Ở LOCAL
Lưu ý: 2 database đã được host nên không cần tạo database ở local

1. Cài đặt Postgresql

2. Mở pgAdmin và truy cập vào server Postgresql 

3. Tạo 2 database với tên "nomeobank" và "vietbank"

4. Giải nén file "db.zip"

5. 
- Mở "Query Tool" của database "nomeobank"
- Mở file "script_nomeobank.sql" trong thư mục "db" vừa giải nén 
- Nhấn nút "Execute" để tạo bảng và thêm dữ liệu

6. 
- Mở "Query Tool" của database "vietbank"
- Mở file "script_vietbank.sql" trong thư mục "db" vừa giải nén
- Nhấn nút "Execute" để tạo bảng và thêm dữ liệu

7. 
- Mở file ".env" trong thư mục "src/backend nomeo" 
- Thay đổi giá trị <username> và <password> trong format sau với cài đặt postgres ở local:
postgresql://<username>:<password>@localhost:5432/nomeobank?schema=public
- Thay giá trị của DATABASE_URL trong file ".env" bằng chuỗi trên

8. 
- Mở file ".env" trong thư mục "src/backend vietbank" 
- Thay đổi giá trị <username> và <password> trong format sau với cài đặt postgres ở local:
postgresql://<username>:<password>@localhost:5432/vietbank?schema=public
- Thay giá trị của DATABASE_URL trong file ".env" bằng chuỗi trên


# HƯỚNG DẪN CHẠY SERVER CHO NGÂN HÀNG NOMEOBANK

1. Mở thư mục "backend nomeo" ở terminal:
cd './backend nomeo/'

2. Chạy các lệnh sau ở terminal để cài đặt các package và dependency:
npm install
npm install prisma --save-dev
npm install @prisma/client

3. Chạy các lệnh sau ở terminal để cập nhật schema prisma theo database:
npx prisma db pull
npx prisma generate

4. Chạy server ở port 4000:
npm run start:dev


# HƯỚNG DẪN CHẠY FRONTEND CHO NGÂN HÀNG NOMEOBANK

1. Mở thư mục "frontend" ở terminal:
cd frontend

2. Chạy lệnh sau ở terminal để cài đặt các package và dependency:
yarn install

3. Chạy server ở port 3000:
yarn start


# HƯỚNG DẪN CHẠY SERVER CHO NGÂN HÀNG VIETBANK ĐỂ CHUYỂN TIỀN LIÊN NGÂN HÀNG VỚI CƠ CHẾ MÃ HÓA BẤT ĐỐI XỨNG PGP

1. Mở thư mục "backend vietbank" ở terminal:
cd './backend vietbank/'

2. Chạy các lệnh sau ở terminal để cài đặt các package và dependency:
npm install
npm install prisma --save-dev
npm install @prisma/client

3. Chạy các lệnh sau ở terminal để cập nhật schema prisma theo database:
npx prisma db pull
npx prisma generate

4. Chạy server ở port 4001:
npm run start:dev