import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, User } from "lucide-react"

type Profile = {
  avatar_url?: string
  nickname: string
}

type AppHeaderProps = {
  profile?: Profile
}

export function AppHeader({ profile }: AppHeaderProps) {
  return (
    <header>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {profile ? (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profile.avatar_url || ""} alt={profile.nickname} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Good Morning</span>
              <span className="text-base font-medium">{profile.nickname}</span>
            </div>
          </div>
        ) : (
          <div className="text-lg font-medium">
            Hello, Stranger
          </div>
        )}
        {profile ? (
          <div>
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
        ) : (
          <div>
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