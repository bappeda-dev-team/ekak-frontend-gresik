'use client'

import React, { useEffect, useState } from "react"
import { ButtonSkyBorder, ButtonRedBorder } from "@/components/global/Button"
import { TbCircleCheck, TbCirclePlus, TbHourglassFilled, TbPencil, TbTrash } from "react-icons/tb"
import { useBrandingContext } from "@/context/BrandingContext"
import { ModalMasterRb } from "./ModalMasterRb"
import { AlertQuestion, AlertNotification } from "@/components/global/Alert"
import { getToken } from "@/components/lib/Cookie"
import { LoadingClip } from "@/components/global/Loading"
import { RB, IndikatorRB, TargetRB } from "../type"

export const Table = () => {

    const [Data, setData] = useState<RB[]>([]);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<RB | null>(null);

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const { branding } = useBrandingContext();
    const tahunBaseline = Number(branding?.tahun?.value) - 1;
    const token = getToken();

    const handleModalOpen = (jenis: "tambah" | "edit", data: RB | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal(jenis);
            setDataModal(null);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataModal(data);
        }
    }

    useEffect(() => {
        const fetchOpd = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await fetch(`${branding?.api_perencanaan}/datamaster/rb?tahun_next=${branding?.tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setData(result.data);
                    // console.log(result.data);
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
        fetchOpd();
    }, [token, branding, FetchTrigger]);

    const hapusRB = async (id: any) => {
        try {
            const response = await fetch(`${branding?.api_perencanaan}/datamaster/rb/${id}/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setData(Data.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data RB Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                        <h1 className="font-bold text-lg uppercase">Master RB {branding?.tahun?.label || ''}</h1>
                        <ButtonSkyBorder
                            className="flex items-center gap-1"
                            onClick={() => handleModalOpen("tambah", null)}
                        >
                            <TbCirclePlus />
                            Tambah Data
                        </ButtonSkyBorder>
                    </div>
                    <div className="overflow-auto m-2 rounded-t-xl border w-full">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-yellow-600 text-white">
                                    <th rowSpan={2} className="border-r border-b px-6 py-3 text-center">No</th>
                                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">Jenis RB</th>
                                    {branding?.user?.roles == "super_admin" &&
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 w-[100px]">Aksi</th>
                                    }
                                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Kegiatan Utama</th>
                                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator</th>
                                    <th colSpan={4} className="border-r border-b px-6 py-3 w-[400px]">BaseLine {tahunBaseline}</th>
                                    <th colSpan={2} className="border-l border-b px-6 py-3 w-[200px]">{branding?.tahun?.value}</th>
                                </tr>
                                <tr className="bg-yellow-600 text-white">
                                    <th className="border-r border-b px-6 py-1 w-[100px]">Target</th>
                                    <th className="border-r border-b px-6 py-1 w-[100px]">Realisasi</th>
                                    <th className="border-r border-b px-6 py-1 w-[100px]">Satuan</th>
                                    <th className="border-r border-b px-6 py-1 w-[100px]">Capaian</th>
                                    <th className="border-r border-b px-6 py-1 w-[100px]">Target</th>
                                    <th className="border-l border-b px-6 py-1 w-[100px]">Satuan</th>
                                </tr>
                                <tr className="bg-yellow-600 text-white">
                                    <th className="border-r border-b px-2 py-1 text-center">1</th>
                                    <th className="border-r border-b px-2 py-1 text-center">2</th>
                                    {branding?.user.roles == "super_admin" &&
                                        <th className="border-r border-b px-2 py-1 text-center"></th>
                                    }
                                    <th className="border-r border-b px-2 py-1 text-center">3</th>
                                    <th className="border-r border-b px-2 py-1 text-center">4</th>
                                    <th className="border-r border-b px-2 py-1 text-center">5</th>
                                    <th className="border-r border-b px-2 py-1 text-center">6</th>
                                    <th className="border-r border-b px-2 py-1 text-center">7</th>
                                    <th className="border-r border-b px-2 py-1 text-center">8</th>
                                    <th className="border-r border-b px-2 py-1 text-center">9</th>
                                    <th className="border-r border-b px-2 py-1 text-center">10</th>
                                    <th className="border-l border-b px-2 py-1 text-center">11</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Data.length > 0 ?
                                    Data.map((item: RB, index: number) => (
                                        <React.Fragment key={index}>
                                            <tr key={index}>
                                                <td rowSpan={item.indikator.length > 1 ? item.indikator.length + 1 : 2} className="border-x border-b border-yellow-600 py-4 px-3 text-center">{index + 1}</td>
                                                <td rowSpan={item.indikator.length > 1 ? item.indikator.length + 1 : 2} className="border-r border-b border-yellow-600 px-6 py-4 text-center">
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        <p>{item.jenis_rb || "-"}</p>
                                                        {item?.sudah_diambil ? 
                                                            <div className="flex items-center gap-1 px-2 bg-green-500 rounded-lg text-white">
                                                                <TbCircleCheck /> Digunakan
                                                            </div>
                                                        :
                                                            <div className="flex items-center gap-1 px-2 bg-gray-500 rounded-lg text-white">
                                                                <TbHourglassFilled /> Pending
                                                            </div>
                                                        }
                                                    </div>
                                                </td>
                                                {branding?.user?.roles == "super_admin" &&
                                                    <td rowSpan={item.indikator.length > 1 ? item.indikator.length + 1 : 2} className="border-r border-b border-yellow-600 px-6 py-4 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <ButtonSkyBorder
                                                                className="w-full flex items-center gap-1"
                                                                onClick={() => handleModalOpen("edit", item)}
                                                            >
                                                                <TbPencil />
                                                                Edit
                                                            </ButtonSkyBorder>
                                                            <ButtonRedBorder
                                                                className="w-full flex items-center gap-1"
                                                                onClick={() => AlertQuestion("Hapus", "Hapus Data RB?", "question", "Hapus", "Batal").then((resp) => {
                                                                    if (resp.isConfirmed) {
                                                                        hapusRB(item.id);
                                                                    }
                                                                })}
                                                            >
                                                                <TbTrash />
                                                                Hapus
                                                            </ButtonRedBorder>
                                                        </div>
                                                    </td>
                                                }
                                                <td rowSpan={item.indikator.length > 1 ? item.indikator.length + 1 : 2} className="border-r border-b border-yellow-600 px-6 py-4 text-center">{item.kegiatan_utama || "-"}</td>
                                                <td rowSpan={item.indikator.length > 1 ? item.indikator.length + 1 : 2} className="border-r border-b border-yellow-600 px-6 py-4 text-center">{item.keterangan || "-"}</td>
                                            </tr>
                                            {item.indikator ?
                                                item.indikator.map((i: IndikatorRB, sub_index: number) => (
                                                    <tr key={sub_index}>
                                                        <td className="border-r border-b border-yellow-600 px-6 py-4 text-center">{i.indikator || "-"}</td>
                                                        <td className="border-r border-b border-yellow-600 px-6 py-4 text-center">{i.target[0].target_baseline || "-"}</td>
                                                        <td className="border-r border-b border-yellow-600 px-6 py-4 text-center">{i.target[0].realisasi_baseline || "-"}</td>
                                                        <td className="border-r border-b border-yellow-600 px-6 py-4 text-center">{i.target[0].satuan_baseline || "-"}</td>
                                                        <td className="border-r border-b border-yellow-600 px-6 py-4 text-center italic">pengembangan</td>
                                                        <td className="border-r border-b border-yellow-600 px-6 py-4 text-center">{i.target[0].target_next || "-"}</td>
                                                        <td className="border-r border-b border-yellow-600 px-6 py-4 text-center">{i.target[0].satuan_next || "-"}</td>
                                                    </tr>
                                                ))
                                                :
                                                <tr>
                                                    <td colSpan={12} className="border-r border-b bg-red-300 text-white border-yellow-600 px-6 py-4 text-center">Indikator Kosong</td>
                                                </tr>
                                            }
                                        </React.Fragment>
                                    ))
                                    :
                                    <tr>
                                        <td className="px-6 py-3" colSpan={30}>
                                            Data Kosong / Belum Ditambahkan
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div >
                {ModalOpen &&
                    <ModalMasterRb
                        isOpen={ModalOpen}
                        onClose={() => handleModalOpen("tambah", null)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                        jenis={JenisModal}
                        tahun={Number(branding?.tahun?.value)}
                        Data={DataModal}
                    />
                }
            </>
        )
    }
} 