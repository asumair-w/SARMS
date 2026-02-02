import { useState } from 'react'
import {
  RECORD_TYPES,
  ZONES,
  UNITS,
  QUALITY_OUTCOMES,
  SEVERITY_OPTIONS,
} from '../../data/recordEvent'
import { SEED_WORKERS } from '../../data/engineerWorkers'
import { DEPARTMENT_OPTIONS } from '../../data/engineerWorkers'
import { useAppStore } from '../../context/AppStoreContext'
import styles from './RecordProduction.module.css'

const WORKERS = SEED_WORKERS.filter((w) => w.role === 'worker' || w.role === 'engineer')
const ZONE_LABELS = Object.fromEntries(ZONES.map((z) => [z.id, z.label]))
const DEPT_LABELS = Object.fromEntries(DEPARTMENT_OPTIONS.map((d) => [d.value, d.label]))

const defaultForm = () => ({
  recordType: 'production',
  workerId: '',
  department: '',
  task: '',
  zoneId: '',
  linesArea: '',
  dateTime: new Date().toISOString().slice(0, 16),
  quantity: '',
  unit: 'kg',
  qualityOutcome: 'pass',
  severity: 'medium',
  notes: '',
})

export default function RecordProduction() {
  const { addRecord } = useAppStore()
  const [form, setForm] = useState(defaultForm())
  const [saved, setSaved] = useState(null)

  const isProduction = form.recordType === 'production'
  const isQuality = form.recordType === 'quality'
  const isFault = form.recordType === 'fault_maintenance'
  const isInventory = form.recordType === 'inventory'

  function handleSave(e) {
    e.preventDefault()
    const worker = WORKERS.find((w) => w.id === form.workerId)
    const record = {
      id: `R${Date.now()}`,
      recordType: form.recordType,
      worker: worker?.fullName ?? form.workerId,
      department: (form.department || worker?.department) ?? '',
      task: form.task,
      zone: ZONE_LABELS[form.zoneId] ?? form.zoneId,
      linesArea: form.linesArea,
      dateTime: form.dateTime,
      quantity: form.quantity,
      unit: form.unit,
      qualityOutcome: form.qualityOutcome,
      severity: form.severity,
      notes: form.notes,
      createdAt: new Date().toISOString(),
    }
    addRecord(record)
    setSaved(record)
    setForm(defaultForm())
  }

  function handleSaveAndNew(e) {
    e.preventDefault()
    const worker = WORKERS.find((w) => w.id === form.workerId)
    const record = {
      id: `R${Date.now()}`,
      recordType: form.recordType,
      worker: worker?.fullName ?? form.workerId,
      department: (form.department || worker?.department) ?? '',
      task: form.task,
      zone: ZONE_LABELS[form.zoneId] ?? form.zoneId,
      linesArea: form.linesArea,
      dateTime: form.dateTime,
      quantity: form.quantity,
      unit: form.unit,
      qualityOutcome: form.qualityOutcome,
      severity: form.severity,
      notes: form.notes,
      createdAt: new Date().toISOString(),
    }
    addRecord(record)
    setSaved(record)
    setForm({ ...defaultForm(), recordType: form.recordType })
  }

  function handleCancel() {
    setForm(defaultForm())
    setSaved(null)
  }

  function selectWorker(workerId) {
    const w = WORKERS.find((x) => x.id === workerId)
    setForm((f) => ({
      ...f,
      workerId: workerId || '',
      department: w?.department ?? f.department,
      task: f.task,
    }))
  }

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Record Event</h2>

        {/* Record type */}
        <div className={styles.formBlock}>
          <label className={styles.label}>Record Type</label>
          <select
            value={form.recordType}
            onChange={(e) => setForm((f) => ({ ...defaultForm(), recordType: e.target.value }))}
            className={styles.select}
          >
            {RECORD_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          {/* Reference */}
          <div className={styles.formBlock}>
            <h3 className={styles.subTitle}>Reference information</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Worker</label>
                <select
                  value={form.workerId}
                  onChange={(e) => selectWorker(e.target.value)}
                  required
                  className={styles.select}
                >
                  <option value="">Select worker</option>
                  {WORKERS.map((w) => (
                    <option key={w.id} value={w.id}>{w.fullName} ({w.employeeId})</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Department</label>
                <input
                  type="text"
                  value={form.department ? DEPT_LABELS[form.department] ?? form.department : ''}
                  readOnly
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Task</label>
                <input
                  type="text"
                  value={form.task}
                  onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))}
                  placeholder="Task reference"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Zone</label>
                <select
                  value={form.zoneId}
                  onChange={(e) => setForm((f) => ({ ...f, zoneId: e.target.value }))}
                  required
                  className={styles.select}
                >
                  <option value="">Select zone</option>
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>{z.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Lines / Area range</label>
                <input
                  type="text"
                  value={form.linesArea}
                  onChange={(e) => setForm((f) => ({ ...f, linesArea: e.target.value }))}
                  placeholder="e.g. 5–8"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Date &amp; time</label>
                <input
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Event details by type */}
          <div className={styles.formBlock}>
            <h3 className={styles.subTitle}>Event details</h3>
            {isProduction && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Quantity produced</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label>Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    className={styles.select}
                  >
                    {UNITS.map((u) => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {isQuality && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Quality status / outcome</label>
                  <select
                    value={form.qualityOutcome}
                    onChange={(e) => setForm((f) => ({ ...f, qualityOutcome: e.target.value }))}
                    className={styles.select}
                  >
                    {QUALITY_OUTCOMES.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Severity (optional)</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
                    className={styles.select}
                  >
                    {SEVERITY_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {(isFault || isInventory) && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Quantity / value (optional)</label>
                  <input
                    type="text"
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="As applicable"
                    className={styles.input}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className={styles.formBlock}>
            <label className={styles.label}>Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Operational or quality remarks"
              className={styles.textarea}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className={styles.btnSecondary} onClick={handleSaveAndNew}>
              Save &amp; New
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Save record
            </button>
          </div>
        </form>

        {saved && (
          <div className={styles.savedBanner}>
            Record saved: {saved.id} – {saved.recordType} at {new Date(saved.dateTime).toLocaleString()}
          </div>
        )}
      </section>
    </div>
  )
}
