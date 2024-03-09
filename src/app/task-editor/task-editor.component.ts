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
  action : string = ''; // to store action performed by user if updated or deleted 
  statusList : Status[] = [];
  userMaessage : string =  'Save Your Edits Now?'; // prompt for user if leaving without saving the work
  isChanged : boolean = false; // to detect changes through focus attribute

  constructor(private actRoute:ActivatedRoute,
              private toastr:ToastrService,
              private dialogService:DialogService,
              private router:Router){ }

  /**
   * intitalises tha task list to taskList and 
   * set properties of loaded task into it's corresponding variables 
   */
    ngOnInit(): void {

      // set taskList from local storage 
      this.tasksJSON = localStorage.getItem('tasks');
      this.taskList = JSON.parse(this.tasksJSON);
  
     // obtain id of task and set's all its properties to corresponding variables
      this.actRoute.queryParams.subscribe((params : any) => {
        let t = this.taskList.find((m) => {
        
        return m.id == params.data});
      
        this.taskID = t?.id;
        this.taskTitle = t?.title;
        this.taskDesc = t?.description;
       if(t?.status !== undefined){
        this.taskStatus = t?.status;
       }
      });

      // obtauin all the status from local storage 
      let statusData = localStorage.getItem('statusList');
      if(statusData != null){
        this.statusList = JSON.parse(statusData);
      }
  }

  /**
   * updates the task and task logs as well
   */
  updateTask(){

    // find task that has to be updated and set's the updated properties to it
    let editTask = this.taskList.find((t) => {return t.id == this.taskID;});
    if(editTask !== undefined){
      editTask.title = this.taskTitle
      editTask.description = this.taskDesc;
      editTask.status = this.taskStatus;
    }

    // store the list with updated task in taskList 
    localStorage.setItem('tasks',JSON.stringify(this.taskList));

    // success toast message to display to the user
    let toastMsg  ="Task ID: " +  this.taskID;
    toastMsg += '<br> <b>' + this.taskTitle +"</b> is updated succesfully";
    this.toastr.success(toastMsg,'Success ',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true});
    this.addTaskToLogData('updated');

    // updates isChanges so that task is not changed immidiatelty after update
    this.isChanged = false;
  }


  deleteTask(){

    // confirm dialog box for confirmation
    this.dialogService.openDialogBox().afterClosed().subscribe(response => {
      if(response == 'true'){
        
        // add task to deletedTasks
        let delTask = this.taskList.find((m)=>m.id == this.taskID);
        let delTaskList = localStorage.getItem('deletedTasks');
        if(delTaskList != null){
          let deletedTasks = JSON.parse(delTaskList);
          deletedTasks.push(delTask);
          
          // store the deletedTasks in the local storage
          localStorage.setItem('deletedTasks',JSON.stringify(deletedTasks));
        }
        // remove it from current task list
        this.taskList =this.taskList.filter(item => item.id !== this.taskID);
        localStorage.setItem('tasks',JSON.stringify(this.taskList));
        this.toastr.error('Task <b>' +this.taskTitle+' </b>Moved To Bin','Task '+this.taskID+' Deleted ',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true});
        this.router.navigate(['/dashboard']);
        this.addTaskToLogData('deleted');

      }
    });
  }

  addTaskToLogData(action:string){
     // pushing into local storage for task log feature
     let logData = localStorage.getItem('taskLog');
     if(logData != null){
     this.taskLog = JSON.parse(logData);

     this.taskLog.push({id:this.taskID,title:this.taskTitle,status:this.taskStatus,message:' is ' + action+" on  "+this.dialogService.getDateAndTime(),action:action});
     localStorage.setItem('taskLog',JSON.stringify(this.taskLog));
     }
  }
  /**
   * Navigate to add new status component 
   */
  navToNewFeature(){
    //if any changes were made,ask if user wants to save it or not
    if(this.isChanged){
      this.dialogService.openSaveDialog().afterClosed().subscribe(response => {
        // if yes save it
        if(response == 'true'){
          this.updateTask();
        }
        this.router.navigate(['/new-status']);
      });
    }
    else{
      this.router.navigate(['/new-status']);
    }    
  }
  /**
   * Navigate to dashboard component
   */
  navToDashBoard(){
    //if any changes were made,ask if user wants to save it or not
   if(this.isChanged){
    this.dialogService.openSaveDialog().afterClosed().subscribe(response => {
      // if yes save it
      if(response == 'true'){
        this.updateTask();
      }
      this.router.navigate(['/dashboard']);
      
    });
  }
  else{
    this.router.navigate(['/dashboard']);
  }
   }
  
}
