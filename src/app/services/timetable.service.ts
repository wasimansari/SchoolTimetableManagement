import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, collectionData, setDoc, query, where, writeBatch } from '@angular/fire/firestore';
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

  getTimetableByDay(day: string): Observable<any[]> {
    const timetableCollection = collection(this.firestore, 'timetable');
    const q = query(timetableCollection, where('day', '==', day));
    return collectionData(q, { idField: 'id' });
  }

  async deleteTimetableByDay(day: string) {
    const timetableCollection = collection(this.firestore, 'timetable');
    const q = query(timetableCollection, where('day', '==', day));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(this.firestore);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    return batch.commit();
  }

  // Period Management
  getPeriods(): Observable<any[]> {
    const periodsCollection = collection(this.firestore, 'periods');
    return collectionData(periodsCollection, { idField: 'id' });
  }

  addPeriod(period: any) {
    const periodsCollection = collection(this.firestore, 'periods');
    return addDoc(periodsCollection, period);
  }

  updatePeriod(id: string, period: any) {
    const periodDocRef = doc(this.firestore, 'periods', id);
    return updateDoc(periodDocRef, period);
  }

  deletePeriod(id: string) {
    const periodDocRef = doc(this.firestore, 'periods', id);
    return deleteDoc(periodDocRef);
  }

  // Class Management
  getClasses(): Observable<any[]> {
    const classesCollection = collection(this.firestore, 'classes');
    return collectionData(classesCollection, { idField: 'id' });
  }

  addClass(className: any) {
    const classesCollection = collection(this.firestore, 'classes');
    return addDoc(classesCollection, className);
  }

  updateClass(id: string, className: any) {
    const classDocRef = doc(this.firestore, 'classes', id);
    return updateDoc(classDocRef, className);
  }

  deleteClass(id: string) {
    const classDocRef = doc(this.firestore, 'classes', id);
    return deleteDoc(classDocRef);
  }

  // Teacher Leave Management
  addLeave(leave: any) {
    const leaveCollection = collection(this.firestore, 'teacher_leave');
    return addDoc(leaveCollection, leave);
  }

  getLeave(): Observable<any[]> {
    const leaveCollection = collection(this.firestore, 'teacher_leave');
    return collectionData(leaveCollection, { idField: 'id' });
  }

  deleteLeave(id: string) {
    const leaveDocRef = doc(this.firestore, 'teacher_leave', id);
    return deleteDoc(leaveDocRef);
  }
}
