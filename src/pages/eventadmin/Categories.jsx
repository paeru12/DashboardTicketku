import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RichTextEditor from "@/components/common/RichTextEditor";
import { Edit } from 'lucide-react'; // Hanya import icon Edit
import { confirmAlert, successAlert } from "@/lib/alert";

const initialCategories = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  name: `Kategori ${i + 1}`,
  description: `Deskripsi untuk kategori ${i + 1}`,
  events: Math.floor(Math.random() * 10),
  createdAt: `2025-12-${(i % 28) + 1}`,
}));

export default function Categories() {
  const [data, setData] = useState(initialCategories);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  
  // State Form & Dialog
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [errors, setErrors] = useState({});

  const columns = [
    { key: 'name', label: 'Nama Kategori' },
    { key: 'description', label: 'Deskripsi' },
    { key: 'events', label: 'Jumlah Event' },
    { key: 'createdAt', label: 'Tanggal Dibuat' },
  ];

  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [d.name, d.description, d.createdAt].join(' ').toLowerCase().includes(q);
    return matchesSearch;
  });

  const sorted = useMemo(() => {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
      if (errors.img) setErrors(prev => ({ ...prev, img: null }));
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingId(null);
    setName('');
    setDesc('');
    setImgFile(null);
    setImgPreview('');
    setErrors({});
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setName(row.name);
    setDesc(row.description);
    setImgPreview(''); // Reset jika tidak ada URL gambar di awal
    setOpen(true);
  };

  async function handleCancel() {
    const config = editingId 
      ? { title: "Batal ?", text: "Data yang anda ubah tidak akan disimpan.", confirmText: "Ya, Batal Edit" }
      : { title: "Batal ?", text: "Data yang anda masukkan akan hilang.", confirmText: "Ya, Batal" };

    const res = await confirmAlert({
      title: config.title,
      text: config.text,
      confirmText: config.confirmText,
    });

    if (res.isConfirmed) closeDialog();
  }

  async function handleAdd(e) {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Nama Kategori wajib diisi.";
    if (!desc.trim() || desc === "<p></p>") newErrors.desc = "Deskripsi wajib diisi.";
    if (!imgFile && !imgPreview) newErrors.img = "Gambar wajib diisi.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingId) {
      setData(data.map(item => item.id === editingId 
        ? { ...item, name, description: desc.replace(/<[^>]*>/g, '') } 
        : item
      ));
      await successAlert("Berhasil", "Kategori Berhasil diubah.");
    } else {
      const item = { 
        id: data.length + 1, 
        name, 
        description: desc.replace(/<[^>]*>/g, ''),
        events: 0, 
        createdAt: new Date().toISOString().slice(0, 10) 
      };
      setData([item, ...data]);
      await successAlert("Berhasil", "Kategori Baru ditambah.");
    }

    closeDialog();
    setPage(1);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Kategori</h2>
        <Button onClick={() => setOpen(true)}>+ Add Kategori</Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <Input
              placeholder="Search categories..."
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
                    >
                      <span>{c.label}</span>
                      <span className="ml-1">
                        {sortKey === c.key ? (
                          sortDir === 'asc' ? (
                            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5H5z" /></svg>
                          ) : (
                            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8l-5 5-5-5h10z" /></svg>
                          )
                        ) : (
                          <svg className="w-3 h-3 text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5H5z" /></svg>
                        )}
                      </span>
                    </button>
                  </th>
                ))}
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-slate-500">No categories found.</td>
                </tr>
              ) : (
                pageData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 font-medium">{row.name}</td>
                    <td className="px-3 py-3">{row.description}</td>
                    <td className="px-3 py-3">{row.events}</td>
                    <td className="px-3 py-3">{row.createdAt}</td>
                    <td className="px-3 py-3 text-right">
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-700">
                          <Edit size={16} className="mr-1" /> Edit
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

      <Dialog open={open} onOpenChange={(val) => !val ? handleCancel() : setOpen(true)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Kategori' : 'Add Kategori'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nama Kategori <span className="text-red-500">*</span></label>
              <Input 
                value={name} 
                onChange={(e) => { setName(e.target.value); if(errors.name) setErrors(p => ({...p, name: null})) }} 
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi <span className="text-red-500">*</span></label>
              <div className={`border rounded-md ${errors.desc ? "border-red-500" : ""}`}>
                <RichTextEditor
                  value={desc}
                  onChange={(val) => { setDesc(val); if(errors.desc) setErrors(p => ({...p, desc: null})) }}
                  className="min-h-[120px] max-h-60 overflow-y-auto"
                />
              </div>
              {errors.desc && <p className="text-xs text-red-500 mt-1">{errors.desc}</p>}
            </div>
            <div className="w-full">
              <label className="text-sm font-medium">Gambar <span className="text-red-500">*</span></label>
              <div className="mt-1">
                <label 
                  className={`flex flex-col h-40 border-2 border-dashed rounded-lg items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden ${errors.img ? 'border-red-500 bg-red-50' : imgPreview ? 'border-primary' : 'border-slate-300'}`}
                >
                  {imgPreview ? (
                    <img src={imgPreview} alt="Preview" className="max-h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className={`w-8 h-8 mb-2 ${errors.img ? 'text-red-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      <span className={`text-sm ${errors.img ? 'text-red-500' : 'text-slate-500'}`}>Upload Gambar</span>
                    </div>
                  )}
                  <Input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              {errors.img && <p className="text-xs text-red-500 mt-1">{errors.img}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
              <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Save'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}