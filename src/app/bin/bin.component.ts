import { Component, OnInit } from '@angular/core';
import { Task } from '../task.interface';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit{
  deletedTasks : Task[] = [];

  constructor(){}

  ngOnInit(): void {
      let tasksData = localStorage.getItem('deletedTasks');
      if(tasksData !== null){
        this.deletedTasks = JSON.parse(tasksData);
      }
  }
}
