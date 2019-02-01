import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {Task} from '../models/task';
import {TaskViewModel} from '../models/task-view-model';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore) { }

  private taskCollectionName = 'tasks';

  getTasks(): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection<Task>(this.taskCollectionName, ref => ref.orderBy('lastModifiedDate', 'desc')).get();
  }
  saveTask(task: Task): Promise<DocumentReference> {
    return this.db.collection(this.taskCollectionName).add(task);
  }
  editTask(task: TaskViewModel): Promise<void> {
    return this.db.collection(this.taskCollectionName).doc(task.id).update(task);
  }
  editTaskPartial(id: string, obj: Object): Promise<void> {
    return this.db.collection(this.taskCollectionName).doc(id).update(obj);
  }
  deleteTask(idTask: string): Promise<void> {
    return this.db.collection(this.taskCollectionName).doc(idTask).delete();
  }
}
