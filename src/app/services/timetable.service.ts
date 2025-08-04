import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, collectionData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(private firestore: Firestore) { }

  // Teacher Management
  addTeacher(teacher: any) {
    const teachersCollection = collection(this.firestore, 'teacher-subject');
    return addDoc(teachersCollection, teacher);
  }

  getTeachers(): Observable<any[]> {
    const teachersCollection = collection(this.firestore, 'teacher-subject');
    return collectionData(teachersCollection, { idField: 'id' });
  }

  updateTeacher(id: string, teacher: any) {
    const teacherDocRef = doc(this.firestore, 'teacher-subject', id);
    return updateDoc(teacherDocRef, teacher);
  }

  deleteTeacher(id: string) {
    const teacherDocRef = doc(this.firestore, 'teacher-subject', id);
    return deleteDoc(teacherDocRef);
  }

  // User Management (for authentication roles)
  saveUser(uid: string, userData: any) {
    const userDocRef = doc(this.firestore, 'users', uid);
    return setDoc(userDocRef, userData);
  }

  // Timetable Management
  assignPeriod(assignment: any) {
    const timetableCollection = collection(this.firestore, 'timetable');
    return addDoc(timetableCollection, assignment);
  }

  getTimetable(): Observable<any[]> {
    const timetableCollection = collection(this.firestore, 'timetable');
    return collectionData(timetableCollection, { idField: 'id' });
  }
}