"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react"
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

export function LessonList() {
  const router = useRouter()
  const [lessons, setLessons] = React.useState<LessonData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedLessons, setSelectedLessons] = React.useState<string[]>([])

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

  const handleLessonClick = (lesson: LessonData) => {
    router.push(`/lessons/${lesson.lesson_no}`)
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
          <Button onClick={() => router.push('/lessons/new')}>
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
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Instructors</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[150px]">Created At</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.lesson_id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedLessons.includes(lesson.lesson_id)}
                        onCheckedChange={(checked) => toggleOne(checked as boolean, lesson.lesson_id)}
                        aria-label={`Select lesson ${lesson.lesson_no}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">#{lesson.lesson_no}</TableCell>
                    <TableCell 
                      className="cursor-pointer hover:underline"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      {lesson.title}
                    </TableCell>
                    <TableCell>{lesson.genre}</TableCell>
                    <TableCell>
                      {[lesson.instructor1, lesson.instructor2]
                        .filter(Boolean)
                        .join(', ')}
                    </TableCell>
                    <TableCell>{lesson.region || '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={lesson.status === 'published' ? "default" : "secondary"}
                      >
                        {lesson.status === 'published' ? '게시됨' : '임시저장'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/lessons/${lesson.lesson_no}`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              // TODO: 삭제 기능 구현
                              toast.error("삭제 기능은 아직 구현되지 않았습니다.")
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
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
    </Card>
  )
} 