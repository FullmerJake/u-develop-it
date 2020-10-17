


DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS voters;


CREATE TABLE parties (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);


CREATE TABLE candidates (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    industry_connected BOOLEAN NOT NULL,
    party_id INTEGER UNSIGNED,
    -- Allows us to flag the party_id field as on official foreign key and tells SQL which table and field it references. 
    -- Ensures that no ID can be inserted into the candidates table if it doesnt also exist in the parties table.
    CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
    -- ON DELETE SET NULL makes sure that if a party is deleted, it updates accordingly on candidates. If a party is deleted, it sets the candidate's party_id to null.
);

CREATE TABLE voters (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NUll,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
