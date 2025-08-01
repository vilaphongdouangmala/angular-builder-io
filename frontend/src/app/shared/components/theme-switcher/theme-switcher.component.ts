import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2">
      <button
        *ngFor="let theme of themeService.availableThemes"
        (click)="setTheme(theme.name as Theme)"
        [class.active]="themeService.currentTheme === theme.name"
        class="px-3 py-1.5 text-sm rounded-md border transition-colors"
        [class.bg-primary-teal]="themeService.currentTheme === theme.name"
        [class.text-white]="themeService.currentTheme === theme.name"
        [class.border-primary-teal]="themeService.currentTheme === theme.name"
        [class.bg-white]="themeService.currentTheme !== theme.name"
        [class.text-neutrals-400]="themeService.currentTheme !== theme.name"
        [class.border-neutrals-50]="themeService.currentTheme !== theme.name"
        [class.hover:border-primary-teal]="themeService.currentTheme !== theme.name"
        [attr.aria-label]="'Switch to ' + theme.displayName + ' theme'"
      >
        {{ theme.displayName }}
      </button>
    </div>
  `,
  styles: [`
    .active {
      @apply ring-2 ring-primary-teal ring-opacity-50;
    }
    
    button:focus {
      @apply outline-none ring-2 ring-primary-teal ring-opacity-50;
    }
  `]
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
