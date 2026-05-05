import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { registerCall } from '../api/auth';
import toast from 'react-hot-toast';
import logo from '../assets/logo-removebg-preview.png';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'doctor',
        hospital: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleToggle = (role) => {
        setFormData({ ...formData, role: role.toLowerCase() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                role: formData.role,
                hospital_name: formData.hospital,
                phone: formData.phone,
                password: formData.password,
                password2: formData.confirmPassword
            };

            await registerCall(payload);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error', error);
            const errorMsg = error.response?.data ? Object.values(error.response.data).flat()[0] : 'Registration failed';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4 py-12">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-8 md:p-12 border border-white/50">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex flex-col items-center mb-12">
                        <img src={logo} alt="MedVision AI" className="h-40 w-auto object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold text-secondary tracking-tight">Create an Account</h2>
                    <p className="text-slate-500 mt-2 font-medium">Join MedVision AI to access advanced diagnostics</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex">
                            <button
                                type="button"
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${formData.role === 'doctor' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                onClick={() => handleRoleToggle('Doctor')}
                            >
                                Doctor
                            </button>
                            <button
                                type="button"
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${formData.role === 'radiologist' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                onClick={() => handleRoleToggle('Radiologist')}
                            >
                                Radiologist
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" placeholder="Dr. John Doe" autoComplete="name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="input-field" placeholder="johndoe" autoComplete="username" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" autoComplete="email" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" placeholder="+1 (555) 000-0000" autoComplete="tel" />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Hospital / Clinic Name</label>
                            <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} required className="input-field" placeholder="General Medical Center" autoComplete="organization" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field" placeholder="••••••••" autoComplete="new-password" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field" placeholder="••••••••" autoComplete="new-password" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4 text-lg mt-6"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Create Clinical Account"
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Sign In here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
