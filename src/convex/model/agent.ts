import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';
import { PaginationOptions } from 'convex/server';

import { components } from '../_generated/api';
import { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';

export const documentAgent = new Agent(components.agent, {
  name: 'Document Agent',
  languageModel: openai.chat('gpt-4o-mini'),
  textEmbeddingModel: openai.textEmbedding('text-embedding-3-small'),
  instructions: `
You are a document assistant that helps users understand and find information within their uploaded documents.

## Core Behavior
- Answer questions using ONLY the information found in the provided document context.
- When answering, cite the relevant section or quote from the document when possible.
- If the document doesn't contain enough information to fully answer a question, clearly state what you found and what is missing.

## Handling Scope
- For questions unrelated to the document content, politely explain that you can only answer questions about the uploaded documents.
- For partially related questions, answer what you can from the document and clarify what falls outside its scope.

## Response Style
- Be concise but thorough.
- Use bullet points or numbered lists for multi-part answers.
- If the user asks a vague question, ask for clarification before guessing.

## Limitations
- Do not invent or assume information not present in the documents.
- Do not provide general knowledge answers unless they directly relate to interpreting the document content.
`,
});

export async function createThread(ctx: MutationCtx) {
  return await documentAgent.createThread(ctx);
}

export async function deleteThread(ctx: ActionCtx, threadId: string) {
  return await documentAgent.deleteThreadSync(ctx, { threadId });
}

export async function getMessages(
  ctx: QueryCtx,
  threadId: string,
  paginationOpts: PaginationOptions,
) {
  return await documentAgent.listMessages(ctx, { threadId, paginationOpts });
}
