/**
 * Audit Logging System
 * 
 * Tracks all critical user actions and system events
 * Essential for compliance, security, and debugging
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Audit action types
 */
export enum AuditAction {
  // Authentication
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_REGISTER = 'user.register',
  PASSWORD_RESET = 'password.reset',
  PASSWORD_CHANGED = 'password.changed',
  
  // User Management
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_SUSPENDED = 'user.suspended',
  USER_ACTIVATED = 'user.activated',
  
  // Permissions & Roles
  ROLE_CHANGED = 'role.changed',
  PERMISSION_GRANTED = 'permission.granted',
  PERMISSION_REVOKED = 'permission.revoked',
  
  // Content Management
  PROGRAM_CREATED = 'program.created',
  PROGRAM_UPDATED = 'program.updated',
  PROGRAM_DELETED = 'program.deleted',
  WORKOUT_CREATED = 'workout.created',
  WORKOUT_UPDATED = 'workout.updated',
  WORKOUT_DELETED = 'workout.deleted',
  
  // Financial
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_ISSUED = 'refund.issued',
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_UPDATED = 'subscription.updated',
  SUBSCRIPTION_CANCELLED = 'subscription.cancelled',
  
  // Data Access
  DATA_EXPORTED = 'data.exported',
  DATA_IMPORTED = 'data.imported',
  SENSITIVE_DATA_ACCESSED = 'sensitive_data.accessed',
  
  // Security
  LOGIN_FAILED = 'login.failed',
  UNAUTHORIZED_ACCESS = 'unauthorized.access',
  RATE_LIMIT_EXCEEDED = 'rate_limit.exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious.activity',
  
  // System
  API_ERROR = 'api.error',
  SYSTEM_ERROR = 'system.error',
}

/**
 * Resource types for audit logs
 */
export enum ResourceType {
  USER = 'user',
  PROFILE = 'profile',
  PROGRAM = 'program',
  WORKOUT = 'workout',
  PROGRESS = 'progress',
  SUBSCRIPTION = 'subscription',
  PAYMENT = 'payment',
  COMMUNITY_POST = 'community_post',
  SUPPORT_TICKET = 'support_ticket',
  SYSTEM = 'system',
}

/**
 * Audit log entry interface
 */
export interface AuditLog {
  id?: string;
  user_id: string | null;
  action: AuditAction;
  resource_type: ResourceType;
  resource_id: string | null;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failure';
  error_message?: string;
  created_at?: Date;
}

/**
 * Log an audit event
 */
export async function logAudit(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<void> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: log.user_id,
        action: log.action,
        resource_type: log.resource_type,
        resource_id: log.resource_id,
        metadata: log.metadata || {},
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        status: log.status,
        error_message: log.error_message,
      });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

/**
 * Helper: Extract IP address from request
 */
export function getIpAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Helper: Extract user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Log successful authentication
 */
export async function logAuthSuccess(
  userId: string,
  request: Request,
  metadata?: Record<string, any>
): Promise<void> {
  await logAudit({
    user_id: userId,
    action: AuditAction.USER_LOGIN,
    resource_type: ResourceType.USER,
    resource_id: userId,
    metadata,
    ip_address: getIpAddress(request),
    user_agent: getUserAgent(request),
    status: 'success',
  });
}

/**
 * Log failed authentication
 */
export async function logAuthFailure(
  email: string,
  request: Request,
  reason: string
): Promise<void> {
  await logAudit({
    user_id: null,
    action: AuditAction.LOGIN_FAILED,
    resource_type: ResourceType.USER,
    resource_id: null,
    metadata: { email, reason },
    ip_address: getIpAddress(request),
    user_agent: getUserAgent(request),
    status: 'failure',
    error_message: reason,
  });
}

/**
 * Log payment event
 */
export async function logPayment(
  userId: string,
  action: AuditAction,
  paymentId: string,
  amount: number,
  currency: string,
  status: 'success' | 'failure',
  metadata?: Record<string, any>
): Promise<void> {
  await logAudit({
    user_id: userId,
    action,
    resource_type: ResourceType.PAYMENT,
    resource_id: paymentId,
    metadata: {
      amount,
      currency,
      ...metadata,
    },
    status,
  });
}

/**
 * Log permission change
 */
export async function logPermissionChange(
  adminUserId: string,
  targetUserId: string,
  action: AuditAction,
  permission: string,
  request: Request
): Promise<void> {
  await logAudit({
    user_id: adminUserId,
    action,
    resource_type: ResourceType.USER,
    resource_id: targetUserId,
    metadata: { permission, target_user_id: targetUserId },
    ip_address: getIpAddress(request),
    user_agent: getUserAgent(request),
    status: 'success',
  });
}

/**
 * Log data export
 */
export async function logDataExport(
  userId: string,
  dataType: string,
  request: Request
): Promise<void> {
  await logAudit({
    user_id: userId,
    action: AuditAction.DATA_EXPORTED,
    resource_type: ResourceType.USER,
    resource_id: userId,
    metadata: { data_type: dataType },
    ip_address: getIpAddress(request),
    user_agent: getUserAgent(request),
    status: 'success',
  });
}

/**
 * Log unauthorized access attempt
 */
export async function logUnauthorizedAccess(
  userId: string | null,
  resource: string,
  request: Request
): Promise<void> {
  await logAudit({
    user_id: userId,
    action: AuditAction.UNAUTHORIZED_ACCESS,
    resource_type: ResourceType.SYSTEM,
    resource_id: null,
    metadata: { attempted_resource: resource },
    ip_address: getIpAddress(request),
    user_agent: getUserAgent(request),
    status: 'failure',
  });
}

/**
 * Log API error
 */
export async function logApiError(
  userId: string | null,
  endpoint: string,
  error: Error,
  request: Request
): Promise<void> {
  await logAudit({
    user_id: userId,
    action: AuditAction.API_ERROR,
    resource_type: ResourceType.SYSTEM,
    resource_id: null,
    metadata: {
      endpoint,
      error_name: error.name,
      error_stack: error.stack?.substring(0, 500),
    },
    ip_address: getIpAddress(request),
    user_agent: getUserAgent(request),
    status: 'failure',
    error_message: error.message,
  });
}

/**
 * Query audit logs
 */
export async function getAuditLogs(filters: {
  userId?: string;
  action?: AuditAction;
  resourceType?: ResourceType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): Promise<AuditLog[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.action) {
      query = query.eq('action', filters.action);
    }

    if (filters.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }

    query = query.limit(filters.limit || 100);

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

/**
 * Example usage:
 * 
 * // Log user login
 * await logAuthSuccess(userId, request, { method: 'email' });
 * 
 * // Log payment
 * await logPayment(userId, AuditAction.PAYMENT_SUCCEEDED, paymentId, 99.99, 'USD', 'success');
 * 
 * // Log unauthorized access
 * await logUnauthorizedAccess(userId, '/api/admin/users', request);
 * 
 * // Query logs
 * const logs = await getAuditLogs({ userId, limit: 50 });
 */
