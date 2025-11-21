/**
 * 任务筛选组件
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import type { FilterType, SortType } from '../../types';
import { Button } from '../ui/Button';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../../constants';

interface ITaskFilterProps {
  filter: FilterType;
  sortType: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sortType: SortType) => void;
}

/**
 * 任务筛选组件
 */
export const TaskFilter: React.FC<ITaskFilterProps> = ({
  filter,
  sortType,
  onFilterChange,
  onSortChange,
}) => {
  const [showSortOptions, setShowSortOptions] = React.useState(false);

  // 处理排序选项点击
  const handleSortOptionClick = (option: typeof SORT_OPTIONS[0]) => {
    onSortChange(option.value as SortType);
    setShowSortOptions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        {/* 筛选标签 */}
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-1">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value as FilterType)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${filter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排序按钮 */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            icon={faSort}
            onClick={() => setShowSortOptions(!showSortOptions)}
            className="text-gray-600"
          >
            {SORT_OPTIONS.find(option => option.value === sortType)?.label}
          </Button>

          {/* 排序选项下拉菜单 */}
          {showSortOptions && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortOptionClick(option)}
                  className={`
                    w-full px-3 py-2 text-sm text-left transition-colors
                    ${sortType === option.value
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};