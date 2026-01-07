import React from 'react';
import { FileText, Image, X, File } from 'lucide-react';
import { UploadedFile } from '../../types';

interface FilePreviewProps {
  file: UploadedFile;
  onRemove?: () => void;
  showRemove?: boolean;
  size?: 'sm' | 'md';
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  showRemove = true,
  size = 'sm'
}) => {
  // Determine icon based on mime type
  const getIcon = () => {
    if (file.mimeType.startsWith('image/')) {
      return <Image className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
    }
    if (file.mimeType.includes('pdf') || file.mimeType.includes('document')) {
      return <FileText className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
    }
    return <File className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />;
  };

  // Check if file is an image
  const isImage = file.mimeType.startsWith('image/');

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3 py-2 text-sm gap-2'
  };

  return (
    <div
      className={`
        inline-flex items-center ${sizeStyles[size]}
        bg-white dark:bg-stone-800
        border border-stone-200 dark:border-stone-700
        rounded-lg shadow-sm
        hover:border-accent/50 transition-colors
        group
      `}
    >
      {/* Thumbnail or Icon */}
      {isImage && file.data ? (
        <img
          src={`data:${file.mimeType};base64,${file.data}`}
          alt={file.name}
          className={`${size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'} rounded object-cover`}
        />
      ) : (
        <span className="text-accent">{getIcon()}</span>
      )}

      {/* File Name */}
      <span
        className={`
          truncate text-stone-700 dark:text-stone-300 font-medium
          ${size === 'sm' ? 'max-w-[100px]' : 'max-w-[150px]'}
        `}
        title={file.name}
      >
        {file.name}
      </span>

      {/* Remove Button */}
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="
            ml-auto p-0.5 rounded
            text-stone-400 hover:text-red-500
            opacity-0 group-hover:opacity-100
            transition-all
          "
          title="Xóa file"
        >
          <X className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      )}
    </div>
  );
};

export default FilePreview;
