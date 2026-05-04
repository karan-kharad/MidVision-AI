import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
    const { user } = useContext(AuthContext);

    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    return (
        <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Welcome back, {user?.role?.toLowerCase() === 'doctor' ? 'Dr. ' : ''}{user?.username || 'User'} 👋
                </h2>
                <p className="text-sm text-gray-500 mt-1">{getCurrentDate()}</p>
            </div>

            <div className="flex items-center space-x-6">
                <div className="relative hidden md:block">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search patients or UI..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm w-64 bg-gray-50"
                    />
                </div>

                <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
