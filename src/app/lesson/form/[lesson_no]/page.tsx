"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LessonForm } from "@/components/LessonForm"
import { toast } from "sonner"

export default function EditLessonPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('lesson_no', params.lesson_no)
          .single()

        if (error) throw error

        // console.log('Fetched lesson data:', data)

        // 날짜와 시간 데이터 변환
        const formattedData = {
          ...data,
          start_date: data.start_date ? new Date(data.start_date) : undefined,
          end_date: data.end_date ? new Date(data.end_date) : undefined,
          startHour: data.start_time?.split(':')[0] || '',
          startMinute: data.start_time?.split(':')[1] || '',
          endHour: data.end_time?.split(':')[0] || '',
          endMinute: data.end_time?.split(':')[1] || '',
          discounts: data.discounts || [],
          contacts: data.contacts || [],
          notices: data.notices || [],
          conditions: data.conditions || [],
          date_subtexts: data.date_subtexts || [],
          discount_subtexts: data.discount_subtexts || []
        }

        // console.log('Fetched lesson data:', formattedData)

        setLesson(formattedData)
      } catch (error) {
        console.error('Error:', error)
        toast.error("데이터를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()
  }, [params.lesson_no])

  const handleSaved = async (updatedData: any) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('lesson_no', params.lesson_no)

      if (error) throw error

      toast.success("수업이 수정되었습니다.")
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      toast.error("수정에 실패했습니다.")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">수업 수정</h1>
        <p className="text-muted-foreground">#{params.lesson_no}</p>
      </div>
      <LessonForm 
        lesson={lesson}
        onSaved={handleSaved}
        onCancel={() => router.back()}
      />
    </div>
  )
} 