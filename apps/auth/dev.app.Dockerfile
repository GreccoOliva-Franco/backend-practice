FROM node:lts

WORKDIR /usr/local/app

COPY . .

RUN npx prisma generate --schema=./apps/auth/prisma/schema.prisma
RUN npm install

CMD [ "npm", "run", "start:dev", "auth", "--watch" ]