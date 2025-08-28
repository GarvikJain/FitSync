import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

// Mock the Sheet components
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div data-testid="sheet" data-open={open}>
      {children}
    </div>
  ),
  SheetContent: ({ children, side }: any) => (
    <div data-testid="sheet-content" data-side={side}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: any) => (
    <div data-testid="sheet-header">
      {children}
    </div>
  ),
  SheetTitle: ({ children }: any) => (
    <div data-testid="sheet-title">
      {children}
    </div>
  ),
  SheetTrigger: ({ children }: any) => (
    <div data-testid="sheet-trigger">
      {children}
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  it('renders desktop navigation on large screens', () => {
    renderWithRouter(<Navbar />);
    
    // Should show desktop navigation
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Wellness')).toBeInTheDocument();
  });

  it('renders hamburger menu button for mobile', () => {
    renderWithRouter(<Navbar />);
    
    // Should show hamburger menu button
    expect(screen.getByLabelText('Toggle navigation menu')).toBeInTheDocument();
  });

  it('renders sheet component for mobile navigation', () => {
    renderWithRouter(<Navbar />);
    
    // Should render the sheet component
    expect(screen.getByTestId('sheet')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-header')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-title')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
  });

  it('shows correct sheet title', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText('WellnessHub Menu')).toBeInTheDocument();
  });

  it('includes all navigation items', () => {
    renderWithRouter(<Navbar />);
    
    const expectedItems = [
      'Dashboard', 'Profile', 'Wellness', 'Health', 'Assistant',
      'Music', 'Games', 'Rewards', 'News', 'She Shines'
    ];
    
    expectedItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(<Navbar />);
    
    const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Toggle navigation menu');
  });
});
