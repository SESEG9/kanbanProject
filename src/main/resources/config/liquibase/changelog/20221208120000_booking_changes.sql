--liquibase formatted sql
--changeset Dominik + Simon:1670324568748-4
alter table booking add column billing_customer_id int8;

alter table booking add foreign key (billing_customer_id) references customer(id);

alter table booking add column booking_code varchar;


alter table rel_booking__rooms drop column rooms_id;
alter table rel_booking__rooms add column room_price_id int8;
alter table rel_booking__rooms add constraint fk_rel_booking__rooms__room_prices_id foreign key (room_price_id) references room_price(id);

