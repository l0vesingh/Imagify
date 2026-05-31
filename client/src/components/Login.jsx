import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const Login = () => {
    const [state, setState] = useState('Login');
    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [forgotPassword, setForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    // LOGIN / REGISTER
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const startTime = Date.now();

        try {
            if(state === 'Login'){
                const {data} = await axios.post(`${backendUrl}/api/user/login`, {email, password});
                if(data.success){
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                    toast.success("Login successful!");
                } else {
                    toast.error(data.message || "Invalid credentials");
                }
            } else {
                const {data} = await axios.post(`${backendUrl}/api/user/register`, {name, email, password});
                if(data.success){
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                    toast.success("Registration successful!");
                } else if(data.message.includes("exists")) {
                    toast.error("Email already exists");
                } else {
                    toast.error(data.message || "Registration failed");
                }
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        } finally {
            const elapsed = Date.now() - startTime;
            const minTime = 1500; // Ensure spinner shows minimum duration
            const remaining = Math.max(minTime - elapsed, 0);
            setTimeout(()=> setLoading(false), remaining);
        }
    };

    // FORGOT PASSWORD
    const handleForgotPassword = async () => {
    if(!forgotEmail) {
        toast.error("Please enter your email");
        return;
    }
    setLoading(true);
    const startTime = Date.now();
    try {
        const {data} = await axios.post(backendUrl + '/api/user/forgot-password', {email: forgotEmail});
        if(data.success){
            toast.success("Password reset email sent! Check your inbox.");
            setForgotPassword(false);
        } else {
            toast.error(data.message); // will show "Email not registered"
        }
    } catch(e){
        toast.error("Server error");
    } finally {
        const elapsed = Date.now() - startTime;
        const minTime = 2000;
        const remaining = Math.max(minTime - elapsed, 0);
        setTimeout(()=> setLoading(false), remaining);
    }
};

    // Prevent background scroll
    useEffect(()=>{
        document.body.style.overflow = 'hidden';
        return ()=>{ document.body.style.overflow = 'unset'; }
    },[]);

    return (
        <div className='fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form 
                onSubmit={onSubmitHandler}
                initial={{opacity:0.2, y:50}}
                transition={{duration:0.3}}
                whileInView={{opacity:1, y:0}}
                viewport={{once:true}}
                className='relative bg-white p-10 rounded-xl text-slate-500 z-30 w-[350px]'
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm mb-5'>Welcome! Please {state === 'Login' ? 'sign in' : 'sign up'} to continue.</p>

                {!forgotPassword && state !== 'Login' && (
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-2'>
                        <img className='w-[16px] h-[14px] filter invert-[50%] brightness-0' src={assets.user_icon} alt="user"/>
                        <input type="text" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)} 
                            className='outline-none text-sm w-full' required disabled={loading}/>
                    </div>
                )}

                {!forgotPassword && (
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                        <img src={assets.email_icon} alt="email"/>
                        <input type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} 
                            className='outline-none text-sm w-full' required disabled={loading}/>
                    </div>
                )}

                {!forgotPassword && (
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                        <img src={assets.lock_icon} alt="password"/>
                        <input type="password" placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} 
                            className='outline-none text-sm w-full' required disabled={loading}/>
                    </div>
                )}

                {!forgotPassword && <p className='text-sm text-blue-600 my-3 cursor-pointer text-right' onClick={()=>setForgotPassword(true)}>Forgot password?</p>}

                {!forgotPassword && (
                    <button type="submit" className={`w-full py-2 rounded-full text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600'}`} disabled={loading}>
                        {loading ? (state==='Login'?'Logging in...':'Creating account...') : (state==='Login'?'Login':'Sign Up')}
                    </button>
                )}

                {forgotPassword && (
                    <div className='flex flex-col gap-2 mt-4'>
                        <input type="email" placeholder='Enter your email' value={forgotEmail} 
                            onChange={e=>setForgotEmail(e.target.value)} disabled={loading} 
                            className='border px-6 py-2 rounded-full outline-none text-sm w-full'/>
                        <button onClick={handleForgotPassword} disabled={loading} 
                            className='bg-blue-600 text-white py-2 rounded-full'>
                            {loading ? "Sending..." : "Send Reset Email"}
                        </button>
                        <p className='text-sm text-blue-600 cursor-pointer text-center mt-2' onClick={()=>setForgotPassword(false)}>
                            Back to Login
                        </p>
                    </div>
                )}

                {!forgotPassword && (
                    <p className='mt-5 text-center text-sm'>
                        {state==='Login' ? "Don't have an account?" : "Already have an account?"} 
                        <span onClick={()=>!loading && setState(state==='Login'?'Sign Up':'Login')} className='text-blue-600 cursor-pointer ml-1'>
                            {state==='Login'?'Sign Up':'Login'}
                        </span>
                    </p>
                )}

                <img onClick={()=>!loading && setShowLogin(false)} src={assets.cross_icon} 
                    className='absolute top-5 right-5 cursor-pointer w-5 h-5' alt="close"/>
            </motion.form>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-white text-lg font-medium">{forgotPassword?"Sending...":"Logging in..."}</p>
                </div>
            )}
        </div>
    );
}

export default Login;