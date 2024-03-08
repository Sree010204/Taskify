import { Component } from '@angular/core';

@Component({
  selector: 'app-new-status',
  templateUrl: './new-status.component.html',
  styleUrls: ['./new-status.component.css']
})
export class NewStatusComponent {

  statusName : string = '';
  description : string = '';
  constructor(){}
  submit() {}

  reset() {}
}
