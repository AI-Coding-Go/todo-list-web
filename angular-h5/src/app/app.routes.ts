/**
 * 应用路由配置
 */

import { Routes } from '@angular/router';
import { TaskListComponent } from './features/task-list/task-list.component';
import { TaskEditComponent } from './features/task-edit/task-edit.component';
import { TaskDetailComponent } from './features/task-detail/task-detail.component';
import { StatisticsComponent } from './features/statistics/statistics.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ApiTestComponent } from './features/api-test/api-test.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent, pathMatch: 'full' },
  { path: 'task/new', component: TaskEditComponent },
  { path: 'task/edit/:id', component: TaskEditComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'test-api', component: ApiTestComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
