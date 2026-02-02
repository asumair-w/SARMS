import { useState, useMemo, useEffect } from 'react'
import {
  getSessionStatus,
  getElapsedMinutes,
  SESSION_STATUS,
  SESSION_STATUS_LABELS,
} from '../../data/monitorActive'
import { DEPARTMENT_OPTIONS } from '../../data/engineerWorkers'
import { ZONES } from '../../data/assignTask'
import { TASK_TYPES } from '../../data/assignTask'
import { useAppStore } from '../../context/AppStoreContext'
import styles from './MonitorActiveWork.module.css'

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export default function MonitorActiveWork() {
  const { sessions, updateSession } = useAppStore()
  const [filterDept, setFilterDept] = useState('')
  const [filterTaskType, setFilterTaskType] = useState('')
  const [filterZone, setFilterZone] = useState('')
  const [searchWorker, setSearchWorker] = useState('')
  const [clickedCard, setClickedCard] = useState(null)
  const [viewSession, setViewSession] = useState(null)
  const [noteSession, setNoteSession] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000)
    return () => clearInterval(interval)
  }, [])

  const now = Date.now()
  const sessionsWithStatus = useMemo(
    () =>
      sessions.map((s) => ({
        ...s,
        status: getSessionStatus(s, now),
        elapsedMinutes: getElapsedMinutes(s, now),
      })),
    [sessions, tick, now]
  )

  const filtered = useMemo(() => {
    let list = sessionsWithStatus
    if (clickedCard === 'active') list = list.filter((s) => s.status === SESSION_STATUS.ACTIVE)
    else if (clickedCard === 'delayed') list = list.filter((s) => s.status === SESSION_STATUS.DELAYED)
    else if (clickedCard === 'flagged') list = list.filter((s) => s.status === SESSION_STATUS.FLAGGED)
    if (filterDept) list = list.filter((s) => (s.departmentId || s.department?.toLowerCase()) === filterDept)
    if (filterTaskType) list = list.filter((s) => (s.taskTypeId || s.departmentId) === filterTaskType)
    if (filterZone) list = list.filter((s) => (s.zoneId || s.zone?.toLowerCase()) === filterZone)
    if (searchWorker.trim()) {
      const q = searchWorker.trim().toLowerCase()
      list = list.filter(
        (s) =>
          s.workerName?.toLowerCase().includes(q) ||
          s.workerId?.toLowerCase().includes(q)
      )
    }
    return list
  }, [sessionsWithStatus, clickedCard, filterDept, filterTaskType, filterZone, searchWorker])

  const summary = useMemo(() => {
    const active = sessionsWithStatus.filter((s) => s.status === SESSION_STATUS.ACTIVE).length
    const delayed = sessionsWithStatus.filter((s) => s.status === SESSION_STATUS.DELAYED).length
    const flagged = sessionsWithStatus.filter((s) => s.status === SESSION_STATUS.FLAGGED).length
    return {
      activeWorkers: new Set(sessionsWithStatus.map((s) => s.workerId)).size,
      activeTasks: sessionsWithStatus.length,
      delayedTasks: delayed,
      flaggedIssues: flagged,
    }
  }, [sessionsWithStatus])

  function refresh() {
    setTick((t) => t + 1)
  }

  function toggleFlag(sessionId) {
    const s = sessions.find((x) => x.id === sessionId)
    if (s) updateSession(sessionId, { flagged: !s.flagged })
    if (viewSession?.id === sessionId) setViewSession((v) => (v ? { ...v, flagged: !v.flagged } : null))
  }

  function addNote(sessionId, text) {
    if (!text.trim()) return
    const s = sessions.find((x) => x.id === sessionId)
    if (s) updateSession(sessionId, { notes: [...(s.notes || []), { at: new Date().toISOString(), text: text.trim() }] })
    setNoteSession(null)
    setNoteText('')
  }

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <div className={styles.cards}>
          <button
            type="button"
            className={`${styles.card} ${clickedCard === 'active' ? styles.cardActive : ''}`}
            onClick={() => setClickedCard(clickedCard === 'active' ? null : 'active')}
          >
            <span className={styles.cardLabel}>Active Workers</span>
            <span className={styles.cardValue}>{summary.activeWorkers}</span>
          </button>
          <button
            type="button"
            className={`${styles.card} ${clickedCard === 'tasks' ? styles.cardActive : ''}`}
            onClick={() => setClickedCard(clickedCard === 'tasks' ? null : 'tasks')}
          >
            <span className={styles.cardLabel}>Active Tasks</span>
            <span className={styles.cardValue}>{summary.activeTasks}</span>
          </button>
          <button
            type="button"
            className={`${styles.card} ${styles.cardDelayed} ${clickedCard === 'delayed' ? styles.cardActive : ''}`}
            onClick={() => setClickedCard(clickedCard === 'delayed' ? null : 'delayed')}
          >
            <span className={styles.cardLabel}>Delayed Tasks</span>
            <span className={styles.cardValue}>{summary.delayedTasks}</span>
          </button>
          <button
            type="button"
            className={`${styles.card} ${styles.cardFlagged} ${clickedCard === 'flagged' ? styles.cardActive : ''}`}
            onClick={() => setClickedCard(clickedCard === 'flagged' ? null : 'flagged')}
          >
            <span className={styles.cardLabel}>Flagged Issues</span>
            <span className={styles.cardValue}>{summary.flaggedIssues}</span>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.filtersRow}>
          <h2 className={styles.sectionTitle}>Filters</h2>
          <button type="button" className={styles.refreshBtn} onClick={refresh}>
            Refresh
          </button>
        </div>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Department</label>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
              <option value="">All</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Task Type</label>
            <select value={filterTaskType} onChange={(e) => setFilterTaskType(e.target.value)}>
              <option value="">All</option>
              {TASK_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Zone</label>
            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
              <option value="">All</option>
              {ZONES.map((z) => (
                <option key={z.id} value={z.id}>{z.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Worker (name or ID)</label>
            <input
              type="search"
              placeholder="Search..."
              value={searchWorker}
              onChange={(e) => setSearchWorker(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Active Workers</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Department</th>
                <th>Task</th>
                <th>Zone</th>
                <th>Lines / Area</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className={styles.emptyCell}>
                    No active sessions match the filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.workerName}</td>
                    <td>{s.department}</td>
                    <td>{s.task}</td>
                    <td>{s.zone}</td>
                    <td>{s.linesArea}</td>
                    <td>{new Date(s.startTime).toLocaleString()}</td>
                    <td>{formatDuration(s.elapsedMinutes)}</td>
                    <td>
                      <span className={styles.statusBadge} data-status={s.status}>
                        {SESSION_STATUS_LABELS[s.status]}
                      </span>
                    </td>
                    <td>
                      <button type="button" className={styles.actionLink} onClick={() => setViewSession(s)}>View</button>
                      {' · '}
                      <button type="button" className={styles.actionLink} onClick={() => { setNoteSession(s); setNoteText(''); }}>Note</button>
                      {' · '}
                      <button type="button" className={styles.actionLink} onClick={() => toggleFlag(s.id)}>
                        {s.flagged ? 'Unflag' : 'Flag'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* View session modal – use latest from store so notes/flag updates show */}
      {viewSession && (() => {
        const currentSession = sessions.find((s) => s.id === viewSession.id) || viewSession
        return (
        <div className={styles.modalOverlay} onClick={() => setViewSession(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Session details</h3>
            <dl className={styles.dl}>
              <dt>Worker</dt><dd>{currentSession.workerName}</dd>
              <dt>Department</dt><dd>{currentSession.department}</dd>
              <dt>Task</dt><dd>{currentSession.task}</dd>
              <dt>Zone</dt><dd>{currentSession.zone}</dd>
              <dt>Lines / Area</dt><dd>{currentSession.linesArea}</dd>
              <dt>Start Time</dt><dd>{new Date(currentSession.startTime).toLocaleString()}</dd>
              <dt>Expected</dt><dd>{currentSession.expectedMinutes} min</dd>
              <dt>Status</dt><dd><span className={styles.statusBadge} data-status={currentSession.flagged ? SESSION_STATUS.FLAGGED : getSessionStatus(currentSession)}>{SESSION_STATUS_LABELS[currentSession.flagged ? SESSION_STATUS.FLAGGED : getSessionStatus(currentSession)]}</span></dd>
              <dt>Notes</dt>
              <dd>
                {currentSession.notes?.length ? (
                  <ul className={styles.notesList}>
                    {currentSession.notes.map((n, i) => (
                      <li key={i}>{new Date(n.at).toLocaleString()}: {n.text}</li>
                    ))}
                  </ul>
                ) : '—'}
              </dd>
            </dl>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btnSecondary} onClick={() => setViewSession(null)}>Close</button>
            </div>
          </div>
        </div>
        )
      })()}

      {/* Add note modal */}
      {noteSession && (
        <div className={styles.modalOverlay} onClick={() => { setNoteSession(null); setNoteText(''); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Add note – {noteSession.workerName}</h3>
            <textarea
              className={styles.noteTextarea}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Operational note..."
              rows={4}
            />
            <div className={styles.modalActions}>
              <button type="button" className={styles.btnSecondary} onClick={() => { setNoteSession(null); setNoteText(''); }}>Cancel</button>
              <button type="button" className={styles.btnPrimary} onClick={() => addNote(noteSession.id, noteText)} disabled={!noteText.trim()}>
                Save note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
