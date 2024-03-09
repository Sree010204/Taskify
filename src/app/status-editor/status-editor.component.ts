import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from '../Status.interface';
import { DialogService } from '../dialog.service';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../task.interface';


@Component({
  selector: 'app-status-editor',
  templateUrl: './status-editor.component.html',
  styleUrls: ['./status-editor.component.css']
})
export class StatusEditorComponent {

  statusID : any = -1;
  statusName : any ='';
  isChanged : boolean = false;
  statusDesc : any = '';
  statusList : Status[] = [];
  deletedStatus : Status[] = [];
  taskList : Task[] =[];
  deletedTasks:Task[] = [];

  constructor(private router:Router,private actRoute:ActivatedRoute,
              private dservice:DialogService,private toastr:ToastrService){}

  ngOnInit(){
    let statusData = localStorage.getItem('statusList');
    if(statusData != null){
      this.statusList = JSON.parse(statusData);
      // console.log(this.statusList);
      this.actRoute.queryParams.subscribe((params : any) => {

        let st  = this.statusList.find((s)=>{
          console.log(s.id+" "+(params.data));
          return s.id == params.data});
        this.statusID = st?.id;
        this.statusName = st?.name;
        this.statusDesc = st?.description;
        console.log("enter params");
        console.log(params.data);
      })
    }
  }

  navToDashBoard(){
    if(this.isChanged){
      this.dservice.openSaveDialog().afterClosed().subscribe(response => {
        if(response == 'true'){
          this.updateStatus();
          this.isChanged = false;
        }
        this.router.navigate(['/dashboard']);
      })
    }
    else{
      this.router.navigate(['/dashboard']);
    }
  }

  updateStatus(){
    let editStatus = this.statusList.find((s)=>s.id == this.statusID);
    if(editStatus !== undefined){
      editStatus.name = this.statusName;
      editStatus.description = this.statusDesc;
    }
    localStorage.setItem('statusList',JSON.stringify(this.statusList));
    this.isChanged = false;
    this.toastr.success('Status <b> '+this.statusName+'</b> updated sucessfully','Success',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true})

  }

  deleteStatus(){
    this.dservice.openDialogBox().afterClosed().subscribe(response => {
        if(response == 'true'){

          // add status to deletedStatus list and move to bin
          let deletedStatusData = localStorage.getItem('deletedStatus');
          if(deletedStatusData !== null){
            // console.log("del data is not nmull");
            this.deletedStatus = JSON.parse(deletedStatusData);
            console.log("indside deleted stats"+this.deleteStatus.length)
            let delStatus= this.statusList.find((s)=>{
              console.log("cpm res " +(s.id == this.statusID));
              return s.id == this.statusID;
            });
            console.log("outside deleted stats ");
            if(delStatus !== undefined){
              this.deletedStatus.push(delStatus);
            }
            localStorage.setItem('deletedStatus',JSON.stringify(this.deletedStatus));
          }

          //delete all tasks belong to that status and add those tasks to bin
          let tasksData = localStorage.getItem('tasks');
          let delTaskdata = localStorage.getItem('deletedTasks');
          if(tasksData != null){
            this.taskList = JSON.parse(tasksData);
          }
          if(delTaskdata !== null){
            this.deletedTasks = JSON.parse(delTaskdata);
            // adding to bin
            // console.log("deleted tasks");
            // console.log(this.deletedTasks);
            let tasksToDelete = this.taskList.filter((s)=>{ return s.status == this.statusName});
            console.log("tasjks to dleejk");
            console.log(this.statusName);
            console.log(tasksToDelete);
            this.deletedTasks = this.deletedTasks.concat(tasksToDelete);
            
            localStorage.setItem('deletedTasks',JSON.stringify(this.deletedTasks));
          }
          if(tasksData !== null){
            this.taskList = this.taskList.filter((s)=>{return s.status != this.statusName});
            localStorage.setItem('tasks',JSON.stringify(this.taskList));
          }
          
          // remove from existing features 
          this.statusList = this.statusList.filter((s)=>s.id != this.statusID);
          localStorage.setItem('statusList',JSON.stringify(this.statusList));
          this.toastr.warning('Status <b> '+this.statusName+' </b> moved to Bin','Status Deleted',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true})
        }
        this.router.navigate(['/dashboard']);
    });
  }
}
