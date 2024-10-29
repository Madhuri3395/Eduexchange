const express = require('express');
const sroute = express.Router();
let sellermodel = require('../model/workermodel');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { storeWorkerData } = require('../workerjs/storeWorkerData');
const authMiddleware = require('../middleware/authmid');
const {validateWorker} = require('../workerjs/validateWorker')
const upload = require('../workerjs/multer'); 

sroute.get('/sellersignin', async (req, res) => {
    res.render('workersignin', { errorMessage: null });
});


sroute.post('/sellersignin',async(req,res)=>{
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

sroute.get('/sellersignup', async (req, res) => {
    res.render('workersignup');
});

sroute.post('/sellersignup', async (req, res) => {
    if (req.body.email && req.body.password) {
        req.session.email = req.body.email;
        req.session.password = await bcrypt.hash(req.body.password, 10); // Hash the password
        req.session.loggedIn = true;
        res.redirect('/sellerinfo');
    } else {
        res.send('Please enter email and password');
    }
});

sroute.get('/sellerinfo',authMiddleware, async (req, res) => {
    res.render('workerinfo');
});

sroute.post('/sellerinfo', authMiddleware, upload.array('book_image[]', 12), async (req, res) => {
  req.body.email = req.session.email;
  req.body.password = req.session.password;
  const result = await storeWorkerData(req, res);
  if (result.success) {
    res.redirect('/home');
  } else {
    res.send('Sorry, try again later.');
  }
});


sroute.get('/seller/:id', async (req, res) => {
    try {
      const x = await sellermodel.findOne({uniqueId:req.params.id})
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

  sroute.post('/sold', async (req, res) => {
    try {
      const bookId = req.body.bookId;
      const worker = await sellermodel.findOneAndUpdate(
        { 'books._id': bookId },
        { $set: { 'books.$.sold': 'yes' } },
        { new: true }
      );
      res.redirect('back'); // Redirect back to the previous page
    } catch (error) {
      console.error('Error updating book status:', error);
      res.status(500).send('Error updating book status');
    }
  });
  

 sroute.get('/sellers/:category', async (req, res) => {
  const category = req.params.category;

  try {
    // Use the correct path to books.category for filtering
    const sellers = await sellermodel.find({ 'books.category': category });
    res.render('painter', {sellers, category });
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).send('Error fetching workers');
  }
});



 sroute.get('/sendemail',async(req,res)=>{
    res.render('sendemail')
 })

 sroute.get('/sellerprofile',authMiddleware, async (req, res) => {
    if (req.session.user && req.session.user.email) {
      const users = await sellermodel.findOne({ email: req.session.user.email });
       
      if(users){// Log to ensure data is being fetched
      res.render('profile', { users });
      console.log(users);}
    } else {
      res.redirect('/who');
    }
  });
  
module.exports = sroute;
