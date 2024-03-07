import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task.interface';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from '../dialog.service';


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
  taskStatus : any = '';

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
        this.taskStatus = t?.status;
        console.log(this.taskStatus);
      });
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
    this.toastr.success(toastMsg,'Success ',{timeOut:2000,easeTime:500,positionClass:'toast-top-right',enableHtml:true});
  }

  confirmDelete(){
    
  }

  deleteTask(){
    this.dialogService.openDialogBox().afterClosed().subscribe(response => {
      console.log(response);
      if(response){
        this.taskList =this.taskList.filter(item => item.id !== this.taskID);
        localStorage.setItem('tasks',JSON.stringify(this.taskList));
        this.router.navigate(['/dashboard']);
      }
      return false;
    });
  }
  
}
