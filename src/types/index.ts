export interface Notification {
  notificationId: number
  title: string
  message: string
  notificationType: string
  isRead: boolean
  createdDate: string
  expiryDate?: string
}

export interface Announcement {
  announcementId: number
  title: string
  content: string
  announcementType?: string
  isPublished: boolean
  publishedDate?: string
  createdDate: string
}

export interface Scheme {
  schemeId: number
  schemeName: string
  description: string
  eligibility?: string
  isActive: boolean
  startDate?: string
  endDate?: string
}

export interface Application {
  applicationId: number
  applicationNumber: string
  schemeId: number
  schemeName: string
  userId: number
  applicantName?: string
  status: string
  remarks?: string
  createdDate: string
  modifiedDate?: string
}

export interface DonationCategory {
  donationCategoryId: number
  categoryName: string
  description?: string
  isActive: boolean
}

export interface Donation {
  donationId: number
  donationNumber: string
  donationCategoryId: number
  categoryName: string
  amount: number
  paymentStatus: string
  paymentReference?: string
  transactionDate?: string
  createdDate: string
}

export interface DashboardSummary {
  totalVillagers: number
  activeUsers: number
  totalComplaints: number
  pendingComplaints: number
  escalatedComplaints: number
  resolvedComplaints: number
  totalApplications: number
  pendingApplications: number
  totalDonations: number
  totalDonationAmount: number
  activeSchemes: number
  totalPublishedNotifications: number
}

export interface AdminUser {
  userId: number
  fullName: string
  email: string
  mobileNumber: string
  role: string
  isActive: boolean
  isEmailVerified: boolean
  createdDate: string
}

export interface AdminRole {
  roleId: number
  roleName: string
  description?: string
}

export type { ComplaintCategory } from './complaint'
