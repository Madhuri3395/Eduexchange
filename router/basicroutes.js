const express=require('express')
const broute=express.Router();
const workermodel=require('../model/workermodel')
broute.get('/',async(req,res)=>{
    res.render('homes')
})

broute.get('/who',async(req,res)=>{
    res.render("userorworker")
})

broute.get('/plumbers', async (req, res) => {
    try {
      const workers = await workermodel.find({});
      res.render('plumber', { workers });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving worker data');
    }
  });
  
broute.get('/contactus',async(req,res)=>{//contact us
  res.render('contactus')
})

broute.get('/profile', (req, res) => {
  if (req.session.user) {
    console.log(req.session.user)
    if (req.session.user.role === 'worker') {
      res.redirect('/workerprofile');
    } else {
      res.redirect('/userprofile');
    }
  } else {
    res.redirect('/who');
  }
});
broute.get('/logout',(req,res)=>{
  res.redirect('/')
})

broute.get('/aboutus',(req,res)=>{
  res.render('aboutus')
})

broute.get('/projects',(req,res)=>{
  res.render('projects')
})

broute.get('/terms',(req,res)=>
{
  res.render('terms')
})
module.exports=broute