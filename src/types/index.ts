export interface OptionTypeString {
  value: string;
  label: string;
}
export interface OptionType {
  value: number;
  label: string;
}
export interface Periode {
  value: number;
  label: string;
  id: number;
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
  tahun_list: string[];
}
export interface PerangkatDaerah {
  nama_opd: string;
  kode_opd: string;
}
export interface Permasalahan {
  id?: number;
  data_dukung: DataDukung;
}
export interface DataDukung {
  data_dukung: string;
  id: number;
  jumlah_data: TargetJumlahData[];
  narasi_data_dukung: string;
  permasalahan_opd_id?: number;
}
export interface TargetJumlahData {
  id?: number;
  id_data_dukung?: number;
  tahun: string;
  jumlah_data: number;
  satuan: string;
}
export interface BidangUrusan {
  value: string;
  label: string;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  tahun: string;
}
export interface Ppd {
  value: number;
  label: string;
  id: number;
  kode_opd: string;
  nama_opd: string;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  potensi: string;
  tahun: string;
}
export interface IsuKlhs {
  value: number;
  label: string;
  id: number;
  kode_opd: string;
  nama_opd: string;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  isu: string;
  tahun: string;
}
export interface IsuGlobal {
  value: number;
  label: string;
  id: number;
  kode_opd: string;
  nama_opd: string;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  isu: string;
  tahun: string;
}
export interface IsuNasional {
  value: number;
  label: string;
  id: number;
  kode_opd: string;
  nama_opd: string;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  isu: string;
  tahun: string;
}
export interface IsuRegional {
  value: number;
  label: string;
  id: number;
  kode_opd: string;
  nama_opd: string;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  isu: string;
  tahun: string;
}
export interface TablePermasalahan {
  value?: number;
  label?: string;
  id?: number;
  id_permasalahan: TablePermasalahan[];
  parent: number | null;
  nama_pohon: string;
  masalah?: string;
  level_pohon: number;
  perangkat_daerah: {
    nama_opd: string;
    kode_opd: string;
  };
  jenis_masalah: string;
}
export interface IsuStrategis {
  created_at: string;
  id: number;
  isu_strategis: string;
  kode_bidang_urusan: string;
  kode_opd: string;
  nama_bidang_urusan: string;
  nama_opd: string;
  id_ppd: number;
  id_isu_klhs: number;
  id_isu_global: number;
  id_isu_nasional: number;
  id_isu_regional: number;
  potensi_perangkat_daerah: string;
  isu_klhs: string;
  isu_global: string;
  isu_nasional: string;
  isu_regional: string;
  permasalahan_opd: PermasalahanOpd[];
  tahun_akhir: string;
  tahun_awal: string;
}
export interface PermasalahanOpd {
  data_dukung: DataDukung[];
  id: number;
  jenis_masalah: string;
  level_pohon: number;
  masalah: string;
}
