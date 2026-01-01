import { useStatsStore } from "../store/Stats.store.js";
import userAuthStore from "../store/AuthenticationStore.js";
import React from 'react';
import { useEffect, useRef } from "react";
import { Trophy, Target, Zap, Activity, Award } from 'lucide-react';

const StatsUI=()=>
{

    const {retrieveStats,UserStats} =useStatsStore();
    const {userauth} = userAuthStore();
    const hasFetchedRef = useRef(false);

    useEffect(()=>
        {
            if (userauth && !hasFetchedRef.current) {
                retrieveStats();
                hasFetchedRef.current = true;
            } else if (!userauth) {
                hasFetchedRef.current = false;
            }
        },[userauth])
    const StatsCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-[#0f0f0f] border border-zinc-800 p-6 rounded-xl hover:border-yellow-500/50 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-zinc-900 ${color} group-hover:scale-110 transition-transform`}>
              <Icon size={24} />
            </div>
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Live Metrics</span>
          </div>
          <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white tracking-tight">
            {value}<span className="text-zinc-600 text-sm ml-1 font-normal">{title.includes('Wpm') ? 'wpm' : title.includes('accuracy') ? '%' : ''}</span>
          </p>
        </div>
      );

    return <>
    <div className="max-w-6xl mx-auto p-8 bg-black min-h-screen text-white">
      
      <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-8">
        <div className="h-16 w-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <Trophy size={32} className="text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase italic">Player Performance</h1>
          <p className="text-zinc-500 text-sm">Real-time statistics from your racing history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Best WPM"
          value={Math.round(UserStats?.bestWpm) || 0}
          icon={Zap}
          color="text-yellow-500"
        />
        <StatsCard
          title="Average WPM"
          value={Math.round(UserStats?.AverageWpm)|| 0}
          icon={Activity}
          color="text-blue-400"
        />
        <StatsCard
          title="Average Accuracy"
          value={Math.round(UserStats?.Averageaccuracy) || 0}
          icon={Target}
          color="text-green-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#111] to-black border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 p-3 rounded-full text-zinc-400">
              <Award size={24} />
            </div>
            <div>
              <p className="text-zinc-500 text-sm">Total Tests Completed</p>
              <p className="text-2xl font-bold">{UserStats?.TotalTests || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#111] to-black border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-zinc-500 text-sm">Total Race Victories</p>
              <p className="text-2xl font-bold">{UserStats?.TotalWins || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
}
export default StatsUI;