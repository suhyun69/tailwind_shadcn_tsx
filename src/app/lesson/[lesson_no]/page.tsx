"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid'
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, MessageCircle } from "lucide-react"

type LessonData = {
  lesson_id: string
  lesson_no: number
  title: string
  genre: string
  instructor1?: string
  instructor2?: string
  region: string
  place?: string
  place_url?: string
  price?: string
  bank: string
  account_number?: string
  account_owner?: string
  start_date?: string
  end_date?: string
  start_time?: string
  end_time?: string
  // startHour?: string
  // startMinute?: string
  // endHour?: string
  // endMinute?: string
  discounts?: any[]
  contacts?: any[]
  notices?: any[]
  conditions?: any[]
  date_subtexts?: any[]
  discount_subtexts?: any[]
  status: 'draft' | 'published'
  datetime_sub_texts?: any[]
  discount_sub_texts?: any[]
  image_url?: string
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

  const handleCheckout = async () => {
    try {
      const { data, error } = await supabase
        .from('checkout')
        .insert({
          lesson_no: lesson?.lesson_no,
          discounts: lesson?.discounts || []
        })
        .select('checkout_id')
        .single()

      if (error) throw error

      toast.success("결제 페이지로 이동합니다.")
      router.push(`/checkout/${data.checkout_id}`)
    } catch (error) {
      console.error('Error:', error)
      toast.error("결제 페이지 이동에 실패했습니다.")
    }
  }

  const getGenreText = (genre: string) => {
    switch (genre) {
      case "S":
        return "살사"
      case "B":
        return "바차타"
      case "K":
        return "키좀바"
      default:
        return genre
    }
  }

  const getRegionText = (region: string) => {
    switch (region) {
      case "HD":
        return "홍대"
      case "GN":
        return "강남"
      case "AP":
        return "압구정"
      default:
        return region
    }
  }

  const formatTime = (time: string | null | undefined) => {
    if (!time) return ""
    return time.slice(0, 5)  // "HH:MM:SS" -> "HH:MM"
  }

  const getBankText = (bank: string) => {
    switch (bank) {
      case "sh":
        return "신한은행"
      default:
        return bank
    }
  }

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          {/* <p className="text-muted-foreground">#{lesson.lesson_no}</p> */}
        </div>
      </div>

      {lesson.image_url && (
        <div className="relative w-full py-3">
          <img
            src={lesson.image_url}
            alt={lesson.title}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      )}

      {/* 기본 정보 */}
      <Card>
        <CardContent>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">장르</h2>
              <p className="text-xl">{getGenreText(lesson.genre)}</p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">강사</h2>
              <p className="text-xl">{[lesson.instructor1, lesson.instructor2].filter(Boolean).join(', ')}</p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">수업기간</h2>
              <p className="text-xl">{lesson.start_date && format(new Date(lesson.start_date), 'M.dd')} ~ {lesson.end_date && format(new Date(lesson.end_date), 'M.dd')}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">수업시간</h2>
                <p className="text-xl">{`${formatTime(lesson.start_time)} ~ ${formatTime(lesson.end_time)}`}</p>
              </div>
            </div>

            {lesson.datetime_sub_texts && lesson.datetime_sub_texts.length > 0 && (
              <div className="flex justify-end">
                <div className="space-y-2">
                  {lesson.datetime_sub_texts.map((text, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-end rounded-lg border p-3 bg-muted"
                    >
                      <div className="text-sm break-words text-right">
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">지역</h2>
              <p className="text-xl">{getRegionText(lesson.region)}</p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">장소</h2>
              <p className="text-xl">
                {lesson.place_url ? (
                  <a 
                    href={lesson.place_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {lesson.place}
                  </a>
                ) : (
                  lesson.place
                )}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">가격</h2>
              <p className="text-xl">{lesson.price?.toLocaleString()}원</p>
            </div>
            {lesson.discounts && lesson.discounts.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">할인</h2>
                </div>
                <div className="flex justify-end">
                  <div className="space-y-2">
                    {lesson.discounts.map((discount, index) => (
                      <div 
                        key={index} 
                        className="flex justify-end"
                      >
                        <div className="inline-flex items-center rounded-lg border p-3 bg-muted">
                          <div className="text-sm break-words text-right">
                            {discount.type === "earlybird" 
                              ? `-${discount.amount}원 (${format(new Date(discount.date), 'M.d')}까지 입금 시)`
                              : `-${discount.amount}원 (${discount.condition === 'male' ? '남성' : '여성'})`
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {lesson.discount_sub_texts && lesson.discount_sub_texts.length > 0 && (
              <div className="flex justify-end">
                <div className="space-y-2">
                  {lesson.discount_sub_texts.map((text, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-end rounded-lg border p-3 bg-muted"
                    >
                      <div className="text-sm break-words text-right">
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold">입금 계좌</h2>
              <div className="flex justify-end">
                <div className="inline-flex items-center rounded-lg border p-3 bg-muted">
                  <div className="text-sm break-words text-right">
                    {getBankText(lesson.bank)} {lesson.account_number} {lesson.account_owner}
                  </div>
                </div>
              </div>
            </div>

            {lesson.notices && lesson.notices.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">공지사항</h2>
                </div>
                <div className="flex justify-end">
                  <div className="space-y-2">
                    {lesson.notices.map((notice, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-end rounded-lg border p-3 bg-muted"
                      >
                        <div className="text-sm break-words text-right">
                          {notice}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {lesson.contacts && lesson.contacts.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">문의</h2>
                </div>
                <div className="flex justify-end">
                  <div className="space-y-2">
                    {lesson.contacts.map((contact, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-end rounded-lg border p-3 bg-muted"
                      >
                        <div className="text-sm break-words text-right flex items-center gap-2">
                          {contact.type === 'instagram' ? (
                            <Instagram className="h-4 w-4" />
                          ) : (
                            <MessageCircle className="h-4 w-4" />
                          )}
                          {contact.address} {contact.name && `| ${contact.name}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
      
      {/* 최하단 버튼 */}
      <div className="mt-8 flex justify-end space-x-2">
        {/* <Button onClick={() => router.push(`/lesson/form/${lesson.lesson_no}`)}>
          수정하기
        </Button> */}
        <Button 
          onClick={handleCheckout}
          className="w-full"
        >
          신청하기
        </Button>
      </div>
    </div>
  )
} 