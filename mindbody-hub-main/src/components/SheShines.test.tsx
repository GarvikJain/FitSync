import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SheShinesPage from '../pages/SheShinesPage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.URL.createObjectURL and revokeObjectURL
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
  },
});

// Mock document.createElement and appendChild
const mockAnchor = {
  href: '',
  download: '',
  click: jest.fn(),
};
document.createElement = jest.fn(() => mockAnchor) as any;
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SheShinesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders the She Shines page with all main sections', () => {
    renderWithRouter(<SheShinesPage />);

    expect(screen.getByText('SheShines ✨')).toBeInTheDocument();
    expect(screen.getByText('For every mood, moment, and miracle in you.')).toBeInTheDocument();
    expect(screen.getByText('The Purpose 🌸')).toBeInTheDocument();
    expect(screen.getByText('Your Daily Dose of Self-Care 💖')).toBeInTheDocument();
    expect(screen.getByText('😊 Mood Tracker')).toBeInTheDocument();
    expect(screen.getByText('📝 Journal')).toBeInTheDocument();
  });

  it('generates a self-care tip when button is clicked', () => {
    renderWithRouter(<SheShinesPage />);

    const tipButton = screen.getByText('My Self-Care Task');
    fireEvent.click(tipButton);

    // Should display a tip (not the placeholder text)
    expect(screen.queryByText('Your self-care task will appear here!')).not.toBeInTheDocument();
  });

  it('saves mood when mood is selected and save button is clicked', () => {
    renderWithRouter(<SheShinesPage />);

    const moodSelect = screen.getByDisplayValue('-- Select Mood --');
    fireEvent.change(moodSelect, { target: { value: '😊 Happy' } });

    const saveButton = screen.getByText('Save Mood');
    fireEvent.click(saveButton);

    // Should show the saved mood
    expect(screen.getByText('😊 Happy')).toBeInTheDocument();
  });

  it('saves journal entry when text is entered and save button is clicked', () => {
    renderWithRouter(<SheShinesPage />);

    const journalTextarea = screen.getByPlaceholderText('Today I felt...');
    fireEvent.change(journalTextarea, { target: { value: 'I felt grateful today' } });

    const saveButton = screen.getByText('Save Journal Entry');
    fireEvent.click(saveButton);

    // Should show the saved journal entry
    expect(screen.getByText('I felt grateful today')).toBeInTheDocument();
  });

  it('shows motivational message when message button is clicked', () => {
    renderWithRouter(<SheShinesPage />);

    const messageButton = screen.getByText('Message for You 💌');
    
    // Mock alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    fireEvent.click(messageButton);

    expect(alertMock).toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it('shows affirmation when affirmation button is clicked', () => {
    renderWithRouter(<SheShinesPage />);

    const affirmationButton = screen.getByText('Daily Affirmation 💫');
    
    // Mock alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    fireEvent.click(affirmationButton);

    expect(alertMock).toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it('generates PDF when generate button is clicked', () => {
    renderWithRouter(<SheShinesPage />);

    const generateButton = screen.getByText('Generate PDF');
    
    // Mock alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    fireEvent.click(generateButton);

    // Should show alert for no data
    expect(alertMock).toHaveBeenCalledWith('No saved entries to generate PDF.');
    alertMock.mockRestore();
  });

  it('toggles dark mode when dark mode button is clicked', () => {
    renderWithRouter(<SheShinesPage />);

    const darkModeButton = screen.getByText('Dark Mode');
    fireEvent.click(darkModeButton);

    // Button text should change
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });

  it('loads saved data from localStorage on mount', () => {
    const savedMoods = JSON.stringify([{ mood: '😊 Happy', date: '2024-01-01' }]);
    const savedJournals = JSON.stringify([{ journal: 'Test entry', date: '2024-01-01' }]);
    
    localStorageMock.getItem
      .mockReturnValueOnce(savedMoods)  // sheShines_moods
      .mockReturnValueOnce(savedJournals); // sheShines_journals

    renderWithRouter(<SheShinesPage />);

    // Should display saved data
    expect(screen.getByText('😊 Happy')).toBeInTheDocument();
    expect(screen.getByText('Test entry')).toBeInTheDocument();
  });
});
