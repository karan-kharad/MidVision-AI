import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Smartphone, Hospital, UserCheck, Edit3, Camera, X, Loader2, Key } from 'lucide-react';
import { updateProfileCall, changePasswordCall } from '../api/auth';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const updatedUser = await updateProfileCall(data);
            setUser(updatedUser);
            setIsEditModalOpen(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (data.new_password !== data.confirm_password) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await changePasswordCall({
                old_password: data.old_password,
                new_password: data.new_password
            });
            setIsChangePasswordModalOpen(false);
            toast.success('Password changed successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const ProfileItem = ({ icon: Icon, label, value, onEdit }) => (
        <div className="flex items-center p-6 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-primary)] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--primary)] mr-6">
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{value || 'N/A'}</p>
            </div>
            <button onClick={onEdit} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                <Edit3 size={18} />
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="medical-card p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-[var(--primary)]/20 overflow-hidden transition-transform duration-500 group-hover:scale-105">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <button className="absolute bottom-2 right-2 w-12 h-12 rounded-2xl bg-white text-[var(--primary)] flex items-center justify-center shadow-lg border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white transition-all">
                            <Camera size={20} />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">
                                {user?.username || 'Medical Practitioner'}
                            </h1>
                            <span className="px-4 py-1.5 rounded-full bg-[var(--accent-soft)] text-[var(--primary)] text-xs font-black uppercase tracking-widest">
                                Verified
                            </span>
                        </div>
                        <p className="text-lg text-[var(--text-secondary)] font-medium mb-6">
                            Radiologist • MedVision AI Network
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <button onClick={() => setIsEditModalOpen(true)} className="btn-primary py-2 px-6 text-sm">
                                <Edit3 size={16} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 medical-card p-0">
                    <div className="px-8 py-6 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <User size={20} className="text-[var(--primary)]" /> Personal Information
                        </h3>
                    </div>
                    <div className="flex flex-col">
                        <ProfileItem icon={User} label="Username" value={user?.username} onEdit={() => setIsEditModalOpen(true)} />
                        <ProfileItem icon={Mail} label="Email Address" value={user?.email} onEdit={() => setIsEditModalOpen(true)} />
                        <ProfileItem icon={Smartphone} label="Phone Number" value={user?.phone || '+1 (555) 0123-456'} onEdit={() => setIsEditModalOpen(true)} />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="medical-card p-8">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                            <Shield size={20} className="text-[var(--primary)]" /> Security
                        </h3>
                        <div className="space-y-4">
                            <button 
                                onClick={() => setIsChangePasswordModalOpen(true)}
                                className="w-full py-4 px-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] hover:border-[var(--primary)] transition-all text-left flex items-center justify-between group"
                            >
                                Change Password
                                <Key size={16} className="text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl border border-[var(--border)] animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-[var(--text-primary)]">Edit Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--error)]"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Username</label>
                                <input type="text" name="username" defaultValue={user?.username} className="input-field" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Email Address</label>
                                <input type="email" name="email" defaultValue={user?.email} className="input-field" required />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                                {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isChangePasswordModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl border border-[var(--border)] animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-[var(--text-primary)]">Change Password</h2>
                            <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--error)]"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Current Password</label>
                                <input type="password" name="old_password" placeholder="••••••••" className="input-field" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">New Password</label>
                                <input type="password" name="new_password" placeholder="••••••••" className="input-field" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Confirm New Password</label>
                                <input type="password" name="confirm_password" placeholder="••••••••" className="input-field" required />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                                {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
