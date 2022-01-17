const { Order } = require("../models/order");
const express = require("express");
const { User } = require("../models/user");
const { OrderItem } = require("../models/order-item");
const { Product } = require("../models/product");
const router = express.Router();

//get all orders
router.get(`/`, async function (req, res) {
    const orderList = await Order.find()
        .populate({ path: "user", model: User, select: "name" })
        .sort({ dateOrdered: -1 });

    if (!orderList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(orderList);
});

//get order by id
router.get(`/:id`, async function (req, res) {
    const order = await Order.findById(req.params.id)
        .populate({ path: "user", model: User, select: "name" })
        .populate({
            path: "orderItems",
            model: OrderItem,
            populate: { path: "product", model: Product, select: "name" },
        });

    if (!order) {
        res.status(500).json({
            message: "The order with giving ID is not found!",
        });
    }
    res.status(200).send(order);
});

//add new order
router.post(`/`, async function (req, res) {

    //add new orderItem
    const orderItemIds = Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product,
            });

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;
        })
    );

    const orderItemIdsResolved = await orderItemIds;

    //get total price of order

    const totalPrices = await Promise.all(orderItemIdsResolved.map(async (orderItemId) =>{
        const orderItem = await OrderItem.findById(orderItemId).populate({ path: "product", model: Product, select: "price" });
        const totalPrice = orderItem.product.price*orderItem.quantity;
        return totalPrice;
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b, 0);
    
    //console.log(totalPrice);

    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });
    order = await order.save();
    if (!order) return res.status(404).send("the order can not created");

    res.send(order);
});


//update order by id
router.put(`/:id`, async function(req,res){
    Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        {new: true}
        
    ).then(order =>{
        if(order){
            return res.status(200).send(order)
        }else{
            return res.status(404).json({success: false, message: "the order is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//delete order by id
router.delete(`/:id`, async function(req,res){

    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order){
            await order.orderItems.map( async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem); //delete orderItem
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        }else{
            return res.status(404).json({success: false, message: "the order is not found!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//get totalsales sum
router.get(`/get/totalsales`, async function(req,res){
    const totalSales = await Order.aggregate([
        { $group:{_id: null, totalsales: {$sum: '$totalPrice' }}}
    ])
    if(!totalSales){
        res.status(400).send('The order sales can not be generated');
    }
    res.send({totalsales: totalSales.pop().totalsales});
})

//get count of orders
router.get(`/get/count`, async function (req, res) {
    const orderCount = await Order.countDocuments({})
 
    if(!orderCount){
        res.status(500).json({success: false});
    }
    res.send({
        orderCount: orderCount
    });
});


//get user orders

router.get(`/get/userorders/:userid`, async function(req,res){
    const userOrderList = await Order.find({user: req.params.userid}).populate({
        path: "orderItems",
        model: OrderItem,
        populate: { path: "product", model: Product, select: "name" }}).sort({ dateOrdered: -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(userOrderList);

});

module.exports = router;
