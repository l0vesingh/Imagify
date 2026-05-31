import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";


const registerUser = async (req, res)=>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success:false, message: 'Missing Details'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, 
            email, 
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success: true, token, user: {name: user.name}})
        
    } catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const loginUser = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false, message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

            res.json({success: true, token, user: {name: user.name}})
        }else{
            return res.json({success:false, message: 'Invalid credentials'})
        }

    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const userCredits = async (req, res)=> {
    try {
        const {userId} = req.body

        const user = await userModel.findById(userId)
        res.json({success: true, credits: user.creditBalance, user:
            {name: user.name}
        })
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async(req, res) =>{
    try {
        
        const {userId, planId} = req.body

        const userData = await userModel.findById(userId)

        if(!userId || !planId){
            return res.json({success: false, message: 'Missing Details'})
        }

        let credits, plan, amount, date

        switch(planId){
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;
            
             case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

             case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;

            default:
                return res.json({success: false, message: 'Plan not found '});
        }

        date: Date.now();
        const transactionData = {
            userId, plan, amount, credits, date
        }

        const newTransaction = await transactionModel.create
        (transactionData)

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id,
        }

        await razorpayInstance.orders.create(options, (error, order)=>{
            if(error){
                console.log(error);
                return res.json({sucess: false, message: error})
            }

            res.json({success: true, order})
        })

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const verifyRazorpay = async (req, res)=>{
    try{
        
        const {razorpay_order_id} = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            const transactionData = await transactionModel.
            findById(orderInfo.receipt)
            if (transactionData.payment) {
                return res.json({success: false, message: 'Payment Failed' })
            }

            const userData = await userModel.
            findById(transactionData.userId)

            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, {creditBalance})

            await transactionModel.findByIdAndUpdate(transactionData._id, 
                {payment: true})

            res.json({success: true, message: "Credits Added"})
        }else{
            res.json({success: false, message: "Payment Failed!"})
        }
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: "Email required" });

        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        // Generate JWT token for password reset (expires in 15 min)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const msg = {
            to: email,
            from: process.env.SENDGRID_VERIFIED_EMAIL, // Verified sender
            subject: 'Reset your password',
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link expires in 15 minutes.</p>`
        };

        await sgMail.send(msg);

        res.json({ success: true, message: "Reset password email sent" });
    } catch (error) {
        console.log("Forgot password error:", error);
        res.json({ success: false, message: "Server error" });
    }
};

// Reset password: update new password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.json({ success: false, message: "Missing data" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return res.json({ success: false, message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.log("Reset password error:", error);
        res.json({ success: false, message: "Invalid or expired token" });
    }
};


export {registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay, forgotPassword, resetPassword}