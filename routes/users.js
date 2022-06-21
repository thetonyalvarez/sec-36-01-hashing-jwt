const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { SECRET_KEY } = require("../config");

const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")

const ExpressError = require("../expressError");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const users = await User.all();
        return res.json({ users })
    } catch (err) {
        return next(err);
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', ensureCorrectUser, async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        return res.json({user: user})
    } catch (err) {
        return next(err)
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureLoggedIn, async (req, res, next) => {
    try {
        let user = await User.get(req.params.username)

        if (req.user.username !== user.username) {
            throw new ExpressError("Unauthorized user.", 401)
        }
        const messagesTo = await User.messagesTo(req.params.username)
        return res.json({messages: messagesTo})
    } catch (err) {
        return next(err)
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureLoggedIn, async (req, res, next) => {
    try {
        let user = await User.get(req.params.username)

        if (req.user.username !== user.username) {
            throw new ExpressError("Unauthorized user.", 401)
        }
        const messagesFrom = await User.messagesFrom(req.params.username)
        return res.json({messages: messagesFrom})
    } catch (err) {
        return next(err)
    }
})

module.exports = router;
