import { Component, OnInit } from '@angular/core';
import { Status } from '../Status.interface';
import { ContentObserver } from '@angular/cdk/observers';
import { Router } from '@angular/router';
import { DialogService } from '../dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-status',
  templateUrl: './new-status.component.html',
  styleUrls: ['./new-status.component.css']
})
export class NewStatusComponent implements OnInit{

  statusName : string = '';
  description : string = '';
  statusID : number = -1;
  isAvailable : boolean = false;
  statusList : Status[] = [];
  isChanged : boolean = false; // to detect any changes in selected status

  constructor(private router:Router,private dservice:DialogService,private toastr:ToastrService){}

  /**
   * obtains status list from local stoarge and stores in statusList 
   */
  ngOnInit(): void {
    //obtain status id that has to be allocated to new status  
    let id = localStorage.getItem('statusID');
      if(id !== null){
        this.statusID = JSON.parse(id);
      }
      // store statusList from llocal storage intp statusList
      let statusData = localStorage.getItem('statusList');
      if(statusData !== null){
        this.statusList = JSON.parse(statusData);
      }
  }

  /**
   * add a new status if user requested status is available 
   * @returns nohing
   */
  submit() {
    // if not available ,return 
    this.checkAvailability();
    if(!this.isAvailable){
      this.isAvailable = false;
      return ;
    }
    // if available store them in the statusList and save to local storage and update status ID 
    this.statusList.push({id:this.statusID,name:this.statusName,description:this.description});
    this.statusID++;
    localStorage.setItem('statusList',JSON.stringify(this.statusList));
    localStorage.setItem('statusID',JSON.stringify(this.statusID));
    // display toast message for confirmation
    this.toastr.success("<b>"+this.statusName+"</b> "+ "status added successfully","Success",{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true})
    // reset the input variables 
    this.statusName = '';
    this.description = '';
    this.isAvailable = false;
    this.isChanged = false;
  }
  /**
   * resets the input fields 
   */
  reset() {
    this.statusName =''
    this.description ='';
    this.isAvailable = false;
  }

  /**
   * checks if input status name is available or not 
   */
  checkAvailability(){
    this.statusName = this.statusName.trimStart();
    this.statusName = this.statusName.trimEnd();
    let res :any = false;

    /// sets isAvailable to true if input string is not in status list else set it to false 
    if(this.statusName !== ''){
      res = this.statusList.find((m)=>{return m.name === this.statusName});
    }
    this.isAvailable = res === undefined ? true : false;
  }

  /**
   * save any unsaved changes and navugates to dashboard
   */
  navToDashBoard(){
    if(this.isChanged && this.statusName !== ''){
      this.dservice.openSaveDialog().afterClosed().subscribe(response => {
           // if changes has to be saved, save them 
        if(response == 'true'){
          this.submit();
        }
        this.router.navigate(['/dashboard']);
      })
    }
    else{
      this.router.navigate(['/dashboard']);
    }
  }
}
