CREATE DATABASE IF NOT EXIST api_rest_laravel;
USE api_rest_laravel;

CREATE TABLE users (
    id              int(255) auto_increment NOT null,
    name            varchar(50) NOT null,
    subname         varchar(100) NOT null,
    role            varchar(20),
    email           varchar(255) NOT null,
    password        varchar(255) NOT null,
    description     text,
    image           varchar(255),
    create_at       datetime DEFAULT NULL,
    update_at       datetime DEFAULT NULL,
    remember_token  varchar(255),
    constrain pk_users PRIMARY KEY(id)
)ENGINE=InnoDB;/* cotejamiento para mantener la integridad referncial */

CREATE TABLE categories(
    id              int(255) auto_increment NOT null,
    name            varchar(100) NOT null,  
    create_at       datetime DEFAULT NULL,
    update_at       datetime DEFAULT NULL,
    constrain pk_categories PRIMARY KEY(id) 
)ENGINE=InnoDB;

CREATE TABLE post (
    id              int(255) auto_increment NOT null,
    user_id         int(255) NOT null,
    category_id     int(255) NOT NULL,
    title           varchar(255) NOT NULL,
    content         varchar(255) NOT NULL,
    image           varchar(255),
    create_at       datetime DEFAULT NULL,
    update_at       datetime DEFAULT NULL,
    constrain pk_post PRIMARY KEY(id),
    constrain fk_post_user FOREING KEY(user_id) REFERENCES user(id),
    constrain fk_post_category FOREING KEY(cateogory_id) REFERENCES categories(id)
)ENGINE=InnoDB;