import { create } from 'zustand'

type Profile = {
  id: string
  nickname: string
  avatar_url: string
}

type ProfileStore = {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
}

export const useProfile = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
})) 