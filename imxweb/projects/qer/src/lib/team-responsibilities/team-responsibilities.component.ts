/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2023 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */

import { Component, OnInit } from '@angular/core';
import { TeamResponsibilitiesService } from './team-responsibilities.service';
import { BusyService, ClientPropertyForTableColumns, DataModelWrapper, DataSourceToolbarFilter, DataSourceToolbarSettings, DataSourceWrapper } from 'qbm';
import { PortalRespTeamResponsibilities, ResponsibilitiesExtendedData, ResponsibilityData } from 'imx-api-qer';
import { CollectionLoadParameters, EntitySchema, ValType } from 'imx-qbm-dbts';
import { TranslateService } from '@ngx-translate/core';
import { EuiSidesheetService } from '@elemental-ui/core';
import { TeamResponsibilitySidesheetComponent } from './team-responsibility-sidesheet/team-responsibility-sidesheet.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'imx-team-responsibilities',
  templateUrl: './team-responsibilities.component.html',
  styleUrls: ['./team-responsibilities.component.scss'],
})
export class TeamResponsibilitiesComponent implements OnInit {
  public dataModelWrapper: DataModelWrapper;
  public dstWrapper: DataSourceWrapper<PortalRespTeamResponsibilities, ResponsibilitiesExtendedData>;
  public entitySchema: EntitySchema;
  public dstSettings: DataSourceToolbarSettings;
  public busyService = new BusyService();
  public displayColumns: ClientPropertyForTableColumns[];
  public source: string;
  public queryParamKey: number;
  public teamTileToMenu: boolean = false;
  

  constructor(
    private readonly teamResponsibilitiesService: TeamResponsibilitiesService,
    private readonly sideSheet: EuiSidesheetService,
    private readonly translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute
    
   
  ) {
    this.entitySchema = this.teamResponsibilitiesService.responsibilitySchema;
    console.log('inside constructor. entityschema is',this.entitySchema);
  }

  public async ngOnInit(): Promise<void> {
    console.log('INSIDE NGONINIT OF TEAMRESP');
    const isBusy = this.busyService.beginBusy();
    try {
      this.dataModelWrapper = {
        dataModel: await this.teamResponsibilitiesService.getDataModel(),
      };
    } finally {
      isBusy.endBusy();
    }
    this.setDisplayColumns();
    this.dstWrapper = new DataSourceWrapper(
      (state) => this.teamResponsibilitiesService.get(state),
      this.displayColumns,
      this.entitySchema,
      this.dataModelWrapper,
      'team-responsibilites',
    );
    //this.getInitialData();
    this.route.queryParams.subscribe(params =>{
      console.log('inside query param subscription');
      if(params['source'] != 'tile' && this.source == 'tile'){
        //when going from tile to menu
        console.log('inside tiletomenu if',this.teamTileToMenu);
        this.teamTileToMenu = true;
        this.source = params['source']; 
      }
      else{
        if(this.teamTileToMenu){
          //when not going from tile to menu but previously having gone from tile to menu
          this.teamTileToMenu = false;
        }
        this.source = params['source'];      
        this.getInitialData();

      }     
        
      
      
      // if(params['source']=='tile'){
      //   console.log('INSIDE RELOAD');
      //   this.router.navigate([this.router.url],{queryParamsHandling: 'merge'});
      // }    
      //this.getInitialData();
      
    
    })
  }

  public async getData(newState?: CollectionLoadParameters): Promise<void> {
    console.log('INSIDE GET DATA');
    console.log('newState is', newState);
    const isbusy = this.busyService.beginBusy();
    try {
      this.dstSettings = await this.dstWrapper.getDstSettings(newState);
    } finally {
      isbusy.endBusy();
    }
  }

  public isResponsibilityOrphaned(responsibility: PortalRespTeamResponsibilities): boolean {
    const extendedData = this.getExtendedData(responsibility);
    return extendedData?.OtherIdentities?.length == 0;
  }
  public isResponsibilityDeletable(responsibility: PortalRespTeamResponsibilities): boolean {
    const extendedData = this.getExtendedData(responsibility);
    return extendedData?.CanDelete;
  }

  public onDeleteResponsibility(responsibility: PortalRespTeamResponsibilities): void {
    console.log(responsibility);
  }

  public onOpenDetails(responsibility: PortalRespTeamResponsibilities): void {
    const extendedData = this.getExtendedData(responsibility);
    this.sideSheet.open(TeamResponsibilitySidesheetComponent, {
      title: this.translateService.instant('#LDS#Heading Other Identities Responsible for the Object'),
      subTitle: responsibility.DisplayName.Column.GetDisplayValue(),
      padding: '0',
      width: 'max(600px, 60%)',
      disableClose: false,
      testId: 'team-responsibilities-sidesheet',
      data: {
        extendedData,
      },
    });
  }

  private getExtendedData(responsibility: PortalRespTeamResponsibilities): ResponsibilityData {
    const index = this.dstSettings.dataSource.Data.indexOf(responsibility);
    return this.dstWrapper.extendedData?.Data[index];
  }

  private async getInitialData(): Promise<void> {
    console.log('INSIDE GETINITIALDATA');
    console.log('dst settings inside getinitialdata are',this.dstSettings);
    // elements of the filters array are objects with a name property, a description property, a currentvalue property, an initialvalue property and an options property (which is an array)
    //here it only has one element which by default has only the name, the description and the options property
    //after the mapping it also has the initial value property
    const filters: DataSourceToolbarFilter[] = this.dataModelWrapper.dataModel.Filters;
    console.log('before filters inside getinitialdata are',filters[0]); 
    filters.map( filter => {
      if(filter.Name === 'forinactive' && this.source == 'tile'){
        filter.InitialValue = '1'; //comment this out so that initialvalue property is not set 
        // and as a result filter is not being preselected
      }
      // else if (filter.Name === 'forinactive' && this.source != 'tile' && filter.InitialValue){
      //   console.log('WENT FROM TILE TO MENU ITEM, filter before is',filter);
      //   delete filter.InitialValue;
      //   delete filter.CurrentValue;
      //   console.log('WENT FROM TILE TO MENU ITEM, filter after is',filter);

      // }
    })
    console.log('after filters inside getinitialdata are',filters[0]);
    const isbusy = this.busyService.beginBusy();
    try {
      this.dstSettings = {
        dataSource: {Data: [], totalCount: 0},
        entitySchema: this.entitySchema,
        filters,
        navigationState: {'forinactive': '1'},
        displayedColumns: this.displayColumns
      };
      console.log('changed dst settings inside getinitialdata are',this.dstSettings);
    } finally {
      isbusy.endBusy();
    }
  }

  private setDisplayColumns():void{
    this.displayColumns =
    [
      this.entitySchema.Columns.DisplayName,
      {
        ColumnName: 'badges',
        Type: ValType.String,
      },
      this.entitySchema.Columns.UID_Person,
      // TODO Work item: #426008
      // {
      //   ColumnName: 'actions',
      //   Type: ValType.String,
      // },
    ];
  }
}
