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
import { Calendar as CalendarIcon } from "lucide-react"

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
    }
  }, [lesson])

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
        </CardContent>
      </Card>


    </form>
    
  )
}