import { useState, useRef, useEffect } from 'react';
import type { DiagnosticResponse, DiscoveryChatResponse } from '@shared/models';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DiagnosticChatProps {
  initialProblem?: string;
  onComplete: (diagnostic: DiagnosticResponse, sessionId: string) => void;
}

export default function DiagnosticChat({ initialProblem, onComplete }: DiagnosticChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Send initial problem on mount
  useEffect(() => {
    if (initialProblem && messages.length === 0) {
      sendMessage(initialProblem);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading || isComplete) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBase}/discovery/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: DiscoveryChatResponse = await response.json();

      // Update session ID
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If diagnosis is ready, signal completion
      if (data.phase === 'diagnosis' && data.diagnostic) {
        setIsComplete(true);
        onComplete(data.diagnostic, data.sessionId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-sm text-center border-b border-outline-variant bg-surface-dim">
        <span className="font-mono text-label-sm text-on-surface-variant">
          {'>'} <span className="text-primary">Binary Diagnostic</span> · fase:{' '}
          <span className="text-primary">{isComplete ? 'DIAGNÓSTICO' : 'ENTREVISTA'}</span>
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !initialProblem && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-4 block">
                psychology
              </span>
              <p className="font-mono text-body-md text-on-surface-variant">
                Descreva o problema que gostaria de resolver.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-surface border border-outline-variant rounded-tr-none shadow-hard'
                  : 'bg-surface border border-primary-container rounded-tl-none'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 text-primary font-mono text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    terminal
                  </span>
                  CB_DIAGNÓSTICO
                </div>
              )}
              <div className="font-mono text-body-sm text-on-surface whitespace-pre-wrap">
                {msg.content}
              </div>
              <span className="font-mono text-label-sm text-on-surface-variant block mt-2 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-primary-container rounded-lg rounded-tl-none p-4">
              <div className="flex items-center gap-2 mb-2 text-primary font-mono text-label-sm">
                <span className="material-symbols-outlined text-[16px]">
                  terminal
                </span>
                CB_DIAGNÓSTICO
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {!isComplete && (
        <div className="p-4 bg-surface-dim border-t border-outline-variant">
          <div className="flex items-end gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-2 focus-within:border-primary-container focus-within:shadow-glow transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="> Responder..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none font-mono text-body-sm text-on-surface placeholder-outline min-h-[44px] max-h-32 py-2 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="bg-primary-container text-on-primary-container p-2 rounded hover:bg-surface-container-high border border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
