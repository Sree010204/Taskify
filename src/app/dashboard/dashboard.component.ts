import { Component } from '@angular/core';
import { Task } from '../task.interface';
import { Router } from '@angular/router';
import { TaskData } from '../TaskData.interface';
import { Status } from '../Status.interface';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '../dialog.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  name = 'Taskify'; // title to display as application name
  taskID : number = 7; // unique ID for each task that will be added to tasks list
  currItem! :Task; // holds current dragged task for drag and drop feature
  taskList : Task[] = []; // holds all the tasks added and available in the array
  tasksJSON :any; // to store tasks data from local storage
  storedTasks : any; // to store tasksJSON in the task array format
  taskLogData: TaskData[] =[]; // holds tasks log from local storage
  statusList : Status[] = []; // holds all the available status

  // status ID -> input task to be added
  // holds id of tasks with it's respective input string to be added 
  taskNameMap = new Map(); 

  /**
   * intitialize tasks with sample data on component initialization for faster user interaction 
   */
  constructor(private router:Router,private dservice:DialogService){
    this.taskList = [
      { id : 1,title: "Guide Me", description: "Project A", status: "To-Do" },
      { id : 2,title: "To Do Task", description: "Project A", status: "To-Do" },
      { id : 3,title: "Guide Me", description: "Project B", status: "In-Progress" },
      { id : 4,title: "In Progress Task", description: "Project X", status: "In-Progress" },
      { id : 5,title: "Guide Me", description: "Project Y", status: "Completed" },
      { id : 6,title: "Completed Task", description: "Project Z", status: "Completed" },
      
    ]
    // make storedTasks to obtain all the available tasks from taskList
    this.storedTasks = this.taskList;
  }
  /**
   * intialize taskID (unique id for every task),task List if not present iun local storage.
   * if present, obtain it from local storage 
   */
  ngOnInit(): void {
    
    // set taskId if it not present
    if(localStorage.getItem('taskID') === null){
      localStorage.setItem('taskID',JSON.stringify(this.taskID));
    }
    let id = localStorage.getItem('taskID');
    if(id !== null){
       // set id from local storage to assign it to a task
      this.taskID = JSON.parse(id);
    }

    // if no tasks array is found in local storage,intialize in the local stoarge
    if(localStorage.getItem('tasks') === null){
       const tasksJSON = JSON.stringify(this.taskList);
       localStorage.setItem('tasks',tasksJSON);

    }

    // get taskList from local storage
    const temp = localStorage.getItem('tasks');
    if(temp != null){
      this.taskList = JSON.parse(temp);
    }

    // obtains all the available status from statsuList array from the local storage 
    let statusData = localStorage.getItem('statusList');
    if(statusData !== null){
      this.statusList = JSON.parse(statusData);
      this.statusList.forEach(status => {

        // set the id and corresponding input string as empty string to store user input with it;s resppective id 
        this.taskNameMap.set(status.id,"");
      })
    }
 }

 /**
  * resets the 'Add Task' input field 
  * @param statusID : id of the status for which task has to be reset
  * @param inputTask : string has to be reset
  */
resetTask(statusID:number,inputTask:string){
  this.taskNameMap.set(statusID,'');
}

/**
 * Add the task to task list with selected status
 * @param statusID : id of status for which task has to be added
 * @param inputTask :name of task to be added
 * @returns :nothing 
 */
addTask(statusID:number,inputTask :string){

  // obtain the input task name from taskName map
  let taskTitle = this.taskNameMap.get(statusID);
  //obtain the status of task 
  let status = this.statusList.find((m) => {return m.id == statusID;})?.name;

  if(taskTitle === undefined || taskTitle.trimStart() === '' || status == undefined){
    return ;
  }
  // task id stored in local storage for incrementing it 
  let id = localStorage.getItem('taskID');
  if(id !== null){
    this.taskID = JSON.parse(id);
  }
  // add the task into taskList and update local storage 
  this.taskList.push({id:this.taskID,title:taskTitle,description:'',status:status});
  localStorage.setItem('tasks',JSON.stringify(this.taskList));

 //update log data 
  let logData = localStorage.getItem('taskLog');
  if(logData){
    this.taskLogData = JSON.parse(logData);
    this.taskLogData.push({id:this.taskID,title:taskTitle,status:status,message:' is added on '+this.dservice.getDateAndTime(),action:'added'});
    localStorage.setItem('taskLog',JSON.stringify(this.taskLogData));
  }
  /// incerement task ID for next task to be added and update in local storage 
  this.taskID++;
  localStorage.setItem('taskID',JSON.stringify(this.taskID));
  this.taskNameMap.set(statusID,'');
}

/**
 * return all tasks from taskList with reuqested status
 * @param status : status for which tasks has to be selcted 
 * @returns : list of tasks that matches the status
 */
 filterList(status:string){
   return this.taskList.filter((m: { status: string; }) => m.status === status);
 }

 onDragStart(task : Task){
   this.currItem = task;
 }

 /**
  * Update the status of task to dropover status
  * @param event :event asscoated with drop event
  * @param status : new staus for which task has to be added
  */
 onDrop(event:any,status:string){
   event.preventDefault();
   // obtain taskList from local stoorage 
   const storedJSONtasks = localStorage.getItem('tasks');
   const draggedTask = this.taskList.find((m: { id: number; })=>(m.id === this.currItem.id));
   if(draggedTask != undefined){
    //change the status of selected task to dropover task 
     draggedTask.status = status;
     localStorage.setItem('tasks',JSON.stringify(this.taskList));
   }

 }
 /*
  * @param event : event object associated with dragover event 
  */
 onDragOver(event:any){
   event.preventDefault();
 }

/**
 * opens task editor for selected task 
 * @param task : task that has to be edited
 */
 navigate(task: Task){
  this.router.navigate(['/taskeditor'],{queryParams : {data:task.id}});
  console.log("hrllo");
 }

 /**
  * returns class according to the status type
  * @param id : id of the status for which css has to applied
  * @returns : class that has be applied 
  */
getClass(id:number){
  switch(id){
    case 0 : return 'todo';
    case 1 : return 'progress';
    case 2 : return 'completed';
    default : return 'custom';
  }
}

/**
 * open status-editor to edit status
 */
editStatus(status:Status){
  this.router.navigate(['/status-editor'],{queryParams:{data:status.id}});
}


 
}
