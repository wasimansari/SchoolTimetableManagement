import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../../../services/timetable.service';

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrl: './teacher-management.component.css'
})
export class TeacherManagementComponent implements OnInit {
  newTeacherName: string = '';
  newTeacherSubject: string = '';
  teachers: any[] = [];
  editingTeacher: any = null;
  editingTeacherId: string | null = null;

  constructor(private timetableService: TimetableService) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  async addOrUpdateTeacher() {
    if (this.editingTeacherId) {
      // Update existing teacher
      await this.timetableService.updateTeacher(this.editingTeacherId, {
        teacherName: this.newTeacherName,
        teacherSubject: this.newTeacherSubject
      });
      this.editingTeacherId = null;
      this.editingTeacher = null;
    } else {
      // Add new teacher
      if (this.newTeacherName && this.newTeacherSubject) {
        await this.timetableService.addTeacher({
          teacherName: this.newTeacherName,
          teacherSubject: this.newTeacherSubject
        });
      }
    }
    this.newTeacherName = '';
    this.newTeacherSubject = '';
    this.loadTeachers();
  }

  editTeacher(teacher: any) {
    this.editingTeacher = teacher;
    this.editingTeacherId = teacher.id;
    this.newTeacherName = teacher.teacherName;
    this.newTeacherSubject = teacher.teacherSubject;
  }

  cancelEdit() {
    this.editingTeacher = null;
    this.editingTeacherId = null;
    this.newTeacherName = '';
    this.newTeacherSubject = '';
  }

  async deleteTeacher(id: string) {
    await this.timetableService.deleteTeacher(id);
    this.loadTeachers();
  }

  async loadTeachers() {
    this.timetableService.getTeachers().subscribe(data => {
      this.teachers = data;
    });
  }
}
