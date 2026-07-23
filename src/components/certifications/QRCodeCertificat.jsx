import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function QRCodeCertificat({ certificationId, taille = 120 }) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const url = `${baseUrl}/verifier-certificat/${certificationId}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <QRCodeSVG
          value={url}
          size={taille}
          bgColor="#FFFFFF"
          fgColor="#0F172A"
          level="H"
          includeMargin={false}
        />
      </div>
      <p className="max-w-[140px] text-center text-[10px] text-slate-400">
        Scannez pour vérifier l’authenticité
      </p>
    </div>
  );
}

export default QRCodeCertificat;
