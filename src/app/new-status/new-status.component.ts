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
  isChanged : boolean = false;

  constructor(private router:Router,private dservice:DialogService,private toastr:ToastrService){}

  ngOnInit(): void {
      let id = localStorage.getItem('statusID');
      if(id !== null){
        this.statusID = JSON.parse(id);
      }

   
      let statusData = localStorage.getItem('statusList');
      if(statusData !== null){
        this.statusList = JSON.parse(statusData);
      }
      console.log(this.statusList);
  }

  submit() {
    this.checkAvailability();
    if(!this.isAvailable){
      this.isAvailable = false;
      return ;
    }
    this.statusList.push({id:this.statusID,name:this.statusName,description:this.description});
    this.statusID++;
    localStorage.setItem('statusList',JSON.stringify(this.statusList));
    localStorage.setItem('statusID',JSON.stringify(this.statusID));
    // display toast message for confirmation
    this.toastr.success("<b>"+this.statusName+"</b> "+ "status added successfully","Success",{timeOut:3000,easeTime:500,positionClass:'toast-top-right',enableHtml:true})
    this.statusName = '';
    this.description = '';
    this.isAvailable = false;
    this.isChanged = false;
  }

  reset() {
    this.statusName =''
    this.description ='';
    this.isAvailable = false;
  }

  checkAvailability(){
    this.statusName = this.statusName.trimStart();
    let res :any = false;
    if(this.statusName !== ''){
      res = this.statusList.find((m)=>{return m.name === this.statusName});
    }
    // console.log("res ");
    // res = 'To-Do' == this.statusName;
    console.log(res);
    console.log('To-Do' == this.statusName);
    this.isAvailable = res === undefined ? true : false;
    console.log("check done");
  }

  navToDashBoard(){
    if(this.isChanged && this.statusName !== ''){
      this.dservice.openSaveDialog().afterClosed().subscribe(response => {
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
