# Hướng dẫn chạy server cho ngân hàng NoMeoBank

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


# Hướng dẫn chạy frontend cho ngân hàng NoMeoBank

1. Mở thư mục "frontend" ở terminal:
cd frontend

2. Chạy lệnh sau ở terminal để cài đặt các package và dependency:
yarn install

3. Chạy server ở port 3000:
yarn start


# Hướng dẫn chạy server cho ngân hàng VietBank để chuyển tiền liên ngân hàng với cơ chế mã hóa bất đối xứng PGP

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