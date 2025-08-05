import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../../../services/timetable.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-timetable-management',
  templateUrl: './timetable-management.component.html',
  styleUrl: './timetable-management.component.css'
})
export class TimetableManagementComponent implements OnInit {
  // Assign Class to Teacher
  selectedDay: string = '';
  selectedClass: string = '';
  selectedPeriod: string = '';
  selectedSubject: string = '';
  selectedTeacherId: string = '';
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  subjects: string[] = ['Math', 'Science', 'English', 'Hindi', 'Urdu', 'Computer Science', 'Social Science', 'Economics', 'History', 'Political Science', 'Geography'];
  availableTeachers: any[] = [];

  // Copy Routine
  sourceDay: string = '';
  targetDay: string = '';
  continueForNextDays: boolean = false;

  // Periods
  periods: any[] = [];
  newPeriod: string = '';
  editingPeriod: any = null;

  // Classes
  classes: any[] = [];
  newClass: string = '';
  editingClass: any = null;

  // Teacher Leave
  leaves: any[] = [];
  teachers: any[] = [];
  leaveDate: string = '';

  constructor(private timetableService: TimetableService) { }

  ngOnInit(): void {
    this.loadPeriods();
    this.loadClasses();
    this.loadTeachers();
    this.loadLeave();
  }

  // Assign Class to Teacher
  async assignClassToTeacher() {
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

  onAssignmentDayChange() {
    this.filterAvailableTeachers();
  }

  filterAvailableTeachers() {
    const selectedDate = this.getFormattedDateForDay(this.selectedDay);
    this.availableTeachers = this.teachers.filter(teacher => {
      return !this.leaves.some(leave => leave.teacherId === teacher.id && leave.date === selectedDate);
    });
  }

  getFormattedDateForDay(day: string): string {
    const today = new Date();
    const dayIndex = this.daysOfWeek.indexOf(day);
    const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = dayIndex - currentDayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate.toISOString().split('T')[0];
  }

  // Copy Routine
  async copyRoutine() {
    if (!this.sourceDay || !this.targetDay) {
      alert('Please select both source and target days.');
      return;
    }

    let daysToCopy: string[] = [];
    if (this.continueForNextDays) {
      const startIndex = this.daysOfWeek.indexOf(this.targetDay);
      daysToCopy = this.daysOfWeek.slice(startIndex);
    } else {
      daysToCopy = [this.targetDay];
    }

    const sourceRoutine = await firstValueFrom(this.timetableService.getTimetableByDay(this.sourceDay));

    for (const day of daysToCopy) {
      await this.timetableService.deleteTimetableByDay(day);

      const targetDate = this.getFormattedDateForDay(day);

      for (const assignment of sourceRoutine) {
        const teacherOnLeave = this.leaves.some(leave =>
          leave.teacherId === assignment.teacherId && leave.date === targetDate
        );

        if (teacherOnLeave) {
          // Assign as vacant if teacher is on leave
          await this.timetableService.assignPeriod({
            day: day,
            class: assignment.class,
            period: assignment.period,
            subject: 'Vacant',
            teacherId: '' // No teacher assigned
          });
        } else {
          // Copy the original assignment
          await this.timetableService.assignPeriod({
            day: day,
            class: assignment.class,
            period: assignment.period,
            subject: assignment.subject,
            teacherId: assignment.teacherId
          });
        }
      }
    }
    alert('Routine copied successfully!');
  }

  // Periods
  loadPeriods() {
    this.timetableService.getPeriods().subscribe(data => {
      this.periods = data;
    });
  }

  addOrUpdatePeriod() {
    if (this.editingPeriod) {
      this.timetableService.updatePeriod(this.editingPeriod.id, { period: this.newPeriod });
    } else {
      this.timetableService.addPeriod({ period: this.newPeriod });
    }
    this.newPeriod = '';
    this.editingPeriod = null;
  }

  editPeriod(period: any) {
    this.newPeriod = period.period;
    this.editingPeriod = period;
  }

  deletePeriod(id: string) {
    this.timetableService.deletePeriod(id);
  }

  cancelEditPeriod() {
    this.newPeriod = '';
    this.editingPeriod = null;
  }

  // Classes
  loadClasses() {
    this.timetableService.getClasses().subscribe(data => {
      this.classes = data;
    });
  }

  addOrUpdateClass() {
    if (this.editingClass) {
      this.timetableService.updateClass(this.editingClass.id, { name: this.newClass });
    } else {
      this.timetableService.addClass({ name: this.newClass });
    }
    this.newClass = '';
    this.editingClass = null;
  }

  editClass(classItem: any) {
    this.newClass = classItem.name;
    this.editingClass = classItem;
  }

  deleteClass(id: string) {
    this.timetableService.deleteClass(id);
  }

  cancelEditClass() {
    this.newClass = '';
    this.editingClass = null;
  }

  // Teacher Leave
  loadTeachers() {
    this.timetableService.getTeachers().subscribe(data => {
      this.teachers = data;
      this.filterAvailableTeachers(); // Initial filter
    });
  }

  loadLeave() {
    this.timetableService.getLeave().subscribe(data => {
      this.leaves = data;
      this.filterAvailableTeachers(); // Re-filter when leave data changes
    });
  }

  addLeave() {
    this.timetableService.addLeave({ teacherId: this.selectedTeacherId, date: this.leaveDate });
    this.selectedTeacherId = '';
    this.leaveDate = '';
  }

  deleteLeave(id: string) {
    this.timetableService.deleteLeave(id);
  }

  getTeacherName(teacherId: string) {
    const teacher = this.teachers.find(t => t.id === teacherId);
    return teacher ? teacher.teacherName : 'N/A';
  }
}
