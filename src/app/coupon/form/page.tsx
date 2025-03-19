"use client"

import { useRouter } from "next/navigation"
import { LessonForm } from "@/components/LessonForm"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { LessonForm2 } from "@/components/LessonForm2"
import { uploadLessonImage } from '@/app/actions'
import { CouponForm } from "@/components/CouponForm"
import { CouponList } from "@/components/CouponList"

export default function NewLessonPage() {
  const router = useRouter()

  const handleSaved = async (lessonData: any) => {
    try {

      const { error } = await supabase
        .from('lessons')
        .insert({
          ...lessonData
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
        <h1 className="text-2xl font-bold">쿠폰 관리</h1>
      </div>
      <div className="space-y-6">
        <CouponForm 
          onSaved={handleSaved}
          onCancel={() => router.back()}
        />
        
      </div>
      {/* <LessonForm 
        onSaved={handleSaved}
        onCancel={() => router.back()}
      /> */}
      
    </div>
  )
} 