import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-task-log',
  templateUrl: './task-log.component.html',
  styleUrls: ['./task-log.component.css']
})
export class TaskLogComponent implements OnInit {

  taskLog : any;
  constructor(private router:Router){}
  /**
   * get all the log data from the local storage and initialize into taskLog
   */
  ngOnInit(): void {
    let logData = localStorage.getItem('taskLog');
    if(logData !== null){ 
      this.taskLog = JSON.parse(logData);
      console.log("log ");
      console.log(this.taskLog);
    }
  }

  /**
   * return specified class for bg color based upon the user action for that task
   * @param action : denotes user action for that task
   * @returns class that has to be applied ins string format
   */
  getAction(action:string){
    switch(action){
      case 'updated' : return 'updated';
      case 'deleted' : return 'deleted';
      case 'added' : return 'added';
      case 'permDeleted' : return 'permDel'
      default :return 'default';
    }
  }

  
}
