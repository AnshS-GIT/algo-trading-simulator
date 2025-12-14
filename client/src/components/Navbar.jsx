import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        setDropdownOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        onLogout();
    };

    return (
        <>
            <nav className="sticky top-0 bg-[#1e222d] border-b border-[#2a2e39] h-12 z-50 flex items-center w-full">
                <div className="w-full px-4 h-full flex items-center justify-between">

                    {/* Left: Brand & Navigation */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">P</span>
                            </div>
                            <span className="text-md font-bold text-[#d1d4dc] group-hover:text-white transition-colors">
                                ProTrade
                            </span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center space-x-1">
                                <Link to="/" className="px-3 py-1 text-xs font-medium text-[#d1d4dc] hover:text-white hover:bg-[#2a2e39] rounded transition-all">
                                    Chart
                                </Link>
                                <Link to="/history" className="px-3 py-1 text-xs font-medium text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded transition-all">
                                    History
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Middle: Active Symbol */}
                    {user && (
                        <div className="hidden lg:flex items-center space-x-3 text-sm border-l border-r border-[#2a2e39] px-4 h-8">
                            <span className="font-mono text-white font-bold tracking-tight">AAPL</span>
                            <span className="text-[#3179f5] text-xs font-bold bg-[#3179f5]/10 px-1.5 py-0.5 rounded">1D</span>
                        </div>
                    )}

                    {/* Right: User Profile & Dropdown */}
                    <div className="flex items-center justify-end">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 focus:outline-none group hover:bg-[#2a2e39] p-1.5 rounded transition-colors"
                                >
                                    <div className="w-7 h-7 bg-[#2a2e39] rounded-full flex items-center justify-center border border-[#363a45]">
                                        <span className="text-xs font-bold text-gray-300 group-hover:text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-xs font-medium text-[#d1d4dc]">{user.name}</p>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 animate-fade-in-down overflow-hidden z-50 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-3 border-b border-gray-700 mb-2">
                                            <p className="text-sm text-white font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">user@example.com</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            Profile
                                        </Link>
                                        <Link
                                            to="/history"
                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            History
                                        </Link>
                                        <div className="h-px bg-gray-700 my-2"></div>
                                        <button
                                            onClick={handleLogoutClick}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</Link>
                                <Link to="/register" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5">Start Trading</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 max-w-sm w-full animate-scale-up">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4 mx-auto">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 text-center">Sign Out</h3>
                        <p className="text-gray-400 mb-6 text-center text-sm">Are you sure you want to end your current session?</p>
                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-5 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 transition-all"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
                @keyframes scale-up {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-up {
                    animation: scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
};

export default Navbar;
