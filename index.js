const express = require('express');
const mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken');
const jwts = "hello my name is pulkit";
const {Usermodel,Todomodel} = require("./db");
const { boolean } = require('webidl-conversions');
const app = express()
mongoose.connect('mongodb+srv://use your id and password.mongodb.net/todo-app');
app.use(express.json()); 

app.post('/signup',async (req,res) =>{
   const username = req.body.username
   const password = req.body.password
  await Usermodel.create({
    username : username,
    password : password
   }) 

   res.status(200).json({
     message: "successful signup" 
    });

})
app.post('/signin',async (req,res) =>{
    const username = req.body.username
    const password = req.body.password
    const user = await Usermodel.findOne({
        username:username ,
        password : password
    })
    if (user) {
        const token = jwt.sign({
            id: user._id
        },jwts)

        res.json({
            token : token
        })
    } else {
        res.status(403).json({ 
            message: "incorrect credentials" 
        });
    }
})
 
function auth(req, res, next) {
    try {
      const token = req.headers.token;
      const decoded = jwt.verify(token, jwts);
      req.userid = decoded.id; 
      next();
    } catch (err) {
      return res.status(403).json({
        message: "invalid token"
      });
    }
  }
  
app.post('/todo',auth,async (req,res)=>{
    const userid = req.userid;
    const title =  req.body.title;
    const done = req.body.done;
    await Todomodel.create({
        title : title ,
        done : done,
        id: userid
    })
    const user = await Usermodel.findOne({ _id: userid });
 if (user) {
     res.json({
        username : user.username,
        message : "added succesfully"
    })
 } else {
    res.status(403).json({
        message : "not found"
    })
 }
   

})
app.get('/todos', auth, async (req, res) => {
    const userid = req.userid;
  
    const todos = await Todomodel.find({ id: userid });
  
    if (todos.length > 0) {
      const result = []; 
      for (let i = 0; i < todos.length; i++) {
        result.push({
          title: todos[i].title,
          done: todos[i].done
        });
      }
  
      res.json(result); 
    } else {
      res.status(404).json({
        message: "no todos found"
      });
    }
  });
  
  
app.listen(3000);

