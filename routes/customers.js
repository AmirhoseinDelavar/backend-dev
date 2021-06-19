const router = require('express').Router();
let Customer = require('../models/Customer.model');


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
        Customer.password = req.body.password;
        Customer.name = req.body.name;
        Customer.section = req.body.section;
        Customer.address = req.body.address;
        Customer.credit = Number(req.body.credit);
        Customer.date = Date.parse(req.body.date);
  
        Customer.save()
          .then(() => res.json(Customer.id))
          .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;