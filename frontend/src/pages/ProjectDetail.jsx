import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'

const COLUMNS = [
  { key: 'TODO', label: 'To Do', color: 'bg-slate-500/20 text-slate-400' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-500/20 text-indigo-400' },
  { key: 'DONE', label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400' },
]

function TaskCard({ task, onUpdate, onDelete, members }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    dueDate: task.dueDate || '',
    assignedToId: task.assignedTo?.id || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, assignedToId: form.assignedToId || null }
      const { data } = await api.put(`/tasks/${task.id}`, payload)
      onUpdate(data)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div
        className={`glass-card p-5 rounded-2xl cursor-pointer hover:border-indigo-500/40 hover:bg-white/5 transition-all duration-300 group relative overflow-hidden ${task.overdue ? 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.05)]' : ''}`}
        onClick={() => setEditing(true)}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">{task.title}</h4>
            {task.assignedTo && (
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-white/10 flex items-center justify-center text-[10px] text-indigo-300 font-black flex-shrink-0" title={task.assignedTo.name}>
                {task.assignedTo.name[0].toUpperCase()}
              </div>
            )}
          </div>
          
          {task.description && <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>}
          
          <div className="flex items-center justify-between pt-2 mt-1">
            <div className="flex items-center gap-2">
              {task.overdue ? (
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black rounded-md border border-rose-500/20 uppercase tracking-tighter animate-pulse">Overdue</span>
              ) : (
                <StatusBadge status={task.status} />
              )}
            </div>
            {task.dueDate && (
              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${task.overdue ? 'text-rose-400' : 'text-slate-500'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {task.dueDate}
              </div>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <Modal title="Task Intelligence" onClose={() => setEditing(false)}>
          <div className="p-1">
            <p className="text-slate-400 font-medium mb-8 uppercase tracking-[0.2em] text-[10px]">Modify Task Parameters</p>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Objective Title</label>
                <input className="input-field" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">In-depth Description</label>
                <textarea className="input-field min-h-[100px] resize-none" rows={3} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Current Phase</label>
                  <select className="input-field appearance-none" value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Deadline</label>
                  <input type="date" className="input-field" value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Assigned Operative</label>
                <select className="input-field appearance-none" value={form.assignedToId}
                  onChange={e => setForm(f => ({ ...f, assignedToId: e.target.value }))}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" className="btn-danger flex-1 py-4 text-xs font-black uppercase tracking-widest"
                  onClick={() => { onDelete(task.id); setEditing(false) }}>
                  Eliminate
                </button>
                <button type="submit" className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest" disabled={saving}>
                  {saving ? 'Synchronizing...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'TODO', dueDate: '', assignedToId: '' })
  const [memberEmail, setMemberEmail] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [pRes, tRes] = await Promise.all([api.get(`/projects/${id}`), api.get(`/projects/${id}/tasks`)])
      setProject(pRes.data)
      setTasks(tRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await api.post(`/projects/${id}/tasks`, { ...taskForm, assignedToId: taskForm.assignedToId || null })
      setShowAddTask(false)
      setTaskForm({ title: '', description: '', status: 'TODO', dueDate: '', assignedToId: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail })
      setShowAddMember(false)
      setMemberEmail('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateTask = (updated) => {
    setTasks(ts => ts.map(t => t.id === updated.id ? updated : t))
  }

  const handleDeleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`)
    setTasks(ts => ts.filter(t => t.id !== taskId))
  }

  const isOwner = project?.owner?.id === user?.id

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse text-sm tracking-widest uppercase">Fetching board state...</p>
    </div>
  )

  if (!project) return (
    <div className="p-20 text-center glass-card rounded-3xl">
      <h2 className="text-2xl font-black text-white mb-4">Project Not Found</h2>
      <button onClick={() => navigate('/projects')} className="btn-primary">Return to Projects</button>
    </div>
  )

  return (
    <div className="animate-fade-in pb-20">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex-1 min-w-0">
          <button onClick={() => navigate('/projects')} className="group text-indigo-400 hover:text-indigo-300 text-[11px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 transition-all">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Projects
          </button>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 truncate leading-none">{project.name}</h1>
          {project.description && <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">{project.description}</p>}
        </div>
        <div className="flex items-center gap-4">
          {(isOwner || isAdmin) && (
            <button className="btn-secondary group flex items-center gap-3 px-6 h-[56px]" onClick={() => { setError(''); setShowAddMember(true) }}>
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span className="text-sm font-black uppercase tracking-widest">Collaborate</span>
            </button>
          )}
          <button className="btn-primary group flex items-center gap-3 px-8 h-[56px]" onClick={() => { setError(''); setShowAddTask(true) }}>
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            <span className="text-sm font-black uppercase tracking-widest">New Task</span>
          </button>
        </div>
      </div>


      <div className="glass-card rounded-2xl p-4 mb-12 flex items-center justify-between border border-white/5">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/10">Squad</div>
          <div className="flex -space-x-3">
            {project.members?.map(m => (
              <div key={m.id} title={`${m.name} (${m.role})`}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-[#05060b] flex items-center justify-center text-xs text-white font-black hover:scale-110 hover:z-10 transition-all cursor-default shadow-xl">
                {m.name[0].toUpperCase()}
              </div>
            ))}
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Sync status: <span className="text-emerald-400">Online</span>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          return (
            <div key={col.key} className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg ${col.color}`}>
                  {col.label}
                </div>
                <span className="text-xs font-black text-slate-500 tracking-widest">{colTasks.length}</span>
              </div>
              
              <div className="space-y-4 min-h-[500px]">
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} members={project.members || []}
                    onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
                ))}
                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[32px] group hover:border-indigo-500/10 transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 group-hover:text-slate-600 transition-colors">No Active Objectives</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>


      {showAddTask && (
        <Modal title="Initialize Objective" onClose={() => setShowAddTask(false)}>
          <div className="p-1">
            <p className="text-slate-400 font-medium mb-8 uppercase tracking-[0.2em] text-[10px]">Strategic Task Definition</p>
            {error && <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold">{error}</div>}
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Title</label>
                <input className="input-field" placeholder="Target objective..."
                  value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Specifications</label>
                <textarea className="input-field min-h-[100px] resize-none" rows={2} placeholder="Outline the requirements..."
                  value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Initial Status</label>
                  <select className="input-field appearance-none" value={taskForm.status}
                    onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Target Date</label>
                  <input type="date" className="input-field" value={taskForm.dueDate}
                    onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Assign Operator</label>
                <select className="input-field appearance-none" value={taskForm.assignedToId}
                  onChange={e => setTaskForm(f => ({ ...f, assignedToId: e.target.value }))}>
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" className="btn-secondary flex-1 py-4 text-xs font-black uppercase tracking-widest" onClick={() => setShowAddTask(false)}>Dismiss</button>
                <button type="submit" className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest" disabled={creating}>
                  {creating ? 'Initializing...' : 'Deploy Task'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {showAddMember && (
        <Modal title="Team Expansion" onClose={() => setShowAddMember(false)}>
          <div className="p-1">
            <p className="text-slate-400 font-medium mb-8 uppercase tracking-[0.2em] text-[10px]">Add Strategic Collaborator</p>
            {error && <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold">{error}</div>}
            <form onSubmit={handleAddMember} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Operative Email</label>
                <input type="email" className="input-field" placeholder="operative@network.com"
                  value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" className="btn-secondary flex-1 py-4 text-xs font-black uppercase tracking-widest" onClick={() => setShowAddMember(false)}>Dismiss</button>
                <button type="submit" className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest" disabled={creating}>
                  {creating ? 'Connecting...' : 'Authorize Operative'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}

