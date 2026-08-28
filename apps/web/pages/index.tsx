import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {
  const [projectId, setProjectId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant'; content: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // Initialize: get or create a default project
  useEffect(() => {
    const stored = localStorage.getItem('binary-code-project-id')
    if (stored) {
      setProjectId(stored)
    } else {
      // Create a new project
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Default Project' }),
      })
        .then(async res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then(data => {
          if (data && data.id) {
            localStorage.setItem('binary-code-project-id', data.id)
            setProjectId(data.id)
          } else {
            // fallback to a hardcoded id for demo
            const fallbackId = 'default-project'
            localStorage.setItem('binary-code-project-id', fallbackId)
            setProjectId(fallbackId)
          }
        })
        .catch(err => {
          console.error('Failed to create project:', err)
          const fallbackId = 'default-project'
          localStorage.setItem('binary-code-project-id', fallbackId)
          setProjectId(fallbackId)
        })
    }
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || !projectId || loading) return
    const message = input.trim()
    setInput('')
    // Add user message immediately
    setMessages(prev => [...prev, {role: 'user', content: message}])
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setMessages(prev => [...prev, {role: 'assistant', content: data.response || 'No response'}])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, {role: 'assistant', content: 'Error: Failed to get response'}])
    } finally {
      setLoading(false)
    }
  }

  if (!projectId) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Código Binário - Main Chat Console</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        <header className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-400">Código Binário</h1>
          <div className="text-sm">
            Project: {projectId?.slice(0, 8)}... · Phase: ANALYSIS
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'ml-auto' : 'mr-auto'}>
              <div className={`inline-block rounded-lg px-3 py-2 mb-2 max-w-xs ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </main>
        <footer className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`bg-green-600 text-white rounded px-4 py-2 hover:bg-green-500 transition-colors disabled:opacity-50`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </footer>
      </div>
    </>
  )
}