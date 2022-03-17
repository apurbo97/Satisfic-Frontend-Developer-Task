import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, Renderer2 } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isDark = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  

  constructor(
    @Inject(DOCUMENT) private document:Document,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener)
    }

    // switchMode(isDarkMode:any){
    //   const hostClass = isDarkMode ? 'dark-theme' : 'light-theme';
    //   this.renderer.setAttribute(this.document.body,'class',hostClass);
    // }

  ngOnInit(): void {
    if(localStorage.getItem("isDark") == "true"){
      this.isDark = true;
      this.toggleDarkMode();
    }
      
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


toggleDarkMode(){
  // this.switchDarkMode.emit(checked);
  localStorage.setItem("isDark",this.isDark.toString())
  const hostClass = this.isDark ? 'dark-theme' : 'light-theme';
  this.renderer.setAttribute(this.document.body,'class',hostClass);
}

logout(){
  localStorage.removeItem("user_details");
  this.router.navigate(['/login'])
}

}
