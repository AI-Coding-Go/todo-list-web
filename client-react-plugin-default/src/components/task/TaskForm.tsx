/**
 * 任务表单组件
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { ITask, Priority } from '../../types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { PRIORITY_CONFIG } from '../../constants';

interface ITaskFormProps {
  task?: ITask;
  onSubmit: (task: Omit<ITask, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * 任务表单组件
 */
export const TaskForm: React.FC<ITaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        deadline: task.deadline || '',
      });
    }
  }, [task]);

  // 处理表单字段变化
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入任务标题';
    } else if (formData.title.length > 50) {
      newErrors.title = '任务标题不能超过50字';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = '任务描述不能超过500字';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: task?.status || 'pending' as const,
      deadline: formData.deadline || undefined,
    };

    onSubmit(submitData);
  };

  // 优先级选项
  const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
  }));

  // 格式化截止时间用于datetime-local输入
  const formatDeadlineForInput = (deadline: string): string => {
    if (!deadline) return '';
    // 转换为datetime-local格式：YYYY-MM-DDTHH:mm
    return deadline.replace(' ', 'T');
  };

  // 处理截止时间变化
  const handleDeadlineChange = (value: string) => {
    // 转换回标准格式：YYYY-MM-DD HH:mm
    const formattedValue = value.replace('T', ' ');
    handleFieldChange('deadline', formattedValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 任务标题 */}
      <Input
        label="任务标题"
        value={formData.title}
        onChange={(value) => handleFieldChange('title', value)}
        placeholder="请输入任务标题"
        error={errors.title}
        maxLength={50}
        required
      />

      {/* 任务描述 */}
      <Textarea
        label="任务描述"
        value={formData.description}
        onChange={(value) => handleFieldChange('description', value)}
        placeholder="请输入任务描述（可选）"
        error={errors.description}
        maxLength={500}
        rows={4}
      />

      {/* 截止时间 */}
      <Input
        type="datetime-local"
        label="截止时间"
        value={formatDeadlineForInput(formData.deadline)}
        onChange={handleDeadlineChange}
        placeholder="请选择截止时间"
      />

      {/* 优先级 */}
      <Select
        label="优先级"
        value={formData.priority}
        onChange={(value) => handleFieldChange('priority', value as Priority)}
        options={priorityOptions}
      />

      {/* 操作按钮 */}
      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={task ? faSave : faPlus}
          className="flex-1"
        >
          {task ? '保存修改' : '添加任务'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          icon={faTimes}
          disabled={loading}
        >
          取消
        </Button>
      </div>
    </form>
  );
};