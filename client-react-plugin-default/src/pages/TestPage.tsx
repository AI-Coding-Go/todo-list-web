/**
 * 测试页面
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';

interface ITestPageProps {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

/**
 * 简单测试页面，便于联调或占位
 */
export const TestPage: React.FC<ITestPageProps> = ({
  onNavigate,
  onBack,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="测试页面"
        showBackButton={true}
        onBack={handleBack}
      />

      <main className="pt-14 pb-8 px-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faFlask} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">测试内容</h2>
              <p className="text-sm text-gray-600">
                这里是测试页面，可用于验证样式、路由或组件渲染。
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
          <h3 className="text-base font-semibold text-gray-900">操作</h3>
          <p className="text-sm text-gray-600">
            点击按钮可返回首页，或在地址栏输入 <code>#/test</code> 再次访问本页。
          </p>
          <Button
            block
            icon={faArrowRotateLeft}
            onClick={() => onNavigate('/')}
          >
            返回首页
          </Button>
        </div>
      </main>
    </div>
  );
};
