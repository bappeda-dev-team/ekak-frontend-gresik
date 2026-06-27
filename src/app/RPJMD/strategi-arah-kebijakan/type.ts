export interface StrategicArahKebijakan {
  kode_opd: string;
  nama_opd: string;
  tahun: string;
  tahun_awal: string;
  tahun_akhir: string;
  isu_strategis_opds: IsuStrategisOpd[];
  tujuan_opd: TujuanOpd[];
  strategi_arah_kebijakan_pemdas: ArahKebijakan[];
}

export interface IsuStrategisOpd {
  nama_isu_strategis: string;
}

export interface TujuanOpd {
  id: number;
  kode_opd: string;
  tujuan: string;
}

export interface ArahKebijakan {
  tujuan_pemda: string;
  sasaran_pemdas: SasaranPemda[];
}

export interface SasaranPemda {
  sasaran_pemda: string;
  strategi_pemda: string;
  arah_kebijakan_pemdas: ArahKebijakanPemda[];
}

export interface ArahKebijakanPemda {
  arah_kebijakan_pemda: string;
}
