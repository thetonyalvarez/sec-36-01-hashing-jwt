/** Routes for Messagely */

const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const { authenticateJWT } = require("../middleware/auth")

const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        let user = await User.authenticate(username, password)
        if (user) {
            let token = jwt.sign({ username }, SECRET_KEY)

            User.updateLoginTimestamp(username)
            return res.json({ token })
        } else {
            throw new ExpressError("Invalid user/password", 400)
        }
    } catch (err) {
        return next(err)
    }

    
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body
        let user = await User.register({
            username,
            password,
            first_name,
            last_name,
            phone
        })
        if (user) {
            User.updateLoginTimestamp(username)
            let token = jwt.sign({ username }, SECRET_KEY)
            return res.json({token})
        }
        throw new ExpressError("Error.", 400)

    } catch (err) {
        return next(err)
    }
})

module.exports = router;
