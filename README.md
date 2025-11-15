# Relay API Client

A fully-typed TypeScript client for the Relay API, designed for BFF (Backend for Frontend) integration and providing comprehensive access to all Relay platform features.

## Features

- **Fully Typed** - Complete TypeScript type definitions for all API endpoints and data models
- **Comprehensive** - Covers all Relay API endpoints (Workflows, Tools, Credentials, Channels, etc.)
- **Well Documented** - JSDoc comments on all methods with examples
- **API Key Authentication** - Secure authentication using API keys with scopes
- **Error Handling** - Detailed error types for different failure scenarios
- **Interceptors** - Request/response interceptors for logging and monitoring
- **BFF Optimized** - Architecture designed for Backend for Frontend patterns

## Installation

```bash
npm install @relay/api-client
```

## Quick Start

```typescript
import { RelayClient } from "@relay/api-client";

// Initialize the client
const client = new RelayClient({
  apiKey: process.env.RELAY_API_KEY!,
  tenantId: process.env.RELAY_TENANT_ID!,
});

// Create a workflow
const workflow = await client.workflows.create({
  name: "WhatsApp Message Handler",
  description: "Handles incoming WhatsApp messages",
  trigger: {
    type: "CHANNEL_WEBHOOK",
    filters: { channel_ids: ["channel-123"] },
  },
  nodes: [
    {
      id: "node-1",
      name: "AI Agent",
      type: "AI_AGENT",
      config: {
        model: "gpt-4",
        system_prompt: "You are a helpful assistant",
      },
      on_success: ["node-2"],
    },
    {
      id: "node-2",
      name: "Send Response",
      type: "SEND_MESSAGE",
      config: {
        channel_id: "{{trigger.channel_id}}",
        recipient_id: "{{trigger.sender_id}}",
        message: "{{nodes.node-1.output.response}}",
      },
    },
  ],
});

// Execute the workflow
const result = await client.workflows.execute(workflow.workflow.id, {
  mode: "SYNC",
  input: { message: "Hello!" },
});

console.log("Workflow result:", result);
```

## Authentication

The Relay API uses API keys for authentication. Create an API key through the Relay dashboard or API:

```typescript
// You need to be authenticated with OAuth first to create API keys
const { api_key, secret_key, message } = await client.apiKeys.create({
  name: "Production Workflows",
  description: "For executing production workflows",
  scopes: [
    "workflows:execute",
    "workflows:read",
    "tools:read",
    "credentials:read",
  ],
  environment: "live",
  expires_in: 365, // Days
});

console.log(message);
// IMPORTANT: Store secret_key securely - it's only shown once!
process.env.RELAY_API_KEY = secret_key;
```

### Available Scopes

```typescript
// Super scope
"*"; // Full access

// Workflow scopes
"workflows:*"; // Full workflow access
"workflows:read";
"workflows:write";
"workflows:execute";
"workflows:delete";

// Tool scopes
"tools:*";
"tools:read";
"tools:write";
"tools:execute";
"tools:delete";

// Credential scopes
"credentials:*";
"credentials:read";
"credentials:write";
"credentials:decrypt"; // Access decrypted credentials
"credentials:delete";

// Channel scopes
"channels:*";
"channels:read";
"channels:write";
"channels:delete";

// Message scopes
"messages:*";
"messages:send";
```

## Client Configuration

```typescript
const client = new RelayClient({
  // Required
  apiKey: "relay_live_xxx...",
  tenantId: "tenant-123",

  // Optional
  baseURL: "https://api.relay.com", // Default
  timeout: 30000, // Request timeout in ms

  // Custom headers
  headers: {
    "X-Custom-Header": "value",
  },

  // Request interceptor
  onRequest: (url, options) => {
    console.log("→", options.method, url);
  },

  // Response interceptor
  onResponse: (response) => {
    console.log("←", response.status, response.url);
  },

  // Error interceptor
  onError: (error) => {
    console.error("Error:", error.message);
  },
});
```

## Usage Examples

### Workflows

```typescript
// Create a workflow
const workflow = await client.workflows.create({
  name: 'My Workflow',
  description: 'Workflow description',
  trigger: { type: 'WEBHOOK' },
  nodes: [
    {
      id: 'node-1',
      name: 'Transform Data',
      type: 'TRANSFORM',
      config: {
        script: 'return { message: input.message.toUpperCase() }'
      }
    }
  ]
});

// List workflows
const { data, total } = await client.workflows.list({
  page: 1,
  page_size: 20,
  is_active: true,
  search: 'whatsapp'
});

// Get a workflow
const { workflow } = await client.workflows.get('workflow-123');

// Update a workflow
await client.workflows.update('workflow-123', {
  description: 'Updated description'
});

// Activate/deactivate
await client.workflows.activate('workflow-123');
await client.workflows.deactivate('workflow-123');

// Execute a workflow
const result = await client.workflows.execute('workflow-123', {
  mode: 'SYNC',
  input: { message: 'Hello' },
  wait: true
});

// Test a workflow (without saving)
const testResult = await client.workflows.test({
  name: 'Test Workflow',
  trigger: { type: 'MANUAL' },
  nodes: [...]
});

// Validate a workflow
const validation = await client.workflows.validate({
  trigger: { type: 'WEBHOOK' },
  nodes: [...]
});

if (!validation.is_valid) {
  console.error('Errors:', validation.errors);
}

// Bulk operations
await client.workflows.bulkActivate(['wf-1', 'wf-2', 'wf-3']);
await client.workflows.bulkDeactivate(['wf-4', 'wf-5']);

// Get metadata
const nodeTypes = await client.workflows.getNodeTypes();
const triggerTypes = await client.workflows.getTriggerTypes();

// Delete a workflow
await client.workflows.delete('workflow-123');
```

### Tools

```typescript
// Create a tool
const tool = await client.tools.create({
  name: "Get User Info",
  description: "Fetches user information",
  type: "HTTP",
  config: {
    method: "GET",
    url: "https://api.example.com/users/{user_id}",
  },
  parameters: [
    {
      name: "user_id",
      description: "User ID to fetch",
      type: "string",
      required: true,
      source: "agent",
    },
    {
      name: "api_key",
      description: "API key for authentication",
      type: "string",
      required: true,
      source: "context",
      context_path: "{{credentials.api_key}}",
    },
  ],
});

// List tools
const { data } = await client.tools.list({
  type: "HTTP",
  is_active: true,
});

// Get tool parameters
const params = await client.tools.getParameters("tool-123");
console.log("Agent parameters:", params.agent_parameters);
console.log("Context parameters:", params.context_parameters);

// Test a tool
const result = await client.tools.test("tool-123", {
  parameters: { user_id: "12345" },
  context: { credentials: { api_key: "test-key" } },
});

// Update and activate
await client.tools.update("tool-123", {
  description: "Updated description",
});
await client.tools.activate("tool-123");
```

### Credentials

```typescript
// Create an API key credential
const credential = await client.credentials.create({
  name: "Stripe API Key",
  description: "Production Stripe key",
  type: "API_KEY",
  data: {
    api_key: "sk_live_...",
    header_name: "Authorization",
  },
  tags: ["production", "payment"],
});

// Create an OAuth2 credential
const oauth = await client.credentials.create({
  name: "Google OAuth",
  type: "OAUTH2",
  data: {
    client_id: "client-id",
    client_secret: "client-secret",
    access_token: "access-token",
    refresh_token: "refresh-token",
  },
});

// List credentials
const { data } = await client.credentials.list({
  type: "API_KEY",
  tags: ["production"],
});

// Get credential (encrypted)
const cred = await client.credentials.get("cred-123");

// Get credential with decrypted data (requires credentials:decrypt scope)
const { credential } = await client.credentials.getDecrypted("cred-123");
console.log("API Key:", credential.data.api_key);

// Auto-refresh OAuth token
const { credential: oauth } = await client.credentials.getDecrypted(
  "oauth-cred-123",
  true, // autoRefresh
);

// Update credential
await client.credentials.update("cred-123", {
  tags: ["production", "updated"],
});

// Share credential
await client.credentials.share("cred-123", {
  is_shared: true,
  user_ids: ["user-1", "user-2"],
});

// Test credential
const testResult = await client.credentials.test("cred-123");
if (!testResult.success) {
  console.error("Credential test failed:", testResult.message);
}

// Refresh OAuth token
await client.credentials.refresh("oauth-cred-123");
```

### Channels

```typescript
// Create a WhatsApp channel
const whatsapp = await client.channels.create({
  type: "WHATSAPP",
  name: "Support WhatsApp",
  description: "Customer support channel",
  config: {
    provider: "meta",
    phone_number_id: "123456789",
    business_account_id: "987654321",
    access_token: "EAAxx...",
    webhook_verify_token: "my-verify-token",
    buffer_enabled: true,
    buffer_time_seconds: 10,
  },
});

// Create an Instagram channel
const instagram = await client.channels.create({
  type: "INSTAGRAM",
  name: "Brand Instagram",
  description: "Brand messaging",
  config: {
    provider: "meta",
    app_id: "app-id",
    page_id: "page-id",
    page_token: "page-token",
    app_secret: "app-secret",
    verify_token: "verify-token",
  },
});

// List channels
const { channels } = await client.channels.list();
const { channels: active } = await client.channels.listActive();
const { channels: whatsappChannels } =
  await client.channels.listByType("WHATSAPP");

// Get channel features
const { features } = await client.channels.getFeatures("channel-123");
if (features.interactive) {
  console.log("Supports interactive messages");
}

// Send a text message
const result = await client.channels.sendMessage("channel-123", {
  recipient_id: "1234567890",
  content: {
    type: "text",
    text: "Hello, world!",
  },
});

// Send an image with caption
await client.channels.sendMessage("channel-123", {
  recipient_id: "1234567890",
  content: {
    type: "image",
    media_url: "https://example.com/image.jpg",
    caption: "Check this out!",
  },
});

// Send a template message
await client.channels.sendMessage("channel-123", {
  recipient_id: "1234567890",
  template_id: "welcome_message",
  variables: {
    name: "John",
    company: "Acme Inc",
  },
});

// Test channel connection
const testResult = await client.channels.test("channel-123");
```

### API Keys Management

```typescript
// Create an API key (requires OAuth authentication)
const { api_key, secret_key, message } = await client.apiKeys.create({
  name: "Production Key",
  description: "For production workflows",
  scopes: ["workflows:execute", "tools:read"],
  environment: "live",
  expires_in: 365,
});

// IMPORTANT: Store secret_key securely!
console.log("Secret:", secret_key);

// List API keys
const { data } = await client.apiKeys.list();

// Update API key scopes
await client.apiKeys.update("key-123", {
  scopes: ["workflows:*", "channels:*"],
});

// Revoke an API key
await client.apiKeys.revoke("key-123");

// Delete an API key
await client.apiKeys.delete("key-123");
```

### Invitations

```typescript
// Create an invitation
const invitation = await client.invitations.create({
  email: "user@example.com",
  role_id: "admin",
  expires_in_days: 7,
  message: "Welcome to the team!",
});

// Send the invitation URL
const inviteUrl = `https://app.relay.com/invite?token=${invitation.token}`;
console.log("Send this URL:", inviteUrl);

// List invitations
const { data } = await client.invitations.list();
const { data: pending } = await client.invitations.listPending();

// Validate an invitation token (public endpoint)
const validation = await client.invitations.validateToken("token-abc123");
if (validation.is_valid) {
  console.log("Valid invitation for:", validation.invitation?.email);
}

// Revoke an invitation
await client.invitations.revoke("invite-123");
```

### Webhooks

```typescript
// List webhook wait instances
const { instances, total } = await client.webhooks.listWaitInstances();

instances.forEach((instance) => {
  console.log("Workflow:", instance.workflow_id);
  console.log("Webhook URL:", instance.webhook_url);
  console.log("Triggered:", instance.triggered);
  if (instance.triggered) {
    console.log("Payload:", instance.payload);
  }
});
```

## Error Handling

The client provides detailed error types for different failure scenarios:

```typescript
import {
  RelayError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  NetworkError,
  ServerError,
  TimeoutError,
} from "@relay/api-client";

try {
  const workflow = await client.workflows.get("workflow-123");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error("Workflow not found");
  } else if (error instanceof AuthorizationError) {
    console.error("Insufficient permissions");
  } else if (error instanceof ValidationError) {
    console.error("Invalid data:", error.details);
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited. Retry after:", error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.error("Network error. Check your connection.");
  } else if (error instanceof RelayError) {
    console.error("API error:", error.message, error.status);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## TypeScript Support

The client is fully typed with comprehensive TypeScript definitions:

```typescript
import {
  Workflow,
  WorkflowNode,
  NodeType,
  TriggerType,
  Tool,
  ToolParameter,
  Credential,
  CredentialType,
  Channel,
  ChannelType,
} from "@relay/api-client";

// All types are exported and can be used in your application
const node: WorkflowNode = {
  id: "node-1",
  name: "My Node",
  type: NodeType.AI_AGENT,
  config: {
    model: "gpt-4",
  },
};
```

## Best Practices

### 1. Store API Keys Securely

```typescript
// ✅ Good - Use environment variables
const client = new RelayClient({
  apiKey: process.env.RELAY_API_KEY!,
  tenantId: process.env.RELAY_TENANT_ID!,
});

// ❌ Bad - Hardcoded keys
const client = new RelayClient({
  apiKey: "relay_live_xxx...", // Never hardcode!
  tenantId: "tenant-123",
});
```

### 2. Use Appropriate Scopes

```typescript
// ✅ Good - Minimal scopes for the use case
const { secret_key } = await client.apiKeys.create({
  name: "Workflow Executor",
  scopes: ["workflows:execute", "workflows:read"],
  environment: "live",
});

// ❌ Bad - Excessive permissions
const { secret_key } = await client.apiKeys.create({
  name: "Workflow Executor",
  scopes: ["*"], // Too broad!
  environment: "live",
});
```

### 3. Handle Errors Gracefully

```typescript
// ✅ Good - Specific error handling
try {
  await client.workflows.execute(workflowId, input);
} catch (error) {
  if (error instanceof NotFoundError) {
    // Handle missing workflow
  } else if (error instanceof ValidationError) {
    // Handle invalid input
  } else {
    // Handle other errors
  }
}
```

### 4. Use Interceptors for Logging

```typescript
const client = new RelayClient({
  apiKey: process.env.RELAY_API_KEY!,
  tenantId: process.env.RELAY_TENANT_ID!,

  onRequest: (url, options) => {
    logger.info("API Request", {
      method: options.method,
      url,
    });
  },

  onError: (error) => {
    logger.error("API Error", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
  },
});
```

## License

MIT

## Support

For issues and questions:

- GitHub Issues: https://github.com/relay/api-client/issues
- Documentation: https://docs.relay.com
- Email: support@relay.com
