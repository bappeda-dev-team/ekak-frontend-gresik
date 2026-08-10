import { OptionTypeString } from "@/types";

export interface FormValue {
  kode_bidang_urusan: OptionTypeString | null;
  kode_opd: string;
  jenis: OptionTypeString | null;
  tahun: number;
  keterangan: string;
  indikators: Indikator[];
}
export interface Indikator {
  indikator: string;
  targets: Target[];
}
export interface Target {
  target: string;
  satuan: string;
  tahun: number;
}

export interface IkkFindall {
  id: number;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  nama_opd: string;
  jenis: "output" | string;
  tahun: number;
  indikators: Indikator[];
  keterangan: string;
  created_at: string;
  updated_at: string;
}
