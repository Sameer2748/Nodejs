import cookieParser from "cookie-parser";
import  express  from "express";
import mongoose from "mongoose";
import path from "path";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';


mongoose.connect("mongodb://127.0.0.1:27017", {dbName:"Users"}).then(()=>{
    console.log("connected to mongodb");
}).catch((error)=>{
    console.log(error);
})

const usersSchema = mongoose.Schema({
    name: {type:String, require:true},
    email: String,
    password:String
})


const User = mongoose.model("user", usersSchema);

const app = express();

// use iddlewre
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended:true}))

// setting up the view engine
app.set("view engine", "ejs");


const isAuthenticated = async (req, res, next)=>{
    const {token} = req.cookies;
    if(token){

        const decoded = jwt.verify(token, "dvfvfvv")
        req.user  = await User.findById(decoded._id)
        next();
    }
    else{
        res.redirect('/login')
    }
}
// get routes
app.get("/",isAuthenticated, (req,res)=>{
    res.render('logout', {name: req.user.name});
})
app.get("/login", (req, res)=>{
    res.render("login")
})
app.get("/logout", (req, res)=>{
    res.cookie("token", null, {httpOnly:true, expires:new Date(Date.now())});
    res.redirect("/");
})
app.get("/register", (req,res)=>{
    res.render('register');
})

app.post("/login", async (req, res)=>{
    const {email,password} = req.body;
    const user =  await User.findOne({email});

    if(!user){ return  res.redirect('register')};

    const ismatch = await bcrypt.compare(password, user.password );

    if(!ismatch) return res.render("login", {email, message:"incorect password"});

    const token= jwt.sign({_id:user._id},"dvfvfvv")

    res.cookie("token",token, {httpOnly:true, expires:new Date(Date.now() + 60 * 1000)});
    res.redirect("/");


})
app.post("/register", async (req, res)=>{
    const {name, email,password} = req.body;

    const findUser = await User.findOne({email});
    if(findUser){
       return  res.redirect('login');
    }

    const hashedpassword = await bcrypt.hash(password, 10)

    const user =  await User.create({name, email, password:hashedpassword});

    const token= jwt.sign({_id:user._id},"dvfvfvv")

    res.cookie("token",token, {httpOnly:true, expires:new Date(Date.now() + 60 * 1000)});
    // res.cookie('token', 'sameer', { maxAge: 900000, httpOnly: true })
    res.redirect("/");
})


app.post("/contact", (req, res)=>{

})
app.listen(5000, ()=>{
    console.log(5000+ ' is working');
})