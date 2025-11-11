FROM node:20

WORKDIR /app

# copiar package.json y package-lock (si tienes)
COPY package.json ./

# instalar dependencias
RUN npm install

# Copiar el resto
COPY . .

# crear directorio uploads
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["npm", "start"]
