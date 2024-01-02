import { TrainingService } from './../training/training.service';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { UIService } from '../shared/ui.service';
@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private afAuth: Auth,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(
      this.afAuth,
      authData.email,
      authData.password
    )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
        this.uiService.showSnackbar(err, 'Dismiss', 5000);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    signInWithEmailAndPassword(this.afAuth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((err) => {
        console.log(err);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(err, 'Dismiss', 5000);
      });
  }

  logout() {
    this.afAuth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
