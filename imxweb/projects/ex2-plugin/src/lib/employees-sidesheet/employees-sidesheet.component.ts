import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import moment from 'moment-timezone';
import { Ex2PluginService } from '../ex2-plugin.service';
import { EUI_SIDESHEET_DATA, EuiLoadingService, EuiSidesheetRef, EuiSidesheetService } from '@elemental-ui/core';


@Component({
  selector: 'imx-employees-sidesheet',
  templateUrl: './employees-sidesheet.component.html',
  styleUrls: ['./employees-sidesheet.component.css']
})
export class EmployeesSidesheetComponent implements OnInit {
  exitdate = new FormControl();
  customproperty01 = new FormControl('');
  entrydate:moment.Moment;
  //loading:boolean;

  constructor( 
     public ex2PluginService: Ex2PluginService,
     private sidesheetService: EuiSidesheetService,
     private busyService: EuiLoadingService,
     private sidesheetRef: EuiSidesheetRef,
    @Inject (EUI_SIDESHEET_DATA) public sidesheetdata?: any) { 
      this.entrydate=sidesheetdata[1];
 
  }

  ngOnInit(): void {
    console.log('ngoninit sidesheetdata is',this.sidesheetdata);

    // this.setLocale(this.translate.currentLang);
  }

    // public setLocale(locale: string): void {
    //   moment.locale(locale);
    //   this.dateAdapter.setLocale(locale);
    // }

    public async updateEmployeeData(){
      //this.loading=true;
      this.busyService.show();
      console.log('clicked button,  inside updatemployeedata',this.sidesheetdata, this.customproperty01.value,this.exitdate.value.format('YYYY-MM-DD'));
      await this.ex2PluginService.EmployeeDataUpdate(this.sidesheetdata[0], this.customproperty01.value,this.exitdate.value.format('YYYY-MM-DD'));
      this.busyService.hide();
      //this.loading=false;

    }

}
