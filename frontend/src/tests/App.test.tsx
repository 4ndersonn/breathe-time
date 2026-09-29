import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Home } from '../pages/Home';
import { Navbar } from '../components/Navbar';

describe('Frontend Modern Architecture Tests', () => {
  test('renders Home page title and CTAs', () => {
    const mockNavigate = vi.fn();
    render(<Home onNavigate={mockNavigate} />);
    expect(screen.getByText(/Radiografia Global do/i)).toBeTruthy();
    expect(screen.getByText(/Explorar Domicílios/i)).toBeTruthy();
  });

  test('Navbar renders navigation tabs and brand', () => {
    const mockTabChange = vi.fn();
    const mockToggleDark = vi.fn();
    render(
      <Navbar 
        currentTab="inicio" 
        onTabChange={mockTabChange} 
        darkMode={false} 
        onToggleDarkMode={mockToggleDark} 
      />
    );
    expect(screen.getByText('Breathe Time')).toBeTruthy();
    expect(screen.getAllByText('Domicílio')[0]).toBeTruthy();
    expect(screen.getAllByText('Suporte Social')[0]).toBeTruthy();

    const domicilioTab = screen.getAllByText('Domicílio')[0];
    fireEvent.click(domicilioTab);
    expect(mockTabChange).toHaveBeenCalledWith('domicilio');
  });
});
