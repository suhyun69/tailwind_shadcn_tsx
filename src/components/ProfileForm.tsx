"use client"

import * as React from "react"
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

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
import { Switch } from "@/components/ui/switch"
import { Pencil, X } from "lucide-react"

// ContactInfo 타입 정의 추가
type ContactInfo = {
  type: string;
  address: string;
  name: string;
}

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

type ProfileFormProps = {
  profile?: ProfileData | null;
  onSaved?: () => void;
}

export function ProfileForm({ profile, onSaved }: ProfileFormProps) {
  // 랜덤 ID 생성 함수
  const generateRandomId = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () => 
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  };

  // 초기값 설정
  const [profileId] = React.useState(profile?.profile_id || generateRandomId())
  const [nickname, setNickname] = React.useState(profile?.nickname || "")
  const [sex, setSex] = React.useState(profile?.sex || "")
  const [isInstructor, setIsInstructor] = React.useState(profile?.is_instructor || false)
  const [bank, setBank] = React.useState(profile?.bank_info?.bank || "")
  const [account, setAccount] = React.useState(profile?.bank_info?.account || "")
  const [accountOwner, setAccountOwner] = React.useState(profile?.bank_info?.owner || "")
  const [savedContacts, setSavedContacts] = React.useState<ContactInfo[]>(profile?.contacts || [])

  // Contact 관련 상태 추가
  const [contactType, setContactType] = React.useState("")
  const [contactAddress, setContactAddress] = React.useState("")
  const [contactName, setContactName] = React.useState("")
  const [editingContactIndex, setEditingContactIndex] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 필수 입력값 검증 (닉네임과 성별만 필수)
      if (!nickname || !sex) {
        toast.error("필수 항목을 모두 입력해주세요.");
        setIsLoading(false);
        return;
      }

      // 프로필 데이터 구성
      const profileData: ProfileData = {
        profile_id: profileId,
        nickname,
        sex,
        is_instructor: isInstructor,
        contacts: savedContacts,
      };

      // 계좌 정보가 부분적으로 입력된 경우에만 검증
      if (isInstructor && (bank || account || accountOwner)) {
        if (!bank || !account || !accountOwner) {
          toast.error("계좌 정보를 모두 입력해주세요.");
          setIsLoading(false);
          return;
        }
        
        profileData.bank_info = {
          bank,
          account,
          owner: accountOwner
        };
      }

      // Supabase에 데이터 저장
      const { data, error } = await supabase
        .from('profiles')
        .upsert([profileData])
        .select()
        .single();

      if (error) throw error;

      toast.success("프로필이 저장되었습니다.");
      onSaved?.();
      
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      toast.error("저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  // Contact 관련 핸들러 추가
  const handleAddContact = () => {
    if (!contactType || !contactAddress || 
        ((contactType === "phone" || contactType === "kakaotalk") && !contactName)) {
      alert("모든 연락처 정보를 입력해주세요.");
      return;
    }

    const newContact: ContactInfo = {
      type: contactType,
      address: contactAddress,
      name: contactName || ""
    };

    if (editingContactIndex !== null) {
      const newContacts = [...savedContacts];
      newContacts[editingContactIndex] = newContact;
      setSavedContacts(newContacts);
      setEditingContactIndex(null);
    } else {
      setSavedContacts([...savedContacts, newContact]);
    }

    setContactType("");
    setContactAddress("");
    setContactName("");
  };

  const handleEditContact = (index: number) => {
    const contact = savedContacts[index];
    setContactType(contact.type);
    setContactAddress(contact.address);
    setContactName(contact.name);
    setEditingContactIndex(index);
  };

  const handleDeleteContact = (index: number) => {
    setSavedContacts(savedContacts.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-6">
        <div className="space-y-4">
          <div className="text-base font-medium">Basic Info</div>
          
          {/* ID */}
          <div className="grid gap-2">
            <Label htmlFor="profileId" className="text-sm">ID</Label>
            <Input 
              id="profileId" 
              value={profileId}
              disabled
              className="bg-muted"
            />
          </div>

          {/* 닉네임 */}
          <div className="grid gap-2">
            <Label htmlFor="nickname" className="text-sm">Nickname</Label>
            <Input 
              id="nickname" 
              placeholder="닉네임을 입력하세요" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* 성별 */}
          <div className="grid gap-2">
            <Label htmlFor="sex" className="text-sm">Sex</Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger id="sex">
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 강사 여부 */}
          <div className="flex items-center justify-between space-x-4">
            <Label 
              htmlFor="isInstructor" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col space-y-1"
            >
              <span>Instructor</span>
            </Label>
            <Switch
              id="isInstructor"
              checked={isInstructor}
              onCheckedChange={setIsInstructor}
              className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
            />
          </div>
        </div>

        {/* Instructor가 true일 때만 표시되는 섹션 */}
        {isInstructor && (
          <>
            {/* 계좌 정보 */}
            <div className="space-y-4">
              <Label className="text-sm">Account</Label>
              {/* <div className="text-base font-medium">Account Info</div> */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="은행을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="sh">신한</SelectItem>
                      <SelectItem value="kb">국민</SelectItem>
                      <SelectItem value="wr">우리</SelectItem>
                      <SelectItem value="hn">하나</SelectItem>
                      <SelectItem value="kk">카카오</SelectItem>
                      <SelectItem value="toss">토스</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="account" 
                    placeholder="계좌번호를 입력하세요" 
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                  <Input 
                    id="account_owner" 
                    placeholder="계좌주를 입력하세요" 
                    value={accountOwner}
                    onChange={(e) => setAccountOwner(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-4">
              <Label className="text-sm">Contact</Label>
              {/* <div className="text-base font-medium">Contact Info</div> */}
              
              {/* 저장된 연락처 정보 표시 */}
              {savedContacts.length > 0 && (
                <div className="space-y-2">
                  {savedContacts.map((contact, index) => (
                    <div 
                      key={index} 
                      className="relative rounded-lg border p-3 bg-muted"
                    >
                      <div className="pr-16 text-sm break-words">
                        <div>타입: {contact.type}</div>
                        <div>연락처: {contact.address}</div>
                        {contact.name && <div>이름: {contact.name}</div>}
                      </div>

                      {/* 수정/삭제 버튼 */}
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditContact(index)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteContact(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 입력 영역 */}
              <div className="space-y-2">
                <Select value={contactType} onValueChange={setContactType}>
                  <SelectTrigger id="contact_type">
                    <SelectValue placeholder="타입을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="phone">전화번호</SelectItem>
                    <SelectItem value="kakaotalk">카카오톡</SelectItem>
                    <SelectItem value="instagram">인스타그램</SelectItem>
                  </SelectContent>
                </Select>

                {(contactType === "phone" || contactType === "kakaotalk") ? (
                  <div className="flex-1 flex flex-col gap-2">
                    <Input 
                      id="contact_address" 
                      placeholder="연락처를 입력하세요" 
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddContact();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Input 
                        id="contact_name" 
                        placeholder="이름을 입력하세요" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddContact();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddContact}
                        className="shrink-0"
                      >
                        {editingContactIndex !== null ? "수정" : "입력"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      id="contact_address" 
                      placeholder="연락처를 입력하세요" 
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddContact();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddContact}
                      className="shrink-0"
                    >
                      {editingContactIndex !== null ? "수정" : "입력"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" type="button">Cancel</Button>
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">저장 중...</span>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  )
} 