import { Component } from '@angular/core';
import { Task } from '../task.interface';
import { Router } from '@angular/router';

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

  constructor(private router:Router){
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
    const temp = localStorage.getItem('tasks');
    if(temp != null){
      this.taskList = JSON.parse(temp);
      console.log("not null");
      console.log(this.taskList);
    }

 }
resetText(str:string){
  // this.addTask();
  // this.blurTimeOut = setTimeout(() => {
  //   if(str == 'todo'){
  //     this.todoText = '';
  //   }
  //   else if(str == 'progress'){
  //     this.progText = '';
  //   }
  //   if(str == 'completed'){
  //     this.compText = '';
  //   }
  // },4000);
  console.log("reset");
}

addTask(status:string){
  console.log("fubnc enter");
  // clearTimeout(this.blurTimeOut);
  let title : string ='';
  if(status === 'To-Do'){
    title = this.todoText;
    this.todoText = '';
  }
  else if(status === 'In-Progress'){
    title = this.progText;
    this.progText ='';
  }
  else if(status === 'Completed'){
    title = this.compText;
    this.compText ='';
  }
  if(title === null || title.trimStart() === ''){
    return ;
  }
  let id = localStorage.getItem('taskID');
  if(id !== null){
    this.taskID = JSON.parse(id);
  }
  this.taskList.push({id:this.taskID,title:title,description:'',status:status});
  localStorage.setItem('tasks',JSON.stringify(this.taskList));
  this.taskID++;
  localStorage.setItem('taskID',JSON.stringify(this.taskID))
  console.log(this.taskList);
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
 
}
