import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { MaterilaModule } from './material.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { UIService } from './shared/ui.service';
import { TrainingService } from './training/training.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';

@NgModule({
  declarations: [
    AppComponent,

    HeaderComponent,
    SidenavListComponent,

    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterilaModule,
    FlexLayoutModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
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
    provideAuth(() => getAuth()),
    StoreModule.forRoot(reducers),
  ],
  providers: [AuthService, TrainingService, UIService],
  bootstrap: [AppComponent],
})
export class AppModule {}
