import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { imx_SessionService } from 'qbm';
import { RequestsService } from 'qer';
import { Ex2PluginService } from './ex2-plugin.service';

@Component({
  selector: 'imx-ex2-plugin',
  templateUrl: './ex2-plugin.component.html',
  styles: [
  ]
})
export class Ex2PluginComponent implements OnInit {

  caption: string = "Employees reporting to me"
  actionText: string = "EXPLORE"
  description: string = "View employees reporting to me"
  //employeesArray: any[] = [];
  hasReportingEmployees: boolean = false;


  constructor(
    
    public readonly router: Router,
    public ex2PluginService: Ex2PluginService
  ) {    
    } 

  async ngOnInit(): Promise<void> {
    console.log("Ex2PluginComponent->onInit")
    this.hasReportingEmployees = await this.ex2PluginService.HasReportingIdentities(); //to check whether or not there are reporting identities 
    //and conditionally render the tile


    

  }

  public GoToCCCEmployeesReportingToMe(): void{
    console.log('inside gotocccemployeesreportingtome');
    this.router.navigate(['employees-reporting-to-me']);

}


}

