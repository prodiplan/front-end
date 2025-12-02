# Searchable Dropdown Implementation

## Overview

Fitur autocomplete/searchable dropdown telah ditambahkan untuk field **Asal Sekolah** dan **Jurusan Impian** pada halaman registrasi.

## Features

### 1. **SearchableSelect Component** (`src/components/ui/SearchableSelect.tsx`)

Komponen reusable dengan fitur:

- ✅ **Live Search** - Filter options saat mengetik
- ✅ **Keyboard Navigation** - Arrow Up/Down, Enter, Escape
- ✅ **Click Outside** - Dropdown tertutup otomatis
- ✅ **Clear Button** - Hapus pilihan yang sudah dipilih
- ✅ **Validation** - Hanya bisa memilih dari daftar yang tersedia
- ✅ **Highlighted Selection** - Visual feedback saat hover/navigate
- ✅ **No Results Message** - Pesan jika tidak ada hasil

### 2. **Data Source** (`src/data/schoolsAndMajors.ts`)

#### Schools (120+ sekolah)

- SMA Negeri dari berbagai kota besar (Jakarta, Bandung, Surabaya, dll)
- SMA Swasta unggulan
- Sekolah boarding school nasional
- Madrasah Aliyah Negeri
- Data sudah di-sort alfabetis

#### Majors (150+ jurusan)

- Teknik & Komputer (24 jurusan)
- Kesehatan (12 jurusan)
- Ekonomi & Bisnis (10 jurusan)
- Hukum & Politik (10 jurusan)
- Sosial & Komunikasi (10 jurusan)
- Seni & Desain (13 jurusan)
- Pendidikan (14 jurusan)
- Pertanian & Kehutanan (7 jurusan)
- MIPA (9 jurusan)
- Bahasa & Sastra (9 jurusan)
- Dan lainnya...
- Data sudah di-sort alfabetis

## Usage

### Keyboard Shortcuts:

- `Arrow Down` / `Arrow Up` - Navigate options
- `Enter` - Select highlighted option
- `Escape` - Close dropdown
- `Type` - Filter options

### User Experience:

1. User mulai mengetik nama sekolah/jurusan
2. Dropdown menampilkan hasil yang cocok
3. User bisa pilih dengan klik atau keyboard
4. Jika ketik tapi tidak pilih dari dropdown → tidak bisa submit (validation)
5. Ada tombol X untuk clear selection

## Validation Rules

```typescript
// User HARUS memilih dari dropdown
// Tidak bisa submit jika:
- Field kosong
- User mengetik tapi tidak memilih dari dropdown
- Teks yang diketik tidak ada di daftar

// Valid jika:
- User memilih salah satu option dari dropdown
- Value match dengan salah satu item di SCHOOLS atau MAJORS array
```

## Implementation in Auth Page

```tsx
// Import
import SearchableSelect from "@/components/ui/SearchableSelect";
import { SCHOOLS, MAJORS } from "@/data/schoolsAndMajors";

// Handler
const handleSearchableSelectChange = (name: string, value: string) => {
  setFormData({ ...formData, [name]: value });
};

// Component Usage
<SearchableSelect
  id="school_origin"
  name="school_origin"
  value={formData.school_origin}
  onChange={handleSearchableSelectChange}
  options={SCHOOLS}
  label="Asal Sekolah"
  placeholder="Ketik nama sekolah..."
  required
/>;
```

## Files Modified/Created

### Created:

- ✅ `front-end/src/components/ui/SearchableSelect.tsx` - Main component
- ✅ `front-end/src/data/schoolsAndMajors.ts` - Data source
- ✅ `front-end/docs/SEARCHABLE_DROPDOWN.md` - Documentation

### Modified:

- ✅ `front-end/src/app/auth/page.tsx` - Integrated SearchableSelect

## Benefits

1. **Better UX** - User tidak perlu scroll panjang untuk cari sekolah/jurusan
2. **Faster Input** - Ketik beberapa huruf langsung muncul hasil
3. **Data Validation** - Hanya accept value yang valid dari list
4. **Consistent Data** - Tidak ada typo atau variasi nama
5. **Extensible** - Mudah menambah sekolah/jurusan baru di data file
6. **Reusable** - Component bisa digunakan di form lain

## Future Enhancements

Possible improvements:

- [ ] Load data from API instead of static file
- [ ] Add fuzzy search for better matching
- [ ] Group options by category (e.g., by province for schools)
- [ ] Add "Lainnya" option with free text input
- [ ] Virtualization for very long lists (performance)
- [ ] Multi-select support
- [ ] Recent selections memory

## Testing Checklist

- [ ] Search menampilkan hasil yang sesuai
- [ ] Keyboard navigation berfungsi
- [ ] Click outside menutup dropdown
- [ ] Clear button menghapus selection
- [ ] Validation mencegah submit jika tidak valid
- [ ] Mobile responsive
- [ ] Works di berbagai browser
- [ ] No console errors

---

**Implemented**: December 2, 2025
