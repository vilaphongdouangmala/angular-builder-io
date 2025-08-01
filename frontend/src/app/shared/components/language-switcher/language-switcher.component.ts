import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService, SupportedLanguage } from '../../../core/services/localization.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="relative">
      <button
        (click)="toggleDropdown()"
        class="flex items-center gap-2 px-3 py-2 text-sm border border-neutrals-50 rounded-lg bg-white hover:border-primary-teal transition-colors"
        [attr.aria-label]="'Current language: ' + localizationService.currentLanguageConfig().name"
      >
        <span class="text-lg">{{ localizationService.currentLanguageConfig().flag }}</span>
        <span class="text-neutrals-400 font-medium">{{ localizationService.currentLanguageConfig().code.toUpperCase() }}</span>
        <svg class="w-4 h-4 text-neutrals-300 transition-transform" [class.rotate-180]="isOpen" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </button>
      
      <div
        *ngIf="isOpen"
        class="absolute top-full left-0 mt-1 w-48 bg-white border border-neutrals-50 rounded-lg shadow-lg z-50"
      >
        <button
          *ngFor="let language of localizationService.availableLanguages"
          (click)="setLanguage(language.code)"
          class="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-neutrals-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
          [class.bg-primary-teal-light]="localizationService.currentLanguage === language.code"
          [class.text-primary-teal]="localizationService.currentLanguage === language.code"
        >
          <span class="text-lg">{{ language.flag }}</span>
          <div class="flex flex-col">
            <span class="font-medium">{{ language.name }}</span>
            <span class="text-xs text-neutrals-300">{{ language.nativeName }}</span>
          </div>
          <svg
            *ngIf="localizationService.currentLanguage === language.code"
            class="w-4 h-4 ml-auto text-primary-teal"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LanguageSwitcherComponent {
  localizationService = inject(LocalizationService);
  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  async setLanguage(language: SupportedLanguage): Promise<void> {
    await this.localizationService.setLanguage(language);
    this.closeDropdown();
  }
}
