const mysql = require("mysql");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {promisify}= require("util")


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,

});
exports.login = async(req,res)=>{
try{
    const{Email,Password}=req.body;
    if(!Email || !Password){
        return res.status(400).render('login',{msg:"Enter Your Email and Password", msg_type:"error",})
    }

    db.query('select * from details where EMAIL=?',[Email],async(error,result)=>{
        console.log(result)
        if(result.length <=0){
            return res.status(401).render("login",{
                msg: "Please Enter Your Email and Password",
                msg_type:"error",
            });
        }else{
            if(!(await bycrypt.compare(Password,result[0].PASS))){
                return res.status(401).render("login",{
                    msg: "Please Enter Your Email and Password",
                    msg_type:"error",
                });
            }else{
                const id = result[0].ID;
                const token = jwt.sign({id:id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN,
                });
                console.log("The Token is"+ token);
                const cookieOptions={
                    expires:new Date(Date.now()+
                    process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                    httpOnly:true,
                };
                res.cookie("siva",token,cookieOptions);
                res.status(200).redirect("/home");
            }
        }
            });

} catch(error){
    console.log(error)
}
};
exports.signup = (req,res)=>{
console.log(req.body)
/*const FullName = req.body.FullName;
const Email = req.body.Email;
const Password = req.body.Password;
const Confirm_Password = req.body.Confirm_Password;
 console.log(FullName);
 console.log(Email);
 console.log(Password);
 console.log(Confirm_Password)*/
const{FullName,Email,Password,Confirm_Password}=req.body;

db.query(
    "select EMAIL from details where EMAIL=?",
    [Email],
    async(error,result)=>{
        if(error){
            confirm.log(error);
        }
        if(result.length > 0){
            return res.render("register",{msg:"Email is already registered", msg_type:"error"});
        }else if(Password!==Confirm_Password){
            return res.render("register",{msg:"Password doesn't match", msg_type:"error"});
        }
        let hashedPassword = await bycrypt.hash(Password,8);
        
        db.query("insert into details set ?",{FULLNAME:FullName,EMAIL:Email,PASS:hashedPassword},
            (error,result)=>{
                if(error){
                    console.log(error)
                }else{
                    console.log(result);
                    return res.render("register",{msg:"Signup Successful", msg_type:"success"})
                }
            }
        );
    }
);

};

exports.isLoggedIn = async(req,res,next)=>{
    
    if (req.cookies.siva){
        try{
        const decode = await promisify(jwt.verify)(
            req.cookies.siva,
            process.env.JWT_SECRET
        );
        console.log(decode)
        db.query( "select * from details where ID=?",[decode.id],(error,results)=>{
            if(!results){
                return next();
            }
            req.user = results[0];
            return next();
        });
     }catch(error){
        console.log(error);
        return next();
    }
    }else{
        next();
    };

}

exports.logout = async (req,res)=>{
    res.cookie("siva","logout",{
        expires: new Date(Date.now()+2*1000),
        httpOnly:true,
    })
    res.status(200).redirect("/");
}