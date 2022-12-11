--liquibase formatted sql
--changeset Dominik + Simon:1670324568748-6
alter table invoice add column booking_id int8;
alter table invoice add foreign key (booking_id) references booking(id);
