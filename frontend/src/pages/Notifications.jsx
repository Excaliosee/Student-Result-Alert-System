import { useEffect, useState } from 'react'
import { getNotifications, markNotificationSent, archiveOldNotifications } from '../api'
import { Bell, CheckCircle, Trash2, RefreshCw } from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)
  const [archiving, setArchiving] = useState(false)

  const load = () => {
    setLoading(true)
    getNotifications()
      .then(r => setNotifications(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const markSent = async (id) => {
    try {
      await markNotificationSent(id)
      setMsg({ type: 'success', text: 'Marked as sent successfully.' })
      load()
      setTimeout(() => setMsg(null), 3000)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update notification' })
    }
  }

  const archive = async () => {
    setArchiving(true)
    try {
      const res = await archiveOldNotifications()
      const count = res.data.count
      if (count === 0) {
        setMsg({ type: 'error', text: 'No successful notifications to archive.' })
      } else {
        setMsg({ type: 'success', text: res.data.message })
        load()
      }
      setTimeout(() => setMsg(null), 3000)
    } catch (err) {
      setMsg({ type: 'error', text: 'Archive failed.' })
    } finally {
      setArchiving(false)
    }
  }

  const pending = notifications.filter(n => n.AlertStatus === 'Pending').length
  const success = notifications.filter(n => n.AlertStatus === 'Success').length
  const failed  = notifications.filter(n => n.AlertStatus === 'Failed').length

  return (
    <>
      <div className="topbar">
        <div><h2>Notifications</h2><p>{notifications.length} total alerts</p></div>
        <div className="flex-gap">
          <button className="btn btn-ghost" onClick={load}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="btn btn-danger" onClick={archive} disabled={archiving || success === 0}>
            <Trash2 size={13} /> {archiving ? 'Archiving...' : `Archive Sent (${success})`}
          </button>
        </div>
      </div>

      <div className="page-content fade-up">

        {/* Stats row */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
          <div className="stat-card amber">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pending}</div>
            <div className="stat-sub">Awaiting send</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-label">Sent</div>
            <div className="stat-value">{success}</div>
            <div className="stat-sub">Delivered</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Failed</div>
            <div className="stat-value">{failed}</div>
            <div className="stat-sub">Email errors</div>
          </div>
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="card">
          {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Result ID</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map(n => (
                    <tr key={n.AlertID}>
                      <td>#{n.AlertID}</td>
                      <td>#{n.ResultID}</td>
                      <td><span className="badge badge-teal">{n.Channel}</span></td>
                      <td>
                        <span className={`badge ${
                          n.AlertStatus === 'Success' ? 'badge-green' :
                          n.AlertStatus === 'Failed'  ? 'badge-red'   : 'badge-amber'
                        }`}>
                          {n.AlertStatus === 'Success' ? '✓ Sent' :
                           n.AlertStatus === 'Failed'  ? '✗ Failed' : '⏳ Pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text3)' }}>
                        {new Date(n.AlertTimeStamp).toLocaleString()}
                      </td>
                      <td>
                        {n.AlertStatus === 'Pending' && (
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '5px 10px', fontSize: 12 }}
                            onClick={() => markSent(n.AlertID)}
                          >
                            <CheckCircle size={12} /> Mark Sent
                          </button>
                        )}
                        {n.AlertStatus === 'Failed' && (
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '5px 10px', fontSize: 12 }}
                            onClick={() => markSent(n.AlertID)}
                          >
                            <CheckCircle size={12} /> Mark Sent
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {notifications.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>
                        No notifications yet
                      </td>
                    </tr>
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
