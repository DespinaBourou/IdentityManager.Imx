import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Ex2PluginService } from './ex2-plugin.service';

@Injectable({
  providedIn: 'root'
})
export class ApiresponseGuardGuard implements CanActivate {
  constructor(public ex2PluginService: Ex2PluginService ){}
  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

      let hasReportingEmployees = await this.ex2PluginService.HasReportingIdentities();     

      return hasReportingEmployees;
  }
  
}
