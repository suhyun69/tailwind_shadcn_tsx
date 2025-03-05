"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, User } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"

export function AppHeader() {
  const { profile, setProfile } = useProfile()

  const handleLogin = () => {
    setProfile({
      id: 'test-id',
      nickname: 'John Doe',
      avatar_url: ''
    })
  }

  return (
    <header>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {profile ? (
          <div className="text-lg font-medium">
            Hello, {profile.nickname}
          </div>
        ) : (
          <div className="text-lg font-medium">
            Hello, Stranger
          </div>
        )}
        {profile ? (
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-muted-foreground" />
            <Avatar>
              <AvatarImage src={profile.avatar_url || ""} alt={profile.nickname} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div onClick={handleLogin}>
            <Avatar>
              <AvatarImage src="" alt="Anonymous" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  )
} 