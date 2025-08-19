FROM php:8.2-apache

# ติดตั้ง extension MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# เปิด mod_rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html
