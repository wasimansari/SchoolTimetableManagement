import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface SubjectTeacher {
  id?: string;
  subject: string;
  teacher: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private subjectTeacherCollection = collection(this.firestore, 'subject-teachers');
  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) { }

  getSubjectTeachers(): Observable<SubjectTeacher[]> {
    return collectionData(this.subjectTeacherCollection, { idField: 'id' }) as Observable<SubjectTeacher[]>;
  }

  addSubjectTeacher(assignment: SubjectTeacher) {
    return addDoc(this.subjectTeacherCollection, assignment);
  }

  updateSubjectTeacher(assignment: SubjectTeacher) {
    const docRef = doc(this.firestore, `subject-teachers/${assignment.id}`);
    const { id, ...data } = assignment;
    return updateDoc(docRef, data);
  }

  deleteSubjectTeacher(id: string) {
    const docRef = doc(this.firestore, `subject-teachers/${id}`);
    return deleteDoc(docRef);
  }

  async getUserData(uid: string) {
    const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
    return userDoc.exists() ? userDoc.data() : null;
  }

  saveUserData(uid: string, data: any) {
    return setDoc(doc(this.firestore, `users/${uid}`), data, { merge: true });
  }
}
