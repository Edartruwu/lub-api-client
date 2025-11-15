/**
 * Channel-related types and interfaces
 * @module types/channel
 */

import type { DateTime, TenantID } from "./common";

/**
 * Unique identifier for a channel
 */
export type ChannelID = string;

/**
 * Channel types
 */
export enum ChannelType {
  WHATSAPP = "WHATSAPP",
  INSTAGRAM = "INSTAGRAM",
  TELEGRAM = "TELEGRAM",
  INFOBIP = "INFOBIP",
  EMAIL = "EMAIL",
  SMS = "SMS",
  WEBCHAT = "WEBCHAT",
  VOICE = "VOICE",
  TEST_HTTP = "TEST_HTTP",
}

/**
 * WhatsApp provider types
 */
export enum WhatsAppProvider {
  META = "meta",
  TWILIO = "twilio",
  INFOBIP = "infobip",
}

/**
 * Message content types
 */
export enum MessageContentType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  DOCUMENT = "document",
  LOCATION = "location",
  CONTACT = "contact",
  INTERACTIVE = "interactive",
}

/**
 * WhatsApp channel configuration
 */
export interface WhatsAppConfig {
  /** WhatsApp provider */
  provider: WhatsAppProvider;
  /** Phone number ID (Meta) */
  phone_number_id: string;
  /** Business account ID (Meta) */
  business_account_id: string;
  /** Access token */
  access_token: string;
  /** App secret (for webhook verification) */
  app_secret?: string;
  /** Webhook verify token */
  webhook_verify_token: string;
  /** API version (e.g., "v17.0") */
  api_version?: string;
  /** Whether message buffering is enabled */
  buffer_enabled?: boolean;
  /** Buffer time in seconds */
  buffer_time_seconds?: number;
  /** Whether to reset buffer on new message */
  buffer_reset_on_message?: boolean;
}

/**
 * Instagram channel configuration
 */
export interface InstagramConfig {
  /** Instagram provider (Meta) */
  provider: "meta";
  /** App ID */
  app_id: string;
  /** Page ID */
  page_id: string;
  /** Page access token */
  page_token: string;
  /** App secret */
  app_secret: string;
  /** Webhook verify token */
  verify_token: string;
  /** Instagram business account ID */
  instagram_business_account_id?: string;
  /** Whether message buffering is enabled */
  buffer_enabled?: boolean;
  /** Buffer time in seconds */
  buffer_time_seconds?: number;
  /** Whether to reset buffer on new message */
  buffer_reset_on_message?: boolean;
}

/**
 * Union type for all channel configurations
 */
export type ChannelConfig =
  | WhatsAppConfig
  | InstagramConfig
  | Record<string, any>;

/**
 * Channel definition
 */
export interface Channel {
  /** Unique channel identifier */
  id: ChannelID;
  /** Associated tenant ID */
  tenant_id: TenantID;
  /** Channel type */
  type: ChannelType;
  /** Channel name */
  name: string;
  /** Channel description */
  description: string;
  /** Channel-specific configuration */
  config: ChannelConfig;
  /** Whether the channel is active */
  is_active: boolean;
  /** Webhook URL for this channel */
  webhook_url: string;
  /** Creation timestamp */
  created_at: DateTime;
  /** Last update timestamp */
  updated_at: DateTime;
}

/**
 * Request to create a new channel
 */
export interface CreateChannelRequest {
  /** Channel type */
  type: ChannelType;
  /** Channel name */
  name: string;
  /** Channel description */
  description: string;
  /** Channel-specific configuration */
  config: ChannelConfig;
}

/**
 * Request to update an existing channel
 */
export interface UpdateChannelRequest {
  /** Updated channel name */
  name?: string;
  /** Updated channel description */
  description?: string;
  /** Updated channel configuration */
  config?: ChannelConfig;
}

/**
 * Channel response
 */
export interface ChannelResponse {
  /** Channel data */
  channel: Channel;
}

/**
 * Channel list response
 */
export interface ChannelListResponse {
  /** Array of channels */
  channels: Channel[];
  /** Total number of channels */
  total: number;
}

/**
 * Location data for messages
 */
export interface Location {
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
  /** Location name */
  name?: string;
  /** Location address */
  address?: string;
}

/**
 * Contact data for messages
 */
export interface Contact {
  /** Contact name */
  name: {
    /** Formatted name */
    formatted_name: string;
    /** First name */
    first_name?: string;
    /** Last name */
    last_name?: string;
  };
  /** Contact phones */
  phones?: Array<{
    phone: string;
    type?: string;
  }>;
  /** Contact emails */
  emails?: Array<{
    email: string;
    type?: string;
  }>;
}

/**
 * Interactive message component (buttons, lists, etc.)
 */
export interface Interactive {
  /** Interactive type */
  type: "button" | "list" | "product" | "product_list";
  /** Header (optional) */
  header?: {
    type: "text" | "image" | "video" | "document";
    text?: string;
    media?: {
      id?: string;
      link?: string;
    };
  };
  /** Body text */
  body: {
    text: string;
  };
  /** Footer (optional) */
  footer?: {
    text: string;
  };
  /** Action component */
  action: any;
}

/**
 * Message attachment
 */
export interface Attachment {
  /** Attachment type */
  type: MessageContentType;
  /** Media URL */
  url?: string;
  /** Media ID (for uploaded media) */
  id?: string;
  /** Caption */
  caption?: string;
  /** MIME type */
  mime_type?: string;
  /** Filename */
  filename?: string;
}

/**
 * Message content
 */
export interface MessageContent {
  /** Content type */
  type: MessageContentType;
  /** Text content */
  text?: string;
  /** Media URL */
  media_url?: string;
  /** Caption for media */
  caption?: string;
  /** MIME type */
  mime_type?: string;
  /** Filename for documents */
  filename?: string;
  /** Location data */
  location?: Location;
  /** Contact data */
  contact?: Contact;
  /** Interactive component */
  interactive?: Interactive;
}

/**
 * Outgoing message request
 */
export interface OutgoingMessage {
  /** Recipient ID (phone number, user ID, etc.) */
  recipient_id: string;
  /** Message content */
  content: MessageContent;
  /** Message attachments */
  attachments?: Attachment[];
  /** Custom metadata */
  metadata?: Record<string, any>;
  /** Message ID to reply to */
  reply_to_id?: string;
  /** Template ID (for template messages) */
  template_id?: string;
  /** Template variables */
  variables?: Record<string, string>;
}

/**
 * Send message request
 */
export interface SendMessageRequest extends OutgoingMessage {}

/**
 * Send message response
 */
export interface SendMessageResponse {
  /** Whether the message was sent successfully */
  success: boolean;
  /** Message ID from the provider */
  message_id?: string;
  /** Error message (if failed) */
  error?: string;
  /** Additional details */
  details?: Record<string, any>;
}

/**
 * Test channel response
 */
export interface TestChannelResponse {
  /** Whether the test was successful */
  success: boolean;
  /** Test message */
  message: string;
  /** Additional test details */
  details?: Record<string, any>;
}

/**
 * Channel features response
 */
export interface ChannelFeaturesResponse {
  /** Channel ID */
  channel_id: ChannelID;
  /** Supported features */
  features: {
    /** Whether the channel supports text messages */
    text: boolean;
    /** Whether the channel supports images */
    images: boolean;
    /** Whether the channel supports audio */
    audio: boolean;
    /** Whether the channel supports video */
    video: boolean;
    /** Whether the channel supports documents */
    documents: boolean;
    /** Whether the channel supports location */
    location: boolean;
    /** Whether the channel supports contacts */
    contacts: boolean;
    /** Whether the channel supports interactive messages */
    interactive: boolean;
    /** Whether the channel supports templates */
    templates: boolean;
    /** Whether the channel supports message buffering */
    buffering: boolean;
  };
}

/**
 * Bulk channel operation request
 */
export interface BulkChannelRequest {
  /** Array of channel IDs to operate on */
  channel_ids: ChannelID[];
}

/**
 * Bulk channel operation response
 */
export interface BulkChannelOperationResponse {
  /** Success message */
  message: string;
  /** Number of channels affected */
  count: number;
  /** IDs of channels that failed (if any) */
  failed_ids?: ChannelID[];
}

/**
 * Channel type metadata
 */
export interface ChannelTypeMetadata {
  /** Channel type identifier */
  type: ChannelType;
  /** Display name */
  name: string;
  /** Channel type description */
  description: string;
  /** Configuration schema */
  schema: Record<string, any>;
  /** Example configuration */
  example?: Record<string, any>;
}
