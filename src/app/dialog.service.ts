import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {


  constructor(private dialog:MatDialog) { }

  openDialogBox(){
    return this.dialog.open(DialogBoxComponent,{
      height:'fit-content'
    })
  }

  openSaveDialog(){
    return this.dialog.open(SaveDialogComponent,{
      height:'fit-content'
    })
  }

  getDateAndTime(){
    // Get current date and time
let currentDate = new Date();
// Format date and time
let formattedDate = `${currentDate.getHours()}:${currentDate.getMinutes()} (${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()})`;
return formattedDate;
  }
}
