import React, { useState } from 'react';
import {
  History,
  MessageSquare,
  Users,
  Trash2,
  ChevronRight,
  Clock,
  Search
} from 'lucide-react';
import { ChatSession } from '../../types';
import { Modal, Button, Input, Badge, EmptyState } from '../ui';
import { ConfirmDialog } from '../shared';

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onSelectSession,
  onDeleteSession,
  onClearAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // Filter sessions by search query
  const filteredHistory = chatHistory.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg =>
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  const handleSelectSession = (session: ChatSession) => {
    onSelectSession(session);
    onClose();
  };

  const handleDeleteSession = (sessionId: string) => {
    onDeleteSession(sessionId);
    setShowDeleteConfirm(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Lịch Sử Trò Chuyện"
        description={`${chatHistory.length} cuộc trò chuyện đã lưu`}
        size="lg"
        headerIcon={<History className="w-6 h-6" />}
        footer={
          chatHistory.length > 0 && (
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearAllConfirm(true)}
                className="text-red-500 hover:text-red-600"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Xóa tất cả
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Đóng
              </Button>
            </div>
          )
        }
      >
        {chatHistory.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12" />}
            title="Chưa có lịch sử"
            description="Các cuộc trò chuyện của em sẽ được lưu tự động tại đây."
          />
        ) : (
          <div className="space-y-4">
            {/* Search */}
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm trong lịch sử..."
              leftIcon={<Search className="w-4 h-4" />}
              inputSize="sm"
            />

            {/* Session List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-stone-500 dark:text-stone-400">
                  Không tìm thấy kết quả nào
                </div>
              ) : (
                filteredHistory.map(session => (
                  <div
                    key={session.id}
                    className="
                      group flex items-center gap-3 p-3
                      bg-stone-50 dark:bg-stone-800
                      rounded-xl
                      hover:bg-stone-100 dark:hover:bg-stone-700
                      transition-colors cursor-pointer
                    "
                    onClick={() => handleSelectSession(session)}
                  >
                    {/* Icon */}
                    <div className={`
                      p-2 rounded-xl
                      ${session.mode === 'roleplay'
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }
                    `}>
                      {session.mode === 'roleplay' ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 dark:text-stone-100 truncate">
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(session.updatedAt)}
                        <span>•</span>
                        <span>{session.messages.length} tin nhắn</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(session.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Single Session Confirm */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDeleteSession(showDeleteConfirm)}
        title="Xóa cuộc trò chuyện?"
        message="Cuộc trò chuyện này sẽ bị xóa vĩnh viễn và không thể khôi phục."
        confirmText="Xóa"
        variant="danger"
      />

      {/* Clear All Confirm */}
      <ConfirmDialog
        isOpen={showClearAllConfirm}
        onClose={() => setShowClearAllConfirm(false)}
        onConfirm={() => {
          onClearAll();
          setShowClearAllConfirm(false);
        }}
        title="Xóa tất cả lịch sử?"
        message={`Bạn có chắc muốn xóa tất cả ${chatHistory.length} cuộc trò chuyện? Hành động này không thể hoàn tác.`}
        confirmText="Xóa tất cả"
        variant="danger"
      />
    </>
  );
};

export default ChatHistoryModal;
