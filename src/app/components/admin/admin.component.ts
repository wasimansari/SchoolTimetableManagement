import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  newTeacherName: string = '';
  newTeacherSubject: string = '';
  teachers: any[] = [];
  editingTeacher: any = null;
  editingTeacherId: string | null = null;

  // Timetable assignment properties
  selectedDay: string = '';
  selectedClass: string = '';
  selectedPeriod: string = '';
  selectedSubject: string = '';
  selectedTeacherId: string = '';

  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  classes: string[] = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  periods: string[] = [
    '9:30 - 10:15',
    '10:15 - 11:00',
    '11:00 - 11:45',
    '11:45 - 12:30',
    '1:10 - 1:55',
    '1:55 - 2:40'
  ];
  subjects: string[] = ['Math', 'Science', 'English', 'Hindi', 'Urdu', 'Computer Science', 'Social Science', 'Economics', 'History', 'Political Science', 'Geography'];

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

  async assignPeriod() {
    if (this.selectedDay && this.selectedClass && this.selectedPeriod && this.selectedSubject && this.selectedTeacherId) {
      await this.timetableService.assignPeriod({
        day: this.selectedDay,
        class: this.selectedClass,
        period: this.selectedPeriod,
        subject: this.selectedSubject,
        teacherId: this.selectedTeacherId
      });
      // Clear form
      this.selectedDay = '';
      this.selectedClass = '';
      this.selectedPeriod = '';
      this.selectedSubject = '';
      this.selectedTeacherId = '';
    }
  }
}