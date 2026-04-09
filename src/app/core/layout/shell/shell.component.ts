import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-white">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {}
