import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Sparkles,
  Check,
} from 'lucide-react';
import { uploadToCloudinary, getCloudinaryConfig } from '../../lib/cloudinary';

export interface CloudinaryImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded?: (url: string) => void;
  onUploadSuccess?: (url: string) => void;
  label?: string;
  buttonLabel?: string;
  folder?: string;
}

const TECH_PRESET_IMAGES = [
  {
    name: 'AI / Neural Network',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Cyber Dashboard',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Cloud Infrastructure',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Code & Terminal',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Futuristic Grid',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Mobile App / UX',
    url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1200&auto=format&fit=crop',
  },
];

export const CloudinaryImageUploader: React.FC<CloudinaryImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  onUploadSuccess,
  label = 'Project Image / Banner',
  buttonLabel,
  folder = 'akash_portfolio',
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [urlInput, setUrlInput] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');

  const config = getCloudinaryConfig();
  const isCloudinaryConfigured = Boolean(config.cloudName && config.uploadPreset);

  const notifyUrl = (url: string) => {
    setPreviewUrl(url);
    if (onImageUploaded) onImageUploaded(url);
    if (onUploadSuccess) onUploadSuccess(url);
  };

  // Convert uploaded image to compressed Base64 Data URL as reliable zero-setup fallback
  const compressImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 900;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccessMsg(null);
    setIsUploading(true);

    try {
      if (isCloudinaryConfigured) {
        try {
          const result = await uploadToCloudinary(file);
          notifyUrl(result.url);
          setUploadSuccessMsg('Uploaded to Cloudinary!');
          setIsUploading(false);
          return;
        } catch (cloudErr) {
          console.warn('Cloudinary upload failed, falling back to local compressed base64:', cloudErr);
        }
      }

      // Fallback to high-quality compressed Base64
      const base64Data = await compressImageToBase64(file);
      notifyUrl(base64Data);
      setUploadSuccessMsg('Image ready & attached!');
    } catch (err: unknown) {
      console.error('Upload processing failed:', err);
      const msg = err instanceof Error ? err.message : 'Image processing failed';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualUrlSave = () => {
    if (urlInput.trim()) {
      notifyUrl(urlInput.trim());
      setUrlInput('');
      setUploadSuccessMsg('URL applied!');
    }
  };

  return (
    <div className="space-y-2.5 p-3 rounded-2xl bg-black/40 border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-slate-300">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label}</span>
        </span>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${
              mode === 'upload' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${
              mode === 'url' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct URL
          </button>
          <button
            type="button"
            onClick={() => setMode('presets')}
            className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'presets' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload */}
      {mode === 'upload' && (
        <div className="flex items-center gap-3">
          <label className="flex-1 flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-white/20 hover:border-cyan-400/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono-tech">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Image...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-300 group-hover:text-cyan-300 text-xs font-mono-tech">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{buttonLabel || 'Choose Local Image File (Auto-Optimized)'}</span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image link: https://images.unsplash.com/..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="button"
            onClick={handleManualUrlSave}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs font-mono-tech hover:scale-105 transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* Mode 3: Curated Tech Presets */}
      {mode === 'presets' && (
        <div className="grid grid-cols-3 gap-2">
          {TECH_PRESET_IMAGES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => notifyUrl(preset.url)}
              className={`p-1.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                previewUrl === preset.url
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="h-12 w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-mono-tech text-slate-300 truncate w-full">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Live Preview & Status */}
      {previewUrl && (
        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
          <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-cyan-400/40 flex-shrink-0 bg-slate-900 shadow-md">
            <img
              src={previewUrl}
              alt="Preview banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <span className="text-emerald-400 font-mono-tech flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Image Attached</span>
            </span>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              {previewUrl.startsWith('data:') ? 'Embedded Base64 Image' : previewUrl}
            </p>
          </div>
        </div>
      )}

      {uploadSuccessMsg && (
        <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-mono-tech">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-1.5 p-2 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-300 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
