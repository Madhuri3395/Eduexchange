const express = require('express');
const wroute = express.Router();
let workermodel = require('../model/workermodel');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { storeWorkerData } = require('../workerjs/storeWorkerData');
const authMiddleware = require('../middleware/authmid');
const {validateWorker} = require('../workerjs/validateWorker')
const upload = require('../workerjs/multer'); 

wroute.get('/workersignin', async (req, res) => {
    res.render('workersignin', { errorMessage: null });
});


wroute.post('/workersignin',async(req,res)=>{
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    const result = await validateWorker(data);
    req.session.user=result.user
    console.log('haiiii')
    if (result.success) {
        req.session.loggedIn = true;
        console.log(result.user)
        res.redirect(result.redirectTo);
    } else {
        res.render('workersignin', { errorMessage: result.message });
    }
})

wroute.get('/workersignup', async (req, res) => {
    res.render('workersignup');
});

wroute.post('/workersignup', async (req, res) => {
    if (req.body.email && req.body.password) {
        req.session.email = req.body.email;
        req.session.password = await bcrypt.hash(req.body.password, 10); // Hash the password
        req.session.loggedIn = true;
        res.redirect('/workerinfo');
    } else {
        res.send('Please enter email and password');
    }
});

wroute.get('/workerinfo',authMiddleware, async (req, res) => {
    res.render('workerinfo');
});

wroute.post('/workerinfo', authMiddleware, upload.array('book_image[]', 12), async  (req, res) => {
    req.body.email = req.session.email;
    req.body.password = req.session.password;
    const result = await storeWorkerData(req, res);
    if (result.success) {
        res.redirect('/home');
    } else {
        res.send('Sorry, try again later.');
    }
});

wroute.get('/worker/:id', async (req, res) => {
    try {
      const x = await workermodel.findOne({uniqueId:req.params.id})
      const currentUser = req.session.user
      console.log('current user==>')
      console.log(currentUser.email)
      console.log('worker====>')
      console.log(x.email)
        if (!x) {
        return res.status(404).send('Worker not found');
      }
      res.render('viewmores', { x,currentUser });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


 wroute.get('/workers/:serviceType', async (req, res) => {
    const serviceType = req.params.serviceType;
    try {
        const workers = await workermodel.find({ service_type: serviceType });
        res.render('painter', { workers,serviceType});
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).send('Error fetching workers');
    }
});



 wroute.get('/sendemail',async(req,res)=>{
    res.render('sendemail')
 })

 wroute.get('/workerprofile',authMiddleware, async (req, res) => {
    if (req.session.user && req.session.user.email) {
      const worker = await workermodel.findOne({ email: req.session.user.email });
       
      if(worker){// Log to ensure data is being fetched
      res.render('profile', { worker });
      console.log(worker);}
    } else {
      res.redirect('/who');
    }
  });
  
module.exports = wroute;
