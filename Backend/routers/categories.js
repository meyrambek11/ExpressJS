const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

//get all categories
router.get(`/`, async function (req, res) {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
    
});

//get category by id
router.get(`/:id`, async function(req,res) {
    /*const category = await Category.findById(req.params.id);

    if(!category){
        res.status(500).json({message: "The category with giving ID is not found!"})
    }
    res.status(200).send(category);*/

    Category.findById(req.params.id).then(category =>{
        if(category){
            return res.status(200).send(category);
        }else{
            return res.status(500).json({message: "The category with giving ID is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//add category
router.post(`/`, async function (req, res) {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })
    category = await category.save();
    if (!category) return res.status(404).send("the category can not created");

    res.send(category);
});

//delete category by id
router.delete(`/:id`, async function(req,res){
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        }else{
            return res.status(404).json({success: false, message: "the category is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//update category by id
router.put(`/:id`, async function(req,res){
    Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {new: true}
        
    ).then(category =>{
        if(category){
            return res.status(200).send(category)
        }else{
            return res.status(404).json({success: false, message: "the category is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})
module.exports = router;
