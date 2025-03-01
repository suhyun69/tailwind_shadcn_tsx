"use client"

import * as React from "react"
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ChevronDown, Plus, MoreHorizontal } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProfileForm } from "@/components/ProfileForm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ProfileData = {
  profile_id: string;
  nickname: string;
  sex: string;
  is_instructor: boolean;
  contacts: ContactInfo[];
  bank_info?: {
    bank: string;
    account: string;
    owner: string;
  };
};

type ContactInfo = {
  type: string;
  address: string;
  name: string;
}

export function ProfileList() {
  const [profiles, setProfiles] = React.useState<ProfileData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [selectedProfile, setSelectedProfile] = React.useState<ProfileData | null>(null)

  // 프로필 목록 조회
  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProfiles(data || []);
    } catch (error) {
      console.error('프로필 조회 중 오류 발생:', error);
      toast.error("프로필 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfiles();
  }, []);

  // 은행 이름 매핑
  const getBankName = (code: string) => {
    const bankMap: { [key: string]: string } = {
      'sh': '신한',
      'kb': '국민',
      'wr': '우리',
      'hn': '하나',
      'kk': '카카오',
      'toss': '토스'
    };
    return bankMap[code] || code;
  };

  // 프로필 저장 완료 후 콜백
  const handleProfileSaved = () => {
    setOpen(false)
    setSelectedProfile(null)
    fetchProfiles()
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-semibold leading-none tracking-tight">프로필 목록</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              등록된 프로필 정보를 확인할 수 있습니다.
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedProfile ? "프로필 수정" : "프로필 생성"}
                </DialogTitle>
                <DialogDescription>
                  {selectedProfile ? "프로필 정보를 수정합니다." : "새로운 프로필을 생성합니다."}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ProfileForm 
                  profile={selectedProfile}
                  onSaved={handleProfileSaved} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            등록된 프로필이 없습니다.
          </div>
        ) : (
          <div className="grid gap-6">
            {profiles.map((profile) => (
              <div key={profile.profile_id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {profile.nickname.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{profile.nickname}</p>
                      {profile.is_instructor && (
                        <Badge variant="secondary" className="text-xs">강사</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {profile.profile_id}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedProfile(profile)
                      setOpen(true)
                    }}>
                      수정
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 