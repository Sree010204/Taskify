import { Component, OnInit } from '@angular/core';
import { Task } from '../task.interface';
import { Status } from '../Status.interface';
import { DialogService } from '../dialog.service';
import { TaskData } from '../TaskData.interface';


@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit{
  deletedTasks : Task[] = []; // contains all tasks that are in bin
  taskList : Task[] = []; // contains all tasks present in local storage 
  statusList : Status[] = []; // contains  all available status
  tasksLog : TaskData[] = []; // contains log data of user actions on tasks

  constructor(private dservice:DialogService){}

  /**
   * ngOnInt() obtains all the deleted tasks that are in bin from local storage 
   * at the time of intitialization of component
   */
  ngOnInit(): void {
    // retrive deleted tasks that are in bin from local storage
      let tasksData = localStorage.getItem('deletedTasks');

      if(tasksData !== null){
        //parse them into deletedTasks
        this.deletedTasks = JSON.parse(tasksData);
      }
  }

  /**
   *  deletes the task permanently from the bin and 
   * updates the tasks log data 
   * @param task : task that has to be permanently deleted
   */
  deleteTask(task:Task){
    // update tasklog with permanent deletion transaction
    this.updateTaskLog(task,'permDeleted','is PERMANENTLY deleted on ');

    // confirm dialog box for deleting the task permanently 
    this.dservice.openDialogBox().afterClosed().subscribe(response => {
      if(response == 'true'){
        // filter all items except selected task into deleted tasks
        this.deletedTasks = this.deletedTasks.filter((t) => t.id !== task.id); 

        // store the items back into local stoarage 
        localStorage.setItem('deletedTasks',JSON.stringify(this.deletedTasks));
      }
    })
   
  }
 /**
  * restores the task into tasks with it's respective status at the time of deletion
  * if status is not present,it restores status as well
  * and updates the task logs as well 
  * @param task : task that to be restored 
  */
  restoreTask(task:Task){

    // update task logs with restore action of the task 
    this.updateTaskLog(task,'restored','is restored on ');

    let status = task.status;
    // obtains all avaailable tasks from local storage
    let tasksData = localStorage.getItem('tasks');

    // if status of task is also deleted, then add it's status to status list
    let statusData = localStorage.getItem('statusList');
    if(statusData !== null){
      this.statusList = JSON.parse(statusData);

      // check if status of restored task is available in local storage or not 
      let statusExist = this.statusList.find((t) => {return t.name == task.status});

      // if not exist,add that status into status list in the local storage
      if(!statusExist){
        let id = localStorage.getItem('statusID');
        if(id !== null){
            let statusID = JSON.parse(id);

            // restore the status into status list with inceremented and unique ID
            this.statusList.push({id:statusID,name:task.status,description:''});
            localStorage.setItem('statusList',JSON.stringify(this.statusList));
            statusID++;

            // store statusID in local storage 
            localStorage.setItem('statusID',JSON.stringify(statusID));
        }
      }
     
    }
    
    //add task back to task list and store in local storage 
    if(tasksData !== null){
      this.taskList = JSON.parse(tasksData);
      this.taskList.push(task);
      localStorage.setItem('tasks',JSON.stringify(this.taskList));
    }

    // remove task from deltedTask list (bin) and upadte deleted tasks (bin)
    this.deletedTasks = this.deletedTasks.filter((t) => t.id !== task.id); 
    localStorage.setItem('deletedTasks',JSON.stringify(this.deletedTasks));
  }

  /**
   * updates the task log data 
   * @param task : the task for which task log data has to be updated
   * @param action : specifies user action like restored or deleted
   * @param message :specifies message that has to displayed in log data
   */
  updateTaskLog(task:Task,action:string,message:string){

   // obtain task logs data and apppend the transaction for specified task with obtained action and message 
    let logData = localStorage.getItem('taskLog');
   
    if(logData != null){
   
      this.tasksLog = JSON.parse(logData);
      // this.tasksLog.push({id:task.id,})
      this.tasksLog.push({id:task.id,title:task.title,status:task.status,message:message +" "+this.dservice.getDateAndTime()+" ",action:action});
      localStorage.setItem('taskLog',JSON.stringify(this.tasksLog));
    }
  }
}
