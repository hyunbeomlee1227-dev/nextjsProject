'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase'

interface Post {
  id: number
  created_at: string
  title: string
  content: string
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])

  const fetchPosts = async () => {
    let { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: true })
    setPosts((posts as Post[]) ?? [])
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`}>
            {post.id} / {post.title}
          </Link>
        </li>
      ))}
      <Link href="/posts/new" className="p-2 rounded hover:bg-gray-200">
        글쓰기
      </Link>
    </ul>
  )
}
