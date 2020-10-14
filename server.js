const express = require('express');
// Sets the execution mode to verbose to produce messages in the terminal regarding the state of the runtime. 
// Helps explain what the application is doing, expecially SQLite
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }
    
    console.log('Connected to the election database');
});


// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
});



//Start Server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});