import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search, Calendar, ChevronDown } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const getCurrentDate = () => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // Redirect to scan history with search query
            navigate(`/scans?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="px-10 py-6 flex items-center justify-between sticky top-0 z-20 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-8">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                        Dashboard
                    </h2>
                </div>
                
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)]">
                    <Calendar className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{getCurrentDate()}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="w-4 h-4 absolute left-5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search clinical records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="!pl-14 pr-6 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] text-sm w-80 shadow-sm transition-all placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative w-12 h-12 flex items-center justify-center bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[var(--error)] rounded-full border-2 border-[var(--bg-secondary)]"></span>
                    </button>
                    
                    <div className="h-12 w-[1px] bg-[var(--border)] mx-2 hidden sm:block"></div>
                    
                    <NavLink to="/profile" className="flex items-center gap-3 pl-2 group cursor-pointer">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-[var(--text-primary)] leading-none mb-1 group-hover:text-[var(--accent)] transition-colors">{user?.username || 'User'}</p>
                            <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest leading-none">Online</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] group-hover:border-[var(--accent)] transition-all">
                            <ChevronDown className="w-5 h-5 transition-transform group-hover:rotate-180" />
                        </div>
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
