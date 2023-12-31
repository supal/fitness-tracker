import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  firestore: Firestore = inject(Firestore);

  exercises$: Observable<any[]>;

  constructor() {
    const aCollection = collection(this.firestore, 'availableExercises');
    this.exercises$ = collectionData(aCollection, {
      idField: 'id',
    }) as Observable<Exercise[]>;
  }

  // constructor(private trainingService: TrainingService) {

  // }

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingService.startExercise(form.value.exercise);
  }
}
