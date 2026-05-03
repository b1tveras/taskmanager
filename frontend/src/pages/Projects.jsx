import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Modal from '../components/Modal'

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="glass-card p-6 rounded-3xl hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300 block group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Activity</p>
          <span className="text-sm font-bold text-slate-300">{project.taskCount} Tasks</span>
        </div>
      </div>

      <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors mb-2 tracking-tight">{project.name}</h3>
      {project.description && (
        <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed mb-6">{project.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
        <div className="flex -space-x-3">
          {project.members?.slice(0, 4).map(m => (
            <div key={m.id} title={m.name}
              className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 border-2 border-[#05060b] flex items-center justify-center text-[10px] text-white font-black shadow-lg">
              {m.name[0].toUpperCase()}
            </div>
          ))}
          {project.members?.length > 4 && (
            <div className="w-8 h-8 rounded-xl bg-slate-800 border-2 border-[#05060b] flex items-center justify-center text-[10px] text-slate-400 font-black">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
          Explore <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const load = () => api.get('/projects').then(r => setProjects(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await api.post('/projects', form)
      setShowCreate(false)
      setForm({ name: '', description: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Projects</h1>
          <p className="text-slate-400 font-medium">Manage and organize your team's initiatives.</p>
        </div>
        <button className="btn-primary group flex items-center gap-3 px-8" onClick={() => setShowCreate(true)}>
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-base uppercase tracking-[0.15em] font-black">New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse text-sm tracking-widest uppercase">Fetching projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card rounded-[40px] p-20 text-center border border-white/5">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[32px] mx-auto flex items-center justify-center mb-8 border border-white/10 shadow-inner rotate-3">
            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-3">No Projects Yet</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">Your workspace is currently quiet. Launch your first project to start collaborating with your team.</p>
          <button className="btn-primary px-10" onClick={() => setShowCreate(true)}>Launch First Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}

      {showCreate && (
        <Modal title="Create New Project" onClose={() => setShowCreate(false)}>
          <div className="p-2">
            <p className="text-slate-400 font-medium mb-8">Define the parameters for your new initiative.</p>
            {error && <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Project Name</label>
                <input className="input-field" placeholder="e.g. Website Redesign 2024"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Core Description</label>
                <textarea className="input-field min-h-[120px] resize-none py-4" placeholder="Briefly outline the goals and scope of this project..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" className="btn-secondary flex-1 py-4 text-xs font-black uppercase tracking-widest" onClick={() => setShowCreate(false)}>Dismiss</button>
                <button type="submit" className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest" disabled={creating}>
                  {creating ? 'Launching...' : 'Launch Project'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}

