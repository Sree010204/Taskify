import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import {MatIconModule } from '@angular/material/icon';
import {MatButtonModule } from '@angular/material/button';
import {MatInputModule } from '@angular/material/input';
import {MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './header/header.component';
import { TaskLogComponent } from './task-log/task-log.component';
import { BinComponent } from './bin/bin.component';
import { NewStatusComponent } from './new-status/new-status.component';
import { SaveDialogComponent } from './save-dialog/save-dialog.component'
import { MatMenuModule } from '@angular/material/menu';
import { StatusEditorComponent } from './status-editor/status-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskEditorComponent,
    DashboardComponent,
    DialogBoxComponent,
    HeaderComponent,
    TaskLogComponent,
    BinComponent,
    NewStatusComponent,
    SaveDialogComponent,
    StatusEditorComponent
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    ConfirmationPopoverModule.forRoot(),
    BrowserAnimationsModule,
    CommonModule,
  ],
  providers: [{provide:LocationStrategy,useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
