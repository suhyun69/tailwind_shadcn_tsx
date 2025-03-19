import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Applicant = {
  name: string
  email: string
  status: 'confirmed' | 'pending'
}

type ApplicantsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lesson?: {
    lesson_no: number
    title: string
  } | null
}

export function ApplicantsDialog({ open, onOpenChange, lesson }: ApplicantsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>신청현황</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {lesson?.title} (#{lesson?.lesson_no})
          </p>
        </DialogHeader>
        <div className="overflow-hidden rounded-t-none border-t bg-transparent">
          <input 
            className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="이름으로 검색..." 
          />
          <div>
            <div className="py-6 text-center text-sm">신청자가 없습니다.</div>
            <div className="p-2">
              {/* TODO: 실제 신청자 데이터로 교체 */}
              {[
                { name: "홍길동", email: "hong@example.com", status: "confirmed" as const },
                { name: "김철수", email: "kim@example.com", status: "pending" as const },
              ].map((user: Applicant) => (
                <div
                  key={user.email}
                  className="flex items-center px-2"
                >
                  <Avatar>
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Badge 
                    variant={user.status === "confirmed" ? "default" : "secondary"}
                    className="ml-auto"
                  >
                    {user.status === "confirmed" ? "확정" : "대기"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center border-t p-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 