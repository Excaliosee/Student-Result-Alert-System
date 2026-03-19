import { useEffect, useState } from 'react'
import { getDashboard, getFailingStudents, getStudents, getSubjects } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, BookOpen, ClipboardList, AlertTriangle } from 'lucide-react'

const gradeColor = { A: '#10b981', B: '#7c6dfa', C: '#f59e0b', D: '#f97316', F: '#f43f5e' }

function GradeDistChart({ data }) {
  const gradeCounts = {}
  data.forEach(r => { gradeCounts[r.Grade] = (gradeCounts[r.Grade] || 0) + 1 })
  const chartData = Object.entries(gradeCounts).map(([g, c]) => ({ grade: g, count: c }))
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} barSize={28}>
        <XAxis dataKey="grade" tick={{ fill: '#9898b0', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9898b0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, fontSize: 13 }} cursor={{ fill: 'rgba(124,109,250,0.05)' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={gradeColor[entry.grade] || '#7c6dfa'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState([])
  const [failing, setFailing] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard(), getFailingStudents(), getStudents(), getSubjects()])
      .then(([d, f, s, sub]) => {
        setDashboard(d.data)
        setFailing(f.data)
        setStudents(s.data)
        setSubjects(sub.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const pending = dashboard.filter(r => r.AlertStatus === 'Pending').length

  return (
    <>
      <div className="topbar">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of student results and activity</p>
        </div>
      </div>
      <div className="page-content">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading...</div>
        ) : (
          <div className="fade-up">
            <div className="stats-grid">
              <div className="stat-card purple">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{students.length}</div>
                <div className="stat-sub">Registered</div>
              </div>
              <div className="stat-card teal">
                <div className="stat-label">Subjects</div>
                <div className="stat-value">{subjects.length}</div>
                <div className="stat-sub">Active</div>
              </div>
              <div className="stat-card amber">
                <div className="stat-label">Results Entered</div>
                <div className="stat-value">{dashboard.length}</div>
                <div className="stat-sub">Total records</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">Failing Students</div>
                <div className="stat-value">{failing.length}</div>
                <div className="stat-sub">Needs attention</div>
              </div>
            </div>

            <div className="grid-2 mb-6">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Grade Distribution</span>
                </div>
                {dashboard.length > 0 ? <GradeDistChart data={dashboard} /> : <div className="empty"><p>No results yet</p></div>}
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Failing Students</span>
                  <span className="badge badge-red">{failing.length} at risk</span>
                </div>
                {failing.length === 0 ? (
                  <div className="empty"><p>No failing students</p></div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>ID</th><th>Email</th><th>Subject</th><th>Marks</th></tr></thead>
                      <tbody>
                        {failing.slice(0, 5).map((s, i) => (
                          <tr key={i}>
                            <td>#{s.StudentID}</td>
                            <td>{s.Email}</td>
                            <td><span className="badge badge-purple">{s.SubjectCode}</span></td>
                            <td><span className="badge badge-red">{s.MarksObtained}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent Results</span>
                <span className="badge badge-amber">{pending} pending alerts</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Student</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Alert</th><th>Time</th></tr></thead>
                  <tbody>
                    {dashboard.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td>{r.StudentName}</td>
                        <td>{r.SubjectName}</td>
                        <td>{r.MarksObtained}</td>
                        <td>
                          <span className={`badge ${r.Grade === 'F' ? 'badge-red' : r.Grade === 'A' ? 'badge-green' : 'badge-purple'}`}>
                            {r.Grade}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${r.AlertStatus === 'Success' ? 'badge-green' : r.AlertStatus === 'Failed' ? 'badge-red' : 'badge-amber'}`}>
                            {r.AlertStatus}
                          </span>
                        </td>
                        <td>{new Date(r.AlertTimeStamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {dashboard.length === 0 && <tr><td colSpan="6" style={{textAlign:'center',padding:'24px',color:'var(--text3)'}}>No results yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
