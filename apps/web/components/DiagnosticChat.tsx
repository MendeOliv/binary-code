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

type PhaseLabel = 'READY TO DIAGNOSE' | 'ANALYSING SYSTEM…' | 'SYSTEM ANALYSIS' | 'DIAGNOSIS READY';

function getPhaseLabel(isLoading: boolean, isComplete: boolean): PhaseLabel {
  if (isComplete) return 'DIAGNOSIS READY';
  if (isLoading) return 'ANALYSING SYSTEM…';
  return 'READY TO DIAGNOSE';
}

export default function DiagnosticChat({ initialProblem, onComplete }: DiagnosticChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

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

    fetch('/api/discovery/chat', {
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
        setHasResponded(true);
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
        setHasResponded(true);
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
      const response = await fetch('/api/discovery/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setHasResponded(true);
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
    } catch (error) {
      console.error('Error sending message:', error);
      setHasResponded(true);
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

  const phaseLabel = getPhaseLabel(isLoading, isComplete);

  return (
    <div className="flex flex-col h-full">
      {/* System status header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container-lowest">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                isLoading ? 'bg-primary animate-ping opacity-60' : 'bg-primary'
              }`}
            />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="font-mono text-label-sm text-on-surface-variant uppercase tracking-widest">
            CB // SILENT INTERVIEW
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 bg-surface rounded-full ${
              isComplete ? 'bg-primary' : 'bg-outline'
            }`}
          />
          <span
            className={`font-mono text-label-sm uppercase tracking-widest ${
              isComplete ? 'text-primary' : 'text-outline'
            }`}
          >
            {phaseLabel}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-8 space-y-6" aria-live="polite">
        {messages.length === 0 && !initialProblem && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center px-3 py-1 bg-surface-container text-primary border border-outline-variant font-mono text-label-sm uppercase tracking-widest">
                  [SYS.READY]
                </span>
              </div>
              <p className="font-mono text-body-md text-on-surface-variant leading-relaxed">
                Está dentro de um sistema de diagnóstico. Descreva o problema que gostaria de
                resolver — em linguagem natural, sem preparação técnica.
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
              className={`max-w-[85%] md:max-w-[70%] ${
                msg.role === 'user'
                  ? 'bg-surface-container text-on-surface border border-outline-variant'
                  : 'bg-surface-container-low text-on-surface border border-outline-variant'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 px-4 pt-3 text-primary font-mono text-label-sm uppercase tracking-widest border-b border-outline-variant/50 pb-2 mb-2">
                  <span className="material-symbols-outlined text-[15px]">terminal</span>
                  CB_SYSTEM
                </div>
              )}
              {msg.role === 'user' && (
                <div className="flex items-center justify-end gap-2 px-4 pt-3 text-on-surface-variant font-mono text-label-sm uppercase tracking-widest pb-2">
                  INPUT
                </div>
              )}
              <div className="px-4 pb-3 pt-1 font-mono text-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>
              <span className="block px-4 pb-3 font-mono text-label-sm text-outline text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Processing / thinking indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-container-low border border-outline-variant px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
                  <span
                    className="w-1.5 h-1.5 bg-primary animate-pulse"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-primary animate-pulse"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant uppercase tracking-widest">
                  THINKING…
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {!isComplete && (
        <div className="px-5 py-4 bg-surface-container-lowest border-t border-outline-variant">
          <div className="max-w-3xl mx-auto">
            {hasResponded && messages.length > 0 && (
              <p className="mb-2 font-mono text-label-sm text-outline uppercase tracking-widest">
                {isLoading ? 'PROCESSANDO…' : 'DESCREVA MAIS DETALHES'}
              </p>
            )}
            <div className="flex items-end gap-2 bg-surface-container border border-outline-variant focus-within:border-primary focus-within:shadow-glow transition-all p-1.5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`> Descreva o problema...`}
                rows={1}
                aria-label="Descreva o seu problema operacional ou técnico"
                className="flex-1 bg-transparent resize-none font-mono text-body-md text-on-surface placeholder-outline min-h-[48px] max-h-40 py-2.5 px-3 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-primary-container text-on-primary-container p-3 hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Enviar"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}