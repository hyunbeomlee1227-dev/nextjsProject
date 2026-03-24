'use client'

import { supabase } from '@/app/supabase/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Post {
  id: number
  create_at: string
  title: string
  content: string
  user_id: string
}

interface Comment {
  id: number
  create_at: string
  content: string
  post_id: number
  user_id: string
}

export default function PostDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComment] = useState<Comment[]>([])
  const [content, setContent] = useState<string>('')
  const [user, setUser] = useState<User | null>(null)

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

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getSession()
    setUser(data.session?.user ?? null)
  }

  useEffect(() => {
    fetchPost()
    fetchComments()
    fetchUser()
  }, [])

  const handleOnDelete = async (id: number) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) console.log(error)
    else {
      alert('삭제성공')
      router.push('/posts')
    }
  }

  const handleOnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: id as string,
        content,
      })
      .select()

    if (error) {
      console.log(error)
    } else if (!data || data.length === 0) {
      alert('권한이 없습니다.')
    } else {
      alert('댓글 작성 성공!')
      setContent('')
      fetchComments()
    }
  }

  const handleOnCommentDelete = async (id: number) => {
    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .select()
    if (error) {
      console.log(error)
    } else if (!data || data.length === 0) {
      alert('권한이 없습니다.')
    } else {
      alert('댓글삭제성공')
      fetchComments()
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
          <li key={comment.id}>
            {' '}
            - {comment.content}{' '}
            {user?.id === comment.user_id && (
              <button
                onClick={() => handleOnCommentDelete(comment.id)}
                className="border p-1"
              >
                X
              </button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button>댓글 작성</button>
      </form>
      {user?.id === post.user_id && (
        <>
          <button
            className="p-2 rounded border-1 hover:bg-gray-200"
            onClick={() => handleOnDelete(post.id)}
          >
            삭제
          </button>
          <Link
            href={`/posts/${post.id}/edit`}
            className="p-3 rounded border-1 hover:bg-gray-200"
          >
            수정
          </Link>
        </>
      )}
    </>
  )
}
