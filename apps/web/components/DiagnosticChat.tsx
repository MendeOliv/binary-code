import { useState, useRef, useEffect } from 'react';
import type { DiagnosticResponse } from '@shared/models';

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
  const [sessionId, setSessionId] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Send initial problem on mount — ref guard prevents duplicate dispatch
  const initialProblemSentRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!initialProblem || initialProblemSentRef.current) return;
    initialProblemSentRef.current = true;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: initialProblem,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([userMessage]);
    setIsLoading(true);

    fetch('/api/diagnostic/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: initialProblem }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.sessionId) setSessionId(data.sessionId);
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (data.phase === 'diagnosis' && data.diagnostic) {
          setIsComplete(true);
          onCompleteRef.current(data.diagnostic, data.sessionId);
        }
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [initialProblem]);

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
      const response = await fetch('/api/diagnostic/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

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
        onCompleteRef.current(data.diagnostic, data.sessionId);
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
      <div className="pSpaceSm text-center border-b borderOutlineVariant bgSurfaceDim">
        <span className="fontMono textLabelSm textOnSurfaceVariant">
          {'>'} <span className="textPrimary">Binary Diagnostic</span> · fase:{' '}
          <span className="textPrimary">{isComplete ? 'DIAGNÓSTICO' : 'ENTREVISTA'}</span>
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !initialProblem && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl textOutline mb-4 block">
                psychology
              </span>
              <p className="fontMono textBodyMd textOnSurfaceVariant">
                Descreva o problema que gostaria de resolver.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-4 roundedSurface ${msg.role === 'user' ? 'border borderOutlineVariant rounded-tr-none' : 'border borderPrimaryContainer rounded-tl-none'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 textPrimary fontMono textLabelSm">
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                  CB_DIAGNÓSTICO
                </div>
              )}
              <div className="fontMono textBodySm textOnSurface whitespace-pre-wrap">
                {msg.content}
              </div>
              <span className="fontMono textLabelSm textOnSurfaceVariant block mt-2 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bgSurfaceContainer border borderSurfaceContainerHigh rounded-lg roundedTlNone p-4">
              <div className="flex items-center gap-2 mb-2 textPrimary fontMono textLabelSm">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                CB_DIAGNÓSTICO
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bgPrimary animate-pulse" />
                <div className="w-2 h-2 rounded-full bgPrimary animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bgPrimary animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {!isComplete && (
        <div className="p-4 bgSurfaceDim borderT borderOutlineVariant">
          <div className="flex items-end gap-2 bgSurfaceContainerLowest border borderOutlineVariant rounded-lg p-2 focusWithIn:borderPrimaryContainer focusWithIn:shadowGlow transitionAll">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="> Responder..."
              rows={1}
              className="flex-1 bgTransparent borderNone focusRing0 resize-none fontMono textBodySm textOnSurface placeholderOutline min-h-[44px] max-h-32 py-2 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="bgPrimaryContainer textOnPrimaryContainer p-2 rounded hover:bgSurfaceContainerHigh border borderPrimary transitionColours disabled:opacity-50 disabled:cursorNotAllowed"
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
