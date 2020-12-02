DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , title varchar(50) NOT NULL
    , author varchar(50) NOT NULL
    , year smallint NULL 
    , genre varchar(50) NULL
);