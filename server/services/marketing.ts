import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { User } from '@shared/schema';
import { db } from '../db';

/**
 * Integrated marketing service for platform communications
 * 
 * This supports both user acquisition and retention with bulk messaging capabilities
 */

// Marketing campaign types
export enum CampaignType {
  ANNOUNCEMENT = 'announcement',
  NEWSLETTER = 'newsletter',
  PROMOTION = 'promotion',
  EVENT_REMINDER = 'event_reminder',
  WELCOME_SERIES = 'welcome_series',
  FEATURE_UPDATE = 'feature_update',
  RE_ENGAGEMENT = 're_engagement',
  SURVEY = 'survey',
}

// Campaign target audience
export enum TargetAudience {
  ALL_USERS = 'all_users',
  NEW_USERS = 'new_users',
  INACTIVE_USERS = 'inactive_users',
  SUBSCRIBERS = 'subscribers',
  FREE_TIER = 'free_tier',
  PREMIUM_TIER = 'premium_tier',
  PRO_TIER = 'pro_tier',
  CUSTOM_SEGMENT = 'custom_segment',
}

// Marketing message template
export interface MarketingTemplate {
  id: string;
  name: string;
  subject?: string;
  textContent: string;
  htmlContent?: string;
  whatsappContent?: string;
  variables: string[];
  previewText?: string;
  category: CampaignType;
}

// Campaign configuration
export interface CampaignConfig {
  name: string;
  type: CampaignType;
  targetAudience: TargetAudience;
  customSegment?: {
    sql?: string;
    filters?: Record<string, any>[];
  };
  schedule?: {
    sendAt?: Date;
    recurring?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  templateId: string;
  templateData?: Record<string, any>;
  channels: ('email' | 'whatsapp' | 'sms')[];
  sendFromName?: string;
  testRecipients?: string[];
  trackingParams?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

// Report for tracking campaign performance
export interface CampaignReport {
  campaignId: string;
  sentCount: number;
  deliveredCount: number;
  openCount?: number;
  clickCount?: number;
  bounceCount: number;
  unsubscribeCount: number;
  complaintCount: number;
  startTime: Date;
  endTime?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed' | 'canceled';
  channelMetrics: {
    email?: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
      unsubscribed: number;
      complained: number;
    };
    whatsapp?: {
      sent: number;
      delivered: number;
      read: number;
      failed: number;
    };
    sms?: {
      sent: number;
      delivered: number;
      failed: number;
    };
  };
}

/**
 * Marketing service for handling bulk communications
 */
export class MarketingService {
  private static instance: MarketingService;
  private sendgridClient: typeof sgMail | null = null;
  private twilioClient: twilio.Twilio | null = null;
  private templates: Map<string, MarketingTemplate> = new Map();
  private campaigns: Map<string, CampaignConfig> = new Map();
  private reports: Map<string, CampaignReport> = new Map();
  
  // Maximum batch sizes for different channels
  private readonly EMAIL_BATCH_SIZE = 1000;
  private readonly WHATSAPP_BATCH_SIZE = 200;
  private readonly SMS_BATCH_SIZE = 500;
  
  // Rate limiting settings (messages per second)
  private readonly EMAIL_RATE_LIMIT = 100;
  private readonly WHATSAPP_RATE_LIMIT = 10;
  private readonly SMS_RATE_LIMIT = 20;

  private constructor() {
    // Initialize services if keys are available
    this.initializeServices();
    
    // Load templates
    this.loadTemplates();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MarketingService {
    if (!MarketingService.instance) {
      MarketingService.instance = new MarketingService();
    }
    return MarketingService.instance;
  }

  /**
   * Initialize API clients for marketing services
   */
  private initializeServices(): void {
    // Initialize SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.sendgridClient = sgMail;
      console.log('[Marketing] SendGrid initialized');
    } else {
      console.warn('[Marketing] SendGrid API key not available');
    }
    
    // Initialize Twilio (for SMS and WhatsApp)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      console.log('[Marketing] Twilio initialized');
    } else {
      console.warn('[Marketing] Twilio credentials not available');
    }
  }

  /**
   * Load marketing templates
   * In a real implementation, these would come from a database
   */
  private loadTemplates(): void {
    // Add some example templates
    const welcomeTemplate: MarketingTemplate = {
      id: 'welcome-email',
      name: 'Welcome Email',
      subject: 'Welcome to HowzEventz! 🎉',
      textContent: 'Hi {{name}},\n\nWelcome to HowzEventz! We\'re excited to help you plan your events.\n\nBest regards,\nThe HowzEventz Team',
      htmlContent: '<h1>Welcome to HowzEventz!</h1><p>Hi {{name}},</p><p>We\'re excited to help you plan your events.</p><p>Best regards,<br>The HowzEventz Team</p>',
      whatsappContent: 'Hi {{name}}! Welcome to HowzEventz! We\'re excited to help you plan your events. Visit your dashboard at {{dashboardUrl}}',
      variables: ['name', 'dashboardUrl'],
      category: CampaignType.WELCOME_SERIES,
    };
    
    const newFeatureTemplate: MarketingTemplate = {
      id: 'new-feature',
      name: 'New Feature Announcement',
      subject: 'New Feature Alert: {{featureName}} is here!',
      textContent: 'Hi {{name}},\n\nWe\'re excited to announce our new feature: {{featureName}}! {{featureDescription}}\n\nCheck it out now at {{featureUrl}}.\n\nBest regards,\nThe HowzEventz Team',
      htmlContent: '<h1>New Feature Alert: {{featureName}} is here!</h1><p>Hi {{name}},</p><p>We\'re excited to announce our new feature: <strong>{{featureName}}</strong>!</p><p>{{featureDescription}}</p><p><a href="{{featureUrl}}">Check it out now</a>.</p><p>Best regards,<br>The HowzEventz Team</p>',
      whatsappContent: 'Hi {{name}}! We\'ve just launched {{featureName}} - {{featureDescription}}. Check it out at {{featureUrl}}',
      variables: ['name', 'featureName', 'featureDescription', 'featureUrl'],
      category: CampaignType.FEATURE_UPDATE,
    };
    
    // Add templates to map
    this.templates.set(welcomeTemplate.id, welcomeTemplate);
    this.templates.set(newFeatureTemplate.id, newFeatureTemplate);
    
    console.log(`[Marketing] Loaded ${this.templates.size} templates`);
  }

  /**
   * Create a new marketing campaign
   */
  public async createCampaign(config: CampaignConfig): Promise<string> {
    const campaignId = `campaign_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Validate campaign config
    this.validateCampaignConfig(config);
    
    // Store campaign
    this.campaigns.set(campaignId, config);
    
    // Create initial report
    this.reports.set(campaignId, {
      campaignId,
      sentCount: 0,
      deliveredCount: 0,
      openCount: 0,
      clickCount: 0,
      bounceCount: 0,
      unsubscribeCount: 0,
      complaintCount: 0,
      startTime: new Date(),
      status: 'draft',
      channelMetrics: {},
    });
    
    // Schedule campaign if needed
    if (config.schedule?.sendAt) {
      this.scheduleCampaign(campaignId, config.schedule.sendAt);
    }
    
    console.log(`[Marketing] Created campaign ${campaignId}: ${config.name}`);
    return campaignId;
  }

  /**
   * Validate campaign configuration
   * @throws Error if configuration is invalid
   */
  private validateCampaignConfig(config: CampaignConfig): void {
    // Check if template exists
    if (!this.templates.has(config.templateId)) {
      throw new Error(`Template ${config.templateId} not found`);
    }
    
    // Check channels
    if (!config.channels || config.channels.length === 0) {
      throw new Error('At least one channel must be specified');
    }
    
    // Check if required services are available
    if (config.channels.includes('email') && !this.sendgridClient) {
      throw new Error('SendGrid API key required for email campaigns');
    }
    
    if ((config.channels.includes('whatsapp') || config.channels.includes('sms')) && !this.twilioClient) {
      throw new Error('Twilio credentials required for WhatsApp or SMS campaigns');
    }
    
    // Check if template variables are provided
    const template = this.templates.get(config.templateId)!;
    const missingVars = template.variables.filter(v => 
      !config.templateData || config.templateData[v] === undefined
    );
    
    if (missingVars.length > 0) {
      throw new Error(`Missing template variables: ${missingVars.join(', ')}`);
    }
  }

  /**
   * Schedule a campaign for future delivery
   */
  private scheduleCampaign(campaignId: string, sendAt: Date): void {
    const now = new Date();
    const delay = sendAt.getTime() - now.getTime();
    
    if (delay <= 0) {
      console.warn(`[Marketing] Campaign ${campaignId} scheduled in the past, executing immediately`);
      this.executeCampaign(campaignId);
      return;
    }
    
    console.log(`[Marketing] Scheduling campaign ${campaignId} for ${sendAt.toISOString()}`);
    
    // Update status
    const report = this.reports.get(campaignId);
    if (report) {
      report.status = 'scheduled';
      this.reports.set(campaignId, report);
    }
    
    // Schedule execution
    setTimeout(() => {
      this.executeCampaign(campaignId);
    }, delay);
  }

  /**
   * Execute a marketing campaign
   */
  public async executeCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }
    
    const report = this.reports.get(campaignId) || {
      campaignId,
      sentCount: 0,
      deliveredCount: 0,
      bounceCount: 0,
      unsubscribeCount: 0,
      complaintCount: 0,
      startTime: new Date(),
      status: 'sending',
      channelMetrics: {},
    };
    
    // Update status
    report.status = 'sending';
    this.reports.set(campaignId, report);
    
    try {
      console.log(`[Marketing] Executing campaign ${campaignId}: ${campaign.name}`);
      
      // Get target recipients
      const recipients = await this.getTargetRecipients(campaign.targetAudience, campaign.customSegment);
      console.log(`[Marketing] Campaign ${campaignId} targeting ${recipients.length} recipients`);
      
      // Process batches for each channel
      let successCount = 0;
      
      // Process email channel
      if (campaign.channels.includes('email') && this.sendgridClient) {
        const emailResults = await this.processEmailCampaign(campaign, recipients);
        successCount += emailResults.successful;
        
        // Update report
        report.channelMetrics.email = {
          sent: emailResults.sent,
          delivered: emailResults.delivered,
          opened: 0, // Will be updated via webhooks
          clicked: 0, // Will be updated via webhooks
          bounced: emailResults.bounced,
          unsubscribed: 0, // Will be updated via webhooks
          complained: 0, // Will be updated via webhooks
        };
      }
      
      // Process WhatsApp channel
      if (campaign.channels.includes('whatsapp') && this.twilioClient) {
        const whatsappResults = await this.processWhatsAppCampaign(campaign, recipients);
        successCount += whatsappResults.successful;
        
        // Update report
        report.channelMetrics.whatsapp = {
          sent: whatsappResults.sent,
          delivered: whatsappResults.delivered,
          read: 0, // Will be updated via webhooks
          failed: whatsappResults.failed,
        };
      }
      
      // Process SMS channel
      if (campaign.channels.includes('sms') && this.twilioClient) {
        const smsResults = await this.processSMSCampaign(campaign, recipients);
        successCount += smsResults.successful;
        
        // Update report
        report.channelMetrics.sms = {
          sent: smsResults.sent,
          delivered: smsResults.delivered,
          failed: smsResults.failed,
        };
      }
      
      // Update report
      report.sentCount = 
        (report.channelMetrics.email?.sent || 0) + 
        (report.channelMetrics.whatsapp?.sent || 0) + 
        (report.channelMetrics.sms?.sent || 0);
      
      report.deliveredCount = 
        (report.channelMetrics.email?.delivered || 0) + 
        (report.channelMetrics.whatsapp?.delivered || 0) + 
        (report.channelMetrics.sms?.delivered || 0);
      
      report.bounceCount = (report.channelMetrics.email?.bounced || 0);
      report.status = 'completed';
      report.endTime = new Date();
      
      this.reports.set(campaignId, report);
      
      console.log(`[Marketing] Campaign ${campaignId} completed: ${successCount} messages sent successfully`);
    } catch (error) {
      console.error(`[Marketing] Error executing campaign ${campaignId}:`, error);
      
      // Update report
      report.status = 'failed';
      report.endTime = new Date();
      this.reports.set(campaignId, report);
      
      throw error;
    }
  }

  /**
   * Get target recipients based on audience segmentation
   */
  private async getTargetRecipients(
    targetAudience: TargetAudience,
    customSegment?: { sql?: string; filters?: Record<string, any>[] }
  ): Promise<User[]> {
    // In a real implementation, this would query the database with proper filters
    // Here we'll simulate it with some basic logic
    
    let users: User[] = [];
    
    try {
      switch (targetAudience) {
        case TargetAudience.ALL_USERS:
          // Get all users
          users = await this.getAllUsers();
          break;
          
        case TargetAudience.SUBSCRIBERS:
          // Get only paid subscribers
          users = await this.getAllUsers();
          users = users.filter(user => (user as any).subscription?.status === 'active');
          break;
          
        case TargetAudience.NEW_USERS:
          // Get users registered in the last 30 days
          users = await this.getAllUsers();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          users = users.filter(user => new Date(user.createdAt as any) >= thirtyDaysAgo);
          break;
          
        case TargetAudience.INACTIVE_USERS:
          // This would typically query a login/activity history table
          // For demo, just return all users
          users = await this.getAllUsers();
          break;
          
        case TargetAudience.CUSTOM_SEGMENT:
          // Custom segment logic
          if (customSegment?.sql) {
            // This would execute a custom SQL query in a real implementation
            console.log(`[Marketing] Custom SQL segment: ${customSegment.sql}`);
            users = await this.getAllUsers();
          } else if (customSegment?.filters && customSegment.filters.length > 0) {
            // Apply custom filters
            users = await this.getAllUsers();
            for (const filter of customSegment.filters) {
              users = users.filter(user => {
                // Apply each filter criterion
                for (const [key, value] of Object.entries(filter)) {
                  if ((user as any)[key] !== value) {
                    return false;
                  }
                }
                return true;
              });
            }
          } else {
            throw new Error('Custom segment requires either SQL or filters');
          }
          break;
          
        default:
          users = await this.getAllUsers();
      }
      
      // Filter out users who have unsubscribed
      users = users.filter(user => !(user as any).marketingUnsubscribed);
      
      return users;
    } catch (error) {
      console.error('[Marketing] Error getting target recipients:', error);
      throw error;
    }
  }

  /**
   * Process email campaign
   */
  private async processEmailCampaign(
    campaign: CampaignConfig,
    recipients: User[]
  ): Promise<{ sent: number; delivered: number; bounced: number; successful: number }> {
    const template = this.templates.get(campaign.templateId)!;
    const result = { sent: 0, delivered: 0, bounced: 0, successful: 0 };
    
    if (!this.sendgridClient) {
      throw new Error('SendGrid API key required for email campaigns');
    }
    
    // Only process recipients with valid email
    const validRecipients = recipients.filter(user => user.email && this.isValidEmail(user.email));
    
    // Process in batches to avoid rate limits
    const batches = this.batchArray(validRecipients, this.EMAIL_BATCH_SIZE);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`[Marketing] Processing email batch ${i + 1}/${batches.length}, size: ${batch.length}`);
      
      const messages = batch.map(user => {
        // Prepare message with template variables
        const templateData = {
          ...(campaign.templateData || {}),
          name: user.username,
          email: user.email,
        };
        
        // Replace template variables in content
        const subject = this.replaceTemplateVars(template.subject || '', templateData);
        const htmlContent = template.htmlContent 
          ? this.replaceTemplateVars(template.htmlContent, templateData)
          : undefined;
        const textContent = this.replaceTemplateVars(template.textContent, templateData);
        
        // Prepare email message
        return {
          to: user.email,
          from: campaign.sendFromName 
            ? `${campaign.sendFromName} <noreply@howzeventz.com>` 
            : 'HowzEventz <noreply@howzeventz.com>',
          subject,
          text: textContent,
          html: htmlContent,
          trackingSettings: {
            clickTracking: { enable: true },
            openTracking: { enable: true },
          },
          categories: [campaign.type, 'marketing'],
        };
      });
      
      try {
        // Send batch
        const responses = await this.sendgridClient.send(messages);
        
        // Process responses
        for (const response of responses) {
          result.sent += response[0]?.statusCode >= 200 && response[0]?.statusCode < 300 ? 1 : 0;
        }
        
        result.delivered += result.sent;
        result.successful += result.sent;
        
        // Rate limiting: add delay between batches
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (batch.length / this.EMAIL_RATE_LIMIT)));
        }
      } catch (error) {
        console.error('[Marketing] Error sending email batch:', error);
        result.bounced += batch.length;
      }
    }
    
    return result;
  }

  /**
   * Process WhatsApp campaign
   */
  private async processWhatsAppCampaign(
    campaign: CampaignConfig,
    recipients: User[]
  ): Promise<{ sent: number; delivered: number; failed: number; successful: number }> {
    const template = this.templates.get(campaign.templateId)!;
    const result = { sent: 0, delivered: 0, failed: 0, successful: 0 };
    
    if (!this.twilioClient || !process.env.TWILIO_WHATSAPP_FROM) {
      throw new Error('Twilio credentials and WhatsApp sender required');
    }
    
    // Only process recipients with valid phone numbers
    const validRecipients = recipients.filter(user => (user as any).phone && this.isValidPhone((user as any).phone));
    
    // Process in batches to avoid rate limits
    const batches = this.batchArray(validRecipients, this.WHATSAPP_BATCH_SIZE);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`[Marketing] Processing WhatsApp batch ${i + 1}/${batches.length}, size: ${batch.length}`);
      
      for (const user of batch) {
        try {
          // Prepare message with template variables
          const templateData = {
            ...(campaign.templateData || {}),
            name: user.username,
          };
          
          // Get content
          const content = template.whatsappContent
            ? this.replaceTemplateVars(template.whatsappContent, templateData)
            : this.replaceTemplateVars(template.textContent, templateData);
          
          // Send message
          const message = await this.twilioClient.messages.create({
            body: content,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
            to: `whatsapp:${(user as any).phone}`,
          });
          
          // Process result
          if (message.sid) {
            result.sent++;
            result.delivered++;
            result.successful++;
          }
          
          // Rate limiting: add delay between messages
          await new Promise(resolve => setTimeout(resolve, 1000 / this.WHATSAPP_RATE_LIMIT));
        } catch (error) {
          console.error(`[Marketing] Error sending WhatsApp to ${(user as any).phone}:`, error);
          result.failed++;
        }
      }
      
      // Additional batch rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return result;
  }

  /**
   * Process SMS campaign
   */
  private async processSMSCampaign(
    campaign: CampaignConfig,
    recipients: User[]
  ): Promise<{ sent: number; delivered: number; failed: number; successful: number }> {
    const template = this.templates.get(campaign.templateId)!;
    const result = { sent: 0, delivered: 0, failed: 0, successful: 0 };
    
    if (!this.twilioClient || !process.env.TWILIO_SMS_FROM) {
      throw new Error('Twilio credentials and SMS sender required');
    }
    
    // Only process recipients with valid phone numbers
    const validRecipients = recipients.filter(user => (user as any).phone && this.isValidPhone((user as any).phone));
    
    // Process in batches to avoid rate limits
    const batches = this.batchArray(validRecipients, this.SMS_BATCH_SIZE);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`[Marketing] Processing SMS batch ${i + 1}/${batches.length}, size: ${batch.length}`);
      
      for (const user of batch) {
        try {
          // Prepare message with template variables
          const templateData = {
            ...(campaign.templateData || {}),
            name: user.username,
          };
          
          // Get content (keep it short for SMS)
          const content = this.replaceTemplateVars(template.textContent, templateData).substring(0, 160);
          
          // Send message
          const message = await this.twilioClient.messages.create({
            body: content,
            from: process.env.TWILIO_SMS_FROM,
            to: (user as any).phone,
          });
          
          // Process result
          if (message.sid) {
            result.sent++;
            result.delivered++;
            result.successful++;
          }
          
          // Rate limiting: add delay between messages
          await new Promise(resolve => setTimeout(resolve, 1000 / this.SMS_RATE_LIMIT));
        } catch (error) {
          console.error(`[Marketing] Error sending SMS to ${(user as any).phone}:`, error);
          result.failed++;
        }
      }
      
      // Additional batch rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return result;
  }

  /**
   * Template variable replacement
   */
  private replaceTemplateVars(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = data[key.trim()];
      return value !== undefined ? value : match;
    });
  }

  /**
   * Split array into batches
   */
  private batchArray<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Validate email address
   */
  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  /**
   * Validate phone number
   */
  private isValidPhone(phone: string): boolean {
    // Basic validation - in reality, you would use a more robust library
    const regex = /^\+[0-9]{10,15}$/;
    return regex.test(phone);
  }

  /**
   * Get all users from database
   * This is a placeholder - in a real system this would query the database
   */
  private async getAllUsers(): Promise<User[]> {
    try {
      // In a real implementation, this would query the database
      // For demonstration, we'll return a mock list
      const users = []; // placeholder
      return users;
    } catch (error) {
      console.error('[Marketing] Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get campaign report
   */
  public getCampaignReport(campaignId: string): CampaignReport | undefined {
    return this.reports.get(campaignId);
  }

  /**
   * Get all campaign reports
   */
  public getAllCampaignReports(): CampaignReport[] {
    return Array.from(this.reports.values());
  }

  /**
   * Get marketing template by ID
   */
  public getTemplate(templateId: string): MarketingTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get all marketing templates
   */
  public getAllTemplates(): MarketingTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Service status check
   */
  public checkStatus(): { 
    emailReady: boolean;
    whatsappReady: boolean;
    smsReady: boolean;
    templatesCount: number;
  } {
    return {
      emailReady: !!this.sendgridClient,
      whatsappReady: !!this.twilioClient && !!process.env.TWILIO_WHATSAPP_FROM,
      smsReady: !!this.twilioClient && !!process.env.TWILIO_SMS_FROM,
      templatesCount: this.templates.size,
    };
  }
}

// Export the singleton instance
export const marketingService = MarketingService.getInstance();