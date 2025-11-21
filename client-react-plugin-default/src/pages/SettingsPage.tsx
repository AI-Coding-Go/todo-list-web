/**
 * 设置页面
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBell, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import type { IAppSettings } from '../types';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { storageService } from '../services/storage';
import { showToast } from '../utils';

interface ISettingsPageProps {
  onNavigate: (path: string) => void;
  onBack: () => void;
}

/**
 * 设置页面组件
 */
export const SettingsPage: React.FC<ISettingsPageProps> = ({
  onNavigate,
  onBack,
}) => {
  const [settings, setSettings] = useState<IAppSettings>(() => 
    storageService.getSettings()
  );
  const [loading, setLoading] = useState(false);

  // 处理提醒设置切换
  const handleReminderToggle = () => {
    const newSettings = {
      ...settings,
      reminderSettings: {
        ...settings.reminderSettings,
        enabled: !settings.reminderSettings.enabled,
      },
    };
    
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    showToast(
      newSettings.reminderSettings.enabled ? '任务提醒已开启' : '任务提醒已关闭'
    );
  };

  // 处理清除所有数据
  const handleClearAllData = async () => {
    const confirmed = window.confirm(
      '确定要清除所有数据吗？此操作不可恢复，将删除所有任务和设置。'
    );
    
    if (confirmed) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 模拟异步操作
        storageService.clearAllData();
        showToast('所有数据已清除');
        // 重新加载默认设置
        const defaultSettings = storageService.getSettings();
        setSettings(defaultSettings);
      } catch (error) {
        console.error('清除数据失败:', error);
        showToast('清除数据失败', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <Header
        title="设置"
        showBackButton={true}
        onBack={onBack}
      />

      {/* 主内容区 */}
      <main className="pt-14 pb-8 px-4">
        <div className="space-y-4">
          {/* 提醒设置 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">提醒设置</h3>
              
              <div className="space-y-4">
                {/* 任务提醒开关 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        任务提醒
                      </div>
                      <div className="text-xs text-gray-500">
                        在任务截止前30分钟和截止时提醒
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleReminderToggle}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${settings.reminderSettings.enabled
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${settings.reminderSettings.enabled
                          ? 'translate-x-6'
                          : 'translate-x-1'
                        }
                      `}
                    />
                  </button>
                </div>

                {/* 提醒说明 */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <FontAwesomeIcon 
                      icon={faInfoCircle} 
                      className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" 
                    />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">提醒功能说明：</p>
                      <ul className="space-y-0.5">
                        <li>• 仅对设置了截止时间的未完成任务触发提醒</li>
                        <li>• 提醒时间：截止前30分钟、截止时间、逾期后每24小时</li>
                        <li>• 最多提醒3次，避免过度打扰</li>
                        <li>• 支持浏览器桌面通知（需要授权）</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 数据管理 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h3>
              
              <div className="space-y-3">
                {/* 清除数据按钮 */}
                <Button
                  variant="danger"
                  icon={faTrash}
                  onClick={handleClearAllData}
                  loading={loading}
                  className="w-full"
                >
                  清除所有数据
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  此操作将删除所有任务和设置，且不可恢复
                </p>
              </div>
            </div>
          </div>

          {/* 应用信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">关于应用</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>应用名称</span>
                  <span className="text-gray-900">待办清单</span>
                </div>
                <div className="flex justify-between">
                  <span>版本</span>
                  <span className="text-gray-900">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>技术栈</span>
                  <span className="text-gray-900">React + TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span>数据存储</span>
                  <span className="text-gray-900">本地存储</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};