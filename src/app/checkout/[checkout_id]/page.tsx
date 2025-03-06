"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

type CheckoutData = {
  checkout_id: string
  lesson_no: number
  discounts: Array<{
    type: string
    amount: number
    condition?: string
    date?: string
  }>
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const { data, error } = await supabase
          .from('checkout')
          .select('*')
          .eq('checkout_id', params.checkout_id)
          .single()

        if (error) throw error
        setCheckoutData(data)
      } catch (error) {
        console.error('Error:', error)
        toast.error("데이터를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCheckoutData()
  }, [params.checkout_id])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!checkoutData) {
    return <div>결제 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">할인 정보</h2>
        <p className="mt-4 text-gray-600">적용 가능한 할인을 선택하세요.</p>
      </div>
      <div className="mt-12 grid gap-6 max-w-5xl mx-auto place-items-center grid-cols-1">
        <Card className="shadow-lg w-full max-w-sm">
          <CardHeader>
            <CardTitle>할인 옵션</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mt-4 space-y-2">
              {checkoutData.discounts.map((discount, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {discount.type === "earlybird" 
                    ? `얼리버드 할인: ${discount.amount.toLocaleString()}원`
                    : `${discount.condition === 'male' ? '남성' : '여성'} 할인: ${discount.amount.toLocaleString()}원`
                  }
                </li>
              ))}
            </ul>
            <Button 
              className="mt-6 w-full"
              onClick={async () => {
                try {
                  const { data, error } = await supabase
                    .from('payments')
                    .insert({
                      lesson_no: checkoutData.lesson_no
                    })
                    .select('payment_id')
                    .single()

                  if (error) throw error

                  toast.success("결제가 완료되었습니다.")
                  router.push('/checkout/complete')
                } catch (error) {
                  console.error('Error:', error)
                  toast.error("결제에 실패했습니다.")
                }
              }}
            >
              결제하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
