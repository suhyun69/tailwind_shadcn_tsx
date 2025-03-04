"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { toast } from "sonner"

type LessonData = {
  lesson_id: string
  lesson_no: number
  title: string
  genre: string
  instructor1?: string
  instructor2?: string
  region?: string
  place?: string
  place_url?: string
  price?: string
  bank?: string
  account_number?: string
  account_owner?: string
  start_date?: string
  end_date?: string
  startHour?: string
  startMinute?: string
  endHour?: string
  endMinute?: string
  discounts?: any[]
  contacts?: any[]
  notices?: any[]
  conditions?: any[]
  date_subtexts?: any[]
  discount_subtexts?: any[]
  status: 'draft' | 'published'
}

export default function LessonViewPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<LessonData | null>(null)
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
        setLesson(data)
      } catch (error) {
        console.error('Error:', error)
        toast.error("데이터를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()
  }, [params.lesson_no])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        수업을 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground">#{lesson.lesson_no}</p>
        </div>
        <Button onClick={() => router.push(`/lesson/form/${lesson.lesson_no}`)}>
          수정하기
        </Button>
      </div>

      {/* 기본 정보 */}
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">기본 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">장르</label>
              <p>{lesson.genre}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">강사</label>
              <p>{[lesson.instructor1, lesson.instructor2].filter(Boolean).join(', ')}</p>
            </div>
          </div>
        </section>

        {/* 시간 정보 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">시간 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">수업 기간</label>
              <p>
                {lesson.start_date && format(new Date(lesson.start_date), 'yyyy-MM-dd')} ~ 
                {lesson.end_date && format(new Date(lesson.end_date), 'yyyy-MM-dd')}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">수업 시간</label>
              <p>{`${lesson.startHour}:${lesson.startMinute} ~ ${lesson.endHour}:${lesson.endMinute}`}</p>
            </div>
          </div>
        </section>

        {/* 장소 정보 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">장소 정보</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-muted-foreground">지역</label>
              <p>{lesson.region}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">장소</label>
              <p>{lesson.place}</p>
              {lesson.place_url && (
                <a 
                  href={lesson.place_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  위치 보기
                </a>
              )}
            </div>
          </div>
        </section>

        {/* 가격 정보 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">가격 정보</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-muted-foreground">가격</label>
              <p>{lesson.price}</p>
            </div>
            {lesson.discounts && lesson.discounts.length > 0 && (
              <div>
                <label className="text-sm text-muted-foreground">할인 정보</label>
                <ul className="list-disc pl-5">
                  {lesson.discounts.map((discount, index) => (
                    <li key={index}>
                      {discount.type === "earlybird" 
                        ? `얼리버드 할인: ${discount.amount}원 (${format(new Date(discount.date), 'yyyy-MM-dd')}까지)`
                        : `${discount.condition === 'male' ? '남성' : '여성'} 할인: ${discount.amount}원`
                      }
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <label className="text-sm text-muted-foreground">계좌 정보</label>
              <p>{`${lesson.bank} ${lesson.account_number} (${lesson.account_owner})`}</p>
            </div>
          </div>
        </section>

        {/* 기타 정보 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">기타 정보</h2>
          {lesson.notices && lesson.notices.length > 0 && (
            <div>
              <label className="text-sm text-muted-foreground">공지사항</label>
              <ul className="list-disc pl-5">
                {lesson.notices.map((notice, index) => (
                  <li key={index}>{notice.content}</li>
                ))}
              </ul>
            </div>
          )}
          {lesson.contacts && lesson.contacts.length > 0 && (
            <div>
              <label className="text-sm text-muted-foreground">연락처</label>
              <ul className="list-disc pl-5">
                {lesson.contacts.map((contact, index) => (
                  <li key={index}>
                    {contact.type}: {contact.address} {contact.name && `(${contact.name})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  )
} 