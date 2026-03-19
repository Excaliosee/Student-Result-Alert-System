import { useEffect, useState } from 'react'
import { getFailingStudents } from '../api'
import { AlertTriangle } from 'lucide-react'

export default function FailingStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getFailingStudents().then(r => setStudents(r.data)).finally(() => setLoading(false)) }, [])

  return (
    <>
      <div className="topbar">
        <div><h2>Failing Students</h2><p>Students with grade F</p></div>
        <span className="badge badge-red" style={{fontSize:13,padding:'6px 14px'}}><AlertTriangle size={12}/> {students.length} at risk</span>
      </div>
      <div className="page-content fade-up">
        {students.length > 0 && (
          <div className="alert alert-error" style={{marginBottom:20}}>
            {students.length} student(s) have failing grades and may require immediate attention.
          </div>
        )}
        <div className="card">
          {loading ? <div className="loading"><div className="spinner"/>Loading...</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student ID</th><th>Email</th><th>Subject</th><th>Marks</th><th>Status</th></tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i}>
                      <td>#{s.StudentID}</td>
                      <td>{s.Email}</td>
                      <td><span className="badge badge-purple">{s.SubjectCode}</span></td>
                      <td><strong style={{color:'var(--red)'}}>{s.MarksObtained}</strong></td>
                      <td><span className="badge badge-red">Failed</span></td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign:'center',padding:'32px',color:'var(--text3)'}}>
                      No failing students — great performance!
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
