"use client"

import { useRouter } from "next/navigation"
import { LessonForm } from "@/components/LessonForm"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { LessonForm2 } from "@/components/LessonForm2"

export default function NewLessonPage() {
  const router = useRouter()

  const handleSaved = async (lessonData: any) => {
    try {
      // lesson_no를 위한 현재 최대값 조회
      const { data: maxNoData } = await supabase
        .from('lessons')
        .select('lesson_no')
        .order('lesson_no', { ascending: false })
        .limit(1)
        .single()

      const nextLessonNo = (maxNoData?.lesson_no || 0) + 1

      const { error } = await supabase
        .from('lessons')
        .insert({
          ...lessonData,
          lesson_no: nextLessonNo,
          lesson_id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success("수업이 생성되었습니다.")
      router.push('/')
    } catch (error) {
      console.error('Error creating lesson:', error)
      toast.error("수업 생성에 실패했습니다.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">새 수업 추가</h1>
      </div>
      <LessonForm2/>
      <LessonForm 
        onSaved={handleSaved}
        onCancel={() => router.back()}
      />
      
    </div>
  )
} 