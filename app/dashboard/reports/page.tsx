"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { RankingSection } from "@/features/dashboard/RankingSection";
import { useCandidateStore } from "@/store/useCandidateStore";
import { Download, TrendingUp, PieChart as PieIcon } from "lucide-react";

export default function ReportsPage() {
  const store = useCandidateStore();
  const liveCandidates = store.candidates; 

  const scoreData = useMemo(() => {
    const ranges = { "90+": 0, "80-89": 0, "70-79": 0, "Below 70": 0 };
    liveCandidates.forEach(c => {
      if (c.aiScore >= 90) ranges["90+"]++;
      else if (c.aiScore >= 80) ranges["80-89"]++;
      else if (c.aiScore >= 70) ranges["70-79"]++;
      else ranges["Below 70"]++;
    });
    return Object.entries(ranges).map(([name, count]) => ({ name, count }));
  }, [liveCandidates]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    liveCandidates.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [liveCandidates]);

  const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#94a3b8"];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Talent Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time trends based on {liveCandidates.length} active candidates.</p>
        </div>
        <button 
          onClick={() => store.exportToCSV()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Download size={18} /> Export Global Data
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Score Distribution Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={20}/></div>
            <h3 className="font-bold text-gray-800 text-lg">Score Distribution</h3>
          </div>
          <div className="h-70 w-full"> {/* Fixed height from h-62.5 */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#6366f1" 
                  radius={[6, 6, 0, 0]} 
                  barSize={45} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Pipeline Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl"><PieIcon size={20}/></div>
            <h3 className="font-bold text-gray-800 text-lg">Pipeline Stages</h3>
          </div>
          <div className="h-70 w-full flex items-center justify-center"> {/* Centered layout */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={10} 
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend for clarity */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Summary Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
         <div className="flex items-center justify-between">
           <h3 className="font-bold text-gray-800 text-xl tracking-tight">Candidate Summary Report</h3>
           <div className="text-xs font-medium text-gray-400">Total Entries: {liveCandidates.length}</div>
         </div>
         <RankingSection candidates={liveCandidates} />
      </div>
    </div>
  );
}
