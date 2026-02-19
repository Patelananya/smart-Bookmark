'use client'

import { createClient } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { Trash2, ExternalLink, Globe } from 'lucide-react'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function BookmarkList({ user, refreshTrigger = 0 }: { user: any, refreshTrigger?: number }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    console.log('BookmarkList mounted, user ID:', user.id)
    fetchBookmarks()

    const channel = supabase
      .channel('realtime bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id, refreshTrigger])

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    // Optimistic update
    setBookmarks((prev) => prev.filter((b) => b.id !== id))

    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (error) {
        // Revert if error
        fetchBookmarks()
        throw error
      }
    } catch (error: any) {
      console.error('Error deleting bookmark:', error)
      alert(`Error deleting bookmark: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
        <Globe className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No bookmarks yet</h3>
        <p className="text-gray-500">Add your first bookmark to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200 group w-full"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-1" title={bookmark.title}>
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 group/link max-w-full"
                title={bookmark.url}
              >
                <ExternalLink size={14} className="flex-shrink-0" />
                <span className="truncate flex-1 min-w-0">{bookmark.url}</span>
              </a>
              <p className="text-xs text-gray-400 mt-2">
                Added {new Date(bookmark.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition duration-200"
              title="Delete bookmark"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
