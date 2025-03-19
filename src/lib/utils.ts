import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGenreText(genre: string) {
  switch (genre) {
    case "S":
      return "살사"
    case "B":
      return "바차타"
    case "K":
      return "키좀바"
    default:
      return genre
  }
}

export function getRegionText(region: string) {
  switch (region) {
    case "HD":
      return "홍대"
    case "GN":
      return "강남"
    case "AP":
      return "압구정"
    default:
      return region
  }
}
