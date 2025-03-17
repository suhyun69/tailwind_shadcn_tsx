'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function uploadLessonImage(file: File) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `lesson-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('lessons')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('lessons')
      .getPublicUrl(filePath)

    return { url: publicUrl }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('이미지 업로드 중 오류가 발생했습니다.')
  }
} 