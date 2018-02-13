DROP DATABASE IF EXISTS nodejsassignment;
CREATE DATABASE nodejsassignment;




\c nodejsassignment;

-- session management table once node module installed  run in command line 
-- psql -U postgres -d nodejsassignment  < node_modules/connect-pg-simple/table.sql


CREATE TABLE identity_user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(200) NOT NULL
);


CREATE TABLE user_friends (
  id SERIAL PRIMARY KEY,
  user_id int NOT NULL,
  friend_id int NOT NULL
);


-- INSERT INTO starships (name, registry, affiliation, launched, class, captain)
--   VALUES ('USS Enterprise', 'NCC-1701', 'United Federation of Planets Starfleet', 2258, 'Constitution', 'James T. Kirk');
