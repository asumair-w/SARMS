import { useParams, useNavigate } from 'react-router-dom'
import { SIDEBAR_ITEMS } from '../../data/engineerNav'
import styles from './EngineerSectionPlaceholder.module.css'

export default function EngineerSectionPlaceholder() {
  const { section } = useParams()
  const navigate = useNavigate()
  const path = section ? `/engineer/${section}` : '/engineer'
  const item = SIDEBAR_ITEMS.find((i) => i.path === path)
  const title = item?.label ?? (section ? section.replace(/-/g, ' ') : 'Section')

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>
        This section is under construction. Full functionality will be available in a future update.
      </p>
      <button type="button" className={styles.backBtn} onClick={() => navigate('/engineer')}>
        Back to Home
      </button>
    </div>
  )
}
