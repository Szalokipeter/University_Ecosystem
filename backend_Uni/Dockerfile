FROM php:8.4.1
RUN apt-get update -y && apt-get install -y openssl zip unzip git libonig-dev
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN apt-get update && apt-get install -y libpq-dev
RUN docker-php-ext-install pdo_mysql mbstring pdo
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app
COPY . /app

RUN npm install
RUN composer install

RUN docker-php-ext-install pcntl

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000
EXPOSE 8080

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
