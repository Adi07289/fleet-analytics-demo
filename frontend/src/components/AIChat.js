import React, { useState, useRef, useEffect } from 'react';
import { fleetAPI } from '../api';

const Message = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-800'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'fuel', label: '⛽ Fuel Efficiency', query: 'How is our fuel efficiency?' },
    { id: 'maintenance', label: '🔧 Maintenance Status', query: 'What vehicles need maintenance?' },
    { id: 'costs', label: '💰 Cost Analysis', query: 'Show me cost analysis' },
    { id: 'alerts', label: '🚨 Current Alerts', query: 'What are the current alerts?' },
    { id: 'performance', label: '📊 Fleet Performance', query: 'How is fleet performance?' },
    { id: 'savings', label: '💡 Optimization Tips', query: 'How can we save costs?' }
  ];

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Quick Actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.query)}
            className="text-left p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-200 rounded-lg px-4 py-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Fleet Intelligence Assistant. I can help you with fleet analytics, maintenance scheduling, fuel efficiency insights, and cost optimization. How can I assist you today?",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to AI API
      const response = await fleetAPI.sendChatMessage(message);
      
      // Add AI response
      setMessages(prev => [...prev, { text: response.response, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (query) => {
    sendMessage(query);
  };

  const clearChat = () => {
    setMessages([
      {
        text: "Chat cleared! How can I help you with your fleet management today?",
        isUser: false
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">🤖 AI Fleet Assistant</h2>
              <p className="text-blue-100 text-sm">Intelligent insights for your fleet</p>
            </div>
            <button
              onClick={clearChat}
              className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-6 bg-gray-50">
          {messages.map((message, index) => (
            <Message key={index} message={message.text} isUser={message.isUser} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 bg-white border-t border-gray-200">
          <QuickActions onActionClick={handleQuickAction} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about fuel efficiency, maintenance, costs, or fleet performance..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            💡 Try asking about fuel trends, maintenance schedules, cost savings, or fleet optimization tips
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">📊</span>
            <h3 className="font-semibold text-gray-900">Analytics Insights</h3>
          </div>
          <p className="text-sm text-gray-600">
            Get real-time analytics and performance insights for your entire fleet
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🔮</span>
            <h3 className="font-semibold text-gray-900">Predictive Maintenance</h3>
          </div>
          <p className="text-sm text-gray-600">
            AI-powered predictions to prevent breakdowns and optimize maintenance schedules
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">💰</span>
            <h3 className="font-semibold text-gray-900">Cost Optimization</h3>
          </div>
          <p className="text-sm text-gray-600">
            Identify cost-saving opportunities and optimize fuel efficiency across your fleet
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;