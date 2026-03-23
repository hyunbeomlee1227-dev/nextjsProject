'use client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase'

export default function Nav() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  useEffect(() => {
    fetchUser()

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event)
      setUser(session?.user ?? null)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const handleOnLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error)
    } else {
      alert('로그아웃 성공')
      router.push('/signin')
    }
  }

  return (
    <nav className="flex">
      <Link href="/" className="p-2 rounded hover:bg-gray-200">
        메인{' '}
      </Link>
      <Link href="/posts" className="p-2 rounded hover:bg-gray-200">
        글목록{' '}
      </Link>
      {user ? (
        <button
          onClick={handleOnLogout}
          className="p-2 rounded hover:bg-gray-200"
        >
          로그아웃
        </button>
      ) : (
        <>
          <Link href="/signup" className="p-2 rounded hover:bg-gray-200">
            회원가입
          </Link>
          <Link href="/signin" className="p-2 rounded hover:bg-gray-200">
            로그인
          </Link>
        </>
      )}
    </nav>
  )
}
