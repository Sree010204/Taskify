import { Component, OnInit } from '@angular/core';
import { Task } from '../task.interface';
import { Status } from '../Status.interface';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit{
  deletedTasks : Task[] = [];
  taskList : Task[] = [];
  statusList : Status[] = [];

  constructor(private dservice:DialogService){}

  ngOnInit(): void {
      let tasksData = localStorage.getItem('deletedTasks');
      if(tasksData !== null){
        this.deletedTasks = JSON.parse(tasksData);
      }
  }

  deleteTask(task:Task){
    this.dservice.openDialogBox().afterClosed().subscribe(response => {
      if(response == 'true'){
        this.deletedTasks = this.deletedTasks.filter((t) => t.id !== task.id); 
        localStorage.setItem('deletedTasks',JSON.stringify(this.deletedTasks));
      }
    })
   
  }
  restoreTask(task:Task){
    let status = task.status;
    let tasksData = localStorage.getItem('tasks');

    // if status of task is also deleted, then add it's status to status list
    let statusData = localStorage.getItem('statusList');
    if(statusData !== null){
      this.statusList = JSON.parse(statusData);
      let statusExist = this.statusList.find((t) => {return t.name == task.status});
      if(!statusExist){
        let id = localStorage.getItem('statusID');
        if(id !== null){
            let statusID = JSON.parse(id);
            this.statusList.push({id:statusID,name:task.status,description:''});
            localStorage.setItem('statusList',JSON.stringify(this.statusList));
            statusID++;
            localStorage.setItem('statusID',JSON.stringify(statusID));
          
        }
      }
     
    }
    
    //add task back to task list
    if(tasksData !== null){
      this.taskList = JSON.parse(tasksData);
      this.taskList.push(task);
      localStorage.setItem('tasks',JSON.stringify(this.taskList));
    }

    // remove task from deltedTask list
    this.deletedTasks = this.deletedTasks.filter((t) => t.id !== task.id); 
    localStorage.setItem('deletedTasks',JSON.stringify(this.deletedTasks));
  }
}
