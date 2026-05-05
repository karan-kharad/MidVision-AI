import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/logo-removebg-preview.png';
import hero from '../assets/hero.png';

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
            toast.success(`Welcome back, Dr.!`);
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>

            <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-6xl flex overflow-hidden border border-white/50 relative z-10 min-h-[700px]">
                
                <div className="md:w-3/5 relative hidden md:block overflow-hidden">
                    <img src={hero} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent flex flex-col justify-end p-16 text-white">
                        <div className="animate-float">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span>Powered by Advanced AI 2.0</span>
                            </div>
                            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                                Precision Diagnostics <br/> <span className="text-primary">Redefined.</span>
                            </h1>
                            <p className="text-blue-100 text-xl leading-relaxed max-w-lg mb-10">
                                Experience the future of medical imaging with instant fracture detection and automated clinical reporting.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
                            <div>
                                <p className="text-3xl font-bold">99.2%</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">AI Accuracy</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">5s</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">Processing Time</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">50k+</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">Scans Analyzed</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-2/5 p-10 md:p-16 flex flex-col justify-center bg-white/80">
                    <div className="mb-12">
                        <div className="flex justify-start mb-14">
                            <img src={logo} alt="MedVision AI" className="h-40 w-auto object-contain" />
                        </div>
                        <h2 className="text-4xl font-bold text-secondary mb-3">Welcome Back</h2>
                        <p className="text-slate-500 text-lg font-medium">Access your clinical dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="Enter your clinical ID"
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                                <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field !pl-14 py-4"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-1">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" id="remember" />
                            <label htmlFor="remember" className="text-sm text-slate-600">Keep me logged in for this session</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 text-lg mt-4 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    Secure Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                        <p className="text-slate-600">
                            New practitioner?{' '}
                            <Link to="/register" className="text-primary font-bold hover:underline">
                                Request Access
                            </Link>
                        </p>
                        <div className="flex items-center gap-6 opacity-30 grayscale contrast-125">
                            <Zap className="w-6 h-6" />
                            <span className="text-xs font-bold tracking-widest uppercase">HIPAA Compliant</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
