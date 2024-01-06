import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggle = new EventEmitter<void>();
  isAuth$!: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onSidenavToggle() {
    this.sideNavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
