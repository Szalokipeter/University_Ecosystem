import { Routes } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './views/main/main.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: HeaderComponent }, // kell majd módosítani
];
