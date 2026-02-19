'use client'

import { createClient } from '@/lib/supabaseClient'
import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'

export default function BookmarkForm({ user, onAdd }: { user: any, onAdd?: () => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return

    setLoading(true)
    try {
      const { error } = await supabase.from('bookmarks').insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ])

      if (error) throw error
      
      setTitle('')
      setUrl('')
      if (onAdd) onAdd()
    } catch (error: any) {
      console.error('Error adding bookmark:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Error adding bookmark: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit sticky top-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Plus size={20} className="text-blue-500" />
        Add New Bookmark
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Site"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}
