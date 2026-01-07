import React from 'react';
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  PenTool,
  BookA,
  Users,
  Brain,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: 'Học Cá Nhân Hóa',
    description: 'AI phân tích điểm mạnh, yếu để tạo lộ trình riêng cho em'
  },
  {
    icon: GraduationCap,
    title: 'Luyện Thi Thông Minh',
    description: 'Tạo đề thi chuẩn, chấm tự động và phản hồi chi tiết'
  },
  {
    icon: PenTool,
    title: 'Phát Triển Kỹ Năng Viết',
    description: 'Hướng dẫn viết văn, phân tích và cải thiện bài luận'
  },
  {
    icon: BookA,
    title: 'Từ Điển Văn Học',
    description: 'Tra cứu thuật ngữ, biện pháp tu từ nhanh chóng'
  },
  {
    icon: Users,
    title: 'Đóng Vai Nhân Vật',
    description: 'Trò chuyện với nhân vật văn học để hiểu sâu tác phẩm'
  },
  {
    icon: Brain,
    title: 'Flashcard & Mindmap',
    description: 'Ghi nhớ kiến thức hiệu quả với công cụ trực quan'
  }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-stone-50 via-accent/5 to-stone-100 dark:from-stone-950 dark:via-accent/10 dark:to-stone-900 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl w-full my-8">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-700">
          {/* Header with Gradient */}
          <div className="relative p-8 md:p-12 bg-gradient-to-r from-accent/90 to-accent text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1.5" fill="white" />
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <BookOpen className="w-12 h-12 md:w-16 md:h-16" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-serif mb-4">
                Chào mừng đến với
                <br className="md:hidden" />
                <span className="block mt-2">AI Văn Học</span>
              </h1>
              <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Trợ lý học tập thông minh giúp em chinh phục môn Ngữ Văn lớp 10
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="p-6 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="
                      group p-5 md:p-6
                      bg-stone-50 dark:bg-stone-700/50
                      rounded-2xl border border-stone-200 dark:border-stone-600
                      hover:border-accent/50 dark:hover:border-accent/50
                      transition-all hover:shadow-lg hover:-translate-y-1
                    "
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm md:text-base">
                          {feature.title}
                        </h3>
                        <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-6">
              <Button
                size="xl"
                onClick={onContinue}
                rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                className="group shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40"
              >
                Bắt Đầu Ngay
              </Button>

              {/* Footer Note */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-700">
                <p className="text-xs md:text-sm text-stone-400 dark:text-stone-500 italic flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>made by An with love</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
