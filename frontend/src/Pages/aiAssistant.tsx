import { useState, useEffect, useRef } from "react";
import { Trash2, Search, Send, AlertTriangle, FileText, BrainCircuit } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sources?: { source: string; name: string }[];
}

export default function ChatLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string>(uuidv4());
  const messagesEndRef = useRef<null | HTMLDivElement>(null);


  const sendMessageToApi = async (
    messageText: string,
    requestType: 'tutoring' | 'quiz_generation' | 'flashcard_creation'
  ) => {
    if (!messageText.trim() && requestType === 'tutoring') return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://nutnell-directed-backend-host.hf.space/api/assistant/chat/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'direct-ed-ai-secret-key-12345',
        },
        body: JSON.stringify({
          input: {
            input: messageText,
            user_type: "student",
            request_type: requestType,
            subject: messageText,
            difficulty_level: "beginner"
          },
          config: {
            configurable: {
              session_id: sessionIdRef.current,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = {
        sender: 'assistant',
        text: data.output.answer,
        sources: data.output.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setMessages((prev) => [...prev, { sender: 'assistant', text: `Sorry, something went wrong: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessageToApi(newMessage, 'tutoring');
  };

  const handleQuickAction = (action: 'quiz_generation' | 'flashcard_creation') => {
    const topic = newMessage.trim() || "the last topic discussed";
    sendMessageToApi(`Please generate ${action === 'quiz_generation' ? 'a quiz' : 'flashcards'} on ${topic}`, action);
  };

  const handleDelete = () => {
    setMessages([]);
    sessionIdRef.current = uuidv4();
  };

  const handleSearch = () => {
   
    alert(`Searching for: ${searchQuery}`);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-purple-50 rounded-2xl shadow-md p-6 grid grid-cols-4 gap-6 w-full max-w-7xl h-[90vh] mx-auto">

      <div className="col-span-1 flex flex-col h-full">
        <div className="bg-[#A46FCC] rounded-md p-4 flex-1 flex flex-col">
          <div className="bg-white text-black text-base font-[Montserrat] rounded p-2">
            Recent Chats
          </div>
          <ul className="mt-4 text-white text-base space-y-1 overflow-y-auto flex-1">
            {messages.filter(m => m.sender === 'user').length > 0 ? (
              messages.filter(m => m.sender === 'user').map((msg, i) => (
                <li key={i} className="truncate p-1 rounded cursor-pointer">
                  • {msg.text}
                </li>
              ))
            ) : (
              <li>No chats yet...</li>
            )}
          </ul>
        </div>
      </div>

      
      <div className="col-span-3 flex flex-col h-full overflow-hidden"> 
        <div className="w-full flex justify-end items-center gap-4">
          <AlertTriangle className="text-red-500 w-7 h-7" />
          <button onClick={handleDelete}>
            <Trash2 className="w-7 h-7 hover:text-red-700" style={{ color: "#082567" }} />
          </button>
          <div className="flex items-center bg-[#A46FCC] rounded-md px-3 py-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent placeholder-white text-white focus:outline-none"
            />
            <button onClick={handleSearch}>
              <Search className="text-white w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border bg-white border-gray-200 p-6 rounded-lg mt-2 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-lg text-base border-l-4 ${msg.sender === 'user' ? 'bg-[#A46FCC] text-white border-purple-700' : 'bg-gray-100 text-[#424242] border-purple-400'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <h4 className="text-xs font-bold mb-1">Sources:</h4>
                      <ul className="text-xs space-y-1">
                        {msg.sources.map((source, idx) => (
                          <li key={idx}>
                            <a href={source.source} target="_blank" rel="noopener noreferrer" className={`underline ${msg.sender === 'user' ? 'hover:text-gray-200' : 'hover:text-gray-500'}`}>
                              {source.name || 'Link'}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-base">No messages yet. Ask a question to begin!</p>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg border-l-4 border-purple-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

      
        <div className="mt-4">
          {error && <div className="text-red-500 text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16} /> {error}</div>}
          <div className="flex items-center justify-end gap-2 mb-2 text-sm text-gray-500">
            <button onClick={() => handleQuickAction('quiz_generation')} className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-200">
              <FileText size={14} /> Generate Quiz
            </button>
            <button onClick={() => handleQuickAction('flashcard_creation')} className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-200">
              <BrainCircuit size={14} /> Create Flashcards
            </button>
          </div>
          <div className="flex items-center border-2 border-[#A46FCC] rounded p-2 bg-white">
            <textarea
              placeholder="Type a new message here"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              className="flex-1 resize-none outline-none text-[#424242] p-2 rounded text-base bg-transparent"
              rows={1}
            />
            <button onClick={handleSend} disabled={isLoading}>
              <Send className="text-[#A46FCC] w-7 h-7 ml-3 hover:opacity-80 disabled:opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
