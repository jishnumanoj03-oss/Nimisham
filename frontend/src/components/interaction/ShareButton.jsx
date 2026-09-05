import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ShareButton = ({ title, text, url, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Nimisham Content',
          text: text || 'Check out this content on Nimisham',
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center p-2 rounded-full transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200 ${className}`}
      title="Share"
    >
      {copied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
    </button>
  );
};

export default ShareButton;
