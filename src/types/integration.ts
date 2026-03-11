export enum IntegrationType {
    Internal = 1,
    External = 2,
    Webhook = 3,
    Payment = 4,
    SMS = 5,
    Email = 6,
    CRM = 7,
    ERP = 8,
    Custom = 9,
}

export enum IntegrationStatus {
    Active = 1,
    Inactive = 2,
    Error = 3,
    Disconnected = 4,
    Pending = 5,
}

export interface IntegrationStatsDto {
    totalLogs: number;
    errorLogs: number;
    successLogs: number;
    lastActivity: string | null;
    uptimePercentage: number;
    failuresThisWeek: number;
    successfulSyncsThisWeek: number;
}

export interface IntegrationConfigurationDto {
    apiKey: string | null;
    secretKey: string | null;
    endpointUrl: string | null;
    webhookUrl: string | null;
    webhookSecret: string | null;
    maxRetries: number;
    autoRetry: boolean;
    customSettings: Record<string, any> | null;
}

export interface IntegrationLogDto {
    id: string | null;
    integrationId: string | null;
    action: string | null;
    logLevel: string | null;
    details: string | null;
    performedBy: string | null;
    timestamp: string;
}

export interface IntegrationDto {
    id: string;
    name: string | null;
    description: string | null;
    type: IntegrationType;
    typeName: string | null;
    status: IntegrationStatus;
    statusName: string | null;
    isEnabled: boolean;
    endpointUrl: string | null;
    iconUrl: string | null;
    lastConnectionTest: string | null;
    lastSuccessfulSync: string | null;
    lastError: string | null;
    lastErrorAt: string | null;
    retryCount: number;
    maxRetries: number;
    autoRetry: boolean;
    canRetry: boolean;
    isConnected: boolean;
    hasRecentError: boolean;
    tags: string | null;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
}

export interface IntegrationDetailsDto extends IntegrationDto {
    apiKey: string | null;
    webhookUrl: string | null;
    lastSyncDate: string | null;
    connectionUrl: string | null;
    healthScore: number;
    errorCount: number;
    successfulOperations: number;
    totalOperations: number;
    averageResponseTime: number;
    configuration: IntegrationConfigurationDto;
    recentLogs: IntegrationLogDto[] | null;
    stats: IntegrationStatsDto;
}

export interface CreateIntegrationRequestDto {
    name: string;
    description?: string | null;
    type: IntegrationType;
    apiKey?: string | null;
    secretKey?: string | null;
    endpointUrl?: string | null;
    clientUrl?: string | null;
    configuration?: string | null;
    username?: string | null;
    password?: string | null;
    webhookUrl?: string | null;
    webhookSecret?: string | null;
    maxRetries: number;
    autoRetry: boolean;
    tags?: string | null;
}

export interface UpdateIntegrationRequestDto {
    id: string;
    name: string | null;
    description: string | null;
    type: IntegrationType;
    tags: string | null;
}

export interface IntegrationDashboardStatsDto {
    totalIntegrations: number;
    activeIntegrations: number;
    inactiveIntegrations: number;
    errorIntegrations: number;
    disconnectedIntegrations: number;
    // ... other stats
}

export interface IntegrationsPagedResponse {
    items: IntegrationDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    stats: IntegrationDashboardStatsDto;
}

export interface IntegrationLogsPagedResponse {
    items: IntegrationLogDto[];
    totalCount: number;
    page: number;
    pageSize: number;
}
