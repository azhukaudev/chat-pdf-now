import { FileQuestion, MessageSquare, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

const SUGGESTIONS = [
  {
    icon: Search,
    text: 'What is this document about?',
  },
  {
    icon: FileQuestion,
    text: 'Summarize the key points',
  },
  {
    icon: MessageSquare,
    text: 'What are the main conclusions?',
  },
];

export interface ChatWelcomeProps {
  documentName: string;
  onSuggestionClick?: (suggestion: string) => void;
}

export function ChatWelcome({
  documentName,
  onSuggestionClick,
}: ChatWelcomeProps) {
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

      <div className="w-full max-w-sm space-y-3 text-left">
        <h3 className="text-xs font-medium tracking-wider text-stone-400 uppercase dark:text-stone-500">
          Try asking
        </h3>
        <div className="space-y-2">
          {SUGGESTIONS.map((suggestion) => (
            <SuggestionButton
              key={suggestion.text}
              icon={<suggestion.icon className="h-4 w-4" />}
              text={suggestion.text}
              onClick={() => onSuggestionClick?.(suggestion.text)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionButton({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="flex h-auto w-full items-center justify-start gap-3 rounded-lg border-stone-200 bg-stone-50 px-4 py-3 text-left text-sm font-normal text-stone-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
      onClick={onClick}
    >
      <span className="text-stone-400 dark:text-stone-500">{icon}</span>
      {text}
    </Button>
  );
}
