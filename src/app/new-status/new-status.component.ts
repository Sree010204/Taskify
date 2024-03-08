import { Component, OnInit } from '@angular/core';
import { Status } from '../Status.interface';

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

  constructor(){}

  ngOnInit(): void {
      let id = localStorage.getItem('statusID');
      if(id !== null){
        this.statusID = JSON.parse(id);
      }

   
      let statusData = localStorage.getItem('statusList');
      if(statusData !== null){
        this.statusList = JSON.parse(statusData);
      }
  }

  submit() {
    this.statusList.push({id:this.statusID,name:this.statusName,description:this.description});
    this.statusID++;
    localStorage.setItem('statusList',JSON.stringify(this.statusList));
  }

  reset() {
    this.statusName =''
    this.description ='';
  }

  checkAvailability(){
    this.statusName = this.statusName.trimStart();
    let res :any = false;
    if(this.statusName !== ''){
      res = this.statusList.find((m)=>{m.name == this.statusName});
    }
    this.isAvailable = res == undefined ? true : false;
    console.log("check done");
  }
}
