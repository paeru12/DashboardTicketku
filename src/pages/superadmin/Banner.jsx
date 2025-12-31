import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Upload } from 'lucide-react';
import { confirmAlert, successAlert, errorAlert } from "@/lib/alert"; // Sesuaikan path alert Anda
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Mock banner data
const mockBanners = [
  {
    id: '1',
    title: 'New Year Event 2025',
    imageUrl: 'https://pin.it/5XOKzI2HW',
    link: 'https://example.com',
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
];

export default function Banner() {
  const [banners, setBanners] = useState(mockBanners);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    isActive: 'true', // string untuk radio button logic
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
        if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, isActive: newStatus === 'active' } : b
    ));
    successAlert('Berhasil', 'Status banner berhasil diperbarui');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Nama banner wajib diisi';
    if (!formData.imageUrl) newErrors.imageUrl = 'Gambar wajib diunggah';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newBanner = {
        id: String(Date.now()),
        title: formData.title,
        link: formData.link,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive === 'true',
        createdAt: new Date().toISOString(),
      };
      
      setBanners([newBanner, ...banners]);
      await successAlert('Berhasil', 'Banner berhasil ditambahkan');
      
      // KIRIM PARAMETER TRUE DISINI
      handleCloseDialog(true); 

    } catch (error) {
      errorAlert('Gagal', 'Gagal menambahkan banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await confirmAlert({
      title: 'Hapus Banner?',
      text: 'Apakah Anda yakin ingin menghapus banner ini?',
      confirmText: 'Ya, Hapus'
    });

    if (res.isConfirmed) {
      setBanners(banners.filter(b => b.id !== id));
      successAlert('Berhasil', 'Banner berhasil dihapus');
    }
  };

  const handleCloseDialog = async (isSuccess = false) => {
    // Jika isSuccess true, langsung tutup. 
    // Jika false (diklik manual), baru cek apakah perlu konfirmasi.
    if (!isSuccess && (formData.title || formData.imageUrl)) {
      const res = await confirmAlert({
        title: 'Batal?',
        text: 'Data yang Anda masukkan akan hilang.',
        confirmText: 'Ya, Batal'
      });
      if (!res.isConfirmed) return;
    }
    
    // Reset State
    setUploadDialogOpen(false);
    setFormData({ title: '', link: '', isActive: 'true', imageUrl: '' });
    setImagePreview(null);
    setErrors({});
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => <div className="font-medium">{row.title}</div>,
    },
    {
      key: 'imageUrl',
      label: 'Image',
      render: (row) => <img src={row.imageUrl} alt={row.title} className="h-12 w-20 object-cover rounded" />,
    },
    {
      key: 'link',
      label: 'Link',
      render: (row) => <span className="text-sm text-muted-foreground">{row.link || '-'}</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => {
        const isActive = row.isActive;
        return (
          <select
            value={isActive ? 'active' : 'inactive'}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className={`text-xs font-bold border rounded-full px-3 py-1 focus:outline-none transition-colors cursor-pointer
              ${isActive 
                ? 'bg-green-100 text-green-700 border-green-300' 
                : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        );
      },
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Banner Management"
        description="Manage platform banners"
        action={
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Upload Banner
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={banners} loading={false} />
      )}

      <Dialog open={uploadDialogOpen} onOpenChange={(val) => !val ? handleCloseDialog() : setUploadDialogOpen(true)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Banner</DialogTitle>
            <DialogDescription>Tambahkan banner baru untuk ditampilkan di platform</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Nama Banner *</label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                }}
                placeholder="Masukkan nama banner"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Link Input (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">Link (Opsional)</label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            {/* Is Active Radio */}
            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    checked={formData.isActive === 'true'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    checked={formData.isActive === 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Inactive</span>
                </label>
              </div>
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload Image *</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${errors.imageUrl ? "border-red-500 bg-red-50" : "border-input"}`}>
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded mx-auto" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ubah gambar
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className={`h-8 w-8 mx-auto mb-2 ${errors.imageUrl ? "text-red-400" : "text-muted-foreground"}`} />
                    <p className="text-sm font-medium">Klik untuk upload gambar</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (maks 5MB)</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
              {errors.imageUrl && <p className="text-xs text-red-500 mt-1">{errors.imageUrl}</p>}
            </div>

            <div className="flex gap-3 justify-between pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}