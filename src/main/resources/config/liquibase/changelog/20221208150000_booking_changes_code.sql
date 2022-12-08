--liquibase formatted sql
--changeset Dominik + Simon:1670324568748-5
alter table booking add constraint unique_booking_code unique (booking_code);
