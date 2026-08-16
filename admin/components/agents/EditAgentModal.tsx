'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateAgent, Agent } from '@/store/slices/agentSlice';
import toast from 'react-hot-toast';
import { X, Upload, Save } from 'lucide-react';

interface Props {
  agent: Agent | null;
  onClose: () => void;
}

export default function EditAgentModal({ agent, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { updateLoading } = useAppSelector((s) => s.agents);
  const [form, setForm] = useState({ name: '', whatsapp: '', status: 'active' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (agent) {
      setForm({ name: agent.name, whatsapp: agent.whatsapp, status: agent.status });
      setImagePreview(agent.image?.url || null);
      setImageFile(null);
    }
  }, [agent]);

  if (!agent) return null;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('whatsapp', form.whatsapp);
    fd.append('status', form.status);
    if (imageFile) fd.append('image', imageFile);

    const result = await dispatch(updateAgent({ id: agent._id, formData: fd }));
    if (updateAgent.fulfilled.match(result)) {
      toast.success('Agent updated successfully');
      onClose();
    } else {
      toast.error((result.payload as string) || 'Failed to update agent');
    }
  };

  const inputStyle = {
    background: 'var(--gray)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    color: 'var(--dark)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--white)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--dark)' }}>Edit Agent</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Photo</label>
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="w-16 h-16 rounded-xl object-cover" style={{ border: '1px solid var(--border)' }} />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {agent.name[0]}
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: '#374151' }}>
                <Upload size={14} />
                Change
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">WhatsApp</label>
            <input type="text" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} required style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-all" style={{ borderColor: 'var(--border)', color: '#374151' }}>
              Cancel
            </button>
            <button type="submit" disabled={updateLoading} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60" style={{ background: 'var(--primary)' }}>
              {updateLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
