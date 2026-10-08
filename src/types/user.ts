export interface UserProfile {
  userId: number
  fullName: string
  email: string
  mobileNumber: string
  street: string
  doorNumber: string
  village: string
  mandal: string
  district: string
  state: string
  pincode: string
  profileImage: string
}

export interface UpdateUserProfileRequest {
  fullName: string
  mobileNumber: string
  street: string
  doorNumber?: string
  village?: string
  mandal?: string
  district?: string
  state?: string
  pincode?: string
}
