import React, { useState } from 'react';
import {
  UserCircle2,
  Target,
  AlertCircle,
  Award,
  History,
  TrendingUp,
  Edit2,
  Download,
  Trash2,
  FileText,
  Calendar,
  Trophy
} from 'lucide-react';
import { UserProfile, ExamHistory, ExamType, EXAM_TYPE_CONFIGS } from '../../types';
import { Card, Button, Badge, Modal, EmptyState, Avatar } from '../ui';

interface ProfileViewProps {
  profile: UserProfile | null;
  onEditProfile: () => void;
  onExportData: () => void;
  onDeleteExamHistory?: (examId: string) => void;
  onDownloadExamPDF?: (exam: ExamHistory) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onEditProfile,
  onExportData,
  onDeleteExamHistory,
  onDownloadExamPDF
}) => {
  const [selectedExam, setSelectedExam] = useState<ExamHistory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <EmptyState
          icon={<UserCircle2 className="w-12 h-12" />}
          title="Chưa có hồ sơ"
          description="Hãy tạo hồ sơ học tập để AI có thể cá nhân hóa trải nghiệm cho em."
          action={{
            label: 'Tạo hồ sơ',
            onClick: onEditProfile
          }}
        />
      </div>
    );
  }

  // Calculate statistics
  const examHistory = profile.examHistory || [];
  const avgScore = examHistory.length > 0
    ? (examHistory.reduce((sum, e) => sum + e.score, 0) / examHistory.length).toFixed(1)
    : null;
  const highestScore = examHistory.length > 0
    ? Math.max(...examHistory.map(e => e.score)).toFixed(1)
    : null;
  const totalExams = examHistory.length;

  // Get exam type label
  const getExamTypeLabel = (type?: ExamType) => {
    if (!type) return 'Kiểm tra';
    return EXAM_TYPE_CONFIGS[type]?.name || 'Kiểm tra';
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 6.5) return 'text-blue-600 dark:text-blue-400';
    if (score >= 5) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Profile Header */}
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar name={profile.name} size="xl" />
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif">
              {profile.name}
            </h2>
            {profile.goals && (
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                <Target className="w-4 h-4 inline mr-1" />
                {profile.goals}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onEditProfile}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportData}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Xuất dữ liệu
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="filled" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                {totalExams}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Bài kiểm tra
              </p>
            </div>
          </div>
        </Card>

        <Card variant="filled" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                {avgScore || '-'}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Điểm trung bình
              </p>
            </div>
          </div>
        </Card>

        <Card variant="filled" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                {highestScore || '-'}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Điểm cao nhất
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weaknesses & Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weaknesses */}
        <Card variant="default" padding="md">
          <Card.Header icon={<AlertCircle className="w-5 h-5" />}>
            <h3 className="font-bold text-stone-800 dark:text-stone-100">
              Điểm cần cải thiện
            </h3>
          </Card.Header>
          <Card.Content>
            {profile.weaknesses && profile.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.weaknesses.map((w, i) => (
                  <Badge key={i} variant="warning">
                    {w}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                Chưa có thông tin
              </p>
            )}
          </Card.Content>
        </Card>

        {/* Strengths */}
        <Card variant="default" padding="md">
          <Card.Header icon={<Award className="w-5 h-5" />}>
            <h3 className="font-bold text-stone-800 dark:text-stone-100">
              Điểm mạnh
            </h3>
          </Card.Header>
          <Card.Content>
            {profile.strengths && profile.strengths.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.strengths.map((s, i) => (
                  <Badge key={i} variant="success">
                    {s}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                Sẽ được cập nhật qua các bài kiểm tra
              </p>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Exam History */}
      <Card variant="default" padding="md">
        <Card.Header icon={<History className="w-5 h-5" />}>
          <h3 className="font-bold text-stone-800 dark:text-stone-100">
            Lịch sử kiểm tra
          </h3>
        </Card.Header>
        <Card.Content>
          {examHistory.length > 0 ? (
            <div className="space-y-3">
              {examHistory.slice(0, 10).map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`text-2xl font-bold ${getScoreColor(exam.score)}`}>
                      {exam.score.toFixed(1)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-stone-800 dark:text-stone-100 truncate">
                        {exam.topic}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(exam.date).toLocaleDateString('vi-VN')}
                        <Badge variant="default" size="sm">
                          {getExamTypeLabel(exam.examType)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {exam.examStructure && onDownloadExamPDF && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onDownloadExamPDF(exam)}
                        leftIcon={<Download className="w-4 h-4" />}
                      >
                        PDF
                      </Button>
                    )}
                    {onDeleteExamHistory && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setShowDeleteConfirm(exam.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {examHistory.length > 10 && (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center pt-2">
                  Và {examHistory.length - 10} bài kiểm tra khác...
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="w-10 h-10" />}
              title="Chưa có bài kiểm tra"
              description="Làm bài kiểm tra để theo dõi tiến bộ học tập."
            />
          )}
        </Card.Content>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Xác nhận xóa"
        size="sm"
        variant="danger"
        headerIcon={<Trash2 className="w-6 h-6" />}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (showDeleteConfirm && onDeleteExamHistory) {
                  onDeleteExamHistory(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }
              }}
            >
              Xóa
            </Button>
          </div>
        }
      >
        <p className="text-stone-600 dark:text-stone-400">
          Bạn có chắc muốn xóa bài kiểm tra này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  );
};

export default ProfileView;
