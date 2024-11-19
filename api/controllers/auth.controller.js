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

const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    if (!email || !name) {
        return next(errorHandler(400, "Email and Name are required"));
    }

    try {
        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User already exists, generate a token
            const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);

            // Exclude the password field in the response
            const { password, ...userWithoutPassword } = user._doc;

            return res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json(userWithoutPassword);
        }

        // Create a new user if they don't exist
        const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random password
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

        const newUser = new User({
            username: name.toLowerCase().replace(/\s/g, '') + Math.random().toString().slice(-4),
            email,
            password: hashedPassword,
            profilePicture: googlePhotoUrl,
        });

        await newUser.save();

        // Generate token for new user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN);

        const { password, ...newUserWithoutPassword } = newUser._doc;

        return res
            .status(201)
            .cookie('access_token', token, {
                httpOnly: true,
            })
            .json(newUserWithoutPassword);
    } catch (error) {
        next(error);
    }
};


module.exports = {signup ,signin, google};
