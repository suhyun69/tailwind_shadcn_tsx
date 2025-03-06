"use client"

import { useState } from "react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

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
import { Calendar as CalendarIcon, Check, GripVertical, Plus, Send } from "lucide-react"
import { Pencil, Trash2, X } from "lucide-react"

type DiscountData = {
  type: string
  condition?: string
  date?: string
  amount: number
}

type LessonData = {
  no?: number
  title: string
  genre: string
  instructor1: string
  instructor2?: string
  start_date: Date | string
  end_date: Date | string
  start_time: string
  end_time: string
  date_time_sub_texts?: string[]
  region: string
  place: string
  place_url?: string
  price: string
  discounts?: DiscountData[]
  discount_sub_texts?: string[]
}

type LessonFormProps = {
  lesson?: LessonData | null
  onSaved: (lessonData: any) => Promise<void>  // Promise 타입 추가
  onCancel: () => void
}

export function LessonForm2({ lesson, onSaved, onCancel }: LessonFormProps) {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
  
  const [startTime, setStartTime] = React.useState(lesson?.start_time || "")
  const [endTime, setEndTime] = React.useState(lesson?.end_time || "")

  const [dateTimeSubTexts, setDateTimeSubTexts] = React.useState(lesson?.date_time_sub_texts || [])
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

  // useEffect를 사용하여 lesson prop이 변경될 때마다 상태 업데이트
  React.useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "")
      setGenre(lesson.genre || "")
      setInstructor1(lesson.instructor1 || "")
      setInstructor2(lesson.instructor2 || "")
      setStartDate(lesson.start_date ? new Date(lesson.start_date) : undefined)
      setEndDate(lesson.end_date ? new Date(lesson.end_date) : undefined)
      setStartTime(lesson.start_time || "")
      setEndTime(lesson.end_time || "")
      setDateTimeSubTexts(lesson.date_time_sub_texts || [])
      setRegion(lesson.region || "")
      setPlace(lesson.place || "")
      setPlaceUrl(lesson.place_url || "")
      setPrice(lesson.price || "")
      setDiscounts(lesson.discounts || [])
      setDiscountSubTexts(lesson.discount_sub_texts || [])
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

  return (
    <form className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor={`no`}>Lesson No</Label>
            <Input className="bg-muted" id={`no`} placeholder="" disabled/>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`genre`}>Genre</Label>
              <Select defaultValue="">
                <SelectTrigger id={`genre`} aria-label="Genre">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Salsa</SelectItem>
                  <SelectItem value="B">Bachata</SelectItem>
                  <SelectItem value="K">Kizomba</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`title`}>Title</Label>
            <Input id={`title`} placeholder="수업명을 입력하세요." />
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`instructor1`}>Instructor1</Label>
              <Select defaultValue="">
                <SelectTrigger id={`instructor1`} aria-label="Instructor1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="browny">브라우니</SelectItem>
                  <SelectItem value="kali">칼리</SelectItem>
                  <SelectItem value="scarlet">스칼렛</SelectItem>
                  <SelectItem value="diana">디아나</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`instructor2`}>Instructor2</Label>
              <Select defaultValue="">
                <SelectTrigger id={`instructor2`} aria-label="Instructor2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="browny">브라우니</SelectItem>
                  <SelectItem value="kali">칼리</SelectItem>
                  <SelectItem value="scarlet">스칼렛</SelectItem>
                  <SelectItem value="diana">디아나</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="start_date" className="text-sm">시작일</Label>
              <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy-MM-dd") : "날짜를 선택하세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setIsStartDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date" className="text-sm">종료일</Label>
              <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "yyyy-MM-dd") : "날짜를 선택하세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setIsEndDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`start_time`}>시작 시간</Label>
              <Input id={`start_time`} placeholder="HH:mm" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`end_time`}>종료 시간</Label>
              <Input id={`end_time`} placeholder="HH:mm" />
            </div>
          </div>

          {dateTimeSubTexts.length > 0 && (
            <div className="space-y-4">
              {dateTimeSubTexts.map((text, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[75%] items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    "bg-muted"
                  )}
                >
                  {editingDateTimeSubTextsIndex === index ? (
                    <>
                      <Input
                        value={editedDateTimeSubText}
                        onChange={(e) => setEditedDateTimeSubText(e.target.value)}
                        className="h-6 w-[200px]"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleEditSavedDateTimeSubTexts(index)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      {text}
                      <div className="ml-2 flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleEditDateTimeSubTexts(index, text)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleDeleteDateTimeSubText(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              id="dateTimeSubTextInput"
              placeholder="추가정보를 입력하세요."
              className="flex-1"
              autoComplete="off"
              value={dateTimeSubTextInput}
              onChange={(event) => setDateTimeSubTextInput(event.target.value)}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={dateTimeSubTextInputLength === 0}
              onClick={handleAddDateTimeSubText}
            >
              <Plus />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`region`}>Region</Label>
              <Select defaultValue="">
                <SelectTrigger id={`region`} aria-label="Region">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HD">홍대</SelectItem>
                  <SelectItem value="GN">강남</SelectItem>
                  <SelectItem value="AP">압구정</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`place`}>Place</Label>
            <Input id={`place`} placeholder="장소를 입력하세요." />
            <Input id={`place_url`} placeholder="Url을 입력하세요." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`price`}>Price</Label>
              <Input id={`price`} placeholder="금액을 입력하세요." />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Discount</Label>
              {discounts.length > 0 && (
                <div className="space-y-2">
                  {discounts.map((discount, index) => (
                    <div 
                      key={index} 
                      className="group relative flex items-center justify-between rounded-lg border p-3 bg-muted"
                    >
                      <div className="flex items-center space-x-2 text-sm">
                        <span>
                          {discount.type === "earlybird" ? "얼리버드" : 
                           discount.condition === "male" ? "남성 할인" : "여성 할인"}
                        </span>
                        <span>|</span>
                        {discount.type === "earlybird" && discount.date && (
                          <>
                            <span>{format(new Date(discount.date), "yyyy-MM-dd")}</span>
                            <span>|</span>
                          </>
                        )}
                        <span>
                          {new Intl.NumberFormat('ko-KR').format(-discount.amount)}원
                        </span>
                      </div>

                      {editingDiscountsIndex !== index && (
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditDiscount(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => handleDeleteDiscount(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* 입력 영역 */}
              <div className="space-y-2">
                <Select value={discountType} onValueChange={(value) => {
                  setDiscountType(value);
                  setDiscountCondition("");
                  setDiscountDate(undefined);
                }}>
                  <SelectTrigger id="discount_type">
                    <SelectValue placeholder="할인 타입 선택" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="earlybird">얼리버드</SelectItem>
                    <SelectItem value="sex">성별 할인</SelectItem>
                  </SelectContent>
                </Select>

                {/* 할인 조건 */}
                {discountType && renderDiscountConditions()}

                {/* 할인 금액 입력 및 버튼 */}
                <div className="flex gap-2">
                  <Input 
                    id="discount_amount" 
                    placeholder="할인 금액을 입력하세요" 
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddDiscount();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddDiscount}
                    className="shrink-0"
                  >
                    {editingDiscountsIndex !== null ? "수정" : "입력"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* discountSubTexts 표시 영역 */}
          {discountSubTexts.length > 0 && (
            <div className="space-y-4">
              {discountSubTexts.map((text, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[75%] items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    "bg-muted"
                  )}
                >
                  {editingDiscountSubTextsIndex === index ? (
                    <>
                      <Input
                        value={editedDiscountSubText}
                        onChange={(e) => setEditedDiscountSubText(e.target.value)}
                        className="h-6 w-[200px]"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleSaveDiscountsSubText(index)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      {text}
                      {editingDiscountSubTextsIndex === null && (
                        <div className="ml-2 flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleEditDiscountsSubText(index, text)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => {
                              const newTexts = [...discountSubTexts]
                              newTexts.splice(index, 1)
                              setDiscountSubTexts(newTexts)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="flex gap-2">
            <Input
              id="discountSubTextInput"
              placeholder="할인 관련 추가정보를 입력하세요."
              className="flex-1"
              autoComplete="off"
              value={discountSubTextInput}
              onChange={(event) => setDiscountSubTextInput(event.target.value)}
            />
            <Button 
              type="button"
              size="icon" 
              disabled={discountSubTextInputLength === 0}
              onClick={handleAddDiscountsSubText}
            >
              <Plus />
              <span className="sr-only">Add</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </form>
    
  )
}