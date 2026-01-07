import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Message, Sender, UploadedFile } from '../../types';
import { ChatMessage, ChatInput } from '../shared';
import { EmptyState } from '../ui';
import { MessageSquare, Sparkles } from 'lucide-react';
import { sendMessageToGemini, extractTextFromImage } from '../../../services/geminiService';
import { checkContentSafety, createSupportiveResponse } from '../../../utils/contentSafetyFilter';

interface ChatViewProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userName?: string;
  weaknesses?: string[];
  isFastMode: boolean;
  onSaveSession?: (messages: Message[]) => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  setMessages,
  userName,
  weaknesses = [],
  isFastMode,
  onSaveSession
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() && files.length === 0) return;

    // Check content safety first
    const safetyCheck = checkContentSafety(inputMessage);
    if (safetyCheck.riskLevel !== 'none' && safetyCheck.riskLevel !== 'low') {
      // Show supportive response for concerning content
      const supportiveMsg = createSupportiveResponse(safetyCheck);
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: supportiveMsg,
        sender: Sender.Bot,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
      setInputMessage('');
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputMessage,
      sender: Sender.User,
      timestamp: Date.now(),
      files: files.length > 0 ? [...files] : undefined
    };

    // Add loading message
    const loadingMessage: Message = {
      id: `loading_${Date.now()}`,
      text: '',
      sender: Sender.Bot,
      timestamp: Date.now(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');
    setFiles([]);
    setIsLoading(true);

    try {
      // Extract text from images if any
      let imageTexts: string[] = [];
      for (const file of userMessage.files || []) {
        if (file.mimeType.startsWith('image/')) {
          try {
            const extractedText = await extractTextFromImage(file.data, file.mimeType);
            if (extractedText) {
              imageTexts.push(extractedText);
            }
          } catch (err) {
            console.error('OCR error:', err);
          }
        }
      }

      // Build context with image texts
      let fullMessage = userMessage.text;
      if (imageTexts.length > 0) {
        fullMessage += `\n\n[Nội dung từ ảnh đính kèm]:\n${imageTexts.join('\n\n')}`;
      }

      // Get AI response
      const response = await sendMessageToGemini(
        fullMessage,
        messages.filter(m => !m.isLoading),
        weaknesses,
        isFastMode ? false : true // Use extended thinking for deep mode
      );

      // Replace loading with actual response
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isLoading);
        return [
          ...filtered,
          {
            id: `bot_${Date.now()}`,
            text: response,
            sender: Sender.Bot,
            timestamp: Date.now()
          }
        ];
      });

      // Save session
      onSaveSession?.(messages);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isLoading);
        return [
          ...filtered,
          {
            id: `error_${Date.now()}`,
            text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
            sender: Sender.Bot,
            timestamp: Date.now()
          }
        ];
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, files, messages, weaknesses, isFastMode, setMessages, onSaveSession]);

  // Handle file selection
  const handleFileSelect = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12" />}
            title="Bắt đầu cuộc trò chuyện"
            description="Hãy đặt câu hỏi về văn học, yêu cầu phân tích tác phẩm, hoặc nhờ giải thích khái niệm."
          />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                userName={userName}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggestions (show when no messages or few messages) */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-stone-200 dark:border-stone-800">
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
            Gợi ý câu hỏi:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Phân tích nhân vật Thúy Kiều',
              'Giải thích biện pháp tu từ ẩn dụ',
              'So sánh thơ Đường và thơ lục bát',
              'Hướng dẫn viết nghị luận xã hội'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="
                  px-3 py-1.5 text-xs font-medium
                  bg-accent/10 text-accent
                  rounded-full
                  hover:bg-accent/20 transition-colors
                  flex items-center gap-1
                "
              >
                <Sparkles className="w-3 h-3" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={handleSendMessage}
        onFileSelect={handleFileSelect}
        files={files}
        onRemoveFile={handleRemoveFile}
        isLoading={isLoading}
        placeholder="Hỏi về văn học, phân tích tác phẩm..."
        showCamera={true}
        onCameraClick={() => setShowCamera(true)}
      />
    </div>
  );
};

export default ChatView;
