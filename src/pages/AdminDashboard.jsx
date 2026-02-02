import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../i18n/translations'
import { useAppStore } from '../context/AppStoreContext'
import { Icon } from '../components/HeroIcons'
import { getInventoryStatus } from '../data/inventory'
import { INVENTORY_STATUS } from '../data/inventory'
import { TASK_STATUS } from '../data/assignTask'
import { SEED_WORKERS } from '../data/engineerWorkers'
import { getPowerBiEmbedUrl } from '../config/powerBi'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = (key) => getTranslation(lang, 'admin', key)
  const { tasks, sessions, faults, inventory } = useAppStore()
  const [analyticsTab, setAnalyticsTab] = useState('internal') // 'internal' | 'powerbi'
  const [powerBiVisible, setPowerBiVisible] = useState(true)
  const [powerBiFullscreen, setPowerBiFullscreen] = useState(false)

  const kpis = useMemo(() => {
    const activeWorkers = SEED_WORKERS.filter((w) => w.status === 'active').length
    const activeTasks = tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length
    const delayedTasks = tasks.filter(
      (t) =>
        (t.status === TASK_STATUS.APPROVED || t.status === TASK_STATUS.IN_PROGRESS) &&
        t.createdAt &&
        Date.now() - new Date(t.createdAt).getTime() > 24 * 60 * 60 * 1000
    ).length
    const openFaults = faults.length
    const inventoryAlerts = inventory.filter(
      (i) => getInventoryStatus(i) !== INVENTORY_STATUS.NORMAL
    ).length
    return {
      totalActiveWorkers: activeWorkers,
      activeTasks,
      delayedTasks,
      openFaults,
      inventoryAlerts,
    }
  }, [tasks, faults, inventory])

  const internalChartData = useMemo(() => {
    const byStatus = {
      [TASK_STATUS.PENDING_APPROVAL]: 0,
      [TASK_STATUS.APPROVED]: 0,
      [TASK_STATUS.IN_PROGRESS]: 0,
      [TASK_STATUS.COMPLETED]: 0,
    }
    tasks.forEach((t) => {
      if (byStatus[t.status] !== undefined) byStatus[t.status]++
    })
    const max = Math.max(1, ...Object.values(byStatus))
    return [
      { labelKey: 'pendingApproval', value: byStatus[TASK_STATUS.PENDING_APPROVAL], max },
      { labelKey: 'approved', value: byStatus[TASK_STATUS.APPROVED], max },
      { labelKey: 'inProgress', value: byStatus[TASK_STATUS.IN_PROGRESS], max },
      { labelKey: 'completed', value: byStatus[TASK_STATUS.COMPLETED], max },
    ]
  }, [tasks])

  const quickActions = [
    { labelKey: 'registerManageWorkers', icon: 'users', path: '/admin/register' },
  ]

  return (
    <div className={styles.page}>
      {/* 1. Top KPI Summary */}
      <section className={styles.kpiSection}>
        <h2 className={styles.sectionTitle}>{t('dashboardKpiSummary')}</h2>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiValue}>{kpis.totalActiveWorkers}</span>
            <span className={styles.kpiLabel}>{t('totalActiveWorkers')}</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiValue}>{kpis.activeTasks}</span>
            <span className={styles.kpiLabel}>{t('activeTasks')}</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiValue}>{kpis.delayedTasks}</span>
            <span className={styles.kpiLabel}>{t('delayedTasks')}</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiValue}>{kpis.openFaults}</span>
            <span className={styles.kpiLabel}>{t('openFaults')}</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiValue}>{kpis.inventoryAlerts}</span>
            <span className={styles.kpiLabel}>{t('inventoryAlerts')}</span>
          </div>
        </div>
      </section>

      {/* 2. Internal vs Power BI Tabs */}
      <section className={styles.analyticsSection}>
        <div className={styles.tabBar}>
          <button
            type="button"
            className={analyticsTab === 'internal' ? styles.tabActive : styles.tab}
            onClick={() => setAnalyticsTab('internal')}
          >
            {t('internalCharts')}
          </button>
          <button
            type="button"
            className={analyticsTab === 'powerbi' ? styles.tabActive : styles.tab}
            onClick={() => setAnalyticsTab('powerbi')}
          >
            {t('powerBiReports')}
          </button>
        </div>

        {analyticsTab === 'internal' && (
          <div className={styles.internalCharts}>
            <h3 className={styles.chartTitle}>{t('taskStatus')}</h3>
            <div className={styles.barChart}>
              {internalChartData.map(({ labelKey, value, max }) => (
                <div key={labelKey} className={styles.barRow}>
                  <span className={styles.barLabel}>{t(labelKey)}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </div>
                  <span className={styles.barValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analyticsTab === 'powerbi' && (
          <div className={styles.powerBiBlock}>
            <div className={styles.powerBiControls}>
              <button
                type="button"
                className={styles.controlBtn}
                onClick={() => setPowerBiVisible((v) => !v)}
              >
                {powerBiVisible ? t('hidePowerBi') : t('showPowerBi')}
              </button>
              {powerBiVisible && (
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={() => setPowerBiFullscreen((f) => !f)}
                >
                  {powerBiFullscreen ? t('exitFullscreen') : t('fullscreen')}
                </button>
              )}
            </div>
            {powerBiVisible && (
              <div
                className={
                  powerBiFullscreen ? styles.powerBiFrameFullscreen : styles.powerBiFrameWrap
                }
              >
                {powerBiFullscreen && (
                  <div className={styles.powerBiFullscreenBar}>
                    <button
                      type="button"
                      className={styles.controlBtn}
                      onClick={() => setPowerBiFullscreen(false)}
                    >
                      {t('exitFullscreen')}
                    </button>
                  </div>
                )}
                {getPowerBiEmbedUrl() ? (
                  <iframe
                    title="Power BI Analytics"
                    src={getPowerBiEmbedUrl()}
                    className={styles.powerBiIframe}
                    allowFullScreen
                  />
                ) : (
                  <div className={styles.powerBiPlaceholder}>
                    <p>{t('powerBiNotConfigured')}</p>
                    <p className={styles.powerBiHint}>
                      {t('powerBiHintConfig')} <code>src/config/powerBi.js</code>
                    </p>
                    <p className={styles.powerBiHint}>
                      {t('powerBiHintSteps')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. System Quick Actions */}
      <section className={styles.quickActionsSection}>
        <h2 className={styles.sectionTitle}>{t('systemQuickActions')}</h2>
        <div className={styles.quickActionsGrid}>
          {quickActions.map(({ labelKey, icon, path }) => (
            <button
              key={path}
              type="button"
              className={styles.quickActionBtn}
              onClick={() => navigate(path)}
            >
              <Icon name={icon} className={styles.quickActionIcon} />
              <span className={styles.quickActionLabel}>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
