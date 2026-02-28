import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

/** * BAGIAN UI KOMPONEN (Lokal agar tidak ada error export/import)
 */
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "default", size = "md", className = "" }: any) => {
  const base = "rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center disabled:opacity-50";
  const variants: any = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };
  const sizes: any = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Input = (props: any) => (
  <input {...props} className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white ${props.className}`} />
);

const Select = ({ value, onValueChange, children }: any) => (
  <select value={value} onChange={(e) => onValueChange(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none w-full cursor-pointer">
    {children}
  </select>
);

/**
 * APLIKASI UTAMA
 */
export default function ProductionSystem() {
  // --- LOGIKA PENYIMPANAN BAHASA ---
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("app_language");
    return savedLang ? savedLang : "id"; // Default ke Indonesia jika belum ada yang disimpan
  });

  // Fungsi untuk merubah bahasa sekaligus menyimpannya ke localStorage
  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    localStorage.setItem("app_language", val);
  };

  const [records, setRecords] = useState<any[]>(() => {
    const saved = localStorage.getItem("production_records");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [form, setForm] = useState({
    date: "",
    color: "",
    shift: "Siang",
    product: "",
    quantity: "",
  });

  const [filterDate, setFilterDate] = useState("");
  const [filterShift, setFilterShift] = useState("all");

  const text = {
    id: {
      title: "SISTEM DATA PRODUKSI",
      addData: "Tambah Data Produksi",
      date: "Tanggal",
      color: "Warna",
      shift: "Shift",
      product: "Produk",
      quantity: "Jumlah",
      save: "Simpan",
      tableTitle: "Data Produksi",
      time: "Waktu",
      reset: "Reset",
      export: "Ekspor ke Excel"
    },
    cn: {
      title: "生产数据系统",
      addData: "添加生产数据",
      date: "日期",
      color: "颜色",
      shift: "班次",
      product: "产品",
      quantity: "数量",
      save: "保存",
      tableTitle: "生产数据",
      time: "时间",
      reset: "重置",
      export: "导出 Excel"
    },
  };

  const t = text[language as keyof typeof text];

  const handleSubmit = () => {
    if (!form.date || !form.color || !form.product || !form.quantity) return;
    const currentTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

    const newRecord = {
      id: Date.now(),
      ...form,
      time: currentTime,
      quantity: Number(form.quantity),
    };

    const newRecords = [...records, newRecord];
    setRecords(newRecords);
    localStorage.setItem("production_records", JSON.stringify(newRecords));
    setForm({ date: "", color: "", shift: "Siang", product: "", quantity: "" });
  };

  const handleDelete = (id: number) => {
    const newRecords = records.filter((record) => record.id !== id);
    setRecords(newRecords);
    localStorage.setItem("production_records", JSON.stringify(newRecords));
  };

  const handleExport = () => {
    const filteredRaw = records.filter((r) => {
      const matchDate = filterDate ? r.date === filterDate : true;
      const matchShift = filterShift !== "all" ? r.shift === filterShift : true;
      return matchDate && matchShift;
    });

    const totalQuantity = filteredRaw.reduce((acc, r) => acc + Number(r.quantity), 0);
    const filteredData = filteredRaw.map((r) => ({
      [t.date]: r.date,
      [t.time]: r.time || "",
      [t.color]: r.color,
      [t.shift]: language === "cn" ? (r.shift === "Siang" ? "白班" : "夜班") : r.shift,
      [t.product]: r.product,
      [t.quantity]: r.quantity,
    }));

    filteredData.push({
      [t.date]: "", [t.time]: "", [t.color]: "", [t.shift]: "",
      [t.product]: language === "cn" ? "总计" : "TOTAL",
      [t.quantity]: totalQuantity,
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Production Data");
    const fileDate = filterDate ? filterDate : new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `production_data_${fileDate}.xlsx`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1"></div>
        <div className="flex-1 text-center px-4">
          <h1 className="text-2xl font-black text-gray-800 tracking-wider">
            {t.title}
          </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="w-32">
            <Select value={language} onValueChange={handleLanguageChange}>
              <option value="id">Indonesia</option>
              <option value="cn">中文</option>
            </Select>
          </div>
        </div>
      </div>

      {/* FORM TAMBAH DATA */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">{t.addData}</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.date}</label>
              <Input type="date" value={form.date} onChange={(e:any) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.color}</label>
              <Input value={form.color} onChange={(e:any) => setForm({ ...form, color: e.target.value })} placeholder={t.color} />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.shift}</label>
              <Select value={form.shift} onValueChange={(val:any) => setForm({ ...form, shift: val })}>
                <option value="Siang">Siang / 白班</option>
                <option value="Malam">Malam / 夜班</option>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.product}</label>
              <Input value={form.product} onChange={(e:any) => setForm({ ...form, product: e.target.value })} placeholder={t.product} />
            </div>
            <div className="w-[100px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.quantity}</label>
              <Input type="number" value={form.quantity} onChange={(e:any) => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
            </div>
            <Button onClick={handleSubmit} className="px-10 h-[40px] uppercase tracking-wide">
              {t.save}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABEL DATA */}
      <Card>
        <CardContent>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-700">{t.tableTitle}</h2>
            <div className="flex items-center gap-2">
              <Input type="date" className="w-40" value={filterDate} onChange={(e:any) => setFilterDate(e.target.value)} />
              <div className="w-40">
                <Select value={filterShift} onValueChange={setFilterShift}>
                  <option value="all">Semua / 全部</option>
                  <option value="Siang">Siang / 白班</option>
                  <option value="Malam">Malam / 夜班</option>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setFilterDate(""); setFilterShift("all"); }}>{t.reset}</Button>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">{t.export}</Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-inner">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-4 border-b">{t.date}</th>
                  <th className="p-4 border-b">{t.time}</th>
                  <th className="p-4 border-b">{t.color}</th>
                  <th className="p-4 border-b">{t.shift}</th>
                  <th className="p-4 border-b">{t.product}</th>
                  <th className="p-4 border-b">{t.quantity}</th>
                  <th className="p-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records
                  .filter((r) => {
                    const matchDate = filterDate ? r.date === filterDate : true;
                    const matchShift = filterShift !== "all" ? r.shift === filterShift : true;
                    return matchDate && matchShift;
                  })
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/50 transition-all group">
                      <td className="p-4 font-semibold text-gray-700">{r.date}</td>
                      <td className="p-4 text-gray-400">{r.time}</td>
                      <td className="p-4">{r.color}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${r.shift === 'Siang' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {language === "cn" ? (r.shift === "Siang" ? "白班" : "夜班") : r.shift}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{r.product}</td>
                      <td className="p-4 font-black text-blue-600">{r.quantity}</td>
                      <td className="p-4 text-center">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)} className="opacity-0 group-hover:opacity-100">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-400 italic">Belum ada data produksi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}