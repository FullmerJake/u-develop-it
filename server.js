const express = require('express');
// Sets the execution mode to verbose to produce messages in the terminal regarding the state of the runtime. 
// Helps explain what the application is doing, expecially SQLite
const sqlite3 = require('sqlite3').verbose();
const inputCheck = require('./utils/inputCheck');

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

// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates
                WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

// Create a candidate
app.post('/api/candidate', ({body}) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_standard');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSET INTO candidates (first_name, last_name, industry_standard)
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_standard];
    // ES5 function, not arrow function, to use 'this'
    db.run(sql, params, function(err, result){
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
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