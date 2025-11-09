import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('LabelThemeController', () => {
  let checkbox: HTMLInputElement;

  beforeEach(() => {
    // Reset the DOM
    document.documentElement.innerHTML = '';
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    
    // Clear localStorage
    localStorage.clear();
    
    // Create the checkbox element
    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'theme-controller';
    document.body.appendChild(checkbox);
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    localStorage.clear();
  });

  const initializeThemeController = () => {
    // This simulates the script logic from the Astro component
    const theme = (() => {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
      }
      return 'light';
    })();

    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const checkboxElement = document.querySelector('.theme-controller') as HTMLInputElement;
    if (checkboxElement) {
      checkboxElement.checked = theme === 'dark';
    }

    checkboxElement?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const newTheme = target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme);
    });
  };

  it('should load the theme from localStorage on initial render', () => {
    // Arrange: Set theme in localStorage
    localStorage.setItem('theme', 'dark');

    // Act: Initialize the theme controller
    initializeThemeController();

    // Assert: Theme should be loaded from localStorage
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should use light theme by default when localStorage is empty', () => {
    // Arrange: localStorage is empty (cleared in beforeEach)

    // Act: Initialize the theme controller
    initializeThemeController();

    // Assert: Should default to light theme
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should toggle between light and dark when the checkbox is clicked', () => {
    // Arrange: Initialize with light theme
    initializeThemeController();

    // Act & Assert: Toggle to dark
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Act & Assert: Toggle back to light
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should update localStorage "theme" item correctly when theme changes', () => {
    // Arrange: Initialize the theme controller
    initializeThemeController();

    // Act: Toggle to dark theme
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    // Assert: localStorage should be updated to dark
    expect(localStorage.getItem('theme')).toBe('dark');

    // Act: Toggle to light theme
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    // Assert: localStorage should be updated to light
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should add/remove "dark" class from document.documentElement based on the selected theme', () => {
    // Arrange: Initialize with light theme
    initializeThemeController();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Act: Change to dark theme
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    // Assert: "dark" class should be added
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Act: Change back to light theme
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    // Assert: "dark" class should be removed
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should reflect the currently active theme in the checkbox', () => {
    // Arrange: Set dark theme in localStorage
    localStorage.setItem('theme', 'dark');

    // Act: Initialize the theme controller
    initializeThemeController();

    // Assert: Checkbox should be checked for dark theme
    expect(checkbox.checked).toBe(true);

    // Arrange: Set light theme in localStorage
    localStorage.setItem('theme', 'light');
    // Reinitialize by creating a fresh state
    checkbox.checked = false;
    initializeThemeController();

    // Assert: Checkbox should be unchecked for light theme
    expect(checkbox.checked).toBe(false);
  });

  it('should correctly set data-theme attribute on documentElement', () => {
    // Arrange & Act: Initialize with default (light) theme
    initializeThemeController();

    // Assert: data-theme should be 'light'
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Act: Change to dark theme
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    // Assert: data-theme should be 'dark'
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
