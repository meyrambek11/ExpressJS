//models -> product.js
const {Product} = require('../models/product');
const express = require("express");
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

//fileSend
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){
            uploadError = null;
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`); //`${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })

//get all product
router.get(`/`, async function (req, res) {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }
    const productList = await Product.find(filter);
 
    if(!productList){
        res.status(500).json({success: false});
    }
    res.send(productList);
});

//get product by id
router.get(`/:id`, async function(req,res) {
    //.populate('category')
    //.select('name brand -_id')
    Product.findById(req.params.id).then(product =>{
        if(product){
            return res.status(200).send(product);
        }else{
            return res.status(500).json({message: "The category with giving ID is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//add new product
router.post(`/`, uploadOptions.single('image'), async function (req, res) {

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid category');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`; //http//:localhost:3000/public/uploads
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    
    product = await product.save();

    if(!product) return res.status(500).send('The product can not be created');

    res.send(product)
});

//delete product by id
router.delete(`/:id`, async function(req,res){
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        }else{
            return res.status(404).json({success: false, message: "the product is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})


//update product by giving ID
router.put(`/:id`, async function(req,res){
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid product ID');
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid product');

    Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {new: true}
        
    ).then(product =>{
        if(product){
            return res.status(200).send(product)
        }else{
            return res.status(404).json({success: false, message: "the product is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//get count of product
router.get(`/get/count`, async function (req, res) {
    const productCount = await Product.countDocuments({})
 
    if(!productCount){
        res.status(500).json({success: false});
    }
    res.send({
        productCount: productCount
    });
});

//get featured products
router.get(`/get/featured/:count`, async function(req,res){
    const count = req.params.count ? req.params.count : 0;
    const featuredProduct = await Product.find({isFeatured: true}).limit(+count);

    if(!featuredProduct){
        res.status(500).json({success: false});
    }
    res.send(featuredProduct)
})

//update images of product
router.put(`/gallery-images/:id`, uploadOptions.array('images',10), async function(req,res){
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid product ID');
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files){
        files.map(file =>{
            imagesPaths.push(`${basePath}${file.filename}`);
        })
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        {new: true}
        
    )
    
    if(!product){
        return res.status(404).json({success: false, message: "the product is not found!"})
            
    }
    res.status(200).send(product)  
});


module.exports = router;
