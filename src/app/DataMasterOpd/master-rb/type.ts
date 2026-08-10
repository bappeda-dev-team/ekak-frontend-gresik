export interface TargetRB {
    id: string;
    id_indikator: string;
    tahun_baseline: number;
    target_baseline: string;
    realisasi_baseline: string;
    satuan_baseline: string;
    tahun_next: number;
    target_next: string;
    satuan_next: string;
}

export interface IndikatorRB {
    id: string;
    id_rb: number;
    indikator: string;
    target: TargetRB[];
}

export interface RB {
    id: number;
    jenis_rb: string;
    sudah_diambil: boolean,
    kegiatan_utama: string;
    keterangan: string;
    indikator: IndikatorRB[];
    tahun_baseline: number;
    tahun_next: number;
}