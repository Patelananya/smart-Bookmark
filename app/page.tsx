'use client'

import BookmarkList from '@/components/BookmarkList'
import BookmarkForm from '@/components/BookmarkForm'
import SignOutButton from '@/components/SignOutButton'
import { createClient } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [supabase, router])

  if (!user) return null

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔖</span>
            <h1 className="text-2xl font-bold text-gray-800">Smart Bookmarks</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline-block truncate max-w-[200px]" title={user.email}>
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </header>
        
        <div className="grid gap-8 lg:grid-cols-[350px_1fr] items-start">
           <div className="w-full">
             <BookmarkForm user={user} onAdd={() => setRefreshTrigger(prev => prev + 1)} />
           </div>
           <div className="w-full overflow-hidden">
             <BookmarkList user={user} refreshTrigger={refreshTrigger} />
           </div>
        </div>
      </div>
    </main>
  )
}
