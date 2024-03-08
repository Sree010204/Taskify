import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task.interface';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from '../dialog.service';
import { TaskData } from '../TaskData.interface';
import { Status } from '../Status.interface';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit{

  taskList : Task[] =[];
  taskID : any = -1;
  tasksJSON :any;
  taskTitle: any = '';
  taskDesc : any = '';
  taskStatus : string = '';
  taskLog : TaskData[] =[];
  action : string = '';
  statusList : Status[] = [];

  constructor(private actRoute:ActivatedRoute,
              private toastr:ToastrService,
              private dialogService:DialogService,
              private router:Router){}

  ngOnInit(): void {
      this.tasksJSON = localStorage.getItem('tasks');
      this.taskList = JSON.parse(this.tasksJSON);
      console.log(this.taskList);
      this.actRoute.queryParams.subscribe((params : any) => {
        let t = this.taskList.find((m) => 
        
        {console.log(m.id+"  "+params.data+"  res  "+(m.id == params.data));
        return m.id == params.data});
        // console.log(params);
        this.taskID = t?.id;
        this.taskTitle = t?.title;
        this.taskDesc = t?.description;
       if(t?.status !== undefined){
        this.taskStatus = t?.status;
       }
        console.log(this.taskStatus);
      });

      // obtauin all the status from local storage 
      let statusData = localStorage.getItem('statusList');
      console.log("ouside loop");
      if(statusData != null){
        console.log("inside loop");
        this.statusList = JSON.parse(statusData);
       console.log(this.taskStatus);
      }
  }

  updateTask(){
    let editTask = this.taskList.find((t) => {return t.id == this.taskID;});
    if(editTask !== undefined){
      editTask.title = this.taskTitle
      editTask.description = this.taskDesc;
      editTask.status = this.taskStatus;
    }
    localStorage.setItem('tasks',JSON.stringify(this.taskList));
    let toastMsg  ="Task ID: " +  this.taskID;
    toastMsg += '<br> <b>' + this.taskTitle +"</b> is updated succesfully";
    this.toastr.success(toastMsg,'Success ',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true});
    this.addTaskToLogData('updated');
  //  alert(this.statusList.length+" "+localStorage.getItem('stausList')?.length);

  }

  navToDashBoard(){
    this.router.navigate(['/dashboard']);
  }

  deleteTask(){
    this.dialogService.openDialogBox().afterClosed().subscribe(response => {

     console.log(response);
      if(response == 'true'){
        
        // add task to deletedTasks
        let delTask = this.taskList.find((m)=>m.id == this.taskID);
        let delTaskList = localStorage.getItem('deletedTasks');
        if(delTaskList != null){
          let deletedTasks = JSON.parse(delTaskList);
          deletedTasks.push(delTask);
          localStorage.setItem('deletedTasks',JSON.stringify(deletedTasks));
        }
        // remove it from current task list
        this.taskList =this.taskList.filter(item => item.id !== this.taskID);
        localStorage.setItem('tasks',JSON.stringify(this.taskList));
        this.toastr.error('Task <b>' +this.taskTitle+' </b>Moved To Bin','Task '+this.taskID+' Deleted ',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true});
        this.navToDashBoard();
        this.addTaskToLogData('deleted');

      }
    });
  }

  addTaskToLogData(action:string){
     // pushing into local storage for task log feature
     let logData = localStorage.getItem('taskLog');
     if(logData != null){
     this.taskLog = JSON.parse(logData);
     console.log(typeof this.taskLog);
     this.taskLog.push({id:this.taskID,title:this.taskTitle,message:' is ' + action+" on  "+new Date(),action:action});
     localStorage.setItem('taskLog',JSON.stringify(this.taskLog));
     }
  }
  
}
