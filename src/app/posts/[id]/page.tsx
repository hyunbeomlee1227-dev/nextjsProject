'use client'

import { supabase } from '@/app/supabase/supabase'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Post {
  id: number
  create_at: string
  title: string
  content: string
}

interface Comment {
  id: number
  create_at: string
  content: string
  post_id: number
}

export default function PostDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComment] = useState<Comment[]>([])

  const fetchPost = async () => {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id as string)
      .single()

    setPost(post)
  }

  const fetchComments = async () => {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id as string)

    setComment(comments ?? [])
  }

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [])

  const handleOnDelete = async (id: number) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) console.log(error)
    else {
      alert('삭제성공')
      router.push('/posts')
    }
  }

  if (!post) return <>Loading...</>

  return (
    <>
      <div>{post.id}번 게시글 상세</div>
      <div>{post.title}</div>
      <div>{post.content}</div>
      <div>댓글</div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}> - {comment.content}</li>
        ))}
      </ul>
      <button
        className="p-2 rounded border-1 hover:bg-gray-200"
        onClick={() => handleOnDelete(post.id)}
      >
        삭제
      </button>
    </>
  )
}
