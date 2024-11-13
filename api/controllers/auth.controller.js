const User = require("../models/user.model.js");
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs'); 

const bcrypt = require('bcryptjs'); 
const errorHandler = require("../utils/error.js");

const signup = async (req, res ,next) => {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password ) {
        next(errorHandler(400, "All fields are required" ));
    }

    try {
        
        const hashedPassword = bcrypt.hashSync(password, 10); 

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "Sign-Up Successful" });
    } catch (error) {
         next(error)
    }
};

const signin = async (req , res, next) =>{
    const {email , password} = req.body;
    if(!email || !password ){
        return next(errorHandler(400,'All Fields are required'))
       
    }
    try {
        const validUser = await User.findOne({email}) 
        if (!validUser) {
            return next(errorHandler(404,'User not found'))            
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password)
        if (!validPassword) {
            return next(errorHandler(404,'Invalid password'))
        }
        const token = jwt.sign(
            {
                id:validUser._id
            },
            process.env.JWT_TOKEN,
        );

        const {password:pass, ...rest} = validUser._doc

        res
        .status(200)
        .cookie('access_token',token,{
            httpOnly : true,
        }).json(rest);

    } catch (error) {
            next(error)
    }
}

module.exports = {signup ,signin};
