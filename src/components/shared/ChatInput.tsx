import React, { useRef, useState, KeyboardEvent } from 'react';
import { Send, Paperclip, Camera, X, Loader2 } from 'lucide-react';
import { UploadedFile } from '../../types';
import { IconButton } from '../ui';
import FilePreview from './FilePreview';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileSelect?: (files: UploadedFile[]) => void;
  onCameraClick?: () => void;
  files?: UploadedFile[];
  onRemoveFile?: (index: number) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showCamera?: boolean;
  showAttachment?: boolean;
  maxFiles?: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onFileSelect,
  onCameraClick,
  files = [],
  onRemoveFile,
  isLoading = false,
  placeholder = 'Nhập tin nhắn...',
  disabled = false,
  showCamera = true,
  showAttachment = true,
  maxFiles = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const newFiles: UploadedFile[] = [];

    for (const file of selectedFiles) {
      if (files.length + newFiles.length >= maxFiles) {
        alert(`Tối đa ${maxFiles} file`);
        break;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" quá lớn (tối đa 10MB)`);
        continue;
      }

      try {
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newFiles.push({
          name: file.name,
          mimeType: file.type,
          data
        });
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

    if (newFiles.length > 0 && onFileSelect) {
      onFileSelect([...files, ...newFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isLoading && (value.trim() || files.length > 0)) {
        onSend();
      }
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  };

  const canSend = !disabled && !isLoading && (value.trim() || files.length > 0);

  return (
    <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
      {/* Attached Files Preview */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onRemove={() => onRemoveFile?.(index)}
            />
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        {showAttachment && (
          <>
            <IconButton
              icon={<Paperclip className="w-5 h-5" />}
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="md"
              disabled={disabled || files.length >= maxFiles}
              tooltip="Đính kèm file"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}

        {/* Camera Button */}
        {showCamera && onCameraClick && (
          <IconButton
            icon={<Camera className="w-5 h-5" />}
            onClick={onCameraClick}
            variant="ghost"
            size="md"
            disabled={disabled}
            tooltip="Chụp ảnh bài viết"
          />
        )}

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="
              w-full px-4 py-3
              bg-stone-100 dark:bg-stone-800
              border border-stone-200 dark:border-stone-700
              rounded-2xl
              resize-none
              text-stone-800 dark:text-stone-100
              placeholder:text-stone-400 dark:placeholder:text-stone-500
              focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
              max-h-[150px]
            "
            style={{ minHeight: '48px' }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!canSend}
          className={`
            p-3 rounded-xl
            transition-all duration-200
            flex items-center justify-center
            ${canSend
              ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/25'
              : 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 text-center">
        Nhấn Enter để gửi, Shift+Enter để xuống dòng
      </p>
    </div>
  );
};

export default ChatInput;
