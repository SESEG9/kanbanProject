--liquibase formatted sql
--changeset Dominik + David:1670324568748-10

create table time_slots
(
    name       varchar primary key,
    start_time time,
    end_time   time
);

insert into time_slots (name, start_time, end_time) values ('night_shift', '19:00:00', '07:00:00'),
                                                           ('day_shift', '07:00:00', '19:00:00'),
                                                           ('vacation', '00:00:00', '24:00:00');


drop table work_package;

CREATE TABLE time_management
(
    id       int8 NOT NULL,
    user_id  int8  NOT NULL,
    workday  date  NOT NULL,
    time_slot_name varchar  NOT NULL,
    CONSTRAINT time_management_pkey PRIMARY KEY (id),
    CONSTRAINT time_management_user_id_fkey FOREIGN KEY (user_id) REFERENCES jhi_user (id),
    CONSTRAINT time_management_time_slot_fkey FOREIGN KEY (time_slot_name) REFERENCES time_slots (name),
    UNIQUE (user_id, workday)
);

