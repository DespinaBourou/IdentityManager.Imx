import { NgModule } from '@angular/core';
import { Ex2PluginComponent } from './ex2-plugin.component';
import { Ex2PluginService } from './ex2-plugin.service';
import { MenuItem, MenuService, RouteGuardService, TileModule } from 'qbm';
import { EmployeesReportingToMeComponent } from './employees-reporting-to-me/employees-reporting-to-me.component';
import{RouterModule, Routes} from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiresponseGuardGuard } from './apiresponse-guard.guard';
import { EmployeesSidesheetComponent } from './employees-sidesheet/employees-sidesheet.component';
//import { MatDatepickerModule } from '@angular/material/datepicker';
// import {MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { EuiCoreModule } from '@elemental-ui/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  {path:'employees-reporting-to-me',
    component: EmployeesReportingToMeComponent,
    canActivate: [RouteGuardService, ApiresponseGuardGuard],
    resolve: [RouteGuardService]

  }
];

// export const EUI_DATE_FORMATS = {
//   parse: {
//     dateInput: ['LL', 'L'],
//   },
//   display: {
//     dateInput: 'LL',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

// export const EuiDateProviders = [
//   {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
//   {provide: MAT_DATE_FORMATS, useValue: EUI_DATE_FORMATS}
// ]; 

@NgModule({
  declarations: [
    Ex2PluginComponent,
    EmployeesReportingToMeComponent,
    EmployeesSidesheetComponent
  ],
  imports: [
    EuiCoreModule,
    TileModule,
    RouterModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    CommonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,   
    MatButtonModule,
    ReactiveFormsModule
    
  ],
  exports: [
    Ex2PluginComponent
  ],
  providers:[RouteGuardService]
})
export class Ex2PluginModule { 

  constructor(private readonly initializer: Ex2PluginService, private readonly menuService: MenuService){
    console.log('In constructor of Ex2PluginService');
    this.initializer.onInit(routes);
    console.log('SamplePluginModule initialized');
    //this.setupMenu();

  }

 
}
