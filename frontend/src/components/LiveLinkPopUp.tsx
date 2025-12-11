import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface LiveLinkPopUpProps {
  url: string;
  onClose: () => void;
}

const LiveLinkPopUp: React.FC<LiveLinkPopUpProps> = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Your Page is Live 🚀</h3>
        <p className="text-sm text-gray-500 mt-1">
          Share this URL with candidates to start hiring.
        </p>
      </div>

      {/* URL Input & Copy */}
      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded border border-gray-200 mb-6">
        <input 
          type="text" 
          readOnly 
          value={url} 
          className="bg-transparent w-full text-sm text-gray-600 focus:outline-none"
        />
        <button 
          onClick={handleCopy}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase px-2"
        >
          {copied ? <span className="text-green-600">Copied</span> : 'Copy'}
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
        >
          Close
        </button>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          View Live Page
        </a>
      </div>
    </div>
  )
}

export default LiveLinkPopUp