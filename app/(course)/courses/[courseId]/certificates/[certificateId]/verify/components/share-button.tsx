'use client';

import { useState } from 'react';
import { Copy, Share2, Check } from 'lucide-react';

export default function CopyShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificado Verificado',
          text: 'Certificado verificado de AulaSTEAM',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            ¡Copiado!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copiar enlace
          </>
        )}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
      >
        <Share2 className="w-4 h-4" />
        Compartir
      </button>
    </div>
  );
}