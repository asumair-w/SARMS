import { useState, useMemo } from 'react'
import {
  ROLE_OPTIONS,
  DEPARTMENT_OPTIONS,
  SEED_WORKERS,
  generateEmployeeId,
  generateTempPassword,
  getQRCodeUrl,
} from '../../data/engineerWorkers'
import { useAppStore } from '../../context/AppStoreContext'
import styles from './RegisterManageWorkers.module.css'

const ROLE_LABEL = Object.fromEntries(ROLE_OPTIONS.map((r) => [r.value, r.label]))
const DEPT_LABEL = Object.fromEntries(DEPARTMENT_OPTIONS.map((d) => [d.value, d.label]))

/** True if session startTime is on today (local date). */
function isSessionToday(session) {
  const start = new Date(session.startTime)
  const now = new Date()
  return start.getFullYear() === now.getFullYear() && start.getMonth() === now.getMonth() && start.getDate() === now.getDate()
}

/** Display status: inactive (disabled), active (attended today), absent (enabled but not attended today). */
function getDisplayStatus(worker, sessions) {
  if (worker.status === 'inactive') return 'inactive'
  const attendedToday = sessions.some((s) => s.workerId === worker.id && isSessionToday(s))
  return attendedToday ? 'active' : 'absent'
}

/** Engineers cannot add or assign admin; only admin can. */
function getRoleOptionsForCurrentUser() {
  try {
    const role = sessionStorage.getItem('sarms-user-role')
    if (role === 'engineer') return ROLE_OPTIONS.filter((r) => r.value !== 'admin')
  } catch {}
  return ROLE_OPTIONS
}

export default function RegisterManageWorkers() {
  const { sessions } = useAppStore()
  const roleOptions = useMemo(getRoleOptionsForCurrentUser, [])
  const [workers, setWorkers] = useState(() => [...SEED_WORKERS])
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [createdWorker, setCreatedWorker] = useState(null)
  const [selected, setSelected] = useState(null)
  const [addForm, setAddForm] = useState({ fullName: '', phone: '', email: '', nationality: '', role: 'worker', department: 'farming' })
  const [editForm, setEditForm] = useState({ fullName: '', role: 'worker', department: 'farming', status: 'active' })

  const filtered = useMemo(() => {
    let list = workers
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((w) => w.fullName.toLowerCase().includes(q) || (w.employeeId && w.employeeId.toLowerCase().includes(q)))
    }
    if (filterRole) list = list.filter((w) => w.role === filterRole)
    if (filterDept) list = list.filter((w) => w.department === filterDept)
    if (filterStatus) list = list.filter((w) => getDisplayStatus(w, sessions) === filterStatus)
    return list
  }, [workers, search, filterRole, filterDept, filterStatus, sessions])

  function openAdd() {
    setAddForm({ fullName: '', phone: '', email: '', nationality: '', role: 'worker', department: 'farming' })
    setCreatedWorker(null)
    setAddOpen(true)
  }

  function saveAdd(e) {
    e.preventDefault()
    if (!addForm.fullName.trim()) return
    const role = addForm.role
    const employeeId = generateEmployeeId(role, workers)
    const tempPassword = generateTempPassword()
    const newWorker = {
      id: String(Date.now()),
      employeeId,
      fullName: addForm.fullName.trim(),
      phone: addForm.phone.trim(),
      email: addForm.email.trim(),
      nationality: addForm.nationality.trim(),
      role,
      department: addForm.department,
      status: 'active',
      tempPassword,
      createdAt: new Date().toISOString(),
    }
    setWorkers((prev) => [newWorker, ...prev])
    setCreatedWorker(newWorker)
    setAddForm({ fullName: '', phone: '', email: '', nationality: '', role: 'worker', department: 'farming' })
  }

  function closeAdd() {
    setAddOpen(false)
    setCreatedWorker(null)
  }

  function openEdit(w) {
    setSelected(w)
    setEditForm({ fullName: w.fullName, role: w.role, department: w.department, status: w.status })
    setEditOpen(true)
  }

  function saveEdit(e) {
    e.preventDefault()
    if (!selected || !editForm.fullName.trim()) return
    const canChangeRole = roleOptions.some((r) => r.value === selected.role)
    const newRole = canChangeRole ? editForm.role : selected.role
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === selected.id
          ? { ...w, fullName: editForm.fullName.trim(), role: newRole, department: editForm.department, status: editForm.status }
          : w
      )
    )
    setEditOpen(false)
    setSelected(null)
  }

  function openView(w) {
    setSelected(w)
    setViewOpen(true)
  }

  function setStatus(w, status) {
    setWorkers((prev) => prev.map((x) => (x.id === w.id ? { ...x, status } : x)))
  }

  function updateRole(w, role) {
    setWorkers((prev) => prev.map((x) => (x.id === w.id ? { ...x, role } : x)))
  }

  function downloadQR(employeeId) {
    const url = getQRCodeUrl(employeeId, 300)
    const a = document.createElement('a')
    a.href = url
    a.download = `QR-${employeeId}.png`
    a.target = '_blank'
    a.rel = 'noopener'
    a.click()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Register & Manage Workers</h1>
        <button type="button" className={styles.addBtn} onClick={openAdd}>
          + Add Worker
        </button>
      </header>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.search}
          placeholder="Search by name or Employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={styles.filter} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All roles</option>
          {roleOptions.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select className={styles.filter} value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">All departments</option>
          {DEPARTMENT_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <select className={styles.filter} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active (attended today)</option>
          <option value="absent">Absent</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.id}>
                <td className={styles.cellId}>{w.employeeId}</td>
                <td>{w.fullName}</td>
                <td>
                  {roleOptions.some((r) => r.value === w.role) ? (
                    <select
                      className={styles.roleSelect}
                      value={w.role}
                      onChange={(e) => updateRole(w, e.target.value)}
                    >
                      {roleOptions.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span title="Only admin can change this role">{ROLE_LABEL[w.role] ?? w.role}</span>
                  )}
                </td>
                <td>{DEPT_LABEL[w.department] ?? w.department}</td>
                <td>
                  {(() => {
                    const display = getDisplayStatus(w, sessions)
                    const label = display === 'active' ? 'Active' : display === 'absent' ? 'Absent' : 'Inactive'
                    const cls = display === 'active' ? styles.badgeActive : display === 'absent' ? styles.badgeAbsent : styles.badgeInactive
                    return <span className={cls}>{label}</span>
                  })()}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button type="button" className={styles.actionBtn} onClick={() => openView(w)} title="View">
                      View
                    </button>
                    <button type="button" className={styles.actionBtn} onClick={() => openEdit(w)} title="Edit">
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtnDanger}
                      onClick={() => setStatus(w, w.status === 'active' ? 'inactive' : 'active')}
                      title={w.status === 'active' ? 'Disable' : 'Activate'}
                    >
                      {w.status === 'active' ? 'Disable' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className={styles.empty}>No workers match your filters.</p>
        )}
      </div>

      {addOpen && (
        <div className={styles.overlay} onClick={closeAdd}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h2>{createdWorker ? 'Worker created' : 'Add Worker'}</h2>
              <button type="button" className={styles.closeBtn} onClick={closeAdd} aria-label="Close">×</button>
            </div>
            {!createdWorker ? (
              <form onSubmit={saveAdd} className={styles.form}>
                <label className={styles.label}>Full Name *</label>
                <input className={styles.input} value={addForm.fullName} onChange={(e) => setAddForm((f) => ({ ...f, fullName: e.target.value }))} required />
                <label className={styles.label}>Phone</label>
                <input className={styles.input} type="tel" value={addForm.phone} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} />
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
                <label className={styles.label}>Nationality</label>
                <input className={styles.input} value={addForm.nationality} onChange={(e) => setAddForm((f) => ({ ...f, nationality: e.target.value }))} />
                <label className={styles.label}>Role</label>
                <select className={styles.input} value={addForm.role} onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <label className={styles.label}>Department</label>
                <select className={styles.input} value={addForm.department} onChange={(e) => setAddForm((f) => ({ ...f, department: e.target.value }))}>
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.primaryBtn}>Save</button>
                  <button type="button" className={styles.secondaryBtn} onClick={closeAdd}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className={styles.createdBlock}>
                <p className={styles.createdIntro}>User added. Credentials (share securely):</p>
                <div className={styles.credRow}><span className={styles.credLabel}>Employee ID</span><strong>{createdWorker.employeeId}</strong></div>
                <div className={styles.credRow}><span className={styles.credLabel}>Temporary password</span><strong>{createdWorker.tempPassword}</strong></div>
                <div className={styles.qrBlock}>
                  <p className={styles.credLabel}>QR Code (for login scan)</p>
                  <img src={getQRCodeUrl(createdWorker.employeeId)} alt={`QR for ${createdWorker.employeeId}`} className={styles.qrImage} />
                  <button type="button" className={styles.downloadQrBtn} onClick={() => downloadQR(createdWorker.employeeId)}>Download QR Code</button>
                </div>
                <button type="button" className={styles.primaryBtn} onClick={closeAdd}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {editOpen && selected && (
        <div className={styles.overlay} onClick={() => setEditOpen(false)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h2>Edit Worker</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setEditOpen(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={saveEdit} className={styles.form}>
              <label className={styles.label}>Full Name *</label>
              <input className={styles.input} value={editForm.fullName} onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))} required />
              <label className={styles.label}>Role</label>
              {roleOptions.some((r) => r.value === selected.role) ? (
                <select className={styles.input} value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              ) : (
                <div className={styles.input} style={{ opacity: 0.9 }}>{ROLE_LABEL[selected.role]} (only admin can change)</div>
              )}
              <label className={styles.label}>Department</label>
              <select className={styles.input} value={editForm.department} onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <label className={styles.label}>Status</label>
              <select className={styles.input} value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryBtn}>Save</button>
                <button type="button" className={styles.secondaryBtn} onClick={() => setEditOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewOpen && selected && (
        <div className={styles.overlay} onClick={() => setViewOpen(false)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h2>View Worker</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setViewOpen(false)} aria-label="Close">×</button>
            </div>
            <div className={styles.viewBlock}>
              <div className={styles.viewRow}><span className={styles.credLabel}>Employee ID</span><span>{selected.employeeId}</span></div>
              <div className={styles.viewRow}><span className={styles.credLabel}>Full Name</span><span>{selected.fullName}</span></div>
              <div className={styles.viewRow}><span className={styles.credLabel}>Role</span><span>{ROLE_LABEL[selected.role]}</span></div>
              <div className={styles.viewRow}><span className={styles.credLabel}>Department</span><span>{DEPT_LABEL[selected.department]}</span></div>
              <div className={styles.viewRow}>
                <span className={styles.credLabel}>Status</span>
                {(() => {
                  const display = getDisplayStatus(selected, sessions)
                  const label = display === 'active' ? 'Active' : display === 'absent' ? 'Absent' : 'Inactive'
                  const cls = display === 'active' ? styles.badgeActive : display === 'absent' ? styles.badgeAbsent : styles.badgeInactive
                  return <span className={cls}>{label}</span>
                })()}
              </div>
              <div className={styles.qrBlock}>
                <p className={styles.credLabel}>QR Code (login scan)</p>
                <img src={getQRCodeUrl(selected.employeeId)} alt={`QR for ${selected.employeeId}`} className={styles.qrImage} />
                <button type="button" className={styles.downloadQrBtn} onClick={() => downloadQR(selected.employeeId)}>Download QR Code</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
