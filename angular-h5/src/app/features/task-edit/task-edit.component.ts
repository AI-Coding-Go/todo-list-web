/**
 * 任务新增/编辑页组件
 * 支持创建新任务和编辑已有任务
 */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import dayjs from 'dayjs';
import { TaskService } from '../../core/services/task.service';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import type { ITodoTaskResponse, EApiTaskPriority, ITodoTaskCreateRequest, ITodoTaskUpdateRequest } from '../../shared/models/api.model';

/** 表单数据接口 */
interface IFormData {
  title: string;
  description: string;
  deadline: string;
  priority: EApiTaskPriority;
}

/** 优先级选项 */
const PRIORITY_OPTIONS: Array<{ value: EApiTaskPriority; label: string; colorClass: string }> = [
  { value: 'HIGH', label: '高', colorClass: 'text-red-500' },
  { value: 'MEDIUM', label: '中', colorClass: 'text-amber-500' },
  { value: 'LOW', label: '低', colorClass: 'text-green-500' }
];

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopBarComponent],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss'
})
export class TaskEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  /** 表单组 */
  form: FormGroup;
  /** 是否为编辑模式 */
  isEditMode = false;
  /** 任务 ID（编辑模式） */
  taskId: number | null = null;
  /** 加载状态 */
  loading = false;
  /** 显示优先级选择器 */
  showPriorityPicker = false;

  /** 优先级选项 */
  priorityOptions = PRIORITY_OPTIONS;

  constructor() {
    // 初始化表单
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(500)],
      deadline: [''],
      priority: ['MEDIUM' as EApiTaskPriority]
    });
  }

  ngOnInit(): void {
    // 检查是否为编辑模式
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.taskId = Number(id);
          return this.taskService.getTaskById(this.taskId);
        }
        return [];
      })
    ).subscribe({
      next: (task?: ITodoTaskResponse) => {
        if (task) {
          // 填充表单
          this.form.patchValue({
            title: task.title,
            description: task.description || '',
            deadline: task.deadline ? task.deadline.slice(0, 16) : '',
            priority: task.priority
          });
        }
      },
      error: (err: unknown) => {
        console.error('加载任务失败:', err);
        this.router.navigate(['']);
      }
    });
  }

  /** 获取表单控件 */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /** 处理返回 */
  onBack(): void {
    if (this.form.dirty) {
      if (window.confirm('有未保存的修改，确定要离开吗？')) {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

  /** 处理保存 */
  onSave(): void {
    // 验证表单
    if (this.form.invalid) {
      if (this.f['title'].errors?.['required']) {
        alert('请输入任务标题');
        return;
      }
      if (this.f['title'].errors?.['maxlength']) {
        alert('任务标题不能超过 50 字');
        return;
      }
      if (this.f['description'].errors?.['maxlength']) {
        alert('任务描述不能超过 500 字');
        return;
      }
    }

    this.loading = true;

    const formValue = this.form.value;
    const requestData = {
      title: formValue.title.trim(),
      description: formValue.description.trim() || undefined,
      deadline: formValue.deadline ? dayjs(formValue.deadline).format('YYYY-MM-DDTHH:mm:ss') : undefined,
      priority: formValue.priority
    };

    if (this.isEditMode && this.taskId) {
      // 更新任务
      this.taskService.editTask(this.taskId, requestData as ITodoTaskUpdateRequest).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err: unknown) => {
          console.error('保存失败:', err);
          const error = err as { message?: string };
          alert(error.message || '保存失败');
          this.loading = false;
        }
      });
    } else {
      // 创建任务
      this.taskService.createTask(requestData as ITodoTaskCreateRequest).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err: unknown) => {
          console.error('保存失败:', err);
          const error = err as { message?: string };
          alert(error.message || '保存失败');
          this.loading = false;
        }
      });
    }
  }

  /** 切换优先级选择器 */
  onTogglePriorityPicker(): void {
    this.showPriorityPicker = !this.showPriorityPicker;
  }

  /** 选择优先级 */
  onSelectPriority(priority: EApiTaskPriority): void {
    this.f['priority'].setValue(priority);
    this.showPriorityPicker = false;
  }

  /** 获取当前优先级标签 */
  getCurrentPriorityLabel(): string {
    return this.priorityOptions.find(p => p.value === this.f['priority'].value)?.label || '中';
  }

  /** 获取当前优先级颜色类 */
  getCurrentPriorityColor(): string {
    return this.priorityOptions.find(p => p.value === this.f['priority'].value)?.colorClass || 'text-amber-500';
  }

  /** 获取标题字符数 */
  getTitleCount(): number {
    return this.f['title'].value?.length || 0;
  }

  /** 获取描述字符数 */
  getDescriptionCount(): number {
    return this.f['description'].value?.length || 0;
  }
}
