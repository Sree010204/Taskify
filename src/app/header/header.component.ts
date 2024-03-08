import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isExpanded : boolean = false;
  isProfileExpanded : boolean = false;


  toggleMenu(){
    this.isExpanded = !this.isExpanded;
  }

  toggleProfile(){
    this.isProfileExpanded = !this.isProfileExpanded
  }
}
