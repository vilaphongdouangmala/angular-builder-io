import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  name: string;
  displayName: string;
  cssClass: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'selected-theme';
  
  // Theme signal
  private _currentTheme = signal<Theme>('light');
  
  // Available themes configuration
  private readonly themes: Record<Theme, ThemeConfig> = {
    light: {
      name: 'light',
      displayName: 'Light',
      cssClass: 'theme-light',
      colors: {
        primary: '#175252',
        secondary: '#1958D3',
        background: '#F9F9FC',
        surface: '#FFFFFF',
        text: '#12141F',
        textSecondary: '#55596D',
        border: '#EAEAED',
        error: '#FF3B30',
        warning: '#FF9500',
        success: '#34C759'
      }
    },
    dark: {
      name: 'dark',
      displayName: 'Dark',
      cssClass: 'theme-dark',
      colors: {
        primary: '#4AEAE4',
        secondary: '#5B9AFF',
        background: '#121212',
        surface: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#B3B3B3',
        border: '#2C2C2C',
        error: '#FF5F5F',
        warning: '#FFB84D',
        success: '#5DD876'
      }
    },
    auto: {
      name: 'auto',
      displayName: 'Auto',
      cssClass: 'theme-auto',
      colors: {
        primary: '#175252',
        secondary: '#1958D3',
        background: '#F9F9FC',
        surface: '#FFFFFF',
        text: '#12141F',
        textSecondary: '#55596D',
        border: '#EAEAED',
        error: '#FF3B30',
        warning: '#FF9500',
        success: '#34C759'
      }
    }
  };

  // Computed theme config
  currentThemeConfig = computed(() => this.themes[this._currentTheme()]);
  
  // Getters
  get currentTheme() {
    return this._currentTheme();
  }

  get availableThemes() {
    return Object.values(this.themes);
  }

  constructor() {
    this.initializeTheme();
    this.setupMediaQueryListener();
  }

  /**
   * Set the application theme
   */
  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    this.saveThemePreference(theme);
    this.applyTheme(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const current = this._currentTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get theme config by name
   */
  getThemeConfig(themeName: Theme): ThemeConfig {
    return this.themes[themeName];
  }

  /**
   * Check if current theme is dark
   */
  isDarkTheme(): boolean {
    const current = this._currentTheme();
    if (current === 'auto') {
      return this.isSystemDarkMode();
    }
    return current === 'dark';
  }

  private initializeTheme(): void {
    const savedTheme = this.getSavedThemePreference();
    const theme = savedTheme || 'light';
    this._currentTheme.set(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    const config = this.themes[theme];
    
    // Remove all theme classes
    Object.values(this.themes).forEach(t => {
      body.classList.remove(t.cssClass);
    });
    
    // Apply current theme class
    body.classList.add(config.cssClass);
    
    // Apply CSS custom properties
    this.setCSSCustomProperties(config);
    
    // Handle auto theme
    if (theme === 'auto') {
      this.applyAutoTheme();
    }
  }

  private setCSSCustomProperties(config: ThemeConfig): void {
    const root = document.documentElement;
    
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  private applyAutoTheme(): void {
    const isDark = this.isSystemDarkMode();
    const autoConfig = isDark ? this.themes.dark : this.themes.light;
    this.setCSSCustomProperties(autoConfig);
    
    // Update body class for auto theme
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
  }

  private setupMediaQueryListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', () => {
      if (this._currentTheme() === 'auto') {
        this.applyAutoTheme();
      }
    });
  }

  private isSystemDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private saveThemePreference(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  private getSavedThemePreference(): Theme | null {
    try {
      const saved = localStorage.getItem(this.THEME_STORAGE_KEY);
      return saved as Theme;
    } catch (error) {
      console.warn('Failed to get saved theme preference:', error);
      return null;
    }
  }
}
