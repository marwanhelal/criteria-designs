'use client'

import { useState } from 'react'
import { Database } from 'lucide-react'

export default function MigrateButton() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [results, setResults] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const run = async () => {
    setState('running')
    setResults([])
    try {
      const res = await fetch('/api/migrate', { method: 'POST' })
      const data = await res.json()
      setResults(data.results ?? [])
      setState(data.success ? 'done' : 'error')
    } catch {
      setState('error')
      setResults(['Network error — check console'])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database size={18} className="text-gray-500" />
          Database Migration
        </h2>
        <button
          onClick={run}
          disabled={state === 'running'}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {state === 'running' ? 'Running…' : state === 'done' ? 'Run Again' : 'Run Migration'}
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Run this after every deployment to apply schema changes to the database.
      </p>

      {state === 'done' && (
        <p className="text-xs text-green-600 font-medium mb-2">✓ Migration completed successfully</p>
      )}
      {state === 'error' && (
        <p className="text-xs text-red-600 font-medium mb-2">✗ Migration failed — see details below</p>
      )}

      {results.length > 0 && (
        <>
          <button onClick={() => setOpen(o => !o)} className="text-xs text-gray-400 underline mb-2">
            {open ? 'Hide' : 'Show'} details ({results.length} steps)
          </button>
          {open && (
            <div className="bg-gray-50 rounded p-3 max-h-48 overflow-y-auto space-y-1">
              {results.map((r, i) => (
                <p key={i} className={`text-xs font-mono ${r.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                  {r}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
