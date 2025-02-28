"use client"

import { useState } from "react"
import * as React from "react"

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

import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, GripVertical, Pencil, X } from "lucide-react"

// 할인 정보 타입 정의
type DiscountInfo = {
  type: string;
  condition: string;
  amount: string;
  date?: Date;
}

export function LessonForm() {

  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [startHour, setStartHour] = React.useState("")
  const [startMinute, setStartMinute] = React.useState("")
  const [endHour, setEndHour] = React.useState("")
  const [endMinute, setEndMinute] = React.useState("")
  const [discountType, setDiscountType] = React.useState("")
  const [discountCondition, setDiscountCondition] = React.useState("")
  const [discountAmount, setDiscountAmount] = React.useState("")
  const [discountDate, setDiscountDate] = React.useState<Date>()
  const [savedDiscounts, setSavedDiscounts] = React.useState<DiscountInfo[]>([])
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  
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

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Lesson</CardTitle>
        <CardDescription>수업을 생성합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">

            {/* 타이틀 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="name" placeholder="title of your lesson" />
            </div>

            {/* 강사1 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="instructor1">Instructor1</Label>
              <Select>
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
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="instructor2">Instructor2</Label>
              <Select>
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

            {/* 시작일 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="start_date">시작일</Label>
              <Popover>
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
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 종료일 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="end_date">종료일</Label>
              <Popover>
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
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 시작 시간 */}
            <div className="flex flex-col space-y-1.5">
              <Label>시작 시간</Label>
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
            <div className="flex flex-col space-y-1.5">
              <Label>종료 시간</Label>
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

            {/* 지역 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="region">Region</Label>
              <Select>
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
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="place">Place</Label>
              <Input id="place" placeholder="장소를 입력하세요" />
            </div>

            {/* 금액 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input id="price" placeholder="금액을 입력하세요" />
            </div>

            {/* 할인 정보 */}
            <div className="space-y-4">
              <Label className="text-base">Discount</Label>

              {/* 저장된 할인 정보 표시 */}
              {savedDiscounts.length > 0 && (
                <div className="space-y-2">
                  {/* <Label className="text-base">적용된 할인</Label> */}
                  {savedDiscounts.map((discount, index) => (
                    <div 
                      key={index} 
                      className="group relative rounded-lg border p-3 bg-muted hover:bg-muted/80"
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
                        <div >
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
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDiscount(index)}
                        >
                          수정
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteDiscount(index)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 할인 타입 */}
              <div className="flex flex-col space-y-1.5">
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
                {discountType && (
                  <>
                    {renderDiscountConditions()}
                  </>
                )}

                {/* 할인 금액 */}
                <Input 
                  id="discount_amount" 
                  placeholder="할인 금액을 입력하세요" 
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                />
              </div>


              {/* 적용/수정 버튼 */}
              <Button
                type="button"
                className="w-full"
                onClick={handleAddDiscount}
              >
                {editingIndex !== null ? "할인 수정" : "할인 적용"}
              </Button>
            </div>

            {/* 계좌 */}
            <div className="space-y-4">
              <Label className="text-base">Account</Label>
              <div className="flex flex-col space-y-1.5">
                <Select>
                  <SelectTrigger id="bank">
                    <SelectValue placeholder="은행을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="sh">신한</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="account" placeholder="계좌번호를 입력하세요" />
                <Input id="account_owner" placeholder="계좌주를 입력하세요" />
              </div>
            </div>

          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
