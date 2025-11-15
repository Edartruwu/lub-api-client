/**
 * Channel service for managing communication channels
 * @module services/channel
 */

import { BaseService } from "./base.service";
import type {
  ChannelID,
  ChannelType,
  CreateChannelRequest,
  UpdateChannelRequest,
  ChannelResponse,
  ChannelListResponse,
  SendMessageRequest,
  SendMessageResponse,
  TestChannelResponse,
  ChannelFeaturesResponse,
  BulkChannelOperationResponse,
  SuccessResponse,
  ChannelTypeMetadata,
} from "../types";

/**
 * Service for managing communication channels
 *
 * Provides methods for creating, updating, and managing channels like WhatsApp,
 * Instagram, Telegram, and more.
 *
 * @example
 * ```ts
 * const channel = await client.channels.create({
 *   type: 'WHATSAPP',
 *   name: 'Support WhatsApp',
 *   description: 'Customer support channel',
 *   config: {
 *     provider: 'meta',
 *     phone_number_id: '...',
 *     access_token: '...'
 *   }
 * });
 * ```
 */
export class ChannelService extends BaseService {
  protected readonly basePath = "/channels";

  /**
   * Create a new channel
   *
   * @param request - Channel creation request
   * @returns Promise resolving to the created channel
   *
   * @throws {ValidationError} When the channel data is invalid
   * @throws {AuthorizationError} When the user lacks `channels:write` scope
   *
   * @example
   * ```ts
   * // Create a WhatsApp channel
   * const whatsapp = await client.channels.create({
   *   type: 'WHATSAPP',
   *   name: 'Support WhatsApp',
   *   description: 'Customer support',
   *   config: {
   *     provider: 'meta',
   *     phone_number_id: '123456789',
   *     business_account_id: '987654321',
   *     access_token: 'EAAxx...',
   *     webhook_verify_token: 'my-verify-token'
   *   }
   * });
   *
   * // Create an Instagram channel
   * const instagram = await client.channels.create({
   *   type: 'INSTAGRAM',
   *   name: 'Brand Instagram',
   *   description: 'Brand messaging',
   *   config: {
   *     provider: 'meta',
   *     app_id: 'app-id',
   *     page_id: 'page-id',
   *     page_token: 'page-token',
   *     app_secret: 'app-secret',
   *     verify_token: 'verify-token'
   *   }
   * });
   * ```
   */
  async create(request: CreateChannelRequest): Promise<ChannelResponse> {
    return this.client.post<ChannelResponse>(this.buildPath(""), request);
  }

  /**
   * List all channels for the tenant
   *
   * @returns Promise resolving to list of channels
   *
   * @throws {AuthorizationError} When the user lacks `channels:read` scope
   *
   * @example
   * ```ts
   * const { channels, total } = await client.channels.list();
   * console.log(`Found ${total} channels`);
   * ```
   */
  async list(): Promise<ChannelListResponse> {
    return this.client.get<ChannelListResponse>(this.buildPath(""));
  }

  /**
   * List active channels only
   *
   * @returns Promise resolving to list of active channels
   *
   * @throws {AuthorizationError} When the user lacks `channels:read` scope
   *
   * @example
   * ```ts
   * const { channels } = await client.channels.listActive();
   * ```
   */
  async listActive(): Promise<ChannelListResponse> {
    return this.client.get<ChannelListResponse>(this.buildPath("/active"));
  }

  /**
   * List channels by type
   *
   * @param type - Channel type to filter by
   * @returns Promise resolving to list of channels of the specified type
   *
   * @throws {AuthorizationError} When the user lacks `channels:read` scope
   *
   * @example
   * ```ts
   * const { channels } = await client.channels.listByType('WHATSAPP');
   * ```
   */
  async listByType(type: ChannelType): Promise<ChannelListResponse> {
    return this.client.get<ChannelListResponse>(
      this.buildPath(`/type/${type}`),
    );
  }

  /**
   * Get a channel by ID
   *
   * @param id - Channel ID
   * @returns Promise resolving to the channel
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {AuthorizationError} When the user lacks `channels:read` scope
   *
   * @example
   * ```ts
   * const { channel } = await client.channels.get('channel-123');
   * ```
   */
  async get(id: ChannelID): Promise<ChannelResponse> {
    return this.client.get<ChannelResponse>(this.buildPath(`/${id}`));
  }

  /**
   * Get a channel by name
   *
   * @param name - Channel name
   * @returns Promise resolving to the channel
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {AuthorizationError} When the user lacks `channels:read` scope
   *
   * @example
   * ```ts
   * const { channel } = await client.channels.getByName('support-whatsapp');
   * ```
   */
  async getByName(name: string): Promise<ChannelResponse> {
    return this.client.get<ChannelResponse>(
      this.buildPath(`/name/${encodeURIComponent(name)}`),
    );
  }

  /**
   * Get channel features and capabilities
   *
   * @param id - Channel ID
   * @returns Promise resolving to channel features
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {AuthorizationError} When the user lacks `channels:read` scope
   *
   * @example
   * ```ts
   * const { features } = await client.channels.getFeatures('channel-123');
   * if (features.interactive) {
   *   console.log('Channel supports interactive messages');
   * }
   * ```
   */
  async getFeatures(id: ChannelID): Promise<ChannelFeaturesResponse> {
    return this.client.get<ChannelFeaturesResponse>(
      this.buildPath(`/${id}/features`),
    );
  }

  /**
   * Update a channel
   *
   * @param id - Channel ID
   * @param request - Channel update request
   * @returns Promise resolving to the updated channel
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {ValidationError} When the update data is invalid
   * @throws {AuthorizationError} When the user lacks `channels:write` scope
   *
   * @example
   * ```ts
   * const updated = await client.channels.update('channel-123', {
   *   description: 'Updated description',
   *   config: {
   *     buffer_enabled: true,
   *     buffer_time_seconds: 10
   *   }
   * });
   * ```
   */
  async update(
    id: ChannelID,
    request: UpdateChannelRequest,
  ): Promise<ChannelResponse> {
    return this.client.put<ChannelResponse>(this.buildPath(`/${id}`), request);
  }

  /**
   * Delete a channel
   *
   * @param id - Channel ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {AuthorizationError} When the user lacks `channels:delete` scope
   *
   * @example
   * ```ts
   * await client.channels.delete('channel-123');
   * ```
   */
  async delete(id: ChannelID): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(this.buildPath(`/${id}`));
  }

  /**
   * Activate a channel
   *
   * @param id - Channel ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {AuthorizationError} When the user lacks `channels:write` scope
   *
   * @example
   * ```ts
   * await client.channels.activate('channel-123');
   * ```
   */
  async activate(id: ChannelID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(this.buildPath(`/${id}/activate`));
  }

  /**
   * Deactivate a channel
   *
   * @param id - Channel ID
   * @returns Promise resolving to success response
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {AuthorizationError} When the user lacks `channels:write` scope
   *
   * @example
   * ```ts
   * await client.channels.deactivate('channel-123');
   * ```
   */
  async deactivate(id: ChannelID): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(
      this.buildPath(`/${id}/deactivate`),
    );
  }

  /**
   * Send a message through a channel
   *
   * @param id - Channel ID
   * @param request - Message to send
   * @returns Promise resolving to send response
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {ValidationError} When the message data is invalid
   * @throws {AuthorizationError} When the user lacks `messages:send` scope
   *
   * @example
   * ```ts
   * // Send a text message
   * const result = await client.channels.sendMessage('channel-123', {
   *   recipient_id: '1234567890',
   *   content: {
   *     type: 'text',
   *     text: 'Hello, world!'
   *   }
   * });
   *
   * // Send an image with caption
   * await client.channels.sendMessage('channel-123', {
   *   recipient_id: '1234567890',
   *   content: {
   *     type: 'image',
   *     media_url: 'https://example.com/image.jpg',
   *     caption: 'Check this out!'
   *   }
   * });
   *
   * // Send a template message
   * await client.channels.sendMessage('channel-123', {
   *   recipient_id: '1234567890',
   *   template_id: 'welcome_message',
   *   variables: {
   *     name: 'John',
   *     company: 'Acme Inc'
   *   }
   * });
   * ```
   */
  async sendMessage(
    id: ChannelID,
    request: SendMessageRequest,
  ): Promise<SendMessageResponse> {
    return this.client.post<SendMessageResponse>(
      this.buildPath(`/${id}/send`),
      request,
    );
  }

  /**
   * Test a channel connection
   *
   * @param id - Channel ID
   * @returns Promise resolving to test response
   *
   * @throws {NotFoundError} When the channel doesn't exist
   * @throws {AuthorizationError} When the user lacks `channels:test` scope
   *
   * @example
   * ```ts
   * const result = await client.channels.test('channel-123');
   * if (result.success) {
   *   console.log('Channel is working correctly');
   * } else {
   *   console.error('Test failed:', result.message);
   * }
   * ```
   */
  async test(id: ChannelID): Promise<TestChannelResponse> {
    return this.client.post<TestChannelResponse>(this.buildPath(`/${id}/test`));
  }

  /**
   * Bulk activate channels
   *
   * @param channelIds - Array of channel IDs to activate
   * @returns Promise resolving to bulk operation response
   *
   * @throws {AuthorizationError} When the user lacks `channels:*` scope
   *
   * @example
   * ```ts
   * const result = await client.channels.bulkActivate([
   *   'channel-1',
   *   'channel-2',
   *   'channel-3'
   * ]);
   * console.log(`Activated ${result.count} channels`);
   * ```
   */
  async bulkActivate(
    channelIds: ChannelID[],
  ): Promise<BulkChannelOperationResponse> {
    return this.client.put<BulkChannelOperationResponse>(
      this.buildPath("/bulk/activate"),
      { channel_ids: channelIds },
    );
  }

  /**
   * Bulk deactivate channels
   *
   * @param channelIds - Array of channel IDs to deactivate
   * @returns Promise resolving to bulk operation response
   *
   * @throws {AuthorizationError} When the user lacks `channels:*` scope
   *
   * @example
   * ```ts
   * const result = await client.channels.bulkDeactivate([
   *   'channel-1',
   *   'channel-2'
   * ]);
   * ```
   */
  async bulkDeactivate(
    channelIds: ChannelID[],
  ): Promise<BulkChannelOperationResponse> {
    return this.client.put<BulkChannelOperationResponse>(
      this.buildPath("/bulk/deactivate"),
      { channel_ids: channelIds },
    );
  }

  /**
   * Get available channel types and their schemas
   *
   * @returns Promise resolving to array of channel type metadata
   *
   * @example
   * ```ts
   * const channelTypes = await client.channels.getChannelTypes();
   * channelTypes.forEach(type => {
   *   console.log(`${type.name}: ${type.description}`);
   * });
   * ```
   */
  async getChannelTypes(): Promise<ChannelTypeMetadata[]> {
    return this.client.get<ChannelTypeMetadata[]>(
      this.buildAbsolutePath("/api/channels/types"),
    );
  }

  /**
   * Validate channel configuration
   *
   * @param config - Channel configuration to validate
   * @returns Promise resolving to validation result
   *
   * @example
   * ```ts
   * const validation = await client.channels.validateConfig({
   *   type: 'WHATSAPP',
   *   config: {
   *     provider: 'meta',
   *     phone_number_id: '...'
   *   }
   * });
   * ```
   */
  async validateConfig(
    config: any,
  ): Promise<{ is_valid: boolean; errors?: string[] }> {
    return this.client.post<{ is_valid: boolean; errors?: string[] }>(
      this.buildAbsolutePath("/api/channels/validate"),
      config,
    );
  }
}
