import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { TeacherManagementComponent } from './components/teacher-management/teacher-management.component';
import { TimetableManagementComponent } from './components/timetable-management/timetable-management.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'teachers', component: TeacherManagementComponent },
      { path: 'timetable', component: TimetableManagementComponent },
      { path: '', redirectTo: 'teachers', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
