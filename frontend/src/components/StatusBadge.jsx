export default function StatusBadge({ status, overdue }) {
  if (overdue) {
    return (
      <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black rounded-md border border-rose-500/20 uppercase tracking-widest shadow-lg shadow-rose-500/5 animate-pulse">
        Critical
      </span>
    )
  }

  const s = status?.toLowerCase()
  if (s === 'todo') {
    return (
      <span className="px-2.5 py-0.5 bg-slate-500/10 text-slate-400 text-[10px] font-black rounded-md border border-slate-500/20 uppercase tracking-widest">
        Pending
      </span>
    )
  }
  if (s === 'in_progress') {
    return (
      <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-md border border-indigo-500/20 uppercase tracking-widest shadow-lg shadow-indigo-500/5">
        Active
      </span>
    )
  }
  if (s === 'done') {
    return (
      <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-md border border-emerald-500/20 uppercase tracking-widest shadow-lg shadow-emerald-500/5">
        Resolved
      </span>
    )
  }
  
  return (
    <span className="px-2.5 py-0.5 bg-slate-500/10 text-slate-400 text-[10px] font-black rounded-md border border-slate-500/20 uppercase tracking-widest">
      {status}
    </span>
  )
}

