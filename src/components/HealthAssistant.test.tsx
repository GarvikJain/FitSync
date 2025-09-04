import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HealthAssistant from './HealthAssistant';

// Mock the environment variable
const mockEnv = {
  VITE_GEMINI_API_KEY: 'test-api-key'
};

// Mock fetch
global.fetch = jest.fn();

describe('HealthAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the health assistant component', () => {
    render(<HealthAssistant />);
    
    expect(screen.getByText('Health Assistant')).toBeInTheDocument();
    expect(screen.getByText('Get wellness tips and health guidance')).toBeInTheDocument();
  });

  it('displays quick questions', () => {
    render(<HealthAssistant />);
    
    expect(screen.getByText('How can I improve my sleep?')).toBeInTheDocument();
    expect(screen.getByText('What are some stress management techniques?')).toBeInTheDocument();
    expect(screen.getByText('Tips for maintaining a healthy diet')).toBeInTheDocument();
  });

  it('shows initial welcome message', () => {
    render(<HealthAssistant />);
    
    expect(screen.getByText(/Hello! I'm your friendly health information assistant/)).toBeInTheDocument();
  });

  it('displays medical disclaimer', () => {
    render(<HealthAssistant />);
    
    expect(screen.getByText('For medical advice, consult a healthcare professional')).toBeInTheDocument();
  });

  it('allows typing in the input field', () => {
    render(<HealthAssistant />);
    
    const textarea = screen.getByPlaceholderText('Ask me about health and wellness...');
    fireEvent.change(textarea, { target: { value: 'How can I improve my sleep?' } });
    
    expect(textarea).toHaveValue('How can I improve my sleep?');
  });

  it('clicking quick question fills the input', () => {
    render(<HealthAssistant />);
    
    const quickQuestion = screen.getByText('How can I improve my sleep?');
    fireEvent.click(quickQuestion);
    
    const textarea = screen.getByPlaceholderText('Ask me about health and wellness...');
    expect(textarea).toHaveValue('How can I improve my sleep?');
  });
});

