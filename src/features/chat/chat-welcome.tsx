import { FileQuestion, MessageSquare, Search } from 'lucide-react';

export interface ChatWelcomeProps {
  documentName: string;
}

export function ChatWelcome({ documentName }: ChatWelcomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <MessageSquare className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
        Start a conversation
      </h2>
      <p className="mb-8 max-w-sm text-sm text-stone-500 dark:text-stone-400">
        Ask any question about{' '}
        <span className="font-medium text-stone-700 dark:text-stone-300">
          {documentName}
        </span>{' '}
        and get AI-powered answers based on its content.
      </p>

      <div className="space-y-3 text-left">
        <h3 className="text-xs font-medium tracking-wider text-stone-400 uppercase dark:text-stone-500">
          Try asking
        </h3>
        <div className="space-y-2">
          <SuggestionItem
            icon={<Search className="h-4 w-4" />}
            text="What is this document about?"
          />
          <SuggestionItem
            icon={<FileQuestion className="h-4 w-4" />}
            text="Summarize the key points"
          />
          <SuggestionItem
            icon={<MessageSquare className="h-4 w-4" />}
            text="What are the main conclusions?"
          />
        </div>
      </div>
    </div>
  );
}

function SuggestionItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
      <span className="text-stone-400 dark:text-stone-500">{icon}</span>
      {text}
    </div>
  );
}
