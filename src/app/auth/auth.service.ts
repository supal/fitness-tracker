import { TrainingService } from './../training/training.service';
import { AuthData } from './auth-data';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Authrx from './auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: Auth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ ui: fromRoot.State }>
  ) {}

  initAuthListener() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.store.dispatch(new Authrx.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new Authrx.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    createUserWithEmailAndPassword(
      this.afAuth,
      authData.email,
      authData.password
    )
      .then((result) => {
        this.store.dispatch(new UI.StopLoading());
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(err, 'Dismiss', 5000);
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    signInWithEmailAndPassword(this.afAuth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.store.dispatch(new UI.StopLoading());
        // this.uiService.loadingStateChanged.next(false);
      })
      .catch((err) => {
        console.log(err);
        this.store.dispatch(new UI.StopLoading());
        // this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(err, 'Dismiss', 5000);
      });
  }

  logout() {
    this.afAuth.signOut();
  }
}
