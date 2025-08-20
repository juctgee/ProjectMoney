# ใช้ Node.js เวอร์ชันล่าสุด LTS
FROM node:18

# ตั้ง working directory
WORKDIR /usr/src/app

# copy package.json และติดตั้ง dependency
COPY package*.json ./
RUN npm install

# copy source code ทั้งหมด
COPY . .

# ตั้ง environment variable สำหรับ DB (สามารถ override จาก docker-compose)
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=261146
ENV DB_NAME=Money

# expose port 8082 (ให้ตรงกับ docker-compose.yml)
EXPOSE 8082

# ใช้ server.js เป็น entrypoint
CMD ["node", "server.js"]
