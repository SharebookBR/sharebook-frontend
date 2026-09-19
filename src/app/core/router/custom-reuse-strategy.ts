import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {
  handlers: { [key: string]: DetachedRouteHandle } = {};

  /** Determines if this route (and its subtree) should be detached to be reused later */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig?.path === 'book/list';
  }

  /** Stores the detached route */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (!route.routeConfig?.path) {
      return;
    }

    this.handlers[route.routeConfig.path] = handle;
  }

  /** Determines if this route (and its subtree) should be reattached */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig?.path && !!this.handlers[route.routeConfig.path];
  }

  /** Retrieves the previously stored route */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig?.path) {
      return null;
    }

    return this.handlers[route.routeConfig.path];
  }

  /** Determines if a route should be reused */
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
