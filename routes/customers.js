const router = require('express').Router();
let Customer = require('../models/customer.model');
let Comment = require('../models/comment.model');
let Food = require('../models/food.model');
let Order = require('../models/order.model');
let Manager = require('../models/manager.model');

router.route('/search/restaurant/:name').get(function(req,res,nxt){
    const content = req.params.name;
    Manager.find({'name':content},function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        return res.json(doc);
    }); 
});

router.route('/search/food/:name').get(function(req,res,nxt){
    const content = req.params.name;
    Food.find({'name':content},function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        return res.json(doc);
    }); 
});

router.route('/search/section/:num').get(async function(req,res,nxt){
    const content = req.params.num;
    var rests = [];
    var foods = [];
    await Manager.find({'section':content},function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err)
              
        doc.forEach(function(manager,indx){
            rests.push(manager);
        })
    });
    while(rests.length>0){
        await Food.find({'res_name':rests.pop()["name"]}, function(err,doc_2){
            if (err)
                return res.status(400).json('Error: ' + err)
            foods = foods.concat(doc_2);
        })
    }
    
    return res.json(foods);
});

router.route('/comment').post((req, res) => {
    const cust_phone = req.body.cust_phone;
    const res_name = req.body.res_name;
    const food_name = req.body.food_name;
    let content;
    if (req.body.content)
        content = req.body.content;
    else
        content = null;
    let reply;
    if (req.body.reply)
        reply = req.body.reply;
    else
        reply = null;
    let rate;
    if (req.body.rate)
        rate = Number(req.body.rate);
    else
        rate = null;

    const newComment = new Comment({
        cust_phone,
        res_name,
        food_name,
        content,
        reply,
        rate,
    });
    newComment.save()
    .then(() => res.json(newComment.id))
    .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/register').post((req, res) => {
  const phonenum = req.body.phonenum;
  const password = req.body.password;
  const name = req.body.name;
  const section = req.body.section;
  const address = req.body.address;
  let credit = Number(req.body.credit);
  const date = Date.parse(req.body.date);
  const this_year = Date.parse("2022-06-18T17:38:13.644Z");
  
  if (date < this_year){
      credit = 1000 + credit;
  }else
  if (Date.now() < this_year){
    credit = 1000 + credit;
  }

  const newCustomer = new Customer({
    phonenum,
    password,
    name,
    section,
    address,
    credit,
    date,
  });

  newCustomer.save()
  .then(() => res.json(newCustomer.id))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
    const phonenum = req.body.phonenum;
    const password = req.body.password;
    Customer.find({'phonenum': phonenum}, function(err,doc){
        if (err)
            res.status(400).json('Error: ' + err)
        else if(doc[0]["password"] == password)
            return res.json(doc[0]["id"]);
        else 
            return res.json("no match!");

    });
    
  });

router.route('/update').post((req, res) => {
  Customer.findById(req.body.id)
    .then(Customer => {
        if (req.body.password)
            Customer.password = req.body.password;
        if (req.body.name)
            Customer.name = req.body.name;
        if (req.body.section)
            Customer.section = req.body.section;
        if (req.body.address)
            Customer.address = req.body.address;
        if (req.body.credit)
            Customer.credit = Number(req.body.credit);
        if (req.body.date)
            Customer.date = Date.parse(req.body.date);
  
        Customer.save()
          .then(() => res.json(Customer.id))
          .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router; 