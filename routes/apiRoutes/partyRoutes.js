const express = require('express');
const router = express.Router();
const db = require('../../db/database');

// Get all parties
router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        res.json({
            message: 'Success',
            data: rows
        });
    });
});

// Get a single party
router.get('/party/:id', (req, res) => { 
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'Success',
            data: row
        });
    });
});

// Delete a party
router.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'Successfully Deleted',
            changes: this.changes
        });
    });
});

// Updating a party
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) { 
        res.status(400).json({error: errors});
        return;
    }
    
    const sql = `UPDATE candidates SET party_id = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: req.body,
            changes: this.changes
        });
    });
});

module.exports = router;