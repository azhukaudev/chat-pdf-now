'use client';

import {
  optimisticallySendMessage,
  toUIMessages,
  useThreadMessages,
} from '@convex-dev/agent/react';
import { useMutation } from 'convex/react';
import { useState } from 'react';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Response } from '@/components/ai-elements/response';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

export interface DocumentChatProps {
  document: Doc<'documents'>;
}

export default function DocumentChat(props: DocumentChatProps) {
  const { results: messages } = useThreadMessages(
    api.chats.listMessages,
    { threadId: props.document.agentThreadId! },
    { initialNumItems: 50, stream: true },
  );

  const [prompt, setPrompt] = useState('');

  const sendMessage = useMutation(api.chats.sendMessage).withOptimisticUpdate(
    optimisticallySendMessage(api.chats.listMessages),
  );

  function handleSubmitMessage(
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    void sendMessage({
      threadId: props.document.agentThreadId!,
      documentId: props.document._id,
      prompt: message.text,
    }).catch(() => setPrompt(message.text));
    setPrompt('');
  }

  return (
    <div className="flex h-full flex-col divide-y bg-white">
      <Conversation>
        <ConversationContent>
          {toUIMessages(messages ?? []).map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <Response>{message.text}</Response>
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4">
        <PromptInput onSubmit={handleSubmitMessage} className="relative">
          <PromptInputTextarea
            placeholder="Enter your question (max 1,000 characters)"
            maxLength={1000}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <PromptInputSubmit
            className="absolute right-2 bottom-2"
            disabled={!prompt}
            status={'ready'}
          />
        </PromptInput>
      </div>
    </div>
  );
}
