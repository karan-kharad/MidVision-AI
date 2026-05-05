import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { forgotPasswordCall } from '../api/auth';
import toast from 'react-hot-toast';
import logo from '../assets/logo-removebg-preview.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPasswordCall(email);
            setSubmitted(true);
            toast.success('Reset instructions sent');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7FBFF] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 border border-slate-100 animate-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-10">
                    <img src={logo} alt="MedVision AI" className="h-32 w-auto object-contain mb-8" />
                    <h2 className="text-3xl font-black text-[#0A192F] tracking-tight">Recover Password</h2>
                    <p className="text-slate-500 mt-2 font-medium text-center">
                        {submitted 
                            ? "Check your inbox for reset instructions." 
                            : "Enter your email and we'll send you a link to reset your password."}
                    </p>
                </div>

                {submitted ? (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                            <CheckCircle2 size={40} />
                        </div>
                        <Link to="/login" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                            <ArrowLeft size={18} /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field !pl-14 py-4" 
                                    placeholder="doctor@hospital.com" 
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                        </button>

                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
