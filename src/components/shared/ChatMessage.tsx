import React, { memo } from 'react';
import { BookOpen, User } from 'lucide-react';
import { Message, Sender, UploadedFile } from '../../types';
import { Avatar } from '../ui';
import { LoadingDots } from '../ui/LoadingSpinner';
import FilePreview from './FilePreview';

interface ChatMessageProps {
  message: Message;
  userName?: string;
  botName?: string;
  botAvatar?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = memo(({
  message,
  userName = 'Bạn',
  botName = 'AI Văn Học',
  botAvatar
}) => {
  const isBot = message.sender === Sender.Bot;

  // Parse markdown-like formatting
  const formatText = (text: string) => {
    // Convert **bold** to <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert *italic* to <em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert `code` to <code>
    formatted = formatted.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-700 rounded text-sm font-mono text-accent">$1</code>');
    // Convert newlines to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isBot ? '' : 'flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isBot ? (
          botAvatar || (
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
          )
        ) : (
          <Avatar name={userName} size="sm" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`
          max-w-[80%] sm:max-w-[70%]
          ${isBot
            ? 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700'
            : 'bg-accent text-white'
          }
          rounded-2xl px-4 py-3 shadow-sm
          ${isBot ? 'rounded-tl-sm' : 'rounded-tr-sm'}
        `}
      >
        {/* Sender Name */}
        <div
          className={`text-xs font-bold mb-1.5 ${
            isBot ? 'text-accent' : 'text-white/80'
          }`}
        >
          {isBot ? botName : userName}
        </div>

        {/* Loading State */}
        {message.isLoading ? (
          <LoadingDots />
        ) : (
          <>
            {/* Message Text */}
            <div
              className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                isBot
                  ? 'text-stone-700 dark:text-stone-200 dark:prose-invert'
                  : 'text-white'
              }`}
              dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
            />

            {/* Attached Files */}
            {message.files && message.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-200 dark:border-stone-600">
                {message.files.map((file, index) => (
                  <FilePreview key={index} file={file} showRemove={false} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-2 ${
            isBot ? 'text-stone-400' : 'text-white/60'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
