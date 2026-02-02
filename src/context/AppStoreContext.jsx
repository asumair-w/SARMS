import { createContext, useContext, useReducer, useCallback } from 'react'
import { getInitialTasks, getInitialRecords } from '../data/assignTask'
import { getInitialInventory, getInitialEquipment } from '../data/inventory'
import { getInitialFaults, getInitialMaintenancePlans } from '../data/faults'
import { getInitialSessions } from '../data/monitorActive'
import { TASK_STATUS } from '../data/assignTask'
import { SEED_WORKERS } from '../data/engineerWorkers'

const initialState = {
  tasks: getInitialTasks(),
  records: getInitialRecords(),
  sessions: getInitialSessions(),
  inventory: getInitialInventory(),
  equipment: getInitialEquipment(),
  faults: getInitialFaults(),
  maintenancePlans: getInitialMaintenancePlans(),
}

function storeReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'UPDATE_TASK_STATUS': {
      const { taskId, status } = action.payload
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status } : t
        ),
      }
    }
    case 'ADD_RECORD':
      return { ...state, records: [action.payload, ...state.records] }
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload }
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] }
    case 'REMOVE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.payload),
      }
    case 'UPDATE_SESSION': {
      const { sessionId, updates } = action.payload
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === sessionId ? { ...s, ...updates } : s
        ),
      }
    }
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload }
    case 'UPDATE_INVENTORY_ITEM': {
      const { itemId, updates } = action.payload
      return {
        ...state,
        inventory: state.inventory.map((i) =>
          i.id === itemId ? { ...i, ...updates, lastUpdated: new Date().toISOString() } : i
        ),
      }
    }
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [action.payload, ...state.inventory] }
    case 'SET_EQUIPMENT':
      return { ...state, equipment: action.payload }
    case 'ADD_FAULT':
      return { ...state, faults: [action.payload, ...state.faults] }
    case 'ADD_MAINTENANCE_PLAN':
      return { ...state, maintenancePlans: [action.payload, ...state.maintenancePlans] }
    default:
      return state
  }
}

const AppStoreContext = createContext(null)

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  const addTask = useCallback((task) => dispatch({ type: 'ADD_TASK', payload: task }), [])
  const updateTaskStatus = useCallback((taskId, status) =>
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } }), [])

  const addRecord = useCallback((record) => dispatch({ type: 'ADD_RECORD', payload: record }), [])
  const addSession = useCallback((session) => dispatch({ type: 'ADD_SESSION', payload: session }), [])
  const removeSession = useCallback((sessionId) => dispatch({ type: 'REMOVE_SESSION', payload: sessionId }), [])
  const updateSession = useCallback((sessionId, updates) =>
    dispatch({ type: 'UPDATE_SESSION', payload: { sessionId, updates } }), [])

  const setInventory = useCallback((items) => dispatch({ type: 'SET_INVENTORY', payload: items }), [])
  const updateInventoryItem = useCallback((itemId, updates) =>
    dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { itemId, updates } }), [])
  const addInventoryItem = useCallback((item) => dispatch({ type: 'ADD_INVENTORY_ITEM', payload: item }), [])

  const addFault = useCallback((fault) => dispatch({ type: 'ADD_FAULT', payload: fault }), [])
  const addMaintenancePlan = useCallback((plan) => dispatch({ type: 'ADD_MAINTENANCE_PLAN', payload: plan }), [])

  const value = {
    ...state,
    addTask,
    updateTaskStatus,
    addRecord,
    addSession,
    removeSession,
    updateSession,
    setInventory,
    updateInventoryItem,
    addInventoryItem,
    addFault,
    addMaintenancePlan,
  }

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}

/** Resolve login userId (e.g. w1) to worker id (e.g. 1) for task assignment. */
export function getWorkerIdFromUserId(userId) {
  const w = SEED_WORKERS.find((x) => x.employeeId === userId?.trim()?.toLowerCase())
  return w?.id ?? null
}
