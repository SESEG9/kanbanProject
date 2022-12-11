--liquibase formatted sql
--changeset Dominik + Simon:1670324568748-7
alter table room drop column invoice_id;
