"use client"

import { useState, useEffect } from "react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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

export function CouponForm({ lesson, onSaved, onCancel, onUploadImage }: LessonFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const supabase = createClientComponentClient()

  const form = useForm<CouponFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: lesson?.title || "",
      discount_amount: lesson?.price?.toString() || "",
      lesson_no: lesson?.lesson_no?.toString() || "",
      quantity: "",
    },
  })

  useEffect(() => {
    async function fetchLessons() {
      const { data, error } = await supabase
        .from('lessons')
        .select('lesson_no, title')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching lessons:', error)
        return
      }

      setLessons(data || [])
    }

    fetchLessons()
  }, [])

  async function onSubmit(values: CouponFormData) {
    try {
      setIsSubmitting(true)
      const lessonData = {
        lesson_no: lesson?.lesson_no,  // id 대신 lesson_no 사용
        genre: lesson?.genre || "",
        title: values.name,
        instructor1: lesson?.instructor1 || "",
        instructor2: lesson?.instructor2 || "",
        start_date: lesson?.start_date ? new Date(lesson.start_date) : new Date(),
        end_date: lesson?.end_date ? new Date(lesson.end_date) : new Date(),
        start_time: lesson?.start_time || "",
        end_time: lesson?.end_time || "",
        datetime_sub_texts: lesson?.datetime_sub_texts || [],
        region: lesson?.region || "",
        place: lesson?.place || "",
        place_url: lesson?.place_url || "",
        price: values.discount_amount,
        discounts: lesson?.discounts || [],
        discount_sub_texts: lesson?.discount_sub_texts || [],
        bank: lesson?.bank || "",
        account_number: lesson?.account_number || "",
        account_owner: lesson?.account_owner || "",
        contacts: lesson?.contacts || [],
        notices: lesson?.notices || [],
        image_url: lesson?.image_url || "",
        updated_at: new Date().toISOString()
      }
      await onSaved(lessonData)
      router.push('/')
    } catch (error) {
      console.error('Error saving lesson:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  const [no, setNo] = React.useState(lesson?.lesson_no?.toString() || "")

  const [title, setTitle] = React.useState(lesson?.title || "")
  const [genre, setGenre] = React.useState(lesson?.genre || "")
  const [instructor1, setInstructor1] = React.useState(lesson?.instructor1 || "")
  const [instructor2, setInstructor2] = React.useState(lesson?.instructor2 || "")

  const [startDate, setStartDate] = React.useState<Date | undefined>(
    lesson?.start_date ? new Date(lesson.start_date) : undefined
  )
  const [isStartDateOpen, setIsStartDateOpen] = React.useState(false)
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    lesson?.end_date ? new Date(lesson.end_date) : undefined
  )
  const [isEndDateOpen, setIsEndDateOpen] = React.useState(false)
  
  const [startTime, setStartTime] = React.useState(
    lesson?.start_time ? lesson.start_time.slice(0, 5) : ""
  )
  const [endTime, setEndTime] = React.useState(
    lesson?.end_time ? lesson.end_time.slice(0, 5) : ""
  )

  const [dateTimeSubTexts, setDateTimeSubTexts] = React.useState(lesson?.datetime_sub_texts || [])
  const [dateTimeSubTextInput, setDateTimeSubTextInput] = React.useState("")
  const dateTimeSubTextInputLength = dateTimeSubTextInput.trim().length
  const [editingDateTimeSubTextsIndex, setEditingDateTimeSubTextsIndex] = useState<number | null>(null)
  const [editedDateTimeSubText, setEditedDateTimeSubText] = useState("")

  const [region, setRegion] = React.useState(lesson?.region || "")
  const [place, setPlace] = React.useState(lesson?.place || "")
  const [placeUrl, setPlaceUrl] = React.useState(lesson?.place_url || "")
  const [price, setPrice] = React.useState(lesson?.price || "")

  const [discountType, setDiscountType] = useState("")
  const [discountCondition, setDiscountCondition] = useState("")
  const [discountDate, setDiscountDate] = useState<Date>()
  const [discountAmount, setDiscountAmount] = useState("")
  const [discounts, setDiscounts] = useState(lesson?.discounts || [])
  const [editingDiscountsIndex, setEditingDiscountsIndex] = useState<number | null>(null)

  const [discountSubTextInput, setDiscountSubTextInput] = useState("")
  const [discountSubTexts, setDiscountSubTexts] = useState(lesson?.discount_sub_texts || [])
  const discountSubTextInputLength = discountSubTextInput.trim().length
  const [editingDiscountSubTextsIndex, setEditingDiscountSubTextsIndex] = useState<number | null>(null)
  const [editedDiscountSubText, setEditedDiscountSubText] = useState("")

  const [bank, setBank] = useState(lesson?.bank || "")
  const [accountNumber, setAccountNumber] = useState(lesson?.account_number || "")
  const [accountOwner, setAccountOwner] = useState(lesson?.account_owner || "")

  const [contacts, setContacts] = useState(lesson?.contacts || [])
  const [contactType, setContactType] = useState("")
  const [contactAddress, setContactAddress] = useState("")
  const [contactName, setContactName] = useState("")
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null)

  const [notices, setNotices] = useState<string[]>(lesson?.notices || [])
  const [noticeInput, setNoticeInput] = useState("")
  const [editingNoticeIndex, setEditingNoticeIndex] = useState<number | null>(null)

  const [imageUrl, setImageUrl] = useState(lesson?.image_url || "")
  const [uploading, setUploading] = useState(false)

  // useEffect를 사용하여 lesson prop이 변경될 때마다 상태 업데이트
  React.useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "")
      setGenre(lesson.genre || "")
      setInstructor1(lesson.instructor1 || "")
      setInstructor2(lesson.instructor2 || "")
      setStartDate(lesson.start_date ? new Date(lesson.start_date) : undefined)
      setEndDate(lesson.end_date ? new Date(lesson.end_date) : undefined)
      setStartTime(lesson.start_time ? lesson.start_time.slice(0, 5) : "")
      setEndTime(lesson.end_time ? lesson.end_time.slice(0, 5) : "")
      setDateTimeSubTexts(lesson.datetime_sub_texts || [])
      setRegion(lesson.region || "")
      setPlace(lesson.place || "")
      setPlaceUrl(lesson.place_url || "")
      setPrice(lesson.price || "")
      setDiscounts(lesson.discounts || [])
      setDiscountSubTexts(lesson.discount_sub_texts || [])
      setBank(lesson.bank || "")
      setAccountNumber(lesson.account_number || "")
      setAccountOwner(lesson.account_owner || "")
      setContacts(lesson.contacts || [])
      setNotices(lesson.notices || [])
      setImageUrl(lesson.image_url || "")
    }
  }, [lesson])

  const handleAddDateTimeSubText = () => {
    if (dateTimeSubTextInput.trim()) {
      setDateTimeSubTexts([...dateTimeSubTexts, dateTimeSubTextInput.trim()])
      setDateTimeSubTextInput("")  // 입력 필드 초기화
    }
  }

  const handleEditDateTimeSubTexts = (index: number, text: string) => {
    setEditingDateTimeSubTextsIndex(index)
    setEditedDateTimeSubText(text)
  }

  const handleEditSavedDateTimeSubTexts = (index: number) => {
    if (editedDateTimeSubText.trim()) {
      const newTexts = [...dateTimeSubTexts]
      newTexts[index] = editedDateTimeSubText.trim()
      setDateTimeSubTexts(newTexts)
    }
    setEditingDateTimeSubTextsIndex(null)
  }

  const handleDeleteDateTimeSubText = (index: number) => {
    setDateTimeSubTexts(dateTimeSubTexts.filter((_, i) => i !== index))
  }

  const handleAddDiscount = () => {
    const amount = parseInt(discountAmount)
    if (!discountType || !amount) return

    const newDiscount = {
      type: discountType,
      condition: discountType === "sex" ? discountCondition : undefined,
      date: discountType === "earlybird" && discountDate ? format(discountDate, "yyyy-MM-dd") : undefined,
      amount
    }

    if (editingDiscountsIndex !== null) {
      const newDiscounts = [...discounts]
      newDiscounts[editingDiscountsIndex] = newDiscount
      setDiscounts(newDiscounts)
      setEditingDiscountsIndex(null)
    } else {
      setDiscounts([...discounts, newDiscount])
    }

    // 입력 필드 초기화
    setDiscountType("")
    setDiscountCondition("")
    setDiscountDate(undefined)
    setDiscountAmount("")
  }

  const handleEditDiscount = (index: number) => {
    const discount = discounts[index]
    setDiscountType(discount.type)
    setDiscountCondition(discount.condition || "")
    setDiscountDate(discount.date ? new Date(discount.date) : undefined)
    setDiscountAmount(discount.amount.toString())
    setEditingDiscountsIndex(index)
  }

  const handleDeleteDiscount = (index: number) => {
    setDiscounts(discounts.filter((_, i) => i !== index))
  }

  const handleAddDiscountsSubText = () => {
    if (discountSubTextInput.trim()) {
      setDiscountSubTexts([...discountSubTexts, discountSubTextInput.trim()])
      setDiscountSubTextInput("")
    }
  }

  const handleEditDiscountsSubText = (index: number, text: string) => {
    setEditingDiscountSubTextsIndex(index)
    setEditedDiscountSubText(text)
  }

  const handleSaveDiscountsSubText = (index: number) => {
    if (editedDiscountSubText.trim()) {
      const newTexts = [...discountSubTexts]
      newTexts[index] = editedDiscountSubText.trim()
      setDiscountSubTexts(newTexts)
    }
    setEditingDiscountSubTextsIndex(null)
  }

  const handleAddContact = () => {
    if (!contactType || !contactAddress) return

    const newContact = {
      type: contactType,
      address: contactAddress,
      name: contactName || undefined
    }

    if (editingContactIndex !== null) {
      const newContacts = [...contacts]
      newContacts[editingContactIndex] = newContact
      setContacts(newContacts)
      setEditingContactIndex(null)
    } else {
      setContacts([...contacts, newContact])
    }

    // 입력 필드 초기화
    setContactType("")
    setContactAddress("")
    setContactName("")
  }

  const handleEditContact = (index: number) => {
    const contact = contacts[index]
    setContactType(contact.type)
    setContactAddress(contact.address)
    setContactName(contact.name || "")
    setEditingContactIndex(index)
  }

  const handleDeleteContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const handleAddNotice = () => {
    if (!noticeInput.trim()) return

    if (editingNoticeIndex !== null) {
      const newNotices = [...notices]
      newNotices[editingNoticeIndex] = noticeInput.trim()
      setNotices(newNotices)
      setEditingNoticeIndex(null)
    } else {
      setNotices([...notices, noticeInput.trim()])
    }
    setNoticeInput("")
  }

  const handleEditNotice = (index: number) => {
    setNoticeInput(notices[index])
    setEditingNoticeIndex(index)
  }

  const handleDeleteNotice = (index: number) => {
    setNotices(notices.filter((_, i) => i !== index))
  }

  const renderDiscountConditions = () => {
    if (discountType === "earlybird") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !discountDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {discountDate ? format(discountDate, "yyyy-MM-dd") : "마감일 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={discountDate}
              onSelect={(date) => {
                setDiscountDate(date)
                // Popover 닫기
                const closeEvent = new Event('keydown')
                ;(closeEvent as any).key = 'Escape'
                document.dispatchEvent(closeEvent)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )
    }
    
    if (discountType === "sex") {
      return (
        <Select value={discountCondition} onValueChange={setDiscountCondition}>
          <SelectTrigger>
            <SelectValue placeholder="성별 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">남성</SelectItem>
            <SelectItem value="female">여성</SelectItem>
          </SelectContent>
        </Select>
      )
    }
  }

  // 아이콘 매핑 함수 추가
  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="h-4 w-4" />
      case "kakaotalk":
        return <MessageCircle className="h-4 w-4" />
      case "instagram":
        return <Globe className="h-4 w-4" />
      case "cafe":
        return <Globe className="h-4 w-4" />
      case "youtube":
        return <Globe className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('이미지를 선택해주세요.')
      }

      const file = event.target.files[0]
      const { url } = await onUploadImage(file)
      setImageUrl(url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
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