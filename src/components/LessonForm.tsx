"use client"

import { useState } from "react"
import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, GripVertical, Pencil, X } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

// 할인 정보 타입 정의
type DiscountInfo = {
  type: string;
  condition: string;
  amount: string;
  date?: Date;
}

// 연락처 정보 타입 정의
type ContactInfo = {
  type: string;
  address: string;
  name: string;
}

// Notice 타입 정의 수정
type NoticeInfo = {
  content: string;  // type 필드 제거
}

// Condition 타입 정의 추가
type ConditionInfo = {
  content: string;
}

// SubtextInfo 타입 정의 추가
type SubtextInfo = {
  content: string;
}

// SubtextForDiscountInfo 타입 정의 추가
type SubtextForDiscountInfo = {
  content: string;
}

// 1. 타입 이름 변경
type DateSubtextInfo = {
  content: string;
}

type LessonData = {
  lesson_id?: string
  lesson_no?: number
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
  start_date?: Date | string
  end_date?: Date | string
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
  status?: 'draft' | 'published'
}

type LessonFormProps = {
  lesson?: LessonData | null
  onSaved: (lessonData: any) => Promise<void>  // Promise 타입 추가
  onCancel: () => void
}

export function LessonForm({ lesson, onSaved, onCancel }: LessonFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 모든 상태를 lesson prop으로 초기화
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    lesson?.start_date ? new Date(lesson.start_date) : undefined
  )
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    lesson?.end_date ? new Date(lesson.end_date) : undefined
  )
  const [startHour, setStartHour] = React.useState(lesson?.startHour || "")
  const [startMinute, setStartMinute] = React.useState(lesson?.startMinute || "")
  const [endHour, setEndHour] = React.useState(lesson?.endHour || "")
  const [endMinute, setEndMinute] = React.useState(lesson?.endMinute || "")
  const [title, setTitle] = React.useState(lesson?.title || "")
  const [genre, setGenre] = React.useState(lesson?.genre || "")
  const [instructor1, setInstructor1] = React.useState(lesson?.instructor1 || "")
  const [instructor2, setInstructor2] = React.useState(lesson?.instructor2 || "")
  const [region, setRegion] = React.useState(lesson?.region || "")
  const [place, setPlace] = React.useState(lesson?.place || "")
  const [placeUrl, setPlaceUrl] = React.useState(lesson?.place_url || "")
  const [price, setPrice] = React.useState(lesson?.price || "")
  const [bank, setBank] = useState(lesson?.bank || "")
  const [accountNumber, setAccountNumber] = useState(lesson?.account_number || "")
  const [accountOwner, setAccountOwner] = useState(lesson?.account_owner || "")
  
  // 배열 데이터 초기화
  const [savedDiscounts, setSavedDiscounts] = React.useState(lesson?.discounts || [])
  const [savedContacts, setSavedContacts] = React.useState(lesson?.contacts || [])
  const [savedNotices, setSavedNotices] = React.useState(lesson?.notices || [])
  const [savedConditions, setSavedConditions] = React.useState(lesson?.conditions || [])
  const [savedDateSubtexts, setSavedDateSubtexts] = React.useState(lesson?.date_subtexts || [])
  const [savedDiscountSubtexts, setSavedDiscountSubtexts] = React.useState(lesson?.discount_subtexts || [])

  // useEffect를 사용하여 lesson prop이 변경될 때마다 상태 업데이트
  React.useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "")
      setGenre(lesson.genre || "")
      setInstructor1(lesson.instructor1 || "")
      setInstructor2(lesson.instructor2 || "")
      setRegion(lesson.region || "")
      setPlace(lesson.place || "")
      setPlaceUrl(lesson.place_url || "")
      setPrice(lesson.price || "")
      setBank(lesson.bank || "")
      setAccountNumber(lesson.account_number || "")
      setAccountOwner(lesson.account_owner || "")
      setStartDate(lesson.start_date ? new Date(lesson.start_date) : undefined)
      setEndDate(lesson.end_date ? new Date(lesson.end_date) : undefined)
      setStartHour(lesson.startHour || "")
      setStartMinute(lesson.startMinute || "")
      setEndHour(lesson.endHour || "")
      setEndMinute(lesson.endMinute || "")
      setSavedDiscounts(lesson.discounts || [])
      setSavedContacts(lesson.contacts || [])
      setSavedNotices(lesson.notices || [])
      setSavedConditions(lesson.conditions || [])
      setSavedDateSubtexts(lesson.date_subtexts || [])
      setSavedDiscountSubtexts(lesson.discount_subtexts || [])
    }
  }, [lesson])

  const [discountType, setDiscountType] = React.useState("")
  const [discountCondition, setDiscountCondition] = React.useState("")
  const [discountAmount, setDiscountAmount] = React.useState("")
  const [discountDate, setDiscountDate] = React.useState<Date>()
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [contactType, setContactType] = React.useState("")
  const [contactAddress, setContactAddress] = React.useState("")
  const [contactName, setContactName] = React.useState("")
  const [editingContactIndex, setEditingContactIndex] = React.useState<number | null>(null)
  const [noticeContent, setNoticeContent] = React.useState("")
  const [editingNoticeIndex, setEditingNoticeIndex] = React.useState<number | null>(null)
  const [conditionContent, setConditionContent] = React.useState("")
  const [editingConditionIndex, setEditingConditionIndex] = React.useState<number | null>(null)
  const [isStartDateOpen, setIsStartDateOpen] = React.useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = React.useState(false)
  const [subtextContent, setSubtextContent] = React.useState("")
  const [savedSubtexts, setSavedSubtexts] = React.useState<SubtextInfo[]>([])
  const [editingSubtextIndex, setEditingSubtextIndex] = React.useState<number | null>(null)
  const [discountSubtextContent, setDiscountSubtextContent] = React.useState("")
  const [editingDiscountSubtextIndex, setEditingDiscountSubtextIndex] = React.useState<number | null>(null)
  const [dateSubtextContent, setDateSubtextContent] = React.useState("")
  const [editingDateSubtextIndex, setEditingDateSubtextIndex] = React.useState<number | null>(null)
  
  // 시간 옵션 (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  )

  // 분 옵션 (0, 30)
  const minuteOptions = ['00', '10', '20', '30', '40', '50']

  // 할인 조건 옵션 렌더링
  const renderDiscountConditions = () => {
    switch (discountType) {
      case "earlybird":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !discountDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {discountDate ? format(discountDate, "yyyy-MM-dd") : "마감 날짜를 선택하세요"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={discountDate}
                onSelect={setDiscountDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "sex":
        return (
          <Select value={discountCondition} onValueChange={setDiscountCondition}>
            <SelectTrigger id="discount_condition">
              <SelectValue placeholder="성별 선택" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  // 할인 정보 삭제
  const handleDeleteDiscount = (index: number) => {
    setSavedDiscounts(savedDiscounts.filter((_, i) => i !== index));
  };

  // 할인 정보 수정 시작
  const handleEditDiscount = (index: number) => {
    const discount = savedDiscounts[index];
    setDiscountType(discount.type);
    if (discount.type === "earlybird" && discount.date) {
      setDiscountDate(new Date(discount.date));
    } else {
      setDiscountCondition(discount.condition);
    }
    setDiscountAmount(discount.amount);
    setEditingIndex(index);
  };

  // 할인 정보 순서 변경
  const handleReorderDiscount = (fromIndex: number, toIndex: number) => {
    const newDiscounts = [...savedDiscounts];
    const [movedItem] = newDiscounts.splice(fromIndex, 1);
    newDiscounts.splice(toIndex, 0, movedItem);
    setSavedDiscounts(newDiscounts);
  };

  // 할인 정보 추가/수정
  const handleAddDiscount = () => {
    console.log({
      discountType,
      discountCondition,
      discountAmount,
      discountDate
    });
    
    if (!discountType || !discountAmount || 
        (discountType === "sex" && !discountCondition) || 
        (discountType === "earlybird" && !discountDate)) {
      alert("모든 할인 정보를 입력해주세요.");
      return;
    }

    const newDiscount: DiscountInfo = {
      type: discountType,
      condition: discountType === "earlybird" ? discountDate?.toISOString() || "" : discountCondition,
      amount: discountAmount,
      date: discountType === "earlybird" ? discountDate : undefined
    };

    if (editingIndex !== null) {
      // 수정 모드
      const newDiscounts = [...savedDiscounts];
      newDiscounts[editingIndex] = newDiscount;
      setSavedDiscounts(newDiscounts);
      setEditingIndex(null);
    } else {
      // 추가 모드
      setSavedDiscounts([...savedDiscounts, newDiscount]);
    }

    // 입력 필드 초기화
    setDiscountType("");
    setDiscountCondition("");
    setDiscountAmount("");
    setDiscountDate(undefined);
  };

  // 연락처 추가
  const handleAddContact = () => {
    if (!contactType || !contactAddress || 
        ((contactType === "phone" || contactType === "kakaotalk") && !contactName)) {
      alert("모든 연락처 정보를 입력해주세요.");
      return;
    }

    const newContact: ContactInfo = {
      type: contactType,
      address: contactAddress,
      name: contactName || "" // name이 필요없는 경우 빈 문자열로 설정
    };

    if (editingContactIndex !== null) {
      const newContacts = [...savedContacts];
      newContacts[editingContactIndex] = newContact;
      setSavedContacts(newContacts);
      setEditingContactIndex(null);
    } else {
      setSavedContacts([...savedContacts, newContact]);
    }

    // 입력 필드 초기화
    setContactType("");
    setContactAddress("");
    setContactName("");
  };

  // 연락처 수정
  const handleEditContact = (index: number) => {
    const contact = savedContacts[index];
    setContactType(contact.type);
    setContactAddress(contact.address);
    setContactName(contact.name);
    setEditingContactIndex(index);
  };

  // 연락처 삭제
  const handleDeleteContact = (index: number) => {
    setSavedContacts(savedContacts.filter((_, i) => i !== index));
  };

  // 공지사항 추가
  const handleAddNotice = () => {
    if (!noticeContent) {  // 조건 수정
      alert("공지사항 내용을 입력해주세요.");
      return;
    }

    const newNotice: NoticeInfo = {
      content: noticeContent  // type 필드 제거
    };

    if (editingNoticeIndex !== null) {
      const newNotices = [...savedNotices];
      newNotices[editingNoticeIndex] = newNotice;
      setSavedNotices(newNotices);
      setEditingNoticeIndex(null);
    } else {
      setSavedNotices([...savedNotices, newNotice]);
    }

    // 입력 필드 초기화
    setNoticeContent("");
  };

  // 공지사항 수정
  const handleEditNotice = (index: number) => {
    const notice = savedNotices[index];
    setNoticeContent(notice.content);
    setEditingNoticeIndex(index);
  };

  // 공지사항 삭제
  const handleDeleteNotice = (index: number) => {
    setSavedNotices(savedNotices.filter((_, i) => i !== index));
  };

  // 조건 추가
  const handleAddCondition = () => {
    if (!conditionContent) {
      alert("조건 내용을 입력해주세요.");
      return;
    }

    const newCondition: ConditionInfo = {
      content: conditionContent
    };

    if (editingConditionIndex !== null) {
      const newConditions = [...savedConditions];
      newConditions[editingConditionIndex] = newCondition;
      setSavedConditions(newConditions);
      setEditingConditionIndex(null);
    } else {
      setSavedConditions([...savedConditions, newCondition]);
    }

    setConditionContent("");
  };

  // 조건 수정
  const handleEditCondition = (index: number) => {
    const condition = savedConditions[index];
    setConditionContent(condition.content);
    setEditingConditionIndex(index);
  };

  // 조건 삭제
  const handleDeleteCondition = (index: number) => {
    setSavedConditions(savedConditions.filter((_, i) => i !== index));
  };

  // 종료일 다음에 추가
  // Subtext for date
  const handleAddDateSubtext = () => {
    if (!dateSubtextContent) {
      alert("내용을 입력해주세요.");
      return;
    }

    const newSubtext: DateSubtextInfo = {
      content: dateSubtextContent
    };

    if (editingDateSubtextIndex !== null) {
      const newSubtexts = [...savedDateSubtexts];
      newSubtexts[editingDateSubtextIndex] = newSubtext;
      setSavedDateSubtexts(newSubtexts);
      setEditingDateSubtextIndex(null);
    } else {
      setSavedDateSubtexts([...savedDateSubtexts, newSubtext]);
    }

    setDateSubtextContent("");
  };

  const handleEditDateSubtext = (index: number) => {
    const subtext = savedDateSubtexts[index];
    setDateSubtextContent(subtext.content);
    setEditingDateSubtextIndex(index);
  };

  const handleDeleteDateSubtext = (index: number) => {
    setSavedDateSubtexts(savedDateSubtexts.filter((_, i) => i !== index));
  };

  // 할인 정보 입력 영역 내부에 추가
  const handleAddDiscountSubtext = () => {
    if (!discountSubtextContent) {
      alert("내용을 입력해주세요.");
      return;
    }

    const newSubtext: SubtextForDiscountInfo = {
      content: discountSubtextContent
    };

    if (editingDiscountSubtextIndex !== null) {
      const newSubtexts = [...savedDiscountSubtexts];
      newSubtexts[editingDiscountSubtextIndex] = newSubtext;
      setSavedDiscountSubtexts(newSubtexts);
      setEditingDiscountSubtextIndex(null);
    } else {
      setSavedDiscountSubtexts([...savedDiscountSubtexts, newSubtext]);
    }

    setDiscountSubtextContent("");
  };

  const handleEditDiscountSubtext = (index: number) => {
    const subtext = savedDiscountSubtexts[index];
    setDiscountSubtextContent(subtext.content);
    setEditingDiscountSubtextIndex(index);
  };

  const handleDeleteDiscountSubtext = (index: number) => {
    setSavedDiscountSubtexts(savedDiscountSubtexts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const lessonData = {
        title,
        genre,
        instructor1,
        instructor2,
        region,
        place,
        place_url: placeUrl,
        price,
        bank,
        account_number: accountNumber,
        account_owner: accountOwner,
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
        startHour,
        startMinute,
        endHour,
        endMinute,
        discounts: savedDiscounts,
        contacts: savedContacts,
        notices: savedNotices,
        conditions: savedConditions,
        date_subtexts: savedDateSubtexts,
        discount_subtexts: savedDiscountSubtexts
      };
      await onSaved(lessonData);
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 기본 정보 섹션 */}
      <div className="space-y-4">
        <div className="text-lg font-medium">Basic Info</div>
        
        {/* 장르 */}
        <div className="grid gap-2">
          <Label htmlFor="genre">Genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger id="genre">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="salsa">살사</SelectItem>
              <SelectItem value="bachata">바차타</SelectItem>
              <SelectItem value="kizomba">키좀바</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 타이틀 */}
        <div className="grid gap-2">
          <Label htmlFor="title" className="text-sm">Title</Label>
          <Input id="name" placeholder="title of your lesson" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* 강사1 */}
        <div className="grid gap-2">
          <Label htmlFor="instructor1" className="text-sm">Instructor1</Label>
          <Select value={instructor1} onValueChange={setInstructor1}>
            <SelectTrigger id="instructor1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="browny">브라우니</SelectItem>
              <SelectItem value="kali">칼리</SelectItem>
              <SelectItem value="ㄴcarlett">스칼렛</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 강사2 */}
        <div className="grid gap-2">
          <Label htmlFor="instructor2" className="text-sm">Instructor2</Label>
          <Select value={instructor2} onValueChange={setInstructor2}>
            <SelectTrigger id="instructor2">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="browny">브라우니</SelectItem>
              <SelectItem value="kali">칼리</SelectItem>
              <SelectItem value="ㄴcarlett">스칼렛</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 시간 정보 섹션 */}
      <div className="space-y-4">
        <div className="text-base font-medium">Time Info</div>
        
        {/* 시작일 */}
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

        {/* 종료일 */}
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

        {/* 종료일 다음에 추가 */}
        {/* Subtext for date */}
        <div className="space-y-4">
          {/* <Label className="text-sm">Subtext for date</Label> */}
          
          {/* 저장된 subtext 표시 */}
          {savedDateSubtexts.length > 0 && (
            <div className="space-y-2">
              {savedDateSubtexts.map((subtext, index) => (
                <div 
                  key={index} 
                  className="relative rounded-lg border p-3 bg-muted"
                >
                  <div className="pr-16 text-sm break-words">
                    {subtext.content}
                  </div>

                  {/* 수정/삭제 버튼 */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditDateSubtext(index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteDateSubtext(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="flex gap-2">
            <Input 
              id="date_subtext_content" 
              placeholder="날짜 관련 추가 설명을 입력하세요" 
              value={dateSubtextContent}
              onChange={(e) => setDateSubtextContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddDateSubtext();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddDateSubtext}
              className="shrink-0"
            >
              {editingDateSubtextIndex !== null ? "수정" : "입력"}
            </Button>
          </div>
        </div>

        {/* 시작 시간 */}
        <div className="grid gap-2">
          <Label className="text-sm">시작 시간</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={startHour} onValueChange={setStartHour}>
                <SelectTrigger>
                  <SelectValue placeholder="시" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={startMinute} onValueChange={setStartMinute}>
                <SelectTrigger>
                  <SelectValue placeholder="분" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 종료 시간 */}
        <div className="grid gap-2">
          <Label className="text-sm">종료 시간</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={endHour} onValueChange={setEndHour}>
                <SelectTrigger>
                  <SelectValue placeholder="시" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={endMinute} onValueChange={setEndMinute}>
                <SelectTrigger>
                  <SelectValue placeholder="분" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 장소 정보 섹션 */}
      <div className="space-y-4">
        <div className="text-base font-medium">Location Info</div>
        
        {/* 지역 */}
        <div className="grid gap-2">
          <Label htmlFor="region" className="text-sm">Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder="지역을 선택하세요" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="hd">홍대</SelectItem>
              <SelectItem value="gn">강남</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 장소 */}
        <div className="grid gap-2">
          <Label htmlFor="place" className="text-sm">Place</Label>
          <Input id="place" placeholder="장소를 입력하세요" value={place} onChange={(e) => setPlace(e.target.value)} />
          <Input id="place_url" placeholder="장소 링크를 입력하세요" value={placeUrl} onChange={(e) => setPlaceUrl(e.target.value)} />
        </div>
      </div>

      {/* 가격 정보 섹션 */}
      <div className="space-y-4">
        <div className="text-base font-medium">Price Info</div>
        
        {/* 금액 */}
        <div className="grid gap-2">
          <Label htmlFor="price" className="text-sm">Price</Label>
          <Input id="price" placeholder="금액을 입력하세요" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        {/* 할인 정보 */}
        <div className="space-y-4">
          <Label className="text-sm">Discount</Label>
          
          {/* 저장된 할인 정보 표시 */}
          {savedDiscounts.length > 0 && (
            <div className="space-y-2">
              {savedDiscounts.map((discount, index) => (
                <div 
                  key={index} 
                  className="group relative rounded-lg border p-3 bg-muted"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', index.toString());
                    e.currentTarget.classList.add('dragging', 'opacity-50');
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.classList.remove('dragging', 'opacity-50');
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    const draggingElement = document.querySelector('.dragging');
                    const currentElement = e.currentTarget;
                    if (!draggingElement || draggingElement === currentElement) return;
                    
                    const container = currentElement.parentElement;
                    if (!container) return;
                    
                    const children = [...container.children];
                    const currentIndex = children.indexOf(currentElement);
                    const draggingIndex = children.indexOf(draggingElement);
                    
                    if (currentIndex > draggingIndex) {
                      currentElement.after(draggingElement);
                    } else {
                      currentElement.before(draggingElement);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    const toIndex = index;
                    if (fromIndex === toIndex) return;
                    
                    handleReorderDiscount(fromIndex, toIndex);
                  }}
                >
                  {/* 드래그 핸들 */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 cursor-move">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* 할인 정보 내용 */}
                  <div className="ml-6 flex flex-col space-y-1 text-sm">
                    <div>
                      <span>
                        타입: {discount.type === "earlybird" ? "얼리버드" : "성별"}
                      </span>
                    </div>
                    <div>
                      {discount.type === "earlybird" ? (
                        <span>
                          마감일: {discount.date && format(new Date(discount.date), "yyyy-MM-dd")}
                        </span>
                      ) : (
                        <span>대상: {discount.condition === "male" ? "남성" : "여성"}</span>
                      )}
                    </div>
                    <div>
                      할인금액: {discount.amount}원
                    </div>
                  </div>

                  {/* 수정/삭제 버튼 */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
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
                {editingIndex !== null ? "수정" : "입력"}
              </Button>
            </div>
          </div>
        </div>

        {/* Subtext for discount */}
        <div className="space-y-4">
          {/* <Label className="text-sm">Subtext for discount</Label> */}
          
          {/* 저장된 subtext 표시 */}
          {savedDiscountSubtexts.length > 0 && (
            <div className="space-y-2">
              {savedDiscountSubtexts.map((subtext, index) => (
                <div 
                  key={index} 
                  className="relative rounded-lg border p-3 bg-muted"
                >
                  <div className="pr-16 text-sm break-words">
                    {subtext.content}
                  </div>

                  {/* 수정/삭제 버튼 */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditDiscountSubtext(index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteDiscountSubtext(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="flex gap-2">
            <Input 
              id="discount_subtext_content" 
              placeholder="할인 관련 추가 설명을 입력하세요" 
              value={discountSubtextContent}
              onChange={(e) => setDiscountSubtextContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddDiscountSubtext();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddDiscountSubtext}
              className="shrink-0"
            >
              {editingDiscountSubtextIndex !== null ? "수정" : "입력"}
            </Button>
          </div>
        </div>
      </div>

      {/* 계좌 */}
      <div className="space-y-4">
        <Label className="text-sm">Account</Label>
        <div className="flex flex-col space-y-1.5">
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger id="bank">
              <SelectValue placeholder="은행을 선택하세요" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="sh">신한</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            id="account" 
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="계좌번호를 입력하세요" 
          />
          <Input 
            id="account_owner" 
            value={accountOwner}
            onChange={(e) => setAccountOwner(e.target.value)}
            placeholder="계좌주를 입력하세요" 
          />
        </div>
      </div>

      {/* 기타 정보 섹션 */}
      <div className="space-y-4">
        <div className="text-base font-medium">Additional Info</div>
        
        {/* 문의 */}
        <div className="space-y-4">
          <Label className="text-sm">Contact</Label>
          
          {/* 저장된 연락처 정보 표시 */}
          {savedContacts.length > 0 && (
            <div className="space-y-2">
              {savedContacts.map((contact, index) => (
                <div 
                  key={index} 
                  className="relative rounded-lg border p-3 bg-muted"
                >
                  <div className="pr-16 text-sm break-words">
                    <div>타입: {contact.type}</div>
                    <div>연락처: {contact.address}</div>
                    {contact.name && <div>이름: {contact.name}</div>}
                  </div>

                  {/* 수정/삭제 버튼 */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditContact(index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteContact(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="space-y-2">
            <Select value={contactType} onValueChange={setContactType}>
              <SelectTrigger id="contact_type">
                <SelectValue placeholder="타입을 선택하세요" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="phone">전화번호</SelectItem>
                <SelectItem value="kakaotalk">카카오톡</SelectItem>
                <SelectItem value="instagram">인스타그램</SelectItem>
                <SelectItem value="cafe">카페</SelectItem>
              </SelectContent>
            </Select>

            {(contactType === "phone" || contactType === "kakaotalk") ? (
              // phone 또는 kakaotalk인 경우
              <div className="flex-1 flex flex-col gap-2">
                <Input 
                  id="contact_address" 
                  placeholder="연락처를 입력하세요" 
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddContact();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Input 
                    id="contact_name" 
                    placeholder="이름을 입력하세요" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddContact();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddContact}
                    className="shrink-0"
                  >
                    {editingContactIndex !== null ? "수정" : "입력"}
                  </Button>
                </div>
              </div>
            ) : (
              // 그 외의 경우
              <div className="flex gap-2">
                <Input 
                  id="contact_address" 
                  placeholder="연락처를 입력하세요" 
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddContact();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddContact}
                  className="shrink-0"
                >
                  {editingContactIndex !== null ? "수정" : "입력"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 공지사항 */}
        <div className="space-y-4">
          <Label className="text-sm">Notice</Label>
          
          {/* 저장된 공지사항 표시 */}
          {savedNotices.length > 0 && (
            <div className="space-y-2">
              {savedNotices.map((notice, index) => (
                <div 
                  key={index} 
                  className="relative rounded-lg border p-3 bg-muted"
                >
                  <div className="pr-16 text-sm break-words">
                    {notice.content}
                  </div>

                  {/* 수정/삭제 버튼 */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditNotice(index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteNotice(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="flex gap-2">
            <Input 
              id="notice_content" 
              placeholder="공지사항을 입력하세요" 
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddNotice();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddNotice}
              className="shrink-0"
            >
              {editingNoticeIndex !== null ? "수정" : "입력"}
            </Button>
          </div>
        </div>

        {/* 조건 */}
        <div className="space-y-4">
          <Label className="text-sm">Condition</Label>
          
          {/* 저장된 조건 표시 */}
          {savedConditions.length > 0 && (
            <div className="space-y-2">
              {savedConditions.map((condition, index) => (
                <div 
                  key={index} 
                  className="relative rounded-lg border p-3 bg-muted"
                >
                  <div className="pr-16 text-sm break-words">
                    {condition.content}
                  </div>

                  {/* 수정/삭제 버튼 */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditCondition(index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteCondition(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="flex gap-2">
            <Input 
              id="condition_content" 
              placeholder="조건을 입력하세요" 
              value={conditionContent}
              onChange={(e) => setConditionContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCondition();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddCondition}
              className="shrink-0"
            >
              {editingConditionIndex !== null ? "수정" : "입력"}
            </Button>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            router.push('/');  // 취소 시 루트로 이동
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
