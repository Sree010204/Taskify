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
  name = 'Taskify';
  taskID : number = 7;
  currItem! :Task;
  taskList : Task[] = [];
  tasksJSON :any;
  storedTasks : any;
  isTodoActive:boolean = false;
  isProgActive:boolean = false;
  isCompActive:boolean = false;
  progText : string = '';
  todoText:string ='';
  compText : string ='';
  blurTimeOut:any;
  taskLogData: TaskData[] =[];
  statusList : Status[] = [];
  taskNameMap = new Map();

  constructor(private router:Router,private dservice:DialogService){
    this.taskList = [
      { id : 1,title: "Guide Me", description: "Project A", status: "To-Do" },
      { id : 2,title: "To Do Task", description: "Project A", status: "To-Do" },
      { id : 3,title: "Guide Me", description: "Project B", status: "In-Progress" },
      { id : 4,title: "In Progress Task", description: "Project X", status: "In-Progress" },
      { id : 5,title: "Guide Me", description: "Project Y", status: "Completed" },
      { id : 6,title: "Completed Task", description: "Project Z", status: "Completed" },
      
    ]
    console.log("in cins");
    this.storedTasks = this.taskList;
    console.log("res cons");
    console.log(localStorage.getItem('tasks') === null);
  }

  ngOnInit(): void {

    if(localStorage.getItem('taskID') === null){
      localStorage.setItem('taskID',JSON.stringify(this.taskID));
    }
    let id = localStorage.getItem('taskID');
    if(id !== null){
      this.taskID = JSON.parse(id);
    }
    console.log(" result heer  ");
    console.log(localStorage.getItem('tasks') === null);
    if(localStorage.getItem('tasks') === null){
      console.log("entry pooint");
       const tasksJSON = JSON.stringify(this.taskList);
       localStorage.setItem('tasks',tasksJSON);

    }

    // get taskList from local storage
    const temp = localStorage.getItem('tasks');
    if(temp != null){
      this.taskList = JSON.parse(temp);
      console.log("not null");
      console.log(this.taskList);
    }

    let statusData = localStorage.getItem('statusList');
    if(statusData !== null){
      this.statusList = JSON.parse(statusData);
      console.log("stsua  ");
      console.log(typeof this.statusList);
      this.statusList.forEach(status => {
        this.taskNameMap.set(status.id,"");
        console.log(status.id+"  "+this.taskNameMap.get(status.id));
      })
    }

 }
resetTask(statusID:number,inputTask:string){
  this.taskNameMap.set(statusID,'');
}

addTask(statusID:number,inputTask :string){
  console.log("fubnc enter");
  // clearTimeout(this.blurTimeOut);
  // let taskTitle : any ='';
  let taskTitle = this.taskNameMap.get(statusID);
  let status = this.statusList.find((m) => {return m.id == statusID;})?.name;
  // if(status === 'To-Do'){
  //   title = this.todoText;
  //   this.todoText = '';
  // }
  // else if(status === 'In-Progress'){
  //   title = this.progText;
  //   this.progText ='';
  // }
  // else if(status === 'Completed'){
  //   title = this.compText;
  //   this.compText ='';
  // }
  if(taskTitle === undefined || taskTitle.trimStart() === '' || status == undefined){
    return ;
  }
  // task id stored in local storage for incrementing it 
  let id = localStorage.getItem('taskID');
  if(id !== null){
    this.taskID = JSON.parse(id);
  }
  this.taskList.push({id:this.taskID,title:taskTitle,description:'',status:status});
  localStorage.setItem('tasks',JSON.stringify(this.taskList));

  console.log(this.taskList);
  let logData = localStorage.getItem('taskLog');
  if(logData){
    this.taskLogData = JSON.parse(logData);
    this.taskLogData.push({id:this.taskID,title:taskTitle,status:status,message:' is added on '+this.dservice.getDateAndTime(),action:'added'});
    localStorage.setItem('taskLog',JSON.stringify(this.taskLogData));
  }
  this.taskID++;
  localStorage.setItem('taskID',JSON.stringify(this.taskID));
  this.taskNameMap.set(statusID,'');
}
 filterList(status:string){
  // console.log(status);
  // console.log(this.storedTasks.filter((m: { status: string; }) => m.status === status));
   return this.taskList.filter((m: { status: string; }) => m.status === status);
 }

 onDragStart(task : Task){
   // console.log("start");
   this.currItem = task;
 }

 onDrop(event:any,status:string){
   event.preventDefault();
   const storedJSONtasks = localStorage.getItem('tasks');
  //  console.log("tasks ");
   // console.log(storedTasks);
   const draggedTask = this.taskList.find((m: { id: number; })=>(m.id === this.currItem.id));
  //  console.log("dg "+draggedTask?.title);
   // console.log("drag task   " +draggedTask);
   if(draggedTask != undefined){
     draggedTask.status = status;
     // console.log("status  "+draggedTask.status);
    //  console.log(this.storedTasks);
     localStorage.setItem('tasks',JSON.stringify(this.taskList));
    //  console.log(this.taskList);
   }
   // console.log("pause");

 }
 onDragOver(event:any){
   // console.log("end");
   event.preventDefault();
 }


 navigate(task: Task){
  this.router.navigate(['/taskeditor'],{queryParams : {data:task.id}});
  console.log("hrllo");
 }

getClass(id:number){
  switch(id){
    case 0 : return 'todo';
    case 1 : return 'progress';
    case 2 : return 'completed';
    default : return 'custom';
  }
}

editStatus(status:Status){
  console.log("in dash");
  console.log(status.id);
  console.log("fin  das");
  this.router.navigate(['/status-editor'],{queryParams:{data:status.id}});
}


 
}
