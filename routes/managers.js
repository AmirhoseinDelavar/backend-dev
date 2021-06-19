const router = require('express').Router();
let Manager = require('../models/manager.model');


router.route('/register').post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const section = req.body.section;
  const address = req.body.address;
  const service_sections = req.body.service_sections;
  const working_hours = Date.parse(req.body.working_hours);
  const delay = Number(req.body.delay);
  const fee = Number(req.body.fee);
  const date = Date.parse(req.body.date);
  const newManager = new Manager({
    email,
    password,
    name,
    section,
    address,
    service_sections,
    working_hours,
    delay,
    fee,
    date,
  });

  newManager.save()
  .then(() => res.json(newManager.id))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Manager.find({'email': email}, function(err,doc){
        if (err)
            res.status(400).json('Error: ' + err)
        else if(doc[0]["password"] == password)
            return res.json(doc[0]["id"]);
        else 
            return res.json("no match!");

    });
    
  });

router.route('/update').post((req, res) => {
  Manager.findById(req.body.id)
    .then(Manager => {
        Manager.password = req.body.password;
        Manager.name = req.body.name;
        Manager.section = req.body.section;
        Manager.address = req.body.address;
        Manager.service_sections = req.body.service_sections;
        Manager.working_hours = Date.parse(req.body.working_hours);
        Manager.delay = Number(req.body.delay);
        Manager.fee = Number(req.body.fee);
        Manager.date = Date.parse(req.body.date);
  
        Manager.save()
          .then(() => res.json(Manager.id))
          .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;