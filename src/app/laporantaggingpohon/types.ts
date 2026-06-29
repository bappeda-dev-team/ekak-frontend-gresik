export interface WebResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface RencanaKinerja {
    id_rekin: string;
    rencana_kinerja: string;
    nama_pelaksana: string;
    nip_pelaksana: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    kode_program: string;
    nama_program: string;
    indikator_programs: IndikatorProgram[];
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    pagu: number;
    keterangan: string;
    tahapan_pelaksanaan: {
        tw_1: number;
        tw_2: number;
        tw_3: number;
        tw_4: number;
    };
}

export type IndikatorProgram = {
    indikator_program: string;
}

export interface Pelaksana {
    nama_pelaksana: string;
    nip_pelaksana: string;
    rencana_kinerjas: RencanaKinerja[];
}

export interface TaggingData {
    kode_program_unggulan: string;
    nama_program_unggulan: string;
    rencana_implementasi: string;
    id_pohon: number;
    tahun: number;
    nama_pohon: string;
    kode_opd: string;
    nama_opd: string;
    jenis_pohon: string;
    keterangan_tagging: string;
    status: string;
    pelaksanas: Pelaksana[];
    keterangan: string;
}

export interface Data {
    nama_tagging: string;
    tahun: number;
    pohon_kinerjas: TaggingData[];
}
