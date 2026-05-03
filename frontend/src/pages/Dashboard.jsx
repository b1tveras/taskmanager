import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'

function StatCard({ label, value, color, icon }) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">{label}</p>
        {icon && <div className="text-indigo-400/50 group-hover:text-indigo-400 transition-colors">{icon}</div>}
      </div>
      <p className={`text-4xl font-black tracking-tighter ${color || 'text-white'}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse text-sm tracking-widest uppercase">Loading workspace...</p>
    </div>
  )

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Hello, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400 text-lg font-medium">Welcome back! Here's the pulse of your workspace today.</p>
      </header>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
        <StatCard label="Projects" value={data?.totalProjects ?? 0} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>} />
        <StatCard label="Total Tasks" value={data?.totalTasks ?? 0} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
        <StatCard label="To Do" value={data?.todoCount ?? 0} color="text-slate-400" />
        <StatCard label="In Progress" value={data?.inProgressCount ?? 0} color="text-indigo-400" />
        <StatCard label="Completed" value={data?.doneCount ?? 0} color="text-emerald-400" />
        <StatCard label="Overdue" value={data?.overdueCount ?? 0} color="text-rose-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse" />
              Critical Overdue
            </h2>
            {data?.overdueTasks?.length > 0 && (
              <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-black rounded-full border border-rose-500/20 uppercase tracking-tighter">
                {data.overdueTasks.length} Attention Required
              </span>
            )}
          </div>
          
          <div className="glass-card rounded-3xl p-2 border border-white/5">
            {data?.overdueTasks?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {data.overdueTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="group flex items-center gap-4 p-5 hover:bg-white/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 border border-rose-500/10 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-rose-300 transition-colors">{task.title}</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                        <span className="text-rose-500/80 font-black">{task.projectName}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        Due {task.dueDate}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>


        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              Recent Updates
            </h2>
            <Link to="/projects" className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">View All Projects →</Link>
          </div>

          <div className="glass-card rounded-3xl p-2 border border-white/5">
            {data?.recentTasks?.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic">No recent activity detected.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {data?.recentTasks?.slice(0, 6).map(task => (
                  <div key={task.id} className="group flex items-center gap-4 p-5 hover:bg-white/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 border border-white/5 flex-shrink-0 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{task.title}</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">{task.projectName}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

