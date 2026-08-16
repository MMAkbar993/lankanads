'use client';
import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createAgent } from '@/store/slices/agentSlice';
import toast from 'react-hot-toast';
import { Upload, X, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function CreateAgentPage() {
  const dispatch = useAppDispatch();
  const { createLoading } = useAppSelector((s) => s.agents);

  const [form, setForm] = useState({ name: '', whatsapp: '', status: 'active' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('whatsapp', form.whatsapp);
    fd.append('status', form.status);
    if (imageFile) fd.append('image', imageFile);

    const result = await dispatch(createAgent(fd));
    if (createAgent.fulfilled.match(result)) {
      toast.success('Agent created successfully');
      setForm({ name: '', whatsapp: '', status: 'active' });
      removeImage();
    } else {
      toast.error((result.payload as string) || 'Failed to create agent');
    }
  };

  const inputStyle = {
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    color: 'var(--dark)',
    transition: 'border-color 0.15s',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: 'var(--dark)' }}>Create Agent</h1>
        <p className="text-sm text-gray-400 mt-0.5">Add a new agent to the Lankan Ads platform.</p>
      </div>

      <div className="rounded-xl shadow-sm" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--primary)' }}>
              <UserPlus size={16} />
            </div>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--dark)' }}>Agent Details</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Agent Photo</label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-xl object-cover" style={{ border: '2px solid var(--border)' }} />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed transition-all hover:border-pink-400 hover:bg-pink-50"
                style={{ borderColor: 'var(--border)' }}
              >
                <Upload size={18} className="text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Upload</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Agent Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Kasun Perera"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">WhatsApp Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              required
              placeholder="+94 77 123 4567"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={createLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: 'var(--primary)' }}
              onMouseEnter={(e) => !createLoading && ((e.currentTarget as HTMLElement).style.background = 'var(--primary-hover)')}
              onMouseLeave={(e) => !createLoading && ((e.currentTarget as HTMLElement).style.background = 'var(--primary)')}
            >
              {createLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus size={15} />}
              {createLoading ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
