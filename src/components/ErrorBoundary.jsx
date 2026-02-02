import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('SARMS render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            background: '#0f172a',
            color: '#f1f5f9',
          }}
        >
          <h1 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>Something went wrong</h1>
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              background: '#1e293b',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem',
              color: '#fca5a5',
            }}
          >
            {this.state.error?.message ?? String(this.state.error)}
          </pre>
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
