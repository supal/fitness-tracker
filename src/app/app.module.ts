import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterilaModule } from './material.module';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { TrainingComponent } from './training/training.component';
import { CurrentTrainingComponent } from './training/current-training/current-training.component';
import { NewTrainingComponent } from './training/new-training/new-training.component';
import { PastTrainingComponent } from './training/past-training/past-training.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { StopTrainingComponent } from './training/current-training/stop-training.component';
import { AuthService } from './auth/auth.service';
import { TrainingService } from './training/training.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    TrainingComponent,
    HeaderComponent,
    SidenavListComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    WelcomeComponent,
    StopTrainingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterilaModule,
    FlexLayoutModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ng-fitness-tracker-82d23',
        appId: '1:683613815280:web:9e061c3422df860dbc1d35',
        storageBucket: 'ng-fitness-tracker-82d23.appspot.com',
        apiKey: 'AIzaSyBKG1MAR7CWTRaqiypZMgGNIonnL7VOzgU',
        authDomain: 'ng-fitness-tracker-82d23.firebaseapp.com',
        messagingSenderId: '683613815280',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
  providers: [AuthService, TrainingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
