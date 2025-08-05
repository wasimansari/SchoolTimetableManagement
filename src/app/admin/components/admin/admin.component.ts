import { Component, OnInit } from '@angular/core';
import { TimetableService } from '../../../services/timetable.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  isSidebarCollapsed: boolean = false;

  constructor(private timetableService: TimetableService) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}