const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//get all users
router.get(`/`, async function (req, res) {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(userList);
});

//get user by ID

router.get(`/:id`, async function(req,res) {

    User.findById(req.params.id).select('-passwordHash').then(user =>{
        if(user){
            return res.status(200).send(user);
        }else{
            return res.status(500).json({message: "The user with giving ID is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//add new user for admins
router.post(`/`, async function (req, res) {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 11), //11 is secret
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        coutry: req.body.coutry
    })
    user = await user.save();
    if (!user) return res.status(404).send("the user can not created");

    res.send(user);
});


//authentication
router.post("/login", async function(req,res){
    const user = await User.findOne(
        {
            email: req.body.email
        }
    )
    const secret = process.env.secret;

    if(!user){
        res.status(400).send('User not found!')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        res.status(200).send({user: user.email, token: token});
    }else{
        res.status(400).send('Password is wrong!')
    }
})

//registration for users
router.post(`/register`, async function (req, res) {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 11), //11 is secret
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        coutry: req.body.coutry
    })
    user = await user.save();
    if (!user) return res.status(404).send("the user can not created");

    res.send(user);
});

//delete user by ID
router.delete(`/:id`, async function(req,res){
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user){
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        }else{
            return res.status(404).json({success: false, message: "the user is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//get count of users
router.get(`/get/count`, async function (req, res) {
    const userCount = await User.countDocuments({})
 
    if(!userCount){
        res.status(500).json({success: false});
    }
    res.send({
        userCount: userCount
    });
});

module.exports = router;