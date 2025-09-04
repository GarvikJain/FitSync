# Health Assistant Setup Guide

## Overview
The Health Assistant is an AI-powered wellness information assistant integrated into the MindBody Hub application. It uses Google's Gemini API to provide general health and wellness guidance to users.

## Features
- Real-time health information and wellness tips
- Interactive chat interface
- Quick question suggestions
- Professional medical disclaimers
- Responsive design that matches the wellness theme

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory with your Gemini API key:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Getting a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

### 3. Running the Application
```bash
npm install
npm run dev
```

## Usage
- The Health Assistant appears as a card at the bottom of the main dashboard
- Users can type health-related questions in the text area
- Quick question badges provide instant access to common wellness topics
- All responses include appropriate medical disclaimers

## Safety Features
- Built-in disclaimers for medical advice
- Clear guidance to consult healthcare professionals for specific concerns
- Focus on general wellness and prevention rather than diagnosis
- Professional and empathetic tone

## Technical Details
- Built with React and TypeScript
- Uses the Gemini Pro model via REST API
- Integrated with the existing wellness design system
- Responsive design for all screen sizes
- Real-time chat interface with message history

## Security Notes
- API key is stored in environment variables
- No sensitive health data is stored locally
- All interactions are stateless
- Appropriate error handling for API failures

## Customization
The Health Assistant can be customized by:
- Modifying the system prompt in the component
- Adding more quick question suggestions
- Adjusting the response generation parameters
- Customizing the UI styling to match your brand


