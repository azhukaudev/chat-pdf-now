# AGENTS.md

This document provides guidelines for AI coding agents working in this codebase.

## Project Overview

Chat PDF Now is a Next.js application that allows users to chat with PDF documents using AI. It uses Convex for backend/database, Clerk for authentication, and OpenAI for AI processing.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix primitives)
- **Backend**: Convex (functions in `src/convex/`)
- **Authentication**: Clerk
- **AI**: OpenAI via Vercel AI SDK (`@ai-sdk/openai`)

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start Next.js dev server with Turbopack
pnpm dev:convex       # Start Convex dev server (required for backend)

# Linting
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix

# Build
pnpm build            # Production build
```

**Note**: Run both `pnpm dev` and `pnpm dev:convex` in separate terminals for full development.

## Project Structure

```
src/
  app/               # Next.js App Router pages
  components/        # Reusable UI components
    ui/              # shadcn/ui components (do not edit manually)
    ai-elements/     # AI chat UI components
  convex/            # Convex backend functions and schema
    model/           # Business logic helpers
    _generated/      # Auto-generated Convex types (do not edit)
  features/          # Feature-specific components
  hooks/             # Custom React hooks
  lib/               # Utility functions
  providers/         # React context providers
  styles/            # Global CSS
```

## Code Style Guidelines

### TypeScript

- Strict mode enabled; avoid `any` types
- Use explicit types for function parameters and return values
- Use `Id<'tableName'>` from Convex for document IDs, not `string`
- Use `as const` for string literals in discriminated unions
- Define arrays as `const array: Array<T> = [...]`
- Define records as `const record: Record<K, V> = {...}`

### Imports (Prettier auto-sorted)

Import order is enforced by Prettier:

1. Built-in modules (node:)
2. Third-party modules
3. Alias imports (`@/...`)
4. Relative imports (`./`, `../`)

Blank lines separate each group.

```typescript
// Example
import { useMutation } from 'convex/react';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';

import { SomeComponent } from './some-component';
```

### Formatting

- **Prettier**: Single quotes, trailing commas, 80 char width
- **ESLint**: extends `next/core-web-vitals` and `next/typescript`

### React Components

- Use function declarations for components: `export default function ComponentName()`
- Props interfaces named `ComponentNameProps`
- Client components must have `'use client'` directive at top
- Use `cn()` from `@/lib/utils` for conditional class names

```typescript
export interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return <div className={cn('base-class')}>{children}</div>;
}
```

### Naming Conventions

- **Files**: kebab-case (`document-list.tsx`)
- **Components**: PascalCase (`DocumentList`)
- **Functions/variables**: camelCase
- **Convex functions**: camelCase exports (`getUserDocuments`)
- **Database indexes**: `by_field_name` format

## Convex Backend Guidelines

### Function Syntax

Always use the object syntax with validators:

```typescript
import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';

export const getDocument = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});
```

### Authentication

Use auth wrappers from `./model/auth.ts`:

- `Auth.authQuery` - for authenticated queries
- `Auth.authMutation` - for authenticated mutations
- `Auth.authAction` - for authenticated actions

```typescript
import * as Auth from './model/auth';

export const getUserData = Auth.authQuery({
  handler: async (ctx) => {
    // ctx.identity is available
  },
});
```

### Internal vs Public Functions

- `query`, `mutation`, `action` - Public API (exposed to clients)
- `internalQuery`, `internalMutation`, `internalAction` - Private (Convex-only)

### Function References

- Use `api.filename.functionName` for public functions
- Use `internal.filename.functionName` for internal functions

### Schema & Indexes

- Define schema in `src/convex/schema.ts`
- Always name indexes descriptively: `by_user_id`, `by_external_id`
- Use `v.union(v.type(), v.null())` for nullable fields

### Model Layer

Business logic lives in `src/convex/model/`:

- `auth.ts` - Authentication helpers
- `users.ts` - User operations
- `documents.ts` - Document CRUD
- `agent.ts` - AI agent configuration
- `rag.ts` - RAG/embeddings

## Error Handling

- Use `ConvexError` for user-facing errors in Convex functions
- Use `toast.error()` from Sonner for client-side error notifications
- Always handle potential null/undefined from database queries

```typescript
import { ConvexError } from 'convex/values';

const doc = await ctx.db.get(documentId);
if (!doc) {
  throw new ConvexError('Document not found');
}
```

## UI Components

### shadcn/ui

Components in `src/components/ui/` are from shadcn/ui. To add new ones:

```bash
npx shadcn@latest add <component-name>
```

### AI Elements

Chat UI components in `src/components/ai-elements/` - use these for AI interfaces.

### Styling

- Use Tailwind classes directly
- Use `cn()` for conditional classes
- Dark mode: use `dark:` prefix variants

## Environment Variables

Required variables (set in `.env.local` and Convex dashboard):

- `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `OPENAI_API_KEY`

## Key Patterns

### Custom Hooks

Hooks live in `src/hooks/` and follow `use-*` naming:

```typescript
export default function useDocumentUpload(
  options: UseDocumentUploadProps = {},
) {
  // Hook implementation
  return { isUploading, error, upload };
}
```

### Async Operations with Convex

```typescript
const mutation = useMutation(api.documents.processUploadedDocument);

// In event handler
await mutation({ name, storageId, size, text });
```

### Scheduling Background Work

```typescript
await ctx.scheduler.runAfter(
  0,
  internal.documents.initializeDocumentChatSystem,
  {
    documentId,
    userId: user._id,
    text,
  },
);
```
