import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../i18n/translations'
import {
  DEPARTMENTS,
  ZONES,
  getDepartment,
  getZone,
  getTasksForDepartment,
} from '../data/workerFlow'
import { SEED_WORKERS } from '../data/engineerWorkers'
import { useAppStore } from '../context/AppStoreContext'
import { Icon } from '../components/HeroIcons'
import WorkerSettingsModal from '../components/WorkerSettingsModal'
import styles from './WorkerInterface.module.css'

const WORKER_SESSION_STORAGE_KEY = 'sarms-worker-session-'

const STEPS = {
  DEPARTMENT: 'department',
  TASK: 'task',
  ZONE: 'zone',
  LINES: 'lines',
  EXECUTION: 'execution',
  CONFIRMATION: 'confirmation',
}

function labelByLang(item, lang) {
  if (!item) return ''
  return lang === 'ar' ? (item.labelAr ?? item.labelEn) : (item.labelEn ?? item.labelAr)
}

export default function WorkerInterface() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const { addSession, removeSession } = useAppStore()
  const t = (key) => getTranslation(lang, 'worker', key)

  const userId = location.state?.userId ?? (typeof window !== 'undefined' ? sessionStorage.getItem('sarms-user-id') : null) ?? 'worker'
  const worker = useMemo(() => SEED_WORKERS.find((w) => w.employeeId === userId?.trim()?.toLowerCase()), [userId])
  const workerId = worker?.id ?? userId
  const workerName = worker?.fullName ?? userId

  const [step, setStep] = useState(STEPS.DEPARTMENT)
  const [selectedDeptId, setSelectedDeptId] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedZoneId, setSelectedZoneId] = useState(null)
  const [lineFrom, setLineFrom] = useState('')
  const [lineTo, setLineTo] = useState('')
  const [activeSession, setActiveSession] = useState(null)
  const [completedSession, setCompletedSession] = useState(null)
  const [blockMessage, setBlockMessage] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const selectedDept = useMemo(() => (selectedDeptId ? getDepartment(selectedDeptId) : null), [selectedDeptId])
  const selectedZone = useMemo(() => (selectedZoneId ? getZone(selectedZoneId) : null), [selectedZoneId])
  const tasks = useMemo(() => (selectedDeptId ? getTasksForDepartment(selectedDeptId) : []), [selectedDeptId])

  // Restore in-progress session when worker logs back in (so they can finish the task)
  useEffect(() => {
    if (!userId) return
    try {
      const raw = localStorage.getItem(WORKER_SESSION_STORAGE_KEY + userId.trim().toLowerCase())
      if (!raw) return
      const saved = JSON.parse(raw)
      if (!saved?.sessionId || !saved?.departmentId || !saved?.zoneId) return
      const dept = getDepartment(saved.departmentId)
      const zone = getZone(saved.zoneId)
      const taskList = getTasksForDepartment(saved.departmentId)
      const task = taskList?.find((t) => t.id === saved.taskId) ?? null
      if (!dept || !zone || !task) return
      setSelectedDeptId(saved.departmentId)
      setSelectedTask(task)
      setSelectedZoneId(saved.zoneId)
      setLineFrom(String(saved.lineFrom ?? ''))
      setLineTo(String(saved.lineTo ?? ''))
      setActiveSession({
        worker_id: userId,
        department: saved.departmentLabel ?? dept.labelEn,
        task: saved.taskLabel ?? task.labelEn,
        zone: saved.zoneLabel ?? zone.labelEn,
        line_from: saved.lineFrom,
        line_to: saved.lineTo,
        start_time: saved.startTime,
        status: 'in_progress',
        _sessionId: saved.sessionId,
      })
      setStep(STEPS.EXECUTION)
      setBlockMessage(null)
    } catch (_) {
      // ignore invalid stored data
    }
  }, [userId])

  function goToDepartment() {
    setStep(STEPS.DEPARTMENT)
    setSelectedDeptId(null)
    setSelectedTask(null)
    setSelectedZoneId(null)
    setLineFrom('')
    setLineTo('')
    setBlockMessage(null)
  }

  function goToTask() {
    setStep(STEPS.TASK)
    if (!activeSession) {
      setSelectedTask(null)
      setSelectedZoneId(null)
      setLineFrom('')
      setLineTo('')
    }
    setBlockMessage(null)
  }

  function goToZone() {
    setStep(STEPS.ZONE)
    if (!activeSession) {
      setSelectedZoneId(null)
      setLineFrom('')
      setLineTo('')
    }
    setBlockMessage(null)
  }

  function goToLines() {
    setStep(STEPS.LINES)
    setBlockMessage(null)
  }

  function goToExecution() {
    setStep(STEPS.EXECUTION)
    setBlockMessage(null)
  }

  function handleSelectDepartment(deptId) {
    setSelectedDeptId(deptId)
    setStep(STEPS.TASK)
  }

  function handleSelectTask(task) {
    setSelectedTask(task)
    setStep(STEPS.ZONE)
  }

  function handleSelectZone(zoneId) {
    setSelectedZoneId(zoneId)
    setStep(STEPS.LINES)
  }

  const LINE_MIN = 1
  const LINE_MAX = 20

  function handleLinesStart(e) {
    e.preventDefault()
    const fromStr = lineFrom.trim()
    const toStr = lineTo.trim()
    if (!fromStr || !toStr) {
      setBlockMessage(t('enterFromTo'))
      return
    }
    const from = parseInt(fromStr, 10)
    const to = parseInt(toStr, 10)
    if (Number.isNaN(from) || Number.isNaN(to)) {
      setBlockMessage(t('enterNumbers'))
      return
    }
    if (from < LINE_MIN || from > LINE_MAX || to < LINE_MIN || to > LINE_MAX) {
      setBlockMessage(t('linesBetween'))
      return
    }
    if (from > to) {
      setBlockMessage(t('fromLessThanTo'))
      return
    }
    setBlockMessage(null)
    setStep(STEPS.EXECUTION)
  }

  function handleStartTask() {
    if (activeSession) {
      setBlockMessage(t('activeTaskBlock'))
      return
    }
    const now = new Date().toISOString()
    const sessionId = `s-${Date.now()}`
    const deptLabel = labelByLang(selectedDept, lang)
    const taskLabel = labelByLang(selectedTask, lang)
    const zoneLabel = labelByLang(selectedZone, lang)
    const session = {
      id: sessionId,
      workerId: String(workerId),
      workerName,
      department: deptLabel,
      departmentId: selectedDeptId ?? '',
      taskTypeId: selectedDeptId ?? '',
      task: taskLabel,
      zone: zoneLabel,
      zoneId: selectedZoneId ?? '',
      linesArea: `${lineFrom.trim()}–${lineTo.trim()}`,
      startTime: now,
      expectedMinutes: 60,
      flagged: false,
      notes: [],
    }
    addSession(session)
    const active = {
      worker_id: userId,
      department: deptLabel,
      task: taskLabel,
      zone: zoneLabel,
      line_from: lineFrom.trim(),
      line_to: lineTo.trim(),
      start_time: now,
      status: 'in_progress',
      _sessionId: sessionId,
    }
    setActiveSession(active)
    setBlockMessage(null)
    // Persist so when this worker logs in again they see the in-progress task and can finish it
    try {
      localStorage.setItem(
        WORKER_SESSION_STORAGE_KEY + (userId || '').trim().toLowerCase(),
        JSON.stringify({
          sessionId,
          departmentId: selectedDeptId,
          taskId: selectedTask?.id,
          zoneId: selectedZoneId,
          lineFrom: lineFrom.trim(),
          lineTo: lineTo.trim(),
          startTime: now,
          departmentLabel: deptLabel,
          taskLabel,
          zoneLabel,
        })
      )
    } catch (_) {}
    // Return to login so other workers can use the device
    navigate('/login', { replace: true })
  }

  function handleEndTask() {
    if (!activeSession) {
      setBlockMessage(t('noActiveTask'))
      return
    }
    if (activeSession._sessionId) removeSession(activeSession._sessionId)
    try {
      localStorage.removeItem(WORKER_SESSION_STORAGE_KEY + (userId || '').trim().toLowerCase())
    } catch (_) {}
    const endTime = new Date()
    const startTime = new Date(activeSession.start_time)
    const durationMs = endTime - startTime
    const durationMins = Math.round(durationMs / 60000)
    setCompletedSession({
      ...activeSession,
      end_time: endTime.toISOString(),
      status: 'completed',
      duration: durationMins,
    })
    setActiveSession(null)
    setStep(STEPS.CONFIRMATION)
    setBlockMessage(null)
  }

  function handleLogAnother() {
    setCompletedSession(null)
    setSelectedDeptId(null)
    setSelectedTask(null)
    setSelectedZoneId(null)
    setLineFrom('')
    setLineTo('')
    setStep(STEPS.DEPARTMENT)
  }

  function handleLogOut() {
    navigate('/login', { replace: true })
  }

  function formatTime(iso) {
    try {
      return new Date(iso).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return iso
    }
  }

  const statusLabel = activeSession ? t('inProgress') : selectedTask ? t('notStarted') : '—'

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.settingsBtn}
        onClick={() => setShowSettings(true)}
        aria-label={t('settings')}
        title={t('settings')}
      >
        <span className={styles.settingsIcon}>⚙</span>
      </button>
      {showSettings && (
        <WorkerSettingsModal onClose={() => setShowSettings(false)} />
      )}
      {step === STEPS.DEPARTMENT && (
        <div className={styles.screen}>
          <p className={styles.stepBadge}>1</p>
          <h1 className={styles.screenTitle}>{t('selectDepartment')}</h1>
          <div className={styles.deptGrid}>
            {DEPARTMENTS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={styles.deptCard}
                onClick={() => handleSelectDepartment(d.id)}
              >
                <Icon name={d.icon} className={styles.deptIcon} />
                <span className={styles.deptLabel}>{labelByLang(d, lang)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === STEPS.TASK && (
        <div className={styles.screen}>
          <button type="button" className={styles.backButton} onClick={goToDepartment}>
            <Icon name={lang === 'ar' ? 'arrow-right' : 'arrow-left'} className={styles.backArrow} /> {t('back')}
          </button>
          <p className={styles.stepBadge}>2</p>
          <h1 className={styles.screenTitle}>
            <Icon name="list-bullet" className={styles.stepIcon} /> {t('selectTask')}
          </h1>
          {activeSession ? (
            <div className={styles.activeTaskBlock}>
              <p className={styles.blockMessage}>{t('activeTaskBlock')}</p>
              <button type="button" className={styles.primaryButton} onClick={goToExecution}>
                {t('backToTask')}
              </button>
            </div>
          ) : (
            <div className={styles.taskGrid}>
              {tasks.map((tsk) => (
                <button
                  key={tsk.id}
                  type="button"
                  className={styles.taskCard}
                  onClick={() => handleSelectTask(tsk)}
                >
                  <Icon name={tsk.icon ?? 'list-bullet'} className={styles.taskIcon} />
                  <span className={styles.taskLabel}>{labelByLang(tsk, lang)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === STEPS.ZONE && (
        <div className={styles.screen}>
          <button type="button" className={styles.backButton} onClick={goToTask}>
            <Icon name={lang === 'ar' ? 'arrow-right' : 'arrow-left'} className={styles.backArrow} /> {t('back')}
          </button>
          <p className={styles.stepBadge}>3</p>
          <h1 className={styles.screenTitle}>
            <Icon name="squares-2x2" className={styles.stepIcon} /> {t('selectZone')}
          </h1>
          {activeSession ? (
            <div className={styles.activeTaskBlock}>
              <p className={styles.blockMessage}>{t('activeTaskBlock')}</p>
              <button type="button" className={styles.primaryButton} onClick={goToExecution}>
                {t('backToTask')}
              </button>
            </div>
          ) : (
            <div className={styles.zoneGrid}>
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={styles.zoneCard}
                  onClick={() => handleSelectZone(z.id)}
                >
                  <Icon name={z.icon ?? 'squares-2x2'} className={styles.zoneIcon} />
                  <span className={styles.zoneLabel}>{labelByLang(z, lang)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === STEPS.LINES && (
        <div className={styles.screen}>
          <button type="button" className={styles.backButton} onClick={goToZone}>
            <Icon name={lang === 'ar' ? 'arrow-right' : 'arrow-left'} className={styles.backArrow} /> {t('back')}
          </button>
          <p className={styles.stepBadge}>4</p>
          <h1 className={styles.screenTitle}>
            <Icon name="minus" className={styles.stepIcon} /> {t('selectLines')}
          </h1>
          {activeSession ? (
            <div className={styles.activeTaskBlock}>
              <p className={styles.blockMessage}>{t('activeTaskBlock')}</p>
              <button type="button" className={styles.primaryButton} onClick={goToExecution}>
                {t('backToTask')}
              </button>
            </div>
          ) : (
            <div className={styles.linesCard}>
              <p className={styles.linesHint}>
                {t('lines1To90')}
              </p>
              <form onSubmit={handleLinesStart} className={styles.linesForm}>
                <div className={styles.linesRow}>
                  <div className={styles.linesField}>
                    <label className={styles.linesLabel} htmlFor="lineFrom">{t('from')}</label>
                    <input
                      id="lineFrom"
                      type="number"
                      min={LINE_MIN}
                      max={LINE_MAX}
                      className={styles.linesInput}
                      value={lineFrom}
                      onChange={(e) => setLineFrom(e.target.value)}
                      placeholder="1"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </div>
                  <div className={styles.linesDashWrapper}>
                    <span className={styles.linesDash} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>-</span>
                  </div>
                  <div className={styles.linesField}>
                    <label className={styles.linesLabel} htmlFor="lineTo">{t('to')}</label>
                    <input
                      id="lineTo"
                      type="number"
                      min={LINE_MIN}
                      max={LINE_MAX}
                      className={styles.linesInput}
                      value={lineTo}
                      onChange={(e) => setLineTo(e.target.value)}
                      placeholder="20"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </div>
                </div>
                {blockMessage && <p className={styles.blockMessage} role="alert">{blockMessage}</p>}
                <button type="submit" className={styles.primaryButton}>
                  {t('start')}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {step === STEPS.EXECUTION && (
        <div className={styles.screen}>
          <button type="button" className={styles.backButton} onClick={goToLines}>
            <Icon name={lang === 'ar' ? 'arrow-right' : 'arrow-left'} className={styles.backArrow} /> {t('back')}
          </button>
          <p className={styles.stepBadge}>5</p>
          <h1 className={styles.screenTitle}>
            <Icon name="play" className={styles.stepIcon} /> {t('task')}
          </h1>
          <div className={styles.executionCard}>
            <div className={styles.executionRow}>
              <span className={styles.infoLabel}>{t('department')}</span>
              <span className={styles.infoValue}>{labelByLang(selectedDept, lang)}</span>
            </div>
            <div className={styles.executionRow}>
              <span className={styles.infoLabel}>{t('task')}</span>
              <span className={styles.infoValue}>{labelByLang(selectedTask, lang)}</span>
            </div>
            <div className={styles.executionRow}>
              <span className={styles.infoLabel}>{t('zone')}</span>
              <span className={styles.infoValue}>{labelByLang(selectedZone, lang)}</span>
            </div>
            <div className={styles.executionRow}>
              <span className={styles.infoLabel}>{t('lines')}</span>
              <span className={styles.infoValue}>{lineFrom.trim()} – {lineTo.trim()}</span>
            </div>
            <div className={styles.executionRow}>
              <span className={styles.infoLabel}>{t('status')}</span>
              <span className={activeSession ? styles.statusActive : styles.statusIdle}>{statusLabel}</span>
            </div>
          </div>
          {blockMessage && <p className={styles.blockMessage} role="alert">{blockMessage}</p>}
          <div className={styles.executionActions}>
            <button type="button" className={styles.startBtn} onClick={handleStartTask}>
              <Icon name="play" className={styles.btnIcon} /> {t('startTask')}
            </button>
            <button type="button" className={styles.endBtn} onClick={handleEndTask}>
              <Icon name="stop" className={styles.btnIcon} /> {t('endTask')}
            </button>
          </div>
        </div>
      )}

      {step === STEPS.CONFIRMATION && completedSession && (
        <div className={styles.screen}>
          <p className={styles.stepBadge}><Icon name="check" className={styles.stepBadgeSvg} /></p>
          <h1 className={styles.confirmTitle}>
            <Icon name="check" className={styles.confirmIcon} /> {t('taskLogged')}
          </h1>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.infoLabel}>{t('department')}</span>
              <span>{completedSession.department}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.infoLabel}>{t('task')}</span>
              <span>{completedSession.task}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.infoLabel}>{t('zone')}</span>
              <span>{completedSession.zone}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.infoLabel}>{t('lines')}</span>
              <span>{completedSession.line_from} – {completedSession.line_to}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.infoLabel}>{t('startTime')}</span>
              <span>{formatTime(completedSession.start_time)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.infoLabel}>{t('endTime')}</span>
              <span>{formatTime(completedSession.end_time)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.infoLabel}>{t('duration')}</span>
              <span>{completedSession.duration} {t('min')}</span>
            </div>
          </div>
          <div className={styles.confirmActions}>
            <button type="button" className={styles.primaryButton} onClick={handleLogAnother}>
              {t('logAnother')}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleLogOut}>
              {t('logOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
