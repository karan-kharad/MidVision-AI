import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { registerCall } from '../api/auth';
import toast from 'react-hot-toast';

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
            // Map frontend fields to backend serializer fields
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
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 md:p-12">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center space-x-2 text-primary mb-2">
                        <Activity className="w-8 h-8" />
                        <span className="text-2xl font-bold">MedVision AI</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                    <p className="text-gray-500 mt-2">Join MedVision AI to access advanced diagnostics</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                            <button
                                type="button"
                                className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${formData.role === 'doctor' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => handleRoleToggle('Doctor')}
                            >
                                Doctor
                            </button>
                            <button
                                type="button"
                                className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${formData.role === 'radiologist' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => handleRoleToggle('Radiologist')}
                            >
                                Radiologist
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" placeholder="Dr. John Doe" autoComplete="name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="input-field" placeholder="johndoe" autoComplete="username" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" autoComplete="email" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" placeholder="+1 (555) 000-0000" autoComplete="tel" />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital / Clinic Name</label>
                            <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} required className="input-field" placeholder="General Medical Center" autoComplete="organization" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field" placeholder="••••••••" autoComplete="new-password" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field" placeholder="••••••••" autoComplete="new-password" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-3 mt-6"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Sign In here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
