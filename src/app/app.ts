import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './features/editor/editor.component';

@Component({
  imports: [RouterOutlet, EditorComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('collaborative-canvas-editor');
}
