import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task.interface';
@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit{

  taskList : Task[] =[];
  tasksJSON :any;
  taskTitle: any = '';
  taskDesc : any = '';
  taskStatus : any = '';

  constructor(private actRoute:ActivatedRoute){}

  ngOnInit(): void {
      this.tasksJSON = localStorage.getItem('tasks');
      this.taskList = JSON.parse(this.tasksJSON);
      console.log(this.taskList);
      this.actRoute.queryParams.subscribe((params : any) => {
        let t = this.taskList.find((m) => 
        
        {console.log(m.id+"  "+params.data+"  res  "+(m.id == params.data));
        return m.id == params.data});
        // console.log(params);
        this.taskTitle = t?.title;
        this.taskDesc = t?.description;
        this.taskStatus = t?.status;
      });
  }
  
}
