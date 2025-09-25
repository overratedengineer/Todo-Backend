const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const user = new Schema ({
    username : String,
   password : String
});
const todo = new Schema({
    title: String,
    done: Boolean,
    id : objectId
   
})
const Usermodel = mongoose.model('users',user)
const Todomodel = mongoose.model('todos',todo)

module.exports = {
    Usermodel,
    Todomodel
}

