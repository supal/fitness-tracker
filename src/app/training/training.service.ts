import { Exercise } from './exercise.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  DocumentReference,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import * as Training from './training.actions';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  firestore: Firestore = inject(Firestore);

  private fbSubs: Subscription[] = [];

  constructor(
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    let exercisesObs!: Observable<Exercise[]>;
    const aCollection = collection(this.firestore, 'availableExercises');
    exercisesObs = collectionData(aCollection, {
      idField: 'id',
    }) as Observable<Exercise[]>;
    this.fbSubs.push(
      exercisesObs.subscribe(
        (exercises: Exercise[]) => {
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        },
        (error) => {
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar('Show list error', '', 3000);
        }
      )
    );
  }

  startExercise(selectedId: string) {
    const docRef = doc(this.firestore, 'availableExercises', selectedId);
    updateDoc(docRef, { lastSelected: new Date() });
    this.store.dispatch(new Training.StartTrainings(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex != null) {
          this.addDataToDatabase({
            ...ex,
            date: new Date(),
            state: 'completed',
          });
          this.store.dispatch(new Training.StopTrainings());
        }
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex != null) {
          this.addDataToDatabase({
            ...ex,
            date: new Date(),
            state: 'cancelled',
            duration: ex.duration * (progress / 100),
            calories: ex.duration * (progress / 100),
          });
          this.store.dispatch(new Training.StopTrainings());
        }
      });
  }

  fetchCompletedOrCancelledExercises() {
    let exercisesObs!: Observable<Exercise[]>;
    const fCollection = collection(this.firestore, 'finishedExercises');
    exercisesObs = collectionData(fCollection, {
      idField: 'id',
    }) as Observable<Exercise[]>;
    this.fbSubs.push(
      exercisesObs.subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    if (!exercise) return;

    const fCollection = collection(this.firestore, 'finishedExercises');
    addDoc(fCollection, exercise).then(
      (documentReference: DocumentReference) => {
        // the documentReference provides access to the newly created document
        console.log(documentReference.id);
      }
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }
}
