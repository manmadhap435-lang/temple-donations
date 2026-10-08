export interface ComplaintCategory {
  complaintCategoryId: number
  categoryName: string
  description?: string
  isActive: boolean
}

export interface ComplaintSummary {
  complaintId: number
  complaintNumber: string
  userId: number
  villagerName?: string
  villagerMobile?: string
  complaintCategoryId: number
  categoryName: string
  title: string
  description: string
  street?: string
  location?: string
  status: string
  priority: string
  estimatedResolutionDate?: string
  resolvedDate?: string
  closedDate?: string
  createdDate: string
}

export interface ComplaintResponseItem {
  responseId: number
  responseText: string
  respondedByName?: string
  respondedByRole?: string
  estimatedResolutionDate?: string
  createdDate: string
}

export interface ComplaintStatusHistoryItem {
  statusHistoryId: number
  oldStatus?: string
  newStatus: string
  remarks?: string
  changedByName?: string
  changedDate: string
}

export interface ComplaintAttachment {
  attachmentId: number
  fileName: string
  filePath: string
  contentType: string
  fileSize: number
  uploadedDate: string
}

export interface ComplaintDetail extends ComplaintSummary {
  latitude?: number
  longitude?: number
  resolutionConfirmedDate?: string
  isReopened: boolean
  reopenReason?: string
  reopenCount: number
  requiresUserConfirmation: boolean
  modifiedDate?: string
  responses: ComplaintResponseItem[]
  statusHistory: ComplaintStatusHistoryItem[]
  attachments: ComplaintAttachment[]
  assignedToUserId?: number
  assignedToName?: string
}

export interface CreateComplaintRequest {
  complaintCategoryId: number
  title: string
  description: string
  street?: string
  location?: string
  latitude?: number
  longitude?: number
  priority?: string
}
