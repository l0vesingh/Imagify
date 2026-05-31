import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

const ResetPassword = () => {
    const { backendUrl } = useContext(AppContext);
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!password || !confirmPassword) {
            toast.error("Enter all fields");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
                token,
                newPassword: password
            });

            if (data.success) {
                toast.success(data.message);
                navigate('/'); // Redirect to home page after reset
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Reset request error:", error);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border px-3 py-2 rounded mb-3"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border px-3 py-2 rounded mb-4"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />
                <button
                    onClick={handleReset}
                    disabled={loading}
                    className={`w-full py-2 rounded ${loading ? "bg-blue-400" : "bg-blue-600 text-white"}`}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;