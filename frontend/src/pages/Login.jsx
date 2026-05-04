import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('dr.sharma');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Please enter both username and password');
            return;
        }

        setIsLoading(true);
        const success = await login(username, password);
        setIsLoading(false);

        if (success) {
            toast.success(`Welcome back!`);
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden flex-col md:flex-row">

                {/* Left Side - Brand & Illustration */}
                <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between hidden md:flex">
                    <div>
                        <div className="flex items-center space-x-2 space-y-4 mb-8 text-2xl font-bold">
                            <Activity className="w-8 h-8" />
                            <span>MedVision AI</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Advanced AI Diagnostics for Modern Healthcare
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Empowering doctors and radiologists with instant, accurate fracture detection and comprehensive medical reports.
                        </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md border border-white/20">
                        <p className="text-sm italic mb-4 text-white">"MedVision has reduced our diagnostic turnaround time by 60%, allowing us to treat patients faster."</p>
                        <p className="text-sm font-semibold text-blue-50">- Dr. Anjali Desai, Head of Radiology</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Please enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="Enter your username"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pr-10"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-3"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
