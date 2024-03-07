import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

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
}
