import { Component, OnInit } from '@angular/core';
import { Task } from './task.interface';
import { TmplAstDeferredBlockLoading, identifierName } from '@angular/compiler';
import { Router } from '@angular/router';

import { Status } from './Status.interface';
import { TaskData } from './TaskData.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
title:string = 'Taskify';
taskLog :TaskData[] = [];
deletedTasks : Task[] = [];
stausList : Status[] = [];
deletedStatus : Status[] = [];
  constructor(){}
    
  ngOnInit(): void {
    if(localStorage.getItem('taskLog') === null){
      localStorage.setItem('taskLog',JSON.stringify(this.taskLog));
    }
    if(localStorage.getItem('deletedTasks') === null){
      localStorage.setItem('deletedTasks',JSON.stringify(this.deletedTasks));
    }
    if(localStorage.getItem('statusList') === null){
      this.stausList.push({id:0,name:'To-Do',description:''});
      this.stausList.push({id:1,name:'In-Progress',description:''});
      this.stausList.push({id:2,name:'Completed',description:''});
      localStorage.setItem('statusList',JSON.stringify(this.stausList));
      localStorage.setItem('statusID',JSON.stringify('3'));
    }

    if(localStorage.getItem('deletedStatus') === null){
      localStorage.setItem('deletedStatus',JSON.stringify(this.deletedStatus));
    }

  }
  
 
  

}
