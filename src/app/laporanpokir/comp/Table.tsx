'use client'

import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";

interface UsulanResponse {
    nip_pengusul: string;
    nama_pengusul: string;
    usulan: string;
    uraian: string;
    alamat: string;
    kecamatan: string;
    kelurahan: string;
    rt: string;
    rw: string;
    kode_opd: string;
    nama_opd: string;
    rekin_id: string;
    nama_rencana_kinerja: string;
    nama_pelaksana_rencana_kinerja: string;
    id_kamus_usulan: number;
    nama_kamus_usulan: string;
    jumlah: string;
    satuan: string;
    anggaran: number; // int64 → number
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    tahun: string;
};

const Table = () => {

    const [Data, setData] = useState<UsulanResponse[]>([]);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const { branding } = useBrandingContext();

    useEffect(() => {
        const fetchIkuOpd = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await fetch(`${branding?.api_perencanaan}/usulan_pokok_pikiran/laporan/${branding?.tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setData(result.data);
                } else if (result.code === 401) {
                    window.location.href = "/login";
                } else {
                    setData([]);
                    setError(true);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchIkuOpd();
    }, [token, branding]);

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (branding?.tahun?.value === undefined) {
        return <TahunNull />
    } else {
        return (
            <>
                <div className="overflow-auto m-2 rounded-t-xl border w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th rowSpan={2} className="border-r border-b px-6 py-3 text-center">No</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Dewan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Kamus Usulan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Nama Usulan</th>
                                <th colSpan={5} className="border-r border-b px-6 py-3 min-w-[500px]">Lokasi</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Keterangan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px]">Jumlah</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">OPD</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sub Kegiatan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Nama Pelaksana</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Pagu Sub Kegiatan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Rekin</th>
                            </tr>
                            <tr className="bg-blue-700 text-white">
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">Kecamatan</th>
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">Kelurahan</th>
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">Alamat</th>
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">RT</th>
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">RW</th>
                            </tr>
                            <tr className="bg-blue-700 text-white">
                                <th className="border-r border-b px-2 py-1 text-center">1</th>
                                <th className="border-r border-b px-2 py-1 text-center">2</th>
                                <th className="border-r border-b px-2 py-1 text-center">3</th>
                                <th className="border-r border-b px-2 py-1 text-center">4</th>
                                <th className="border-r border-b px-2 py-1 text-center">5</th>
                                <th className="border-r border-b px-2 py-1 text-center">6</th>
                                <th className="border-r border-b px-2 py-1 text-center">7</th>
                                <th className="border-r border-b px-2 py-1 text-center">8</th>
                                <th className="border-r border-b px-2 py-1 text-center">9</th>
                                <th className="border-r border-b px-2 py-1 text-center">10</th>
                                <th className="border-r border-b px-2 py-1 text-center">11</th>
                                <th className="border-r border-b px-2 py-1 text-center">12</th>
                                <th className="border-r border-b px-2 py-1 text-center">13</th>
                                <th className="border-r border-b px-2 py-1 text-center">14</th>
                                <th className="border-r border-b px-2 py-1 text-center">15</th>
                                <th className="border-r border-b px-2 py-1 text-center">16</th>
                                <th className="border-r border-b px-2 py-1 text-center">17</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!Data || Data.length === 0) ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={30}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                Data.map((item: UsulanResponse, index: number) => (
                                    <tr key={index}>
                                        <td className="border-x border-b border-blue-500 py-4 px-3 text-center">{index + 1}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">
                                            {item.nip_pengusul ?
                                                <>
                                                    {item.nama_pengusul || "-"} ({item.nip_pengusul || ""})
                                                </>
                                                :
                                                <>-</>
                                            }
                                        </td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.nama_kamus_usulan || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.usulan || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.kecamatan || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.kelurahan || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.alamat || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.rt || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.rw || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.uraian || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.jumlah || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.satuan || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.nama_opd || "-"}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">
                                            {item.kode_subkegiatan ? (
                                                <>({item.kode_subkegiatan || "-"}) {item.nama_subkegiatan || "-"}</>
                                            )
                                                :
                                                <></>
                                            }
                                        </td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.nama_pelaksana_rencana_kinerja || '-'}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">Rp.{formatRupiah(item.anggaran || 0)}</td>
                                        <td className="border-x border-b border-blue-500 py-4 px-3">{item.nama_rencana_kinerja || '-'}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Table;
