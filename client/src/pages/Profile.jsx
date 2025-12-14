import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                setProfile(res.data);
            } catch (err) {
                console.error("Profile Fetch Error:", err);
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">

                {/* Header */}
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex items-center space-x-6 border border-gray-700">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold uppercase ring-4 ring-blue-500/30">
                        {profile?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            {profile?.name}
                        </h1>
                        <p className="text-gray-400">{profile?.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Joined: {new Date(profile?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Backtests Card */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Backtests</h3>
                        <p className="text-4xl font-bold text-white mt-2">{profile?.totalBacktests}</p>
                        <div className="mt-4 h-1 w-full bg-gray-700 rounded overflow-hidden">
                            <div className="h-full bg-blue-500 w-full animate-progress"></div>
                        </div>
                    </div>

                    {/* Avg ROI Card */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Average ROI</h3>
                        <p className={`text-4xl font-bold mt-2 ${profile?.avgROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profile?.avgROI}%
                        </p>
                        <div className="mt-4 h-1 w-full bg-gray-700 rounded overflow-hidden">
                            <div className={`h-full w-[${Math.min(Math.abs(profile?.avgROI), 100)}%] transition-all duration-1000 ${profile?.avgROI >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                    </div>

                    {/* Best Strategy Card */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Best Strategy</h3>
                        <p className="text-2xl font-bold text-white mt-2 capitalize truncate">
                            {profile?.bestStrategy || 'N/A'}
                        </p>
                        <div className="mt-6 flex items-center space-x-2 text-sm text-purple-400">
                            <span>Top Performer</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.6s ease-out forwards;
                    }
                    @keyframes progress {
                        from { width: 0; }
                        to { width: 100%; }
                    }
                    .animate-progress {
                        animation: progress 1s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Profile;
