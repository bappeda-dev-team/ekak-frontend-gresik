'use client'

import { ButtonGreenBorder, ButtonRed, ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import { ModalPokirDewan } from "./ModalPokirDewan";
import { ModalPokirOpd } from "./ModalPokirOpd";

interface UsulanPokir {
    id: string;
    usulan: string;
    alamat: string;
    uraian: string;
    tahun: string;
    rencana_kinerja_id: string;
    kode_opd: string;
    nama_opd: string;
    status: string;
    id_kamus_usulan: number;
    nama_kamus_usulan: string;
    nip_pengusul: string;
    jumlah: number | string;
    satuan: string;
    kecamatan: string;
    kelurahan: string;
    rt: string;
    rw: string;
}

const Table = () => {

    const [Data, setData] = useState<UsulanPokir[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();
    const { branding } = useBrandingContext();


    // MODAL & TRIGGER
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [ModalOpdOpen, setModalOpdOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<any>(null);
    const [fetchTrigger, setfetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true)
            const payload = {
                tahun: String(branding?.tahun?.value),
                nip_pengusul: branding?.user?.nip,
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
                const data = result.data;
                if (data.length === 0) {
                    setDataNull(true);
                    setData([]);
                } else if (data.code == 500) {
                    setError(true);
                    setData([]);
                } else {
                    setDataNull(false);
                    setData(data);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchSubKegiatan();
    }, [branding, fetchTrigger, token]);

    const handleModal = (data: any, jenis: "tambah" | "edit") => {
        if (ModalOpen) {
            setJenisModal(jenis);
            setModalOpen(false);
            setDataModal(data);
        } else {
            setJenisModal(jenis);
            setModalOpen(true);
            setDataModal(data);
        }
    }

    const handleModalOpd = (data: any) => {
        if (ModalOpdOpen) {
            setModalOpdOpen(false);
            setDataModal(data);
        } else {
            setModalOpdOpen(true);
            setDataModal(data);
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
            <div className="flex flex-wrap items-center gap-1">
                <ButtonSkyBorder
                    className="m-2 flex items-center gap-1"
                    onClick={() => handleModal(null, "tambah")}
                >
                    <TbCirclePlus />
                    Tambah Usulan Pokir
                </ButtonSkyBorder>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kamus Usulan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Usulan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">OPD</th>
                            <th className="border-l border-b px-6 py-3 min-w-[300px]">Kecamatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Kelurahan/Desa</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Pengusul</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Jumlah/Volume</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Alamat</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Permasalahan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                        <tr className="bg-blue-500 text-white">
                            <th className="border-r border-b px-6 py-3 text-center">1</th>
                            <th className="border-r border-b px-6 py-3 text-center">2</th>
                            <th className="border-l border-b px-6 py-3 text-center">3</th>
                            <th className="border-l border-b px-6 py-3 text-center">4</th>
                            <th className="border-l border-b px-6 py-3 text-center">5</th>
                            <th className="border-l border-b px-6 py-3 text-center">6</th>
                            <th className="border-l border-b px-6 py-3 text-center">7</th>
                            <th className="border-l border-b px-6 py-3 text-center">8</th>
                            <th className="border-l border-b px-6 py-3 text-center">9</th>
                            <th className="border-l border-b px-6 py-3 text-center">10</th>
                            <th className="border-l border-b px-6 py-3 text-center">11</th>
                            <th className="border-l border-b px-6 py-3 text-center">12</th>
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
                            Data.map((item: UsulanPokir, index: number) => (
                                <tr key={index}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{item.nama_kamus_usulan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.usulan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.nama_opd || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.kecamatan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.kelurahan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.nip_pengusul || "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{item.jumlah || "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{item.satuan || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.alamat || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.uraian || "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col items-center gap-1">
                                            {(branding?.user.roles == "super_admin" && item.kode_opd === null) &&
                                                <ButtonSky
                                                    onClick={() => handleModalOpd(item)}
                                                    className="w-full flex items-center gap-1"
                                                >
                                                    <TbPencil />
                                                    OPD
                                                </ButtonSky>
                                            }
                                            {/* <ButtonSky
                                                onClick={() => handleModal(item, "edit")}
                                                className="w-full flex items-center gap-1"
                                            >
                                                <TbPencil />
                                                Edit
                                            </ButtonSky> */}
                                            <ButtonRed
                                                className="w-full *:flex items-center gap-1"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Pokok Pikiran yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            // hapusSubKegiatan(data.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                <TbTrash />
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {ModalOpen &&
                    <ModalPokirDewan
                        isOpen={ModalOpen}
                        onClose={() => handleModal(null, "tambah")}
                        onSuccess={() => setfetchTrigger((prev) => !prev)}
                        Data={DataModal}
                        jenis={JenisModal}
                    />
                }
                {ModalOpdOpen &&
                    <ModalPokirOpd
                        isOpen={ModalOpdOpen}
                        onClose={() => handleModalOpd(null)}
                        onSuccess={() => setfetchTrigger((prev) => !prev)}
                        Data={DataModal}
                    />
                }
            </div>
        </>
    )
}

export default Table;
