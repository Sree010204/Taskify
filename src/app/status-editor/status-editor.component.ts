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
  /**
   * initialize status information from local storage into respective variables 
   */
  ngOnInit(){
    // obtain status list 
    let statusData = localStorage.getItem('statusList');
    if(statusData != null){
      // store them in statusList
      this.statusList = JSON.parse(statusData);
      // obtain status information 
      this.actRoute.queryParams.subscribe((params : any) => {
        // obtains selected status from status list 
        let st  = this.statusList.find((s)=>{
          return s.id == params.data});
          // assign status details into respective variables
        this.statusID = st?.id;
        this.statusName = st?.name;
        this.statusDesc = st?.description;
      })
    }
  }

  /**
   * navigates to dashboard by saving any unsaved unchanges 
   */
  navToDashBoard(){
    // checks for for any unsaved changes 
    if(this.isChanged){
      this.dservice.openSaveDialog().afterClosed().subscribe(response => {
        // save changes if needed
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

  /**
   * updates the details of status
   */
  updateStatus(){

    // obtains status that has to be updated
    let editStatus = this.statusList.find((s)=>s.id == this.statusID);
    if(editStatus !== undefined){
      editStatus.name = this.statusName;
      editStatus.description = this.statusDesc;
    }
    // updates status list in local storage 
    localStorage.setItem('statusList',JSON.stringify(this.statusList));
    // indicates no immidiate changes are made after updating 
    this.isChanged = false;
    // display a succes toast message 
    this.toastr.success('Status <b> '+this.statusName+'</b> updated sucessfully','Success',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true})

  }

  /**
   * Delete the selected status and alll the tasks belong to that particular status
   */
  deleteStatus(){

    // confirm dialog box for deletion 
    this.dservice.openDialogBox().afterClosed().subscribe(response => {
        if(response == 'true'){

          // add status to deletedStatus list and move to bin
          let deletedStatusData = localStorage.getItem('deletedStatus');
          if(deletedStatusData !== null){
            this.deletedStatus = JSON.parse(deletedStatusData);
    
            // obtain status that has to be deleted 
            let delStatus= this.statusList.find((s)=>{
              return s.id == this.statusID;
            });
           
            // store status into deletedStatus for future use and store in local storage  
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
            // adding all the tasks of this status to bin
            let tasksToDelete = this.taskList.filter((s)=>{ return s.status == this.statusName});
            this.deletedTasks = this.deletedTasks.concat(tasksToDelete);
            
            // update the deletedTasks (that are in bin)
            localStorage.setItem('deletedTasks',JSON.stringify(this.deletedTasks));
          }

          // remove al the tasks that belong to the deleted status
          if(tasksData !== null){
            this.taskList = this.taskList.filter((s)=>{return s.status != this.statusName});
            localStorage.setItem('tasks',JSON.stringify(this.taskList));
          }
          
          // remove from existing status 
          this.statusList = this.statusList.filter((s)=>s.id != this.statusID);
          localStorage.setItem('statusList',JSON.stringify(this.statusList));

          // display a confirmation toast message  
          this.toastr.warning('Status <b> '+this.statusName+' </b> moved to Bin','Status Deleted',{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true})
        }
        this.router.navigate(['/dashboard']);
    });
  }
}
