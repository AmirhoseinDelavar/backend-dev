const router = require('express').Router();
let Manager = require('../models/manager.model');

// router.route('/').get((req, res) => {
//   Manager.find()
//     .then(Managers => res.json(Managers))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

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

router.route('/:id').get((req, res) => {
  Manager.findById(req.params.id)
    .then(Manager => res.json(Manager))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Manager.findByIdAndDelete(req.params.id)
    .then(() => res.json('Manager deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Manager.findById(req.params.id)
    .then(Manager => {
      Manager.username = req.body.username;
      Manager.description = req.body.description;
      Manager.duration = Number(req.body.duration);
      Manager.date = Date.parse(req.body.date);

      Manager.save()
        .then(() => res.json('Manager updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;