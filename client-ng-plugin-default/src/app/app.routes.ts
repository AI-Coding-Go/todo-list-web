/**
 * 应用路由配置
 */

import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    title: '待办清单'
  },
  {
    path: 'tasks/new',
    component: TaskFormComponent,
    title: '新增任务'
  },
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    title: '任务详情'
  },
  {
    path: 'tasks/:id/edit',
    component: TaskFormComponent,
    title: '编辑任务'
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    title: '数据统计'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: '设置'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
