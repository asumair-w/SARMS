/**
 * Worker flow: departments and tasks.
 * Icons use Heroicons keys (see components/HeroIcons.jsx).
 */

export const DEPARTMENTS = [
  { id: 'farming', labelEn: 'Farming', labelAr: 'زراعة', icon: 'sun' },
  { id: 'maintenance', labelEn: 'Maintenance', labelAr: 'صيانة', icon: 'wrench-simple' },
  { id: 'quality', labelEn: 'Quality', labelAr: 'الجودة', icon: 'check-circle' },
  { id: 'storage', labelEn: 'Storage', labelAr: 'التخزين', icon: 'cube' },
]

export const TASKS_BY_DEPARTMENT = {
  farming: [
    { id: 'harvest', labelEn: 'Harvest', labelAr: 'حصاد', icon: 'list-bullet' },
    { id: 'irrigation', labelEn: 'Irrigation', labelAr: 'ري', icon: 'list-bullet' },
    { id: 'cleaning', labelEn: 'Cleaning', labelAr: 'تنظيف', icon: 'list-bullet' },
    { id: 'planting_seeds', labelEn: 'Planting Seeds', labelAr: 'متابعة النبات', icon: 'list-bullet' },
  ],
  maintenance: [
    { id: 'watering', labelEn: 'Watering', labelAr: 'ري', icon: 'list-bullet' },
    { id: 'fixing_installations', labelEn: 'Fixing Installations', labelAr: 'إصلاح المنشآت', icon: 'list-bullet' },
    { id: 'internal_transport', labelEn: 'Internal Transport', labelAr: 'نقل داخلي', icon: 'list-bullet' },
    { id: 'harvest_maintenance', labelEn: 'Harvest (maintenance)', labelAr: 'حصاد (صيانة)', icon: 'list-bullet' },
  ],
  quality: [
    { id: 'actions', labelEn: 'Actions', labelAr: 'أعطال', icon: 'list-bullet' },
    { id: 'equipment_maintenance', labelEn: 'Equipment Maintenance', labelAr: 'صيانة معدات', icon: 'list-bullet' },
    { id: 'cleaning_cooling', labelEn: 'Cleaning & Cooling', labelAr: 'أنظمة ري، تبريد', icon: 'list-bullet' },
    { id: 'notes', labelEn: 'Notes', labelAr: 'ملاحظات', icon: 'list-bullet' },
  ],
  storage: [
    { id: 'quality_check', labelEn: 'Quality Check', labelAr: 'فحص جودة', icon: 'list-bullet' },
    { id: 'quality_notes', labelEn: 'Quality Notes', labelAr: 'ملاحظات جودة', icon: 'list-bullet' },
    { id: 'record_issues', labelEn: 'Record Issues for Production', labelAr: 'تسجيل مشاكل إنتاج', icon: 'list-bullet' },
  ],
}

export function getDepartment(id) {
  return DEPARTMENTS.find((d) => d.id === id)
}

export const ZONES = [
  { id: 'a', labelEn: 'A', labelAr: 'أ', icon: 'squares-2x2' },
  { id: 'b', labelEn: 'B', labelAr: 'ب', icon: 'squares-2x2' },
  { id: 'c', labelEn: 'C', labelAr: 'ج', icon: 'squares-2x2' },
  { id: 'd', labelEn: 'D', labelAr: 'د', icon: 'squares-2x2' },
  { id: 'inventory', labelEn: 'Inventory', labelAr: 'المخزون', icon: 'cube' },
]

export function getTasksForDepartment(departmentId) {
  return TASKS_BY_DEPARTMENT[departmentId] ?? []
}

export function getZone(id) {
  return ZONES.find((z) => z.id === id)
}
