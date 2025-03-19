"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus, MoreHorizontal, Pencil, Trash, ArrowUpDown, ChevronUp, ChevronDown, Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getGenreText, getRegionText } from "@/lib/utils"
import { ApplicantsDialog } from "@/components/ApplicantsDialog"

// 기존 함수들 제거하고 import한 함수 사용
type LessonData = {
  lesson_id: string
  lesson_no: number
  title: string
  genre: string
  instructor1?: string
  instructor2?: string
  region?: string
  status: 'draft' | 'published'
  created_at: string
}

type SortConfig = {
  column: keyof LessonData | null
  direction: 'asc' | 'desc'
}

export function LessonList() {
  const router = useRouter()
  const [lessons, setLessons] = React.useState<LessonData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedLessons, setSelectedLessons] = React.useState<string[]>([])
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    column: 'created_at',
    direction: 'desc'
  })
  const [isApplicantsDialogOpen, setIsApplicantsDialogOpen] = React.useState(false)
  const [selectedLesson, setSelectedLesson] = React.useState<LessonData | null>(null)

  const fetchLessons = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order(sortConfig.column || 'created_at', { 
          ascending: sortConfig.direction === 'asc' 
        })

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
  }, [sortConfig])

  const handleLessonClick = (lesson: LessonData) => {
    router.push(`/lesson/${lesson.lesson_no}`)
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedLessons(lessons.map(lesson => lesson.lesson_id))
    } else {
      setSelectedLessons([])
    }
  }

  const toggleOne = (checked: boolean, lessonId: string) => {
    if (checked) {
      setSelectedLessons([...selectedLessons, lessonId])
    } else {
      setSelectedLessons(selectedLessons.filter(id => id !== lessonId))
    }
  }

  const handleSort = (column: keyof LessonData) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    }))
  }

  const SortableHeader = ({ 
    column, 
    children 
  }: { 
    column: keyof LessonData
    children: React.ReactNode 
  }) => {
    const isActive = sortConfig.column === column
    
    return (
      <TableHead>
        <Button
          variant="ghost"
          onClick={() => handleSort(column)}
          className="flex items-center gap-1 p-0 h-auto font-medium"
        >
          {children}
          {isActive ? (
            sortConfig.direction === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </TableHead>
    )
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
          <Button onClick={() => router.push('/lesson/form')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            등록된 수업이 없습니다.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedLessons.length === lessons.length}
                      onCheckedChange={(checked) => toggleAll(checked as boolean)}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <SortableHeader column="lesson_no">No.</SortableHeader>
                  <SortableHeader column="title">Title</SortableHeader>
                  <SortableHeader column="instructor1">Instructors</SortableHeader>
                  <SortableHeader column="region">Region</SortableHeader>
                  <SortableHeader column="genre">Genre</SortableHeader>
                  <SortableHeader column="status">Status</SortableHeader>
                  <SortableHeader column="created_at">Created At</SortableHeader>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.lesson_id}>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={selectedLessons.includes(lesson.lesson_id)}
                        onCheckedChange={(checked) => toggleOne(checked as boolean, lesson.lesson_id)}
                        aria-label={`Select lesson ${lesson.lesson_no}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-center">{lesson.lesson_no}</TableCell>
                    <TableCell 
                      className="cursor-pointer hover:underline text-center"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      {lesson.title}
                    </TableCell>
                    <TableCell className="text-center">
                      {[lesson.instructor1, lesson.instructor2]
                        .filter(Boolean)
                        .join(', ')}
                    </TableCell>
                    <TableCell className="text-center">{lesson.region ? getRegionText(lesson.region) : '-'}</TableCell>
                    <TableCell className="text-center">{getGenreText(lesson.genre)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={lesson.status === 'published' ? "default" : "secondary"}
                      >
                        {lesson.status === 'published' ? '게시됨' : '임시저장'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/lesson/form/${lesson.lesson_no}`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              toast.error("삭제 기능은 아직 구현되지 않았습니다.")
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedLesson(lesson)
                              setIsApplicantsDialogOpen(true)
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            신청현황
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <ApplicantsDialog 
        open={isApplicantsDialogOpen}
        onOpenChange={setIsApplicantsDialogOpen}
        lesson={selectedLesson}
      />
    </Card>
  )
} 