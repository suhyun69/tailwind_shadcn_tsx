'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CouponTemplateRow = {
  id: number
  name: string
  discount_amount: number
  lesson_no: number
  created_at: string
  coupons: { count: number }[]
  available_coupons: { count: number }[]
}

export function CouponList() {
  const [coupons, setCoupons] = useState<CouponTemplateRow[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
  const [detailCoupons, setDetailCoupons] = useState<Array<{
    id: number
    code: string
    status: 'available' | 'used' | 'expired'
    used_at: string | null
  }>>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCouponTemplates() {
      const { data, error } = await supabase
        .from('coupon_templates')
        .select<string, CouponTemplateRow>(`
          *,
          available_coupons:coupons!inner(count).filter(status.eq.available),
          coupons:coupons!inner(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching coupon templates:', error)
        return
      }

      // 결과 데이터 포맷팅
      const formattedData = data?.map(row => ({
        id: row.id,
        name: row.name,
        discount_amount: row.discount_amount,
        lesson_no: row.lesson_no,
        created_at: row.created_at,
        coupons: row.coupons,
        available_coupons: row.available_coupons
      })) || []

      setCoupons(formattedData)
    }

    fetchCouponTemplates()
  }, [])

  const fetchDetailCoupons = async (templateId: number) => {
    const { data, error } = await supabase
      .from('coupons')
      .select('id, code, status, used_at')
      .eq('template_id', templateId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching coupons:', error)
      return
    }

    setDetailCoupons(data || [])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>쿠폰 목록</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">코드</TableHead>
              <TableHead className="text-center">쿠폰명</TableHead>
              <TableHead className="text-center">할인금액</TableHead>
              <TableHead className="text-center">수업번호</TableHead>
              <TableHead className="text-center">수량</TableHead>
              {/* <TableHead className="text-center">상태</TableHead> */}
              {/* <TableHead className="text-center">생성일시</TableHead> */}
              <TableHead className="text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="text-center font-medium">{coupon.id}</TableCell>
                <TableCell 
                  className="text-center cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    if (selectedTemplateId === coupon.id) {
                      setSelectedTemplateId(null)
                      setDetailCoupons([])
                    } else {
                      setSelectedTemplateId(coupon.id)
                      fetchDetailCoupons(coupon.id)
                    }
                  }}
                >
                  {coupon.name}
                </TableCell>
                <TableCell className="text-center">{coupon.discount_amount.toLocaleString()}원</TableCell>
                <TableCell className="text-center">#{coupon.lesson_no}</TableCell>
                <TableCell className="text-center">
                  {coupon.available_coupons?.[0]?.count || 0} / {coupon.coupons?.[0]?.count || 0}
                </TableCell>
                {/* <TableCell className="text-center">
                  <Badge 
                    variant="default"
                  >
                    사용가능
                  </Badge>
                </TableCell> */}
                {/* <TableCell className="text-center text-muted-foreground">
                  {coupon.created_at}
                </TableCell> */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          // TODO: 만료 처리 기능 구현
                        }}
                      >
                        만료처리
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedTemplateId && detailCoupons.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">개별 쿠폰 목록</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">쿠폰 코드</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-center">사용일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="text-center font-medium">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={
                          coupon.status === 'available' ? "default" : 
                          coupon.status === 'used' ? "secondary" : 
                          "destructive"
                        }
                      >
                        {
                          coupon.status === 'available' ? "사용가능" : 
                          coupon.status === 'used' ? "사용완료" : 
                          "만료"
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {coupon.used_at ? new Date(coupon.used_at).toLocaleString() : '-'}
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