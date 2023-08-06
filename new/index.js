import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/Users").then(()=>{
    console.log("connected to mongodb");
}).catch((error)=>{
    console.log(error);
})


const users = mongoose.Schema({
    name: {type:String, require:true},
    workout:Boolean,
    height:Number
})

const User = mongoose.model("User", users);

const adduser = async ()=>{

// const uu = await User.create({
//     name:"Krish Tyagi",
//     workout:true,
//     height:5.7
// })

}
const finduser = async ()=>{

const uu = await User.find({name:{$eq:"Nancy Tyagi"},height:{$eq:5.7}});
console.log(uu);

}



// const deleteuser = async ()=>{

// const du = await User.remove({
//     name:"Nancy Tyagi",
//     workout:true,
//     height:5.7
// })

// }

finduser();
// deleteuser();
