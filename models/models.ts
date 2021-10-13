
export type Order = {
  id: number
  userId: number
  masterId: number
  cityId: number
  clockSizeId: number
  price: number
  startAt: string
}

export type MasterWithRating = {
  id: number
  name: string
  cityId: number
  rating?: number
  login?:    String
  password?: String 
}

export type OrderForFeedback = {
  id: number
  masterName: string
  cityName: string
  userName: string
  userEmail: string
  size: string
  price: number
  startAt: string
  endAt: string
}