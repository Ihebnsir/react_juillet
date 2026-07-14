import { useRef, useState, useEffect } from 'react';
import { FiCamera, FiX } from 'react-icons/fi';
import fileToBase64 from '../../utils/fileToBase64';

export const AvatarUpload = ({ value, onChange, maxSizeMB = 2 }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || '');

  useEffect(() => setPreview(value || ''), [value]);

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Type d\'image non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Le fichier dépasse ${maxSizeMB} MB.`);
      return;
    }
    try {
      const b64 = await fileToBase64(file);
      setPreview(b64);
      onChange && onChange(b64);
    } catch (err) {
      console.error(err);
      alert('Impossible de lire le fichier.');
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange && onChange('');
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-400">A</div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <div className="flex gap-2">
          <button type="button" onClick={handlePick} className="px-3 py-2 rounded-lg border bg-white text-sm flex items-center gap-2">
            <FiCamera /> Choisir
          </button>
          {preview && (
            <button type="button" onClick={handleRemove} className="px-3 py-2 rounded-lg border bg-white text-sm flex items-center gap-2">
              <FiX /> Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
