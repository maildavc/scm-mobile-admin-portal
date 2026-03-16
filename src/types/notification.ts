// Enums (numeric as the backend uses integer enums)
export enum NotificationChannel {
  Email = 1,
  SMS = 2,
  Push = 3,
  InApp = 4,
  WebPush = 5,
  Slack = 6,
  Teams = 7,
  Webhook = 8,
}

export enum RecipientType {
  AllUsers = 1,
  Vendor = 2,
  Customer = 3,
  SpecificUsers = 4,
}

export enum NotificationPriority {
  Low = 1,
  Normal = 2,
  High = 3,
  Urgent = 4,
  Critical = 5,
}

export enum NotificationStatus {
  Draft = 1,
  AwaitingApproval = 2,
  Approved = 3,
  Rejected = 4,
  Scheduled = 5,
  Sending = 6,
  Sent = 7,
  Failed = 8,
  Cancelled = 9,
}

export enum NotificationType {
  System = 1,
  Transactional = 2,
  Marketing = 3,
  Alert = 4,
  Reminder = 5,
  Welcome = 6,
  Promotional = 7,
  Newsletter = 8,
  Custom = 9,
}

// List DTO (returned from GET /api/v1/notifications)
export interface NotificationDto {
  id: string;
  title: string;
  message: string | null;
  type: NotificationType | number;
  typeName: string | null;
  priority: NotificationPriority | number;
  priorityName: string | null;
  status: NotificationStatus | number;
  statusName: string | null;
  channel: NotificationChannel | number;
  channelName: string | null;
  targetAudience: string | null;
  targetUserIds: string | null;
  recipientType: string | null;
  scheduledFor: string | null;
  scheduledDate: string | null;
  sentDate: string | null;
  expiresAt: string | null;
  isSent: boolean;
  isActive: boolean;
  totalRecipients: number;
  deliveredCount: number;
  readCount: number;
  clickCount: number;
  failedCount: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  allowReply: boolean | null;
  replyToEmail: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  authorName: string | null;
}

// Create DTO (POST /api/v1/notifications)
export interface CreateNotificationRequestDto {
  title: string;
  message: string;
  channel: NotificationChannel | number;
  targetAudience?: string;
  targetUserIds?: string;
  recipientType?: RecipientType | number;
  scheduledFor?: string;
  expiresAt?: string;
  allowReply?: boolean;
  replyToEmail?: string;
  type?: NotificationType | number;
  priority?: NotificationPriority | number;
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
  iconUrl?: string;
  requiresAcknowledgment?: boolean;
  isPersistent?: boolean;
}

// Update DTO (PUT /api/v1/notifications/{id})
export interface UpdateNotificationRequestDto {
  title?: string;
  message?: string;
  channel?: NotificationChannel | number;
  targetAudience?: string;
  targetUserIds?: string;
  recipientType?: string;
  scheduledFor?: string;
  allowReply?: boolean;
  replyToEmail?: string;
  type?: NotificationType | number;
  priority?: NotificationPriority | number;
}

// Approve DTO
export interface ApproveNotificationDto {
  id: string;
  notes?: string;
  sendImmediately?: boolean;
}

// Reject DTO
export interface RejectNotificationDto {
  id: string;
  reason: string;
  notes?: string;
}

// List Response (paginated)
export interface NotificationListResponse {
  data: NotificationDto[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  status?: string;
  message?: string;
  stats?: NotificationDashboardStatsDto;
}

// Dashboard Stats DTO
export interface NotificationDashboardStatsDto {
  totalNotifications: number;
  draftNotifications: number;
  awaitingApprovalNotifications: number;
  approvedNotifications: number;
  sentNotifications: number;
  scheduledNotifications: number;
  failedNotifications: number;
  totalRecipients: number;
  totalDelivered: number;
  totalRead: number;
  overallDeliveryRate: number;
  overallOpenRate: number;
  notificationsToday: number;
  notificationsThisWeek: number;
  notificationsThisMonth: number;
}
