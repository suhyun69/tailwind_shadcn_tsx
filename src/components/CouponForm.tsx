"use client"

import { useState, useEffect } from "react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, Check, GripVertical, Plus, Send, Youtube } from "lucide-react"
import { Pencil, Trash2, X } from "lucide-react"
import { Phone, MessageCircle, Instagram, Globe } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type ContactData = {
  type: string
  address: string
  name?: string
}

type DiscountData = {
  type: string
  condition?: string
  date?: string
  amount: number
}

type LessonData = {
  lesson_no?: number
  title: string
  genre: string
  instructor1: string
  instructor2?: string
  start_date: Date | string
  end_date: Date | string
  start_time: string
  end_time: string
  datetime_sub_texts?: string[]
  region: string
  place: string
  place_url?: string
  price: string
  discounts?: DiscountData[]
  discount_sub_texts?: string[]
  bank: string
  account_number: string
  account_owner: string
  contacts: ContactData[]
  notices: string[]
  image_url?: string
}

type LessonFormProps = {
  lesson?: LessonData | null
  onSaved: (lessonData: any) => Promise<void>
  onCancel: () => void
  onUploadImage: (file: File) => Promise<{ url: string }>
}

const formSchema = z.object({
  name: z.string().min(1, "쿠폰 이름을 입력해주세요."),
  discount_amount: z.string().min(1, "할인 금액을 입력해주세요."),
  lesson_no: z.string().min(1, "수업 번호를 입력해주세요."),
  quantity: z.string().min(1, "수량을 입력해주세요."),
})

type CouponFormData = z.infer<typeof formSchema>

type Lesson = {
  lesson_no: number
  title: string
}

export function CouponForm({ onSaved, onCancel }: { 
  onSaved: (data: CouponFormData) => Promise<void>
  onCancel: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const supabase = createClientComponentClient()

  const form = useForm<CouponFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      discount_amount: "",
      lesson_no: "",
      quantity: "",
    },
  })

  async function onSubmit(values: CouponFormData) {
    try {
      setIsSubmitting(true)
      const supabase = createClientComponentClient()

      alert(1);

      // 1. 쿠폰 템플릿 저장
      const { data: couponTemplate, error: templateError } = await supabase
        .from('coupon_templates')
        .insert({
          name: values.name,
          discount_amount: parseInt(values.discount_amount),
          lesson_no: parseInt(values.lesson_no),
        })
        .select()
        .single()

      alert(2);

      if (templateError) throw templateError

      // 2. 수량만큼 개별 쿠폰 생성
      const quantity = parseInt(values.quantity)
      const coupons = Array.from({ length: quantity }, () => ({
        template_id: couponTemplate.id,
        code: generateCouponCode(),
        status: 'available',
      }))

      const { error: couponsError } = await supabase
        .from('coupons')
        .insert(coupons)

      alert(3);

      if (couponsError) throw couponsError

      alert(4);

      await onSaved(values)
    } catch (error) {
      console.error('Error saving coupon:', error)
      toast.error("쿠폰 저장 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function generateCouponCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>쿠폰 생성</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>쿠폰 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="신규 가입자 할인 쿠폰" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>할인 금액</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="10000" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lesson_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수업</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="수업을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem 
                          key={lesson.lesson_no} 
                          value={lesson.lesson_no.toString()}
                        >
                          #{lesson.lesson_no} {lesson.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수량</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}