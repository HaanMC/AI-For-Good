import React, { useState, useCallback } from 'react';
import { Layers, RefreshCw, Plus, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Flashcard } from '../../types';
import { Input, Button, Card, Badge, Select, EmptyState } from '../ui';
import { LoadingDots } from '../ui/LoadingSpinner';
import { generateFlashcards } from '../../../services/geminiService';

interface FlashcardViewProps {
  weaknesses?: string[];
}

// Single Flashcard Component with 3D flip
const FlashcardItem: React.FC<{ card: Flashcard }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  const difficultyLabels = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó'
  };

  return (
    <div
      className="relative h-64 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`
          absolute inset-0 transition-transform duration-500
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="
            absolute inset-0
            bg-white dark:bg-stone-800
            rounded-2xl shadow-lg
            border border-stone-200 dark:border-stone-700
            p-6 flex flex-col
            [backface-visibility:hidden]
          "
        >
          <div className="flex items-center justify-between mb-4">
            <Badge variant="primary" size="sm">
              {card.category}
            </Badge>
            {card.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColors[card.difficulty]}`}>
                {difficultyLabels[card.difficulty]}
              </span>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg font-bold text-stone-800 dark:text-stone-100 text-center leading-relaxed">
              {card.front}
            </p>
          </div>
          <div className="flex items-center justify-center text-stone-400 dark:text-stone-500 text-sm mt-4">
            <RotateCcw className="w-4 h-4 mr-2" />
            Click để xem đáp án
          </div>
        </div>

        {/* Back */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10
            rounded-2xl shadow-lg
            border-2 border-accent/50
            p-6 flex flex-col
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
          "
        >
          <div className="flex items-center justify-between mb-4">
            <Badge variant="success" size="sm">
              Đáp án
            </Badge>
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <p className="text-base text-stone-700 dark:text-stone-200 text-center leading-relaxed">
              {card.back}
            </p>
          </div>
          <div className="flex items-center justify-center text-accent text-sm mt-4">
            <RotateCcw className="w-4 h-4 mr-2" />
            Click để quay lại
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardView: React.FC<FlashcardViewProps> = ({ weaknesses = [] }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState('10');
  const [difficulty, setDifficulty] = useState<'mixed' | 'easy' | 'medium' | 'hard'>('mixed');
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  // Generate flashcards
  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const numCards = Math.min(Math.max(parseInt(count) || 10, 1), 50);
      const result = await generateFlashcards(
        topic,
        numCards,
        difficulty === 'mixed' ? undefined : difficulty
      );
      setCards(result);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Flashcard generation error:', err);
      setError('Không thể tạo flashcard. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, count, difficulty]);

  // Navigation
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : (cards?.length || 1) - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < (cards?.length || 1) - 1 ? prev + 1 : 0));
  };

  // Reset
  const handleReset = () => {
    setCards(null);
    setCurrentIndex(0);
    setTopic('');
  };

  // Suggested topics based on weaknesses
  const suggestedTopics = weaknesses.length > 0
    ? weaknesses.slice(0, 4)
    : ['Biện pháp tu từ', 'Thể loại văn học', 'Tác giả văn học Việt Nam', 'Phân tích thơ'];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Card */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
            <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="font-bold text-stone-800 dark:text-stone-100">
              Flashcard Học Tập
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Tạo thẻ ghi nhớ cho bất kỳ chủ đề văn học nào
            </p>
          </div>
        </div>

        {/* Generator Form */}
        {!cards && (
          <div className="space-y-4">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Nhập chủ đề (VD: Biện pháp tu từ, Truyện Kiều...)"
              label="Chủ đề"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                  Số lượng thẻ
                </label>
                <Select
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  options={[
                    { value: '5', label: '5 thẻ' },
                    { value: '10', label: '10 thẻ' },
                    { value: '15', label: '15 thẻ' },
                    { value: '20', label: '20 thẻ' },
                    { value: '30', label: '30 thẻ' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                  Độ khó
                </label>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  options={[
                    { value: 'mixed', label: 'Hỗn hợp' },
                    { value: 'easy', label: 'Dễ' },
                    { value: 'medium', label: 'Trung bình' },
                    { value: 'hard', label: 'Khó' }
                  ]}
                />
              </div>
            </div>

            {/* Suggested Topics */}
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                Gợi ý chủ đề:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="px-3 py-1.5 text-xs bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              fullWidth
              isLoading={isLoading}
              disabled={!topic.trim()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Tạo Flashcard
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="py-8 text-center">
            <LoadingDots />
            <p className="mt-3 text-sm text-stone-500">Đang tạo flashcard về "{topic}"...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
            {error}
          </div>
        )}
      </Card>

      {/* Flashcards Display */}
      {cards && cards.length > 0 && !isLoading && (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="primary">
                {currentIndex + 1} / {cards.length}
              </Badge>
              <span className="text-sm text-stone-500">thẻ</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
              >
                {viewMode === 'single' ? 'Xem lưới' : 'Xem từng thẻ'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Tạo mới
              </Button>
            </div>
          </div>

          {/* Single Card View */}
          {viewMode === 'single' && (
            <div className="relative">
              <FlashcardItem card={cards[currentIndex]} />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  onClick={goToPrevious}
                  leftIcon={<ChevronLeft className="w-5 h-5" />}
                >
                  Trước
                </Button>

                {/* Progress Dots */}
                <div className="flex items-center gap-1">
                  {cards.slice(0, 10).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`
                        w-2 h-2 rounded-full transition-all
                        ${index === currentIndex
                          ? 'bg-accent w-4'
                          : 'bg-stone-300 dark:bg-stone-600 hover:bg-stone-400'
                        }
                      `}
                    />
                  ))}
                  {cards.length > 10 && (
                    <span className="text-xs text-stone-400 ml-1">+{cards.length - 10}</span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  onClick={goToNext}
                  rightIcon={<ChevronRight className="w-5 h-5" />}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card, index) => (
                <FlashcardItem key={card.id || index} card={card} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!cards && !isLoading && (
        <EmptyState
          icon={<Layers className="w-12 h-12" />}
          title="Tạo Flashcard của bạn"
          description="Nhập chủ đề và AI sẽ tạo các thẻ ghi nhớ giúp em học hiệu quả hơn."
        />
      )}
    </div>
  );
};

export default FlashcardView;
