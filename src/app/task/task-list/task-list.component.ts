import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TaskFormComponent} from '../task-form/task-form.component';
import {TaskService} from '../services/task.service';
import {TaskViewModel} from '../models/task-view-model';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(private modalService: NgbModal,
              private taskService: TaskService) { }

  tasks: TaskViewModel[] = [];

  ngOnInit() {
    this.loadTasks();
  }
  loadTasks() {
    this.taskService.getTasks().subscribe(response => {
      this.tasks = [];
      setTimeout(() => {
        response.docs.forEach(value => {
          const data = value.data();
          const id = value.id;
          const task: TaskViewModel = {
            id: id,
            title: data.title,
            description: data.description,
            done: data.done,
            // createdDate: data.createdDate,
            lastModifiedDate: data.lastModifiedDate.toDate()
          };
          this.tasks.push(task);
        });
      }, 1000);
    });
  }

  clickAddTask() {
    const modal = this.modalService.open(TaskFormComponent);
    modal.result.then(
      this.handleModalTaskFormClose.bind(this)
    );

  }

  checkedDone(index: number) {
    const newDoneValue = !this.tasks[index].done;
    this.tasks[index].done = newDoneValue;
    const obj = { done: newDoneValue };
    const id = this.tasks[index].id;
    this.taskService.editTaskPartial(id, obj);
  }

  handleModalTaskFormClose(response) {
    if (response === Object(response)) {
      if (response.createMode) {
        response.task.id = response.id;
        this.tasks.unshift(response.task);
      } else {
        const index = this.tasks.findIndex(value => value.id === response.id);
        this.tasks[index] = response.task;
      }
    }
  }

  handleEditClick(task: TaskViewModel) {
    const modal = this.modalService.open(TaskFormComponent);
    modal.result.then(
      this.handleModalTaskFormClose.bind(this),
      this.handleModalTaskFormClose.bind(this)
    );
    modal.componentInstance.createMode = false;
    modal.componentInstance.task = task;
  }


  handleDeleteClick(taskId: string, index: number) {
    this.taskService.deleteTask(taskId).then(() => {
        this.tasks.splice(index, 1);
    });
  }

}
