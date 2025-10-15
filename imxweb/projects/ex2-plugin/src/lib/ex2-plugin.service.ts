import { Injectable } from '@angular/core';
import { AppConfigService, ExtService, MenuItem, MenuService, RouteGuardService, AuthenticationService } from 'qbm';
import { Ex2PluginComponent } from './ex2-plugin.component';
import { Route, Router, Routes } from '@angular/router';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { EmployeesReportingToMeComponent } from './employees-reporting-to-me/employees-reporting-to-me.component';
import { EuiSelectComponent } from '@elemental-ui/core';
import { skip } from 'rxjs/operators';

interface PeopleReporting{
  FirstName: string;
  LastName: string;
  Description: string;
  Phone: string;
  Department: string;
  ContactEmail: string;
  EntryDate: string;
}

interface CountReporting{
  EmployeesCount: number ;
}

@Injectable({
  providedIn: 'root'
})

export class Ex2PluginService {
  public hasReportingIdentities : boolean = false;

  constructor(
    private readonly extService: ExtService, //ExtService service is used to register a component as a tile in the dashboard
     private readonly router: Router,
     private readonly config: AppConfigService, 
     private readonly menuService: MenuService,
     private readonly authentication: AuthenticationService) {  
      this.authentication.onSessionResponse.subscribe({
        next: async sessionState => {
          if (sessionState?.IsLoggedOut){          
            this.hasReportingIdentities=false;
          }
          else if(sessionState?.IsLoggedIn){
            this.HasReportingIdentities();
            this.setupMenu();
          }
          
        }
      })      
           
   }

   public async onInit(routes: Route[]): Promise<void> {
    this.addRoutes(routes);
    this.extService.register('Dashboard-SmallTiles',{instance: Ex2PluginComponent	});
   
   }

   private addRoutes(routes: Route[]): void {
    const config = this.router.config;
    routes.forEach((route) => {
      config.unshift(route);
    });
    this.router.resetConfig(config);
  }



  public async HasReportingIdentities(){
    let countReportingToMe = await this.config.apiClient.processRequest<CountReporting>(this.GetPeopleReportingToMe('ex4/countreportingtome'));
    console.log('apicountresponse: ', countReportingToMe);
    if (countReportingToMe.EmployeesCount != 0){
      this.hasReportingIdentities = true;
    }else{
      this.hasReportingIdentities = false;
    }
    console.log('hasreportingidentities?',this.hasReportingIdentities,countReportingToMe.EmployeesCount);
    return this.hasReportingIdentities;
  }

    public async PeopleReportingToMe(){     
        let peopleReportingToMeData = await this.config.apiClient.processRequest<PeopleReporting[]>(this.GetPeopleReportingToMe('ex4/peoplereportingtome'));
        return peopleReportingToMeData;     
    
    }

  
  
    private GetPeopleReportingToMe(urlendpoint:string): MethodDescriptor<void>{
      return{
        path: `/portal/`+urlendpoint,
        parameters: [],
        method: 'GET',
        headers: {
          'imx-timezone': TimeZoneInfo.get()
        },
        credentials: 'include',
        observe: 'response',
        responseType: 'json'
      };
    }

    public setupMenu(){        
      
        
          this.menuService.addMenuFactories((preProps: string[],features: string[])=>{
            console.log('inside setupmenu, this.hasReportingIdentities is',this.hasReportingIdentities);
            if(this.hasReportingIdentities){
              const menu: MenuItem = {
                id:'ROOT_cccemplreptome',
                title: '#LDS#Employees Reporting To Me',
                sorting: '90',
                route: 'employees-reporting-to-me'
        
              };          
                return menu;   
            }
               
            
          })         
      
  
    }

    public async EmployeeDataUpdate(email: string, customproperty01: string, exitdate: string){
      console.log('inside employeedataupdate service');
      const requestData={"EmailAdress":email,
        "CustomProperty01":customproperty01,
        "ExitDate": exitdate}
      await this.config.apiClient.processRequest(this.PostEmployeeDataUpdate(requestData));
      console.log('finished update');

    }


    private PostEmployeeDataUpdate(data: any): MethodDescriptor<void>{
      return{
        path: `/portal/ex5/exitdatencustomproperty`,
        parameters: [{
          name:'data',
          value: data,
          in: 'body'
          
        }],
        method: 'POST',
        headers: {
          'imx-timezone': TimeZoneInfo.get()
        },
        credentials: 'include',
        observe: 'response',
        responseType: 'json'
      };
    }

  
}
