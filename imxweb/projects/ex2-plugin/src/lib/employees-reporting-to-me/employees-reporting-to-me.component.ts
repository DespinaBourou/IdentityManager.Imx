import { Component, OnInit, ViewChild } from '@angular/core';
import { Ex2PluginService } from '../ex2-plugin.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EuiSidesheetConfig, EuiSidesheetService } from '@elemental-ui/core';
import { EmployeesSidesheetComponent } from '../employees-sidesheet/employees-sidesheet.component';

interface employeeObjectRow {
  FirstName: string,
  LastName: string,
  Description: string,
  Department: string,
  Phone: string,
  ContactEmail: string
}
@Component({
  selector: 'imx-employees-reporting-to-me',
  templateUrl: './employees-reporting-to-me.component.html',
  styleUrls: ['./employees-reporting-to-me.component.css']
})
export class EmployeesReportingToMeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize=10;
  pageSizeOptions= [10,30,50];
  headerDisplayedColumns: string[];
  employeesData;
  employeesDataArray: MatTableDataSource<employeeObjectRow>;
  displayedColumns: string[];
  employeesDataShown: employeeObjectRow[];


  constructor(public ex2PluginService: Ex2PluginService,
              private readonly sidesheetService: EuiSidesheetService
  ) { }

  async ngOnInit(): Promise<void> {

    this.headerDisplayedColumns=['filtersearch'];
    this.employeesData = await this.ex2PluginService.PeopleReportingToMe(); //here response object also includes EntryDate property
    this.employeesDataShown = this.employeesData.map(({EntryDate,...restproperties})=>restproperties) //to get array of objects but without the EntryDate property
    this.displayedColumns = Object.keys(this.employeesDataShown[0]);
    this.employeesDataArray = new MatTableDataSource(this.employeesDataShown);
    this.employeesDataArray.paginator = this.paginator;
 
  }

  filter($event): void{
    this.employeesDataArray.filter = $event.target.value.trim().toLowerCase();
  }

  //method to be executed when clicking a row in the mat table, it opens a sidesheet
 public async onRowClick(row: employeeObjectRow): Promise<void>{
  
  const findemployee = this.employeesData.find(employee=>employee.ContactEmail==row.ContactEmail); //to find from the response data the employee with 
  //given email
  const entrydate=findemployee.EntryDate; //to get the entry date of employee with given email
  const title=findemployee.FirstName+ ' '+findemployee.LastName+"'s Employee Data";
  const config: EuiSidesheetConfig ={
    title: title,
    width: '900px',
    //headerColour: 'peachpuff',
    data: [row.ContactEmail, entrydate]

  } 

  //EmployeesSidesheetComponent is the component that the sidesheet will render
  const sidesheetRef = this.sidesheetService.open(EmployeesSidesheetComponent,config);

 }

}
