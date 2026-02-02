import { useNavigate } from 'react-router-dom'

export default function EngineerWorkspace() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Engineer Workspace</h1>
      <p>Supervisor view – assign and review worker tasks, monitor sessions, log faults and maintenance.</p>
      <button type="button" onClick={() => navigate('/login')}>
        Log out
      </button>
    </div>
  )
}
