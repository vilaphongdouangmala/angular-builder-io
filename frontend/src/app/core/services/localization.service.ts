import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError, from, defer, EMPTY, catchError, map, switchMap, tap, delay } from 'rxjs';

export type SupportedLanguage = 'en' | 'th' | 'zh' | 'ja';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private readonly LANGUAGE_STORAGE_KEY = 'selected-language';
  
  // Current language signal
  private _currentLanguage = signal<SupportedLanguage>('en');
  
  // Translation cache
  private translations = signal<Record<SupportedLanguage, TranslationKeys>>({
    en: {},
    th: {},
    zh: {},
    ja: {}
  });

  // Available languages configuration
  private readonly languages: Record<SupportedLanguage, LanguageConfig> = {
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false
    },
    th: {
      code: 'th',
      name: 'Thai',
      nativeName: 'ไทย',
      flag: '🇹🇭',
      rtl: false
    },
    zh: {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false
    },
    ja: {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      rtl: false
    }
  };

  // Computed values
  currentLanguageConfig = computed(() => this.languages[this._currentLanguage()]);
  currentTranslations = computed(() => this.translations()[this._currentLanguage()]);

  // Getters
  get currentLanguage() {
    return this._currentLanguage();
  }

  get availableLanguages() {
    return Object.values(this.languages);
  }

  constructor() {
    this.initializeLanguage();
    this.loadDefaultTranslations();
  }

  /**
   * Set the application language
   */
  setLanguage(language: SupportedLanguage): Observable<void> {
    if (!this.languages[language]) {
      return throwError(() => new Error(`Language '${language}' is not supported`));
    }

    return this.loadTranslations(language).pipe(
      tap(() => {
        this._currentLanguage.set(language);
        this.saveLanguagePreference(language);
        this.applyLanguageSettings(language);
      }),
      map(() => void 0)
    );
  }

  /**
   * Get translated text by key
   */
  translate(key: string, params?: Record<string, string | number>): string {
    const translations = this.currentTranslations();
    const translation = this.getNestedValue(translations, key);
    
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Replace parameters if provided
    if (params) {
      return this.interpolateParams(translation, params);
    }

    return translation;
  }

  /**
   * Get translated text by key (alias for translate)
   */
  t(key: string, params?: Record<string, string | number>): string {
    return this.translate(key, params);
  }

  /**
   * Check if translation exists for key
   */
  hasTranslation(key: string): boolean {
    const translations = this.currentTranslations();
    return this.getNestedValue(translations, key) !== undefined;
  }

  /**
   * Load translations for a specific language
   */
  loadTranslations(language: SupportedLanguage): Observable<void> {
    return this.fetchTranslations(language).pipe(
      tap(translationData => {
        this.translations.update(current => ({
          ...current,
          [language]: translationData
        }));
      }),
      map(() => void 0),
      catchError(error => {
        console.error(`Failed to load translations for ${language}:`, error);
        return EMPTY;
      })
    );
  }

  /**
   * Add or update translations dynamically
   */
  updateTranslations(language: SupportedLanguage, translations: TranslationKeys): void {
    this.translations.update(current => ({
      ...current,
      [language]: {
        ...current[language],
        ...translations
      }
    }));
  }

  /**
   * Get the direction (LTR/RTL) for current language
   */
  getDirection(): 'ltr' | 'rtl' {
    return this.currentLanguageConfig().rtl ? 'rtl' : 'ltr';
  }

  private initializeLanguage(): void {
    const savedLanguage = this.getSavedLanguagePreference();
    const browserLanguage = this.detectBrowserLanguage();
    const defaultLanguage = savedLanguage || browserLanguage || 'en';
    
    this._currentLanguage.set(defaultLanguage);
    this.applyLanguageSettings(defaultLanguage);
  }

  private loadDefaultTranslations(): void {
    // Load default English translations
    this.updateTranslations('en', {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        remove: 'Remove',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information'
      },
      customer: {
        title: 'Create New Customer',
        customerType: 'Customer type',
        individual: 'Individual',
        company: 'Company',
        taxId: 'Tax ID',
        companyType: 'Company type',
        companyName: 'Company name',
        prefix: 'Prefix',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phoneNo: 'Phone no.',
        contactPersons: 'Contact persons',
        companyTypes: {
          limited: 'Limited Company',
          public: 'Public Limited Company',
          partnership: 'Partnership',
          others: 'Others'
        },
        table: {
          no: 'No.',
          contactName: 'Contact name',
          email: 'Email',
          remarks: 'Remarks',
          withholdingTax: 'Withholding Tax (%)',
          action: 'Action'
        },
        placeholders: {
          taxId: 'Tax ID',
          companyName: 'Company Name',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          phoneNo: 'Phone No.',
          contactName: 'Contact name',
          emailAddress: 'Email address',
          remarks: 'Remarks',
          pleaseSpecify: 'Please Specify'
        },
        actions: {
          edit: 'Edit',
          delete: 'Delete'
        }
      },
      validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: 'Minimum length is {{min}} characters',
        maxLength: 'Maximum length is {{max}} characters',
        pattern: 'Please enter a valid format'
      },
      navigation: {
        newsfeed: 'Newsfeed',
        announcement: 'Announcement',
        approvalRequest: 'Approval Request',
        memoList: 'Memo List',
        folder: 'Folder',
        management: 'Management',
        customer: 'Customer',
        masterdata: 'Masterdata',
        invoice: 'Invoice',
        others: 'Others',
        dashboard: 'Dashboard',
        eContact: 'e-Contact'
      }
    });
  }

  private fetchTranslations(language: SupportedLanguage): Observable<TranslationKeys> {
    // In a real application, this would fetch from a translation service or files
    // Simulate async operation with observable
    return defer(() => {
      const current = this.translations();
      return of(current[language] || {}).pipe(
        delay(100) // Simulate network delay
      );
    });
  }

  private getNestedValue(obj: any, path: string): string | undefined {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private interpolateParams(text: string, params: Record<string, string | number>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  private applyLanguageSettings(language: SupportedLanguage): void {
    const config = this.languages[language];
    
    // Set document language
    document.documentElement.lang = language;
    
    // Set direction
    document.documentElement.dir = config.rtl ? 'rtl' : 'ltr';
    
    // Apply language-specific body class
    document.body.classList.remove('lang-en', 'lang-th', 'lang-zh', 'lang-ja');
    document.body.classList.add(`lang-${language}`);
  }

  private detectBrowserLanguage(): SupportedLanguage | null {
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    return this.languages[browserLang] ? browserLang : null;
  }

  private saveLanguagePreference(language: SupportedLanguage): void {
    try {
      localStorage.setItem(this.LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }

  private getSavedLanguagePreference(): SupportedLanguage | null {
    try {
      const saved = localStorage.getItem(this.LANGUAGE_STORAGE_KEY);
      return saved as SupportedLanguage;
    } catch (error) {
      console.warn('Failed to get saved language preference:', error);
      return null;
    }
  }
}
