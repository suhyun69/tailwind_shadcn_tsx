import { LessonList } from "@/components/LessonList"
import { CouponList } from "@/components/CouponList"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LessonList />
      <CouponList />
    </div>
  )
}