const router = require("express").Router();

const { PrismaClient } = require("@prisma/client");

const { user } = new PrismaClient();

router.get("/get", async function(req,res){
    const users = await user.findMany({
        select: {
            id: true,
            username: true,
            password: true,
            email: true
        }
    });
    res.json(users);
})

router.post("/posting", async function(req,res){
    const {username, password, email} = req.body;
    const userExist = await user.findUnique({
        where:{
            username
        },
    })
    if(userExist){
        return res.status(400).json({
            msg: "user already exist"
        })
    }
    const newUser = await user.create({
        data: {
            username,
            password,
            email
        }
    })
    res.json(newUser);
})
router.patch("/update/", async function(req,res){
    const {id, username} = req.body;
    const userExist = await user.findUnique({
        where:{
            id,
        },
    })
    if(!userExist){
        return res.status(400).json({
            msg: "user not exist"
        })
    }
    const updateUser = await user.update({
        where:{
            id
        },
        data: {
            username,
        }
    })
    res.json(updateUser);

})

router.delete("/deleting/:id", async function(req,res,next){
    try{
        const { id } = req.params;
        const deleteUser = await user.delete({
            where:{
                id: parseInt(id)
            }
        })
        res.json(deleteUser)
    } catch(error){
        next(error);
    }

})


module.exports = router;