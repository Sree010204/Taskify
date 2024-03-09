import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskLogComponent } from './task-log/task-log.component';
import { BinComponent } from './bin/bin.component';
import { NewStatusComponent } from './new-status/new-status.component';
import { StatusEditorComponent } from './status-editor/status-editor.component';


const routes: Routes = [
  {path:'',component:DashboardComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'taskeditor',component:TaskEditorComponent},
  {path:'tasklog',component:TaskLogComponent},
  {path:'bin',component:BinComponent},
  {path:'new-status',component:NewStatusComponent},
  {path:'status-editor',component:StatusEditorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
