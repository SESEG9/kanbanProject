--liquibase formatted sql
--changeset Dominik:1670324568748-12
drop table vacation;
CREATE TABLE vacation (
                          id int8 NOT NULL,
                          user_id int8,
                          start_date date,
                          end_date date,
                          state varchar,
                          CONSTRAINT vacation_pkey PRIMARY KEY (id),
                          CONSTRAINT vacation_user_id_fkey FOREIGN KEY (user_id) REFERENCES jhi_user(id)
);
