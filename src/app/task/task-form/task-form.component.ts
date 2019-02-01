import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task';
import {TaskViewModel} from '../models/task-view-model';
import {DocumentReference} from '@angular/fire/firestore';
import {log} from 'util';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  taskForm: FormGroup;
  createMode = true;
  task: TaskViewModel;
  constructor(private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private taskService: TaskService) { }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      done: false
    });

    if (!this.createMode) {
      this.loadTask(this.task);
    }
  }

  loadTask(task) {
    this.taskForm.patchValue(task);
  }

  saveTask() {
    if (this.taskForm.invalid) {
      return;
    }

    if (this.createMode) {
      const task: Task = this.taskForm.value;
      task.lastModifiedDate = new Date();
      task.createdDate = new Date();
      this.taskService.saveTask(task).then(response => this.handleSuccessfulSaveTask(response, task))
        .catch(err => console.error(err));
    } else {
      const task: TaskViewModel = this.taskForm.value;
      task.id = this.task.id;
      task.lastModifiedDate = new Date();
      this.taskService.editTask(task)
        .then(() => this.handleSuccessfulEditTask(task))
        .catch(err => console.error(err));
    }

  }
  handleSuccessfulSaveTask(response: DocumentReference, task: Task) {
    this.activeModal.dismiss({ task: task, id: response.id, createMode: true });
  }

  handleSuccessfulEditTask(task: TaskViewModel) {
    this.activeModal.dismiss({ task: task, id: task.id, createMode: false });
  }

}
