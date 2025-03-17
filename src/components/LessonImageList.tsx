'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

type LessonImage = {
  lesson_no: string
  image_url: string
}

export function LessonImageList() {
  const [images, setImages] = useState<LessonImage[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from('lessons')
        .select('lesson_no, image_url')
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching images:', error)
        return
      }

      setImages(data)
    }

    fetchImages()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image) => (
        image.image_url && (
          <div key={image.lesson_no} className="relative aspect-auto">
            <img
              src={image.image_url}
              alt={`Lesson ${image.lesson_no}`}
              className="rounded-lg object-cover w-full h-full hover:opacity-75 transition-opacity cursor-pointer"
              onClick={() => window.location.href = `/lesson/${image.lesson_no}`}
            />
          </div>
        )
      ))}
    </div>
  )
} 