import { useStatsStore } from "../store/Stats.store.js";
import userAuthStore from "../store/AuthenticationStore.js";
import React, { useEffect, useRef } from "react";
import { Trophy, Target, Zap, Activity, Award } from 'lucide-react';

const StatsUI = () => {
    const { retrieveStats, UserStats } = useStatsStore();
    const { userauth } = userAuthStore();
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (userauth && !hasFetchedRef.current) {
            retrieveStats();
            hasFetchedRef.current = true;
        } else if (!userauth) {
            hasFetchedRef.current = false;
        }
    }, [userauth, retrieveStats]);

    // Compact Metric Component for the 2x2 Grid
    const MetricItem = ({ title, value, label, color }) => (
        <div className="flex flex-col">
            <p className="text-4xl font-black text-white mb-1 font-mono">
                {value}
                <span className={`text-sm ml-1 font-normal opacity-60`}>{label}</span>
            </p>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${color}`}>{title}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            <div className="max-w-2xl mx-auto px-6 py-8">

                {/* Clean Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1">
                        Welcome {userauth?.username || "Player"}
                    </h1>
                    <p className="text-sm text-gray-400">
                        Your typing performance at a glance
                    </p>
                </div>

                {/* Equal Size Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Average WPM */}
                    <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px] hover:bg-gray-800/60 transition-colors duration-200">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                <Activity size={20} className="text-blue-400" />
                            </div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Average Speed</p>
                            <p className="text-3xl font-bold text-blue-400">{Math.round(UserStats?.AverageWpm) || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">WPM</p>
                        </div>
                    </div>

                    {/* Highest WPM */}
                    <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px] hover:bg-gray-800/60 transition-colors duration-200">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                <Zap size={20} className="text-yellow-400" />
                            </div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Peak Speed</p>
                            <p className="text-3xl font-bold text-yellow-400">{Math.round(UserStats?.bestWpm) || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">WPM</p>
                        </div>
                    </div>

                    {/* Average Accuracy */}
                    <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px] hover:bg-gray-800/60 transition-colors duration-200">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                <Target size={20} className="text-green-400" />
                            </div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Accuracy</p>
                            <p className="text-3xl font-bold text-green-400">{Math.round(UserStats?.Averageaccuracy) || 0}%</p>
                            <p className="text-xs text-gray-500 mt-1">Precision</p>
                        </div>
                    </div>

                    {/* Total Multiplayer Games Won */}
                    <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-6 flex flex-col items-center justify-center min-h-[120px] hover:bg-gray-800/60 transition-colors duration-200">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                <Award size={20} className="text-purple-400" />
                            </div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Victories</p>
                            <p className="text-3xl font-bold text-purple-400">{UserStats?.TotalWins || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Games Won</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default StatsUI;