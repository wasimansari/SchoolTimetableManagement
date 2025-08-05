import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  timetable: any[] = [];
  teachers: any[] = [];
  leaves: any[] = [];
  currentDay: string = '';
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  periods: any[] = [];
  classes: any[] = [];

  constructor(private timetableService: TimetableService) { }

  ngOnInit(): void {
    const today = new Date();
    this.currentDay = this.daysOfWeek[today.getDay() - 1]; // Adjust for 0-indexed Sunday
    if (today.getDay() === 0) { // If it's Sunday, set to Monday for display
      this.currentDay = 'Monday';
    }

    this.timetableService.getTimetable().subscribe(data => {
      this.timetable = data;
    });

    this.timetableService.getTeachers().subscribe(data => {
      this.teachers = data;
    });

    this.timetableService.getPeriods().subscribe(data => {
      this.periods = data.sort((a, b) => a.period.localeCompare(b.period));
    });

    this.timetableService.getClasses().subscribe(data => {
      this.classes = data.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.timetableService.getLeave().subscribe(data => {
      this.leaves = data;
    });
  }

  getAssignment(day: string, period: string, className: string): string {
    const assignment = this.timetable.find(item =>
      item.day === day &&
      item.period === period &&
      item.class === className
    );
    if (assignment) {
      const teacher = this.teachers.find(t => t.id === assignment.teacherId);
      const teacherName = teacher ? teacher.teacherName : 'N/A';

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const dayOfMonth = today.getDate() - today.getDay() + this.daysOfWeek.indexOf(day) + 1;
      const assignmentDate = new Date(year, month, dayOfMonth).toISOString().split('T')[0];

      const onLeave = this.leaves.find(l => l.teacherId === assignment.teacherId && l.date === assignmentDate);

      if (onLeave) {
        return `On Leave (${teacherName})`;
      }

      return `${assignment.subject} (${teacherName})`;
    }
    return '';
  }

  onDayChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currentDay = selectElement.value;
  }
}
