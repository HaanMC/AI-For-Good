import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, BookOpen, Quote, Lightbulb, History, X } from 'lucide-react';
import { DictionaryEntry } from '../../types';
import { Input, Button, Card, Badge, EmptyState } from '../ui';
import { LoadingDots } from '../ui/LoadingSpinner';
import { lookupDictionaryTerm, searchTerms } from '../../../services/geminiService';

interface DictionaryViewProps {
  onTermLookup?: (term: string) => void;
}

const DictionaryView: React.FC<DictionaryViewProps> = ({ onTermLookup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dictionary_recent_searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = useCallback((term: string) => {
    setRecentSearches(prev => {
      const updated = [term, ...prev.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem('dictionary_recent_searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle search
  const handleSearch = useCallback(async (term?: string) => {
    const searchValue = term || searchTerm.trim();
    if (!searchValue) return;

    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const entry = await lookupDictionaryTerm(searchValue);
      setResult(entry);
      saveRecentSearch(searchValue);
      onTermLookup?.(searchValue);
    } catch (err) {
      console.error('Dictionary lookup error:', err);
      setError('Không thể tra cứu thuật ngữ. Vui lòng thử lại.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, saveRecentSearch, onTermLookup]);

  // Handle input change with suggestions
  const handleInputChange = useCallback(async (value: string) => {
    setSearchTerm(value);

    if (value.trim().length >= 2) {
      try {
        const results = await searchTerms(value.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('dictionary_recent_searches');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Search Section */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-bold text-stone-800 dark:text-stone-100">
              Tra Cứu Thuật Ngữ Văn Học
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Tìm định nghĩa, ngữ cảnh và ví dụ minh họa
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nhập thuật ngữ văn học (VD: ẩn dụ, nhân hóa...)"
                leftIcon={<Search className="w-5 h-5" />}
                inputSize="lg"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="
                    absolute z-20 top-full left-0 right-0 mt-1
                    bg-white dark:bg-stone-800
                    border border-stone-200 dark:border-stone-700
                    rounded-xl shadow-lg
                    max-h-60 overflow-y-auto
                  "
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="
                        w-full px-4 py-3 text-left
                        text-stone-700 dark:text-stone-200
                        hover:bg-stone-100 dark:hover:bg-stone-700
                        transition-colors
                        flex items-center gap-2
                        first:rounded-t-xl last:rounded-b-xl
                      "
                    >
                      <Search className="w-4 h-4 text-stone-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={() => handleSearch()}
              size="lg"
              isLoading={isLoading}
              disabled={!searchTerm.trim()}
            >
              Tra cứu
            </Button>
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !result && !isLoading && (
          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <History className="w-4 h-4" />
                <span>Tra cứu gần đây</span>
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(term)}
                  className="
                    px-3 py-1.5 text-sm
                    bg-stone-100 dark:bg-stone-800
                    text-stone-600 dark:text-stone-400
                    rounded-full
                    hover:bg-stone-200 dark:hover:bg-stone-700
                    transition-colors
                  "
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card variant="filled" padding="lg">
          <div className="flex flex-col items-center py-8">
            <LoadingDots />
            <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
              Đang tra cứu "{searchTerm}"...
            </p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card variant="outlined" padding="md">
          <div className="flex items-center gap-3 text-red-500">
            <X className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && !isLoading && (
        <Card variant="elevated" padding="none" className="overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <Badge variant="default" className="bg-white/20 text-white mb-2">
              Thuật ngữ văn học
            </Badge>
            <h3 className="text-2xl font-bold font-serif">{result.term}</h3>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Definition */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                Định nghĩa
              </h4>
              <p className="text-stone-700 dark:text-stone-200 leading-relaxed">
                {result.definition}
              </p>
            </div>

            {/* Literary Context */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                <Lightbulb className="w-4 h-4" />
                Ngữ cảnh văn học
              </h4>
              <p className="text-stone-700 dark:text-stone-200 leading-relaxed">
                {result.literaryContext}
              </p>
            </div>

            {/* Example */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                <Quote className="w-4 h-4" />
                Ví dụ
              </h4>
              <blockquote className="
                pl-4 border-l-4 border-purple-400
                bg-purple-50 dark:bg-purple-900/20
                p-4 rounded-r-xl
                text-stone-700 dark:text-stone-200
                italic
              ">
                {result.example}
              </blockquote>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && searchTerm.trim() === '' && recentSearches.length === 0 && (
        <EmptyState
          icon={<BookOpen className="w-12 h-12" />}
          title="Khám phá thuật ngữ văn học"
          description="Nhập từ khóa để tra cứu định nghĩa, ngữ cảnh sử dụng và ví dụ minh họa từ tác phẩm văn học."
        />
      )}
    </div>
  );
};

export default DictionaryView;
