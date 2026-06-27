export interface StrategicArahKebijakan {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    isu_strategis_opds: IsuStrategisOpd[];
    tujuan_opd: TujuanOpd[];
    strategi_arah_kebijakan_opds: ArahKebijakan[];
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
    tujuan_opd: string;
    sasaran_opds: SasaranOpd[];
}

export interface SasaranOpd {
    sasaran_opd: string;
    strategi_opd: string;
    arah_kebijakan_opds: ArahKebijakanOpd[];
}

export interface ArahKebijakanOpd {
    arah_kebijakan_opd: string;
}