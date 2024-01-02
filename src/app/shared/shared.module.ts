import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterilaModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, MaterilaModule, FlexLayoutModule],
  exports: [CommonModule, FormsModule, MaterilaModule, FlexLayoutModule],
})
export class SharedModule {}
