"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { LessonForm } from "@/components/LessonForm"

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
  start_time?: string
  end_time?: string
  discounts?: any[]
  contacts?: any[]
  notices?: any[]
  conditions?: any[]
  date_subtexts?: any[]
  discount_subtexts?: any[]
  status: 'draft' | 'published'
  created_at: string
}

export function LessonList() {
  const [open, setOpen] = React.useState(false)
  const [lessons, setLessons] = React.useState<LessonData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedLesson, setSelectedLesson] = React.useState<LessonData | null>(null)

  const fetchLessons = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLessons(data || [])
    } catch (error) {
      console.error('Error fetching lessons:', error)
      toast.error("수업 목록을 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchLessons()
  }, [])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setSelectedLesson(null)
    }
  }

  const handleLessonSaved = () => {
    handleOpenChange(false)
    fetchLessons()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Lessons</CardTitle>
            <CardDescription>
              수업 목록을 관리하세요
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedLesson ? "수업 수정" : "새 수업 추가"}
                </DialogTitle>
              </DialogHeader>
              <LessonForm
                lesson={selectedLesson}
                onSaved={handleLessonSaved}
                onCancel={() => handleOpenChange(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              등록된 수업이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card 
                  key={lesson.lesson_id}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setSelectedLesson(lesson)
                    setOpen(true)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{lesson.lesson_no}</span>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <Badge 
                          variant={lesson.status === 'published' ? "default" : "secondary"}
                          className="ml-auto"
                        >
                          {lesson.status === 'published' ? '게시됨' : '임시저장'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{lesson.genre}</span>
                        {lesson.instructor1 && (
                          <>
                            <span>•</span>
                            <span>{lesson.instructor1}</span>
                          </>
                        )}
                        {lesson.instructor2 && (
                          <>
                            <span>•</span>
                            <span>{lesson.instructor2}</span>
                          </>
                        )}
                        {lesson.region && (
                          <>
                            <span>•</span>
                            <span>{lesson.region}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 