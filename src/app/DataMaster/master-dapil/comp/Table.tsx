'use client'

import { ButtonGreenBorder, ButtonRed, ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import { ModalMasterDapil } from "./ModalMasterDapil";

interface Dapil {
    id: number;
    kode_dapil: string;
    nama_dapil: string;
    kode_kecamatan: string;
    nama_kecamatan: string;
}

const Table = () => {

    const [Data, setData] = useState<Dapil[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const token = getToken();
    const { branding } = useBrandingContext();

    // MODAL & TRIGGER
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<Dapil | null>(null);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [fetchTrigger, setfetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/dapil/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data === null) {
                    setData([]);
                } else if (data.code == 500) {
                    setError(true);
                    setData([]);
                } else {
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

    const handleModal = (data: Dapil | null, jenis: "tambah" | "edit") => {
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

    // const hapusDapil = async (id: any) => {
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
    //         setData(Data.filter((data) => (data.id !== id)))
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
        <div className="mt-3 rounded-xl shadow-lg border">
            <div className="flex items-center justify-between border-b px-5 py-5">
                <div className="flex flex-col items-end">
                    <h1 className="uppercase font-bold">Master Dapil</h1>
                </div>
                <div className="flex flex-col">
                    <ButtonSky
                        className="flex items-center justify-center"
                        onClick={() => handleModal(null, "tambah")}
                    >
                        <TbCirclePlus className="mr-1" />
                        Tambah Data
                    </ButtonSky>
                </div>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Dapil</th>
                            <th className="border-l border-b px-6 py-3 min-w-[300px]">Nama Dapil</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Kode Kecamatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Nama Kecamatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                        <tr className="bg-blue-500 text-white">
                            <th className="border-r border-b px-6 py-3 text-center">1</th>
                            <th className="border-r border-b px-6 py-3 text-center">2</th>
                            <th className="border-l border-b px-6 py-3 text-center">3</th>
                            <th className="border-l border-b px-6 py-3 text-center">4</th>
                            <th className="border-l border-b px-6 py-3 text-center">5</th>
                            <th className="border-l border-b px-6 py-3 text-center">6</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data.length === 0 ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={6}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Data.map((item: Dapil, index: number) => (
                                <tr key={index}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{item.kode_dapil ?? "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.nama_dapil ?? "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.kode_kecamatan ?? "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{item.nama_kecamatan ?? "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <ButtonSky
                                                className="w-full flex items-center gap-1"
                                                onClick={() => handleModal(item, "edit")}
                                            >
                                                <TbPencil />
                                                Edit
                                            </ButtonSky>
                                            <ButtonRed
                                                className="w-full *:flex items-center gap-1"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Dapil yang dipilih?", "question", "Hapus", "Batal").then((result) => {
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
                    <ModalMasterDapil
                        isOpen={ModalOpen}
                        onClose={() => handleModal(null, "tambah")}
                        onSuccess={() => setfetchTrigger((prev) => !prev)}
                        jenis={JenisModal}
                        Data={DataModal}
                    />
                }
            </div>
        </div>
    )
}

export default Table;
