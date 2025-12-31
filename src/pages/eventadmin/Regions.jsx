import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RichTextEditor from '@/components/common/RichTextEditor';
import TagInput from '@/components/ui/tagsinput';
import { confirmAlert, successAlert } from "@/lib/alert";
import { Edit } from 'lucide-react';

const initialRegions = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Wilayah ${i + 1}`,
  deskripsi: `halo-${i + 1}`,
  events: Math.floor(Math.random() * 8),
  createdAt: `2025-11-${(i % 28) + 1}`,
}));

export default function Regions() {
  const [data, setData] = useState(initialRegions);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const columns = [
    { key: 'name', label: 'Nama Wilayah' },
    { key: 'deskripsi', label: 'Deskripsi' },
    { key: 'events', label: 'Jumlah Event' },
    { key: 'createdAt', label: 'Tanggal Dibuat' },
  ];

  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [d.name, d.deskripsi, d.events.toString(), d.createdAt].join(' ').toLowerCase().includes(q);
    return matchesSearch;
  });

  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va || '').toLowerCase();
      const sb = String(vb || '').toLowerCase();
      if (sa < sb) return sortDir === 'asc' ? -1 : 1;
      if (sa > sb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageData = sorted.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
      return;
    }
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  }

  const handleEdit = (row) => {
    setEditingId(row.id);
    setName(row.name);
    setDesc(row.deskripsi);
    setKeywords(row.keywords || []);
    setImgPreview(row.imgUrl || ''); // Asumsi ada field imgUrl
    setOpen(true);
  };

async function handleSave(e) {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Nama wilayah wajib diisi.";
    if (!desc.trim() || desc === "<p></p>") newErrors.desc = "Deskripsi wajib diisi.";
    // Saat edit, gambar boleh tidak diupload ulang jika sudah ada preview sebelumnya
    if (!imgFile && !imgPreview) newErrors.img = "Gambar wajib diunggah.";
    if (keywords.length === 0) newErrors.keywords = "Minimal harus ada 1 keyword.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingId) {
      // LOGIKA UPDATE
      const updatedData = data.map((item) => 
        item.id === editingId 
          ? { ...item, name, deskripsi: desc.replace(/<[^>]*>/g, ''), keywords } 
          : item
      );
      setData(updatedData);
      await successAlert("Berhasil", "Data Wilayah telah diperbarui.");
    } else {
      // LOGIKA ADD (Sama seperti sebelumnya)
      const newItem = { 
        id: data.length + 1, 
        name, 
        deskripsi: desc.replace(/<[^>]*>/g, ''),
        keywords,
        events: 0, 
        createdAt: new Date().toISOString().slice(0, 10) 
      };
      setData([newItem, ...data]);
      await successAlert("Berhasil", "Regions Baru ditambah.");
    }

    closeDialog();
  }

  const closeDialog = () => {
    setOpen(false);
    setEditingId(null); // Reset mode ke Add
    setName('');
    setDesc('');
    setImgFile(null);
    setImgPreview('');
    setKeywords([]);
    setErrors({});
  };

  async function handleCancel() {
    // Tentukan pesan berdasarkan mode (Edit atau Add)
    const alertConfig = editingId 
      ? {
          title: "Batalkan Perubahan?",
          text: "Perubahan yang Anda buat pada wilayah ini tidak akan disimpan.",
          confirmText: "Ya, Batalkan Edit",
        }
      : {
          title: "Batal Tambah Wilayah?",
          text: "Data wilayah yang Anda masukkan tidak akan disimpan.",
          confirmText: "Ya, Batal",
        };

    const res = await confirmAlert({
      title: alertConfig.title,
      text: alertConfig.text,
      confirmText: alertConfig.confirmText,
    });

    if (res.isConfirmed) {
      closeDialog();
    }
  }

  // Untuk Nama
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: null }));
    }
  };

  // Untuk Deskripsi (RichTextEditor)
  const handleDescChange = (val) => {
    setDesc(val);
    if (errors.desc) {
      setErrors((prev) => ({ ...prev, desc: null }));
    }
  };

  // Update handleImageChange yang sudah ada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImgPreview(previewUrl);
      
      // Hapus error gambar jika ada
      if (errors.img) {
        setErrors((prev) => ({ ...prev, img: null }));
      }
    }
  };

  React.useEffect(() => {
    if (keywords.length > 0 && errors.keywords) {
      setErrors((prev) => ({ ...prev, keywords: null }));
    }
  }, [keywords, errors.keywords]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Wilayah</h2>
        <Button onClick={() => setOpen(true)}>+ Add Wilayah</Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <Input
              placeholder="Search regions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-10"
            />
          </div>

          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="border rounded px-2 py-1 text-sm focus:outline-none"
              aria-label="Rows per page"
            >
              <option value={6}>6 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm divide-y">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-2">
                    <button
                      className="inline-flex items-center gap-2 text-left w-full"
                      onClick={() => toggleSort(c.key)}
                      aria-label={`Sort by ${c.label}`}
                    >
                      <span>{c.label}</span>
                      <span className="ml-1">
                        {sortKey === c.key ? (
                          sortDir === 'asc' ? (
                            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                              <path d="M5 12l5-5 5 5H5z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                              <path d="M15 8l-5 5-5-5h10z" />
                            </svg>
                          )
                        ) : (
                          <svg className="w-3 h-3 text-slate-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path d="M5 12l5-5 5 5H5z" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </th>
                ))}
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-6 text-center text-slate-500">No regions found.</td>
                </tr>
              ) : (
                pageData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">{row.name}</td>
                    <td className="px-3 py-3">{row.deskripsi}</td>
                    <td className="px-3 py-3">{row.events}</td>
                    <td className="px-3 py-3">{row.createdAt}</td>
                    <td className="px-3 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500">
            Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, sorted.length)} of {sorted.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded hover:bg-slate-100 focus:outline-none"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.293 16.293L7.586 11.586 12.293 6.879 11.293 5.879 5.879 11.293 11.293 16.707z" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 rounded text-sm ${page === i + 1 ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="p-2 rounded hover:bg-slate-100 focus:outline-none"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 3.707L12.414 8.414 7.707 13.121 8.707 14.121 14.121 8.707 8.707 3.293z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(val) => {
        // Jika mencoba menutup dengan klik luar/esc, arahkan ke handleCancel
        if (!val) {
          handleCancel();
        } else {
          setOpen(true);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Wilayah' : 'Add Wilayah'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nama Wilayah <span className="text-red-500">*</span></label>
              <Input 
                value={name} 
                onChange={handleNameChange}
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi <span className="text-red-500">*</span></label>
              <div className={`border rounded-md mt-1 ${errors.desc ? "border-red-500" : ""}`}>
                <RichTextEditor
                  value={desc}
                  onChange={handleDescChange}
                  className="min-h-[120px] max-h-60 overflow-y-auto"
                />
              </div>
              {errors.desc && <p className="text-xs text-red-500 mt-1">{errors.desc}</p>}
            </div>
            <div className="w-full">
              <label className="text-sm font-medium">Gambar <span className="text-red-500">*</span></label>
                <div className="mt-1">
                  <label 
                    className={`flex flex-col h-40 border-2 border-dashed rounded-lg items-center justify-center cursor-pointer transition-colors overflow-hidden 
                      ${errors.img ? 'border-red-500 bg-red-50' : imgPreview ? 'border-primary' : 'border-slate-300 hover:bg-slate-50'}`}
                    >
                    {imgPreview ? (
                      <img 
                        src={imgPreview} 
                        alt="Preview" 
                        className="max-h-full object-contain" 
                      />
                      ) : (
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm text-slate-500">Upload Gambar</span>
                      </div>
                      )}
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                      />
                  </label>
              </div>
              {errors.img && <p className="text-xs text-red-500 mt-1">{errors.img}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Keywords <span className="text-red-500">*</span></label>
              <TagInput
                keywords={keywords}
                maxKeywords={20}
                setKeywords={setKeywords}
                error={!!errors.keywords}
              />
              {errors.keywords && <p className="text-xs text-red-500 mt-1">{errors.keywords}</p>}            
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
              >
                {editingId ? 'Simpan Perubahan' : 'Simpan Regions'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
