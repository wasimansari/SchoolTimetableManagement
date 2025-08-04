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
  currentDay: string = '';
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  periods: string[] = [
    '9:30 - 10:15',
    '10:15 - 11:00',
    '11:00 - 11:45',
    '11:45 - 12:30',
    '1:10 - 1:55',
    '1:55 - 2:40'
  ];
  classes: string[] = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

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
  }

  getAssignment(day: string, period: string, className: string): string {
    const assignment = this.timetable.find(item =>
      item.day === day &&
      item.period === period &&
      item.class === className
    );
    if (assignment) {
      const teacher = this.teachers.find(t => t.id === assignment.teacherId);
      return `${assignment.subject} (${teacher ? teacher.teacherName : 'N/A'})`;
    }
    return '';
  }

  onDayChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currentDay = selectElement.value;
  }
}