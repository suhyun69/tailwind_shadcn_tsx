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
import { CalendarIcon } from "lucide-react"

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

            {/* 할인 정보 */}
            <div className="space-y-4">
              <Label className="text-base">할인 정보</Label>
              
              {/* 할인 타입 */}
              <div className="flex flex-col space-y-1.5">
                <Select value={discountType} onValueChange={(value) => {
                  setDiscountType(value);
                  setDiscountCondition("");
                  setDiscountDate(undefined); // 타입 변경 시 날짜도 초기화
                }}>
                  <SelectTrigger id="discount_type">
                    <SelectValue placeholder="할인 타입 선택" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="earlybird">얼리버드</SelectItem>
                    <SelectItem value="sex">성별 할인</SelectItem>
                  </SelectContent>
                </Select>

                {discountType && (
                  <>
                    {renderDiscountConditions()}
                  </>
                )}

                <Input id="discount_amount" placeholder="할인 금액을 입력하세요" />
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
