create table discount (
    id int8 NOT NULL,
    discount_code varchar(50) NOT NULL UNIQUE,
    discount_percentage float NOT NULL,
    PRIMARY KEY (id)
)
