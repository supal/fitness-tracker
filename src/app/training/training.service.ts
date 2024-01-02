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

@Injectable()
export class TrainingService {
  firestore: Firestore = inject(Firestore);

  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise;
  private finishedExercises!: Exercise[];
  private fbSubs: Subscription[] = [];

  constructor(private uiService: UIService) {}

  fetchAvailableExercises() {
    let exercisesObs!: Observable<Exercise[]>;
    const aCollection = collection(this.firestore, 'availableExercises');
    exercisesObs = collectionData(aCollection, {
      idField: 'id',
    }) as Observable<Exercise[]>;
    this.fbSubs.push(
      exercisesObs.subscribe(
        (exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        },
        (error) => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar('Show list error', '', 3000);
          this.exercisesChanged.next([]);
        }
      )
    );
  }

  startExercise(selectedId: string) {
    const docRef = doc(this.firestore, 'availableExercises', selectedId);
    updateDoc(docRef, { lastSelected: new Date() });

    const runEx = this.availableExercises.find((ex) => ex.id === selectedId);
    this.runningExercise = runEx!;
    this.exerciseChanged.next(this.runningExercise);
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'cancelled',
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.duration * (progress / 100),
    });
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    let exercisesObs!: Observable<Exercise[]>;
    const fCollection = collection(this.firestore, 'finishedExercises');
    exercisesObs = collectionData(fCollection, {
      idField: 'id',
    }) as Observable<Exercise[]>;
    this.fbSubs.push(
      exercisesObs.subscribe((exercises: Exercise[]) => {
        this.finishedExercises = exercises;
        this.finishedExercisesChanged.next([...this.finishedExercises]);
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
