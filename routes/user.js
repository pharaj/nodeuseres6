const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const { check, validationResult } = require('express-validator/check');


const validateToken = async (req, res, next) => {
    let token = req.headers['authorization']
    if (token) {
        const result = await User.findById(token);
        if (result) {
            next();
        } else {
            res.status(500).send('forbidden')
        }
    } else {
        res.status(500).send('forbidden**');
    }
}


//route for register
router.post('/register', [
    check('first_name', "first name is required").not().isEmpty(),
    check('last_name', "last name is required").not().isEmpty(),
    check('email', "email is required").not().isEmpty(),
    check('user_name', "user name is required").not().isEmpty(),
    check('password', "password is required").not().isEmpty(),
    check('confirm_password', "confirm_password is required").not().isEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
    } else {
        if (req.body.password == req.body.confirm_password) {
            const result = await User.findOne({ email: req.body.email });
            if (result) {
                res.status(400).send('email already saved');
            } else {
                const response = await User.findOne({ user_name: req.body.user_name });
                if (response) {
                    res.status(400).send('username already existed');
                } else {
                    let newUser = new User();
                    newUser.first_name = req.body.first_name;
                    newUser.last_name = req.body.last_name;
                    newUser.user_name = req.body.user_name;
                    newUser.email = req.body.email;
                    newUser.setPassword(req.body.password);
                    const saveUser = await newUser.save()
                    res.json(saveUser);
                }
            }
        } else {
            res.send('password not matched');
        }
    }

});


//route for login
router.post('/login', [
    check('user_name', "user name is required").not().isEmpty(),
    check('password', "password is required").not().isEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
    } else {
        const result = await User.findOne({ user_name: req.body.user_name })
        if (result) {
            if (result.validPassword(req.body.password)) {
                res.json(result._id);
            } else {
                res.status(500).send('password is incorrect');
            }
        } else {
            res.status(500).send('User name incorrect');
        }
    }
});

//route to get user data
router.get('/get', validateToken, async (req, res, next) => {
    const response = await User.find({});
    res.json(response);
});

//route to delete user data
router.put('/delete', validateToken, async (req, res, next) => {
    const response = await User.findOneAndDelete({ _id: req.headers['authorization'] });
    res.json(response);
})


module.exports = router;