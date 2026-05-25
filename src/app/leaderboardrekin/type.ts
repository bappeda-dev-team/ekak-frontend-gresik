export interface Pokin {
    kode_opd: string;
    nama_opd: string;
    tematik: Pohon[];
    persentase_cascading: string;
    is_hidden: boolean;
}
export interface Pohon {
    nama: string;
    child?: Pohon[];
}