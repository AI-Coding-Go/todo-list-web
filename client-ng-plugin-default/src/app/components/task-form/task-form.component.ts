/**
 * 任务表单组件
 * 负责任务的新增和编辑功能
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Priority } from '../../models/task.model';
import dayjs from 'dayjs';

/**
 * 任务表单组件
 */
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.less'],
  imports: [FormsModule, CommonModule]
})
export class TaskFormComponent implements OnInit, OnDestroy {
  /** 组件销毁标识 */
  private destroy$ = new Subject<void>();
  
  /** 表单数据 */
  formData = {
    title: '',
    description: '',
    dueDate: '',
    priority: Priority.MEDIUM
  };
  
  /** 是否为编辑模式 */
  isEditMode = false;
  
  /** 编辑的任务ID */
  taskId: string | null = null;
  
  /** 表单验证错误 */
  errors = {
    title: ''
  };
  
  /** 表单是否已修改 */
  isFormDirty = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initRouteParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 初始化路由参数
   */
  private initRouteParams(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.taskId = params['id'];
          this.loadTaskData();
        }
      });
  }

  /**
   * 加载任务数据
   */
  private loadTaskData(): void {
    if (!this.taskId) return;
    
    const task = this.taskService.getTaskById(this.taskId);
    if (task) {
      this.formData = {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || '',
        priority: task.priority
      };
    } else {
      // 任务不存在，返回列表页
      this.navigateToList();
    }
  }

  /**
   * 标题输入变化
   */
  onTitleChange(): void {
    this.isFormDirty = true;
    this.validateTitle();
  }

  /**
   * 描述输入变化
   */
  onDescriptionChange(): void {
    this.isFormDirty = true;
  }

  /**
   * 截止时间变化
   */
  onDueDateChange(): void {
    this.isFormDirty = true;
  }

  /**
   * 优先级变化
   */
  onPriorityChange(): void {
    this.isFormDirty = true;
  }

  /**
   * 验证表单
   */
  validateForm(): boolean {
    let isValid = true;
    
    // 验证标题
    if (!this.validateTitle()) {
      isValid = false;
    }
    
    return isValid;
  }

  /**
   * 验证标题
   */
  private validateTitle(): boolean {
    const title = this.formData.title.trim();
    
    if (!title) {
      this.errors.title = '请输入任务标题';
      return false;
    }
    
    if (title.length > 50) {
      this.errors.title = '任务标题不能超过50个字符';
      return false;
    }
    
    this.errors.title = '';
    return true;
  }

  /**
   * 保存任务
   */
  saveTask(): void {
    if (!this.validateForm()) {
      return;
    }

    const taskData = {
      title: this.formData.title.trim(),
      description: this.formData.description.trim(),
      dueDate: this.formData.dueDate || undefined,
      priority: this.formData.priority
    };

    let success = false;
    
    if (this.isEditMode && this.taskId) {
      // 更新任务
      success = this.taskService.updateTask(this.taskId, taskData);
    } else {
      // 新增任务
      success = this.taskService.addTask(taskData);
    }

    if (success) {
      this.navigateToList();
    } else {
      alert('保存失败，请重试');
    }
  }

  /**
   * 取消操作
   */
  cancel(): void {
    if (this.isFormDirty) {
      if (confirm('确定要放弃当前的修改吗？')) {
        this.navigateToList();
      }
    } else {
      this.navigateToList();
    }
  }

  /**
   * 清空表单
   */
  clearForm(): void {
    this.formData = {
      title: '',
      description: '',
      dueDate: '',
      priority: Priority.MEDIUM
    };
    this.errors.title = '';
    this.isFormDirty = false;
  }

  /**
   * 获取页面标题
   */
  get pageTitle(): string {
    return this.isEditMode ? '编辑任务' : '新增任务';
  }

  /**
   * 获取保存按钮文本
   */
  get saveButtonText(): string {
    return this.isEditMode ? '保存修改' : '创建任务';
  }

  /**
   * 获取优先级选项
   */
  get priorityOptions(): { value: Priority; label: string }[] {
    return [
      { value: Priority.HIGH, label: '高' },
      { value: Priority.MEDIUM, label: '中' },
      { value: Priority.LOW, label: '低' }
    ];
  }

  /**
   * 格式化日期时间显示
   */
  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    return dayjs(dateTime).format('YYYY-MM-DD HH:mm');
  }

  /**
   * 获取字符计数
   */
  getTitleCharCount(): number {
    return this.formData.title.length;
  }

  /**
   * 获取描述字符计数
   */
  getDescriptionCharCount(): number {
    return this.formData.description.length;
  }

  /**
   * 检查是否可以保存
   */
  get canSave(): boolean {
    return this.formData.title.trim().length > 0 && 
           this.formData.title.trim().length <= 50 &&
           this.errors.title === '';
  }

  /**
   * 导航方法
   */
  private navigateToList(): void {
    this.router.navigate(['/']);
  }
}