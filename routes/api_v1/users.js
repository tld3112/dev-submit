/**
 * Created by tech4GT on 8/13/17.
 */
const express = require('express')
const db = require('../../db')

const router = express.Router()

router.get('/', function (req, res) {
    let name = req.query.name
    let email = req.query.email
    let type = "all"

    if (name) {
        type = 'name';
    }
    else if (email) {
        type = 'email'
    }

    if (type == 'all')
        db.actions.users.getUsers(data => {
            res.send(data);
        })
    else if (type == 'email') {
        db.actions.users.searchUsers(email, type, data => res.send(data))
    }
    else {
        db.actions.users.searchUsers(name, type, data => {
            res.send(data);
        });
    }
})
router.get('/:id', function (req, res) {
    db.actions.users.getUser(req.params.id, (data) => {
        res.send(data)
    })
})
router.put('/:id', function (req, res) {
    db.actions.users.editUser(req.params.id, req.body.name, (data) => {
        res.send(data)
    }, req.body.email, req.query.echo)
})
router.post('/new', function (req, res) {
    db.actions.users.addUser(req.body.name, req.body.email, (data) => {
        res.send(data)
    })
})
router.delete('/:id', function (req, res) {
    db.actions.users.deleteUser(req.params.id, (data) => res.send(data))
})

module.exports = router