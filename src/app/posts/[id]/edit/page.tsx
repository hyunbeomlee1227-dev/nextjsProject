'use client'
import { supabase } from '@/app/supabase/supabase'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function EditPost() {
  const router = useRouter()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const fecthPost = async () => {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id as string)
      .single()
    setTitle(post.title)
    setContent(post.content)
  }

  useEffect(() => {
    fecthPost()
  }, [])

  const handleOnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('posts')
      .update({ title, content })
      .eq('id', id as string)
      .select()

    if (error) console.log(error)
    else {
      alert('수정성공')
      router.push(`/posts/${id}`)
    }
  }

  return (
    <>
      <form
        className="flex flex-col gap-2 items-start"
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name="content"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="p-2 rounded border-1 hover:bg-gray-200">수정</button>
      </form>
    </>
  )
}

export default EditPost
