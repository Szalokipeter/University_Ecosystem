import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './views/main/main.component';
import { PortalComponent } from './views/portal/portal.component';
import { DashboardComponent } from './components/portal/dashboard/dashboard.component';
import { TodoListComponent } from './components/portal/todo-list/todo-list.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'portal',
    component: PortalComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'todos', component: TodoListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
