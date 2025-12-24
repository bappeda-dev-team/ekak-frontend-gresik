'use client'

import { ButtonGreenBorder, ButtonRed, ButtonSkyBorder } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import { ModalUsulanPokirOpd } from "./ModalUsulanPokirOpd";

interface PokirOpd {
    alamat: string;
    id: string;
    id_kamus_usulan: number;
    jumlah: string;
    kecamatan: string;
    kelurahan: string | null;
    kode_opd: string;
    nama_kamus_usulan: string;
    nama_opd: string;
    nip_pengusul: string;
    rt: string;
    rw: string;
    satuan: string;
    status: string;
    tahun: string;
    uraian: string;
    usulan: string;
}

const Table = () => {

    const [Data, setData] = useState<PokirOpd[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    // MODAL & TRIGGER
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [fetchTrigger, setfetchTrigger] = useState<boolean>(false);

    const token = getToken();
    const { branding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    useEffect(() => {
        const fetchPokir = async () => {
            const payload = {
                tahun: String(branding?.tahun?.value),
                nip_pengusul: "",
                kode_opd: opd,
                rekin_id: "",
                require_kode_opd: true,
                require_rekin_id: false
            }
            try {
                setLoading(true);
                const response = await fetch(`${branding?.api_perencanaan}/usulan_pokok_pikiran/findall_with_filter`, {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.code === 200) {
                    // console.log(result);
                    setData(result.data);
                } else {
                    AlertNotification("Gagal", "Gagal mengambil data Pokir, cek koneksi internet, jika berlanjut hubungi tim developer", "error", 3000);
                }
            } catch (err) {
                console.log('error saat fetch option Master Sub Kegaitan', err);
                AlertNotification("Gagal", "Gagal mengambil data Pokir, cek koneksi internet, jika berlanjut hubungi tim developer", "error", 3000);
            } finally {
                setLoading(false);
            }
        }
        fetchPokir();
    }, [branding, fetchTrigger, token]);

    const handleModal = () => {
        if (ModalOpen) {
            setModalOpen(false);
        } else {
            setModalOpen(true);
        }
    }

    // const hapusSubKegiatan = async (id: any) => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     try {
    //         const response = await fetch(`${API_URL}/subkegiatanopd/delete/${id}`, {
    //             method: "DELETE",
    //             headers: {
    //                 Authorization: `${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         if (!response.ok) {
    //             alert("cant fetch data")
    //         }
    //         setSubKegiatan(SubKegiatan.filter((data) => (data.id !== id)))
    //         AlertNotification("Berhasil", "Data Sub Kegiatan OPD Berhasil Di hapus", "success", 1000);
    //     } catch (err) {
    //         AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
    //     }
    // };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <>
            {/* <div className="flex flex-wrap items-center gap-1">
                <ButtonSkyBorder
                    className="m-2 flex items-center gap-1"
                    onClick={() => handleModal()}
                >
                    <TbCirclePlus />
                    Tambah Usulan Pokir
                </ButtonSkyBorder>
            </div> */}
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Pokok Pikiran</th>
                            <th className="border-l border-b px-6 py-3 min-w-[300px]">Nama Pokok Pikiran</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Perangkat Daerah</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={5}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Data.map((item: PokirOpd, index: number) => (
                                <tr key={index}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{item.id || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.usulan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.nama_opd || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <ButtonRed
                                            className="w-full flex items-center gap-1"
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "Hapus Pokok Pikiran yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        // hapusSubKegiatan(data.id);
                                                        AlertNotification("Pengembangan Developer", "", "info", 3000);
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash />
                                            Hapus
                                        </ButtonRed>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <ModalUsulanPokirOpd
                    isOpen={ModalOpen}
                    onClose={() => handleModal()}
                    onSuccess={() => setfetchTrigger((prev) => !prev)}
                    tahun={String(branding?.tahun?.value || "0")}
                    kode_opd={opd ?? ""}
                />
            </div>
        </>
    )
}

export default Table;
