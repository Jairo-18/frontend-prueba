import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-base-dialog',
  imports: [],
  templateUrl: './base-dialog.component.html',
  styleUrl: './base-dialog.component.scss'
})
export class BaseDialogComponent {
  title: InputSignal<string> = input('');
  subtitle: InputSignal<string> = input('');
  description: InputSignal<string> = input('');
}
