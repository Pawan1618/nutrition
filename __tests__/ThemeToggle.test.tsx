import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeProvider } from '../components/ThemeContext';

// Mock the useTheme hook
const toggleThemeMock = vi.fn();

vi.mock('../components/ThemeContext', async () => {
    const actual = await vi.importActual('../components/ThemeContext');
    return {
        ...actual,
        useTheme: () => ({
            theme: 'light',
            toggleTheme: toggleThemeMock,
        }),
    };
});

test('ThemeToggle renders and handles click', () => {
    render(<ThemeToggle />);

    // Check if button exists
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeDefined();

    // Click it
    fireEvent.click(button);

    // Verify toggle function was called
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
});
