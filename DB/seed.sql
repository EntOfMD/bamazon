DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
create table products (
    item_id int not null auto_increment,
    product_name varchar(100) null,
    department_name varchar(100) null,
    price int null,
    stock_qty int null,
    primary key(item_id)
)
 insert into products (product_name,department_name,price,stock_qty)
 values('keyboard','electronic',100,100),
 ('monitor','electronic',100,100),
 ('fan','electronic',20,36),
 ('toothpaste','hygiene',5,45),
 ('toothbrush','hygiene',10,90),
 ('bleach','cleaner',10,66),
 ('chicken quesadilla','food',3,1000),
 ('pinot noir','wine',10,999),
 ('pillow','home goods',10,99);

SELECT * FROM bamazon.products;