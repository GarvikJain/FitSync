import { getFunctions, httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Initialize Firebase Functions
const firebaseFunctions = getFunctions(functions);

// Cloud Function interfaces
interface PostTeamMessageData {
  teamId: string;
  message: string;
  messageType?: 'text' | 'image' | 'file';
  replyTo?: string;
}

interface PostTeamMessageResponse {
  success: boolean;
  messageId: string;
  timestamp: string;
}

interface GetTeamMessagesData {
  teamId: string;
  limit?: number;
  startAfter?: unknown;
}

interface GetTeamMessagesResponse {
  success: boolean;
  messages: unknown[];
  hasMore: boolean;
  lastDoc?: unknown;
}

// Cloud Function callables
const postTeamMessageCallable = httpsCallable<PostTeamMessageData, PostTeamMessageResponse>(
  firebaseFunctions,
  'postTeamMessage'
);

const getTeamMessagesCallable = httpsCallable<GetTeamMessagesData, GetTeamMessagesResponse>(
  firebaseFunctions,
  'getTeamMessages'
);


// Helper functions for calling Cloud Functions
export const functionsService = {
  // Post a message to a team chat
  async postTeamMessage(data: PostTeamMessageData): Promise<PostTeamMessageResponse> {
    try {
      const result = await postTeamMessageCallable(data);
      return result.data;
    } catch (error: any) {
      console.error('Error posting team message:', error);
      throw new Error(error.message || 'Failed to post message');
    }
  },

  // Get team messages with pagination
  async getTeamMessages(data: GetTeamMessagesData): Promise<GetTeamMessagesResponse> {
    try {
      const result = await getTeamMessagesCallable(data);
      return result.data;
    } catch (error: any) {
      console.error('Error getting team messages:', error);
      throw new Error(error.message || 'Failed to get messages');
    }
  },

  // Health check function
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    try {
      const response = await fetch('/api/healthCheck');
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Health check failed');
    }
  },

};

// Note: Real-time listeners have been moved to separate files to avoid circular dependencies
// and TypeScript issues. Use the dedicated listener files in the lib directory.

// Error handling utilities
export const handleFunctionError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    const errorObj = error as { code: string; message?: string };
    switch (errorObj.code) {
      case 'unauthenticated':
        return 'Please sign in to continue';
      case 'permission-denied':
        return 'You do not have permission to perform this action';
      case 'not-found':
        return 'The requested resource was not found';
      case 'invalid-argument':
        return errorObj.message || 'Invalid input provided';
      case 'internal':
        return 'An internal error occurred. Please try again later';
      default:
        return errorObj.message || 'An unexpected error occurred';
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'An unexpected error occurred';
};

// Utility to check if user is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Utility to retry function calls
export const retryFunction = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

export default functionsService;

