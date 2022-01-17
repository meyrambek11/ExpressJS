const router = require("express").Router();

const { PrismaClient } = require("@prisma/client")

const { user } = new PrismaClient();

router.get("/get", async function(req,res){
    const users = await user.findMany({
        select: {
            id: true,
            username: true,
            posts: true
        },
        /*where: {
            username: "Meyr"

        }*/
    });
    res.json(users);
});

router.post("/post", async function(req,res){
    const { username } = await req.body;

    const userExist = await user.findUnique({
        where: {
            username
        },
        select: {
            username: true
        }
    });
    if(userExist){
        return res.status(400).json({
            msg: "user already exists"
        })
    }
    const newUser = await user.create({
        data: {
            username
        }
    })
    res.json(newUser);
})

module.exports = router;