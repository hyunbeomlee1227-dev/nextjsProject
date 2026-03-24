'use client'
import { supabase } from '@/app/supabase/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function NewPost() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleOnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content }])
      .select()

    if (error) {
      console.log(error)
    } else if (!data || data.length === 0) {
      alert('권한이 없습니다.')
    } else {
      alert('등록성공')
      router.push('/posts')
    }
  }

  return (
    <form className="flex flex-col gap-2 items-start" onSubmit={handleOnSubmit}>
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
      <button className="p-2 rounded border-1 hover:bg-gray-200">등록</button>
    </form>
  )
}

export default NewPost
