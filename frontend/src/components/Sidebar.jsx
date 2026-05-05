import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    FileImage, 
    FolderOpen, 
    FileText, 
    LogOut, 
    Search,
    Sun,
    Moon
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo-removebg-preview.png';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Patients', icon: Users, path: '/patients' },
        { name: 'Upload Scan', icon: FileImage, path: '/scans/upload' },
        { name: 'Scan History', icon: FolderOpen, path: '/scans' },
        { name: 'Reports', icon: FileText, path: '/reports' },
    ];

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/scans?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div 
            className={`flex flex-col h-screen transition-all duration-500 ease-in-out z-50 ${
                isCollapsed ? 'w-24' : 'w-72'
            } bg-[var(--bg-secondary)] text-[var(--text-primary)] border-r border-[var(--border)] shadow-[20px_0_40px_-20px_var(--shadow)]`}
        >
            {/* Top Logo / User Section */}
            <div className={`pt-10 pb-6 flex items-center transition-all duration-500 ${isCollapsed ? 'justify-center' : 'px-8 justify-between'}`}>
                <NavLink to="/profile" className="relative w-12 h-12 block group cursor-pointer">
                    <div className="w-full h-full rounded-2xl bg-[var(--primary)] flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                         <img src={logo} alt="L" className="w-8 h-8 object-contain invert brightness-200" />
                    </div>
                    {!isCollapsed && (
                        <div className="absolute left-16 top-0 flex flex-col whitespace-nowrap">
                            <span className="font-bold text-base tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">MedVision AI</span>
                            <span className="text-[10px] text-[var(--text-secondary)] font-medium tracking-wide">View Profile</span>
                        </div>
                    )}
                </NavLink>
            </div>

            {/* Search Bar */}
            <div className={`px-6 mb-8 transition-all duration-500 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                <div className="relative flex items-center bg-[var(--bg-primary)] rounded-2xl p-4 border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all">
                    <Search size={18} className="text-[var(--text-muted)] absolute left-4" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="bg-transparent border-none outline-none text-sm font-medium w-full !pl-10 placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                    />
                </div>
            </div>
            
            {/* Collapsed Search placeholder */}
            {isCollapsed && (
                <div className="flex justify-center mb-10">
                     <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                        <Search size={18} className="text-[var(--text-muted)]" />
                     </div>
                </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center rounded-2xl transition-all duration-300 group ${
                                isCollapsed ? 'justify-center p-4' : 'px-6 py-4'
                            } ${isActive
                                ? 'text-[var(--accent)] font-bold bg-[var(--accent-soft)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                            }`
                        }
                    >
                        <item.icon className={`transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-4'}`} />
                        {!isCollapsed && (
                            <span className="text-sm font-medium tracking-tight animate-in slide-in-from-left-2 duration-300">
                                {item.name}
                            </span>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Bottom Section: Logout & Toggle */}
            <div className="p-6 mt-auto space-y-4">
                {/* Logout Button */}
                <button
                    onClick={logout}
                    className={`w-full flex items-center transition-all duration-300 ${
                        isCollapsed ? 'justify-center' : 'px-6'
                    } py-4 text-[var(--text-secondary)] hover:text-[var(--error)] group`}
                >
                    <LogOut className={`transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-4'}`} />
                    {!isCollapsed && (
                        <span className="text-sm font-medium tracking-tight">Logout</span>
                    )}
                </button>

                {/* Theme Toggle Switch */}
                <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'px-6 justify-between'}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                            <Sun size={18} className={!isDarkMode ? 'text-[var(--accent)]' : ''} />
                            <span className="text-sm font-medium">Theme Mode</span>
                        </div>
                    )}
                    
                    <button 
                        onClick={toggleTheme}
                        className={`relative w-14 h-8 rounded-full transition-all duration-500 ${isDarkMode ? 'bg-[var(--primary)]' : 'bg-[var(--border)] shadow-inner'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-500 flex items-center justify-center ${isDarkMode ? 'left-7' : 'left-1'}`}>
                             {isDarkMode ? <Moon size={12} className="text-[var(--primary)]" /> : <Sun size={12} className="text-[var(--primary)]" />}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
