import { OptionTypeString } from "@/types";

export interface FormValue {
  kode_bidang_urusan: OptionTypeString | null;
  kode_opd: string;
  isu: string;
  tahun: number;
}

export interface IsuFindall {
  id: number;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  nama_opd: string;
  isu: string;
  tahun: number;
  created_at: string;
  updated_at: string;
}
