/**
 * Heroicons (https://heroicons.com/) – single place for icon keys and components.
 * Uses @heroicons/react/24/outline for a clean, professional look.
 */

import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  SignalIcon,
  CheckCircleIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CameraIcon,
  QrCodeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  SunIcon,
  WrenchIcon,
  Square2StackIcon,
  ListBulletIcon,
  Squares2X2Icon,
  PlayIcon,
  StopIcon,
  MinusIcon,
} from '@heroicons/react/24/outline'

/** Map of icon key (string) → Heroicon component. Used by nav, dashboard, worker flow. */
export const ICON_MAP = {
  home: HomeIcon,
  users: UserGroupIcon,
  'clipboard-document-list': ClipboardDocumentListIcon,
  signal: SignalIcon,
  'check-circle': CheckCircleIcon,
  cube: CubeIcon,
  wrench: WrenchScrewdriverIcon,
  'chart-bar': ChartBarIcon,
  'cog-6-tooth': Cog6ToothIcon,
  'bars-3': Bars3Icon,
  'x-mark': XMarkIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-left': ChevronLeftIcon,
  camera: CameraIcon,
  'qr-code': QrCodeIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  check: CheckIcon,
  sun: SunIcon,
  'wrench-simple': WrenchIcon,
  'square-2-stack': Square2StackIcon,
  'list-bullet': ListBulletIcon,
  'squares-2x2': Squares2X2Icon,
  play: PlayIcon,
  stop: StopIcon,
  minus: MinusIcon,
}

/**
 * Renders a Heroicon by key. Use for nav items, quick actions, etc.
 * @param {string} name - Key from ICON_MAP (e.g. 'home', 'users')
 * @param {string} [className] - CSS class (e.g. for size/color)
 * @param {object} [props] - Extra props (e.g. aria-hidden)
 */
export function Icon({ name, className, ...props }) {
  const Component = ICON_MAP[name]
  if (!Component) return null
  return <Component className={className} aria-hidden {...props} />
}

/** Menu (hamburger) icon for top bar */
export function MenuIcon({ open, className, ...props }) {
  const Component = open ? XMarkIcon : Bars3Icon
  return <Component className={className} aria-hidden {...props} />
}

/** Sidebar expand/collapse chevron */
export function SidebarToggleIcon({ collapsed, className, ...props }) {
  const Component = collapsed ? ChevronRightIcon : ChevronLeftIcon
  return <Component className={className} aria-hidden {...props} />
}
