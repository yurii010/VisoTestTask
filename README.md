# VisoTestTask

ngrok http 3000

// В client/src/config/config.ts вставити посилання ngrok

cd ./client
npm install

cd ./server
npm install

createdb recipe_db

// або в psql:
CREATE DATABASE recipe_db;

delete .example in server/.env.example

cd ./server
npx prisma migrate dev --name init

cd ./client
npm run build

cd ./server
npm run build
npm run start


