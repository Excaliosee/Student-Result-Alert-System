import { useEffect, useState } from 'react'
import { getResults, addResult, getStudents, getSubjects, getAdmins } from '../api'
import { PlusCircle, X } from 'lucide-react'

function Modal({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-up" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

const gradeOptions = ['A', 'B', 'C', 'D', 'F']

export default function Results() {
  const [results, setResults] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ marks: '', grade: 'A', studentId: '', subCode: '', adminId: '' })
  const [msg, setMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    Promise.all([getResults(), getStudents(), getSubjects(), getAdmins()])
      .then(([r, s, sub, a]) => { setResults(r.data); setStudents(s.data); setSubjects(sub.data); setAdmins(a.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true); setMsg(null)
    try {
      await addResult({ marks: Number(form.marks), grade: form.grade, studentId: Number(form.studentId), subCode: form.subCode, adminId: Number(form.adminId) })
      setMsg({ type: 'success', text: 'Result added! Notification triggered.' })
      setForm({ marks: '', grade: 'A', studentId: '', subCode: '', adminId: '' })
      load()
      setTimeout(() => setShowAdd(false), 1400)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Error adding result' })
    } finally { setSubmitting(false) }
  }

  return (
    <>
      <div className="topbar">
        <div><h2>Results</h2><p>{results.length} result records</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><PlusCircle /> Add Result</button>
      </div>
      <div className="page-content fade-up">
        <div className="card">
          {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Student</th><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.ResultID}>
                      <td>#{r.ResultID}</td>
                      <td>{r.StudentName || `Student #${r.StudentID}`}</td>
                      <td>{r.SubjectName || r.SubjectCode}</td>
                      <td>{r.MarksObtained}</td>
                      <td><span className={`badge ${r.Grade === 'F' ? 'badge-red' : r.Grade === 'A' ? 'badge-green' : r.Grade === 'B' ? 'badge-purple' : r.Grade === 'C' ? 'badge-teal' : 'badge-amber'}`}>{r.Grade}</span></td>
                    </tr>
                  ))}
                  {results.length === 0 && <tr><td colSpan="5" style={{textAlign:'center',padding:'24px',color:'var(--text3)'}}>No results yet</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setMsg(null) }}>
          <div className="flex-between mb-4">
            <h3>Add Result</h3>
            <button className="btn btn-ghost" style={{padding:'4px 8px'}} onClick={() => { setShowAdd(false); setMsg(null) }}><X size={14}/></button>
          </div>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleAdd}>
            <div className="form-grid single" style={{gap:14}}>
              <div className="form-group">
                <label>Student *</label>
                <select required value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})}>
                  <option value="">Select student...</option>
                  {students.map(s => <option key={s.StudentID} value={s.StudentID}>{s.StudentName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select required value={form.subCode} onChange={e => setForm({...form, subCode: e.target.value})}>
                  <option value="">Select subject...</option>
                  {subjects.map(s => <option key={s.SubjectCode} value={s.SubjectCode}>{s.SubjectName} ({s.SubjectCode})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Admin *</label>
                <select required value={form.adminId} onChange={e => setForm({...form, adminId: e.target.value})}>
                  <option value="">Select admin...</option>
                  {admins.map(a => <option key={a.AdminID} value={a.AdminID}>{a.AdminName}</option>)}
                </select>
              </div>
              <div className="form-grid" style={{gridTemplateColumns:'2fr 1fr',gap:14}}>
                <div className="form-group">
                  <label>Marks Obtained *</label>
                  <input required type="number" min="0" max="100" placeholder="0–100" value={form.marks} onChange={e => setForm({...form, marks: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Grade *</label>
                  <select required value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
                    {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <p style={{fontSize:12,color:'var(--text3)',marginTop:10}}>A notification will be auto-created via trigger on save.</p>
            <div className="flex-gap" style={{marginTop:16,justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Add Result'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
