import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileImage, FolderOpen, FileText, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Patients', icon: Users, path: '/patients' },
        { name: 'Upload Scan', icon: FileImage, path: '/scans/upload' },
        { name: 'Scan History', icon: FolderOpen, path: '/scans' },
        { name: 'Reports', icon: FileText, path: '/reports' },
    ];

    return (
        <div className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between h-full shadow-sm">
            <div>
                <div className="p-6 flex items-center space-x-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-lg text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31" /><path d="M14 9.3V1.99" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">MedVision AI</span>
                </div>

                <nav className="mt-4 px-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-lg transition-colors group ${isActive
                                    ? 'bg-blue-50 text-primary font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] m-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-lg">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.role || 'Guest'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
