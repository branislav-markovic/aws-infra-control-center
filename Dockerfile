FROM node:26

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

COPY . ./

CMD ["npx", "tsx", "--env-file=.env", "index.ts"]
