create table discount (
    id int NOT NULL,
    discount_code varchar(50) NOT NULL UNIQUE,
    discount_percentage float NOT NULL,
    PRIMARY KEY (id)
)
