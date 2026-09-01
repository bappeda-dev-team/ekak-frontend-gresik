"use client";

import {
    ButtonRed,
    ButtonGreen,
    ButtonBlackBorder,
} from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TahunNull, OpdTahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import {
    TbPencil,
    TbTrash,
    TbCirclePlus,
    TbArrowBadgeDownFilled,
    TbEyeClosed,
    TbEye,
    TbAlertCircle,
    TbPrinter,
} from "react-icons/tb";
import { ModalSasaranOpd } from "./ModalSasaranOpd";
import { useCetakSasaranOpd } from "@/app/Renstra/sasaranopd/useCetakSasaranOpd";

interface OptionTypeString {
    value: string;
    label: string;
}

interface Target {
    id: string;
    target: string;
    satuan: string;
    tahun: string;
}

interface Indikator {
    id: string;
    indikator: string;
    definisi_operasional: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

interface Pelaksana {
    id: string;
    pegawai_id: string;
    nip: string;
    nama_pegawai: string;
}

interface SasaranOpd {
    id: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    nama_sasaran_opd: string;
    id_tujuan_opd: number;
    nama_tujuan_opd: string;
    nip: string;
    indikator: Indikator[];
}

interface Sasaran {
    id_pohon: number;
    nama_pohon: string;
    jenis_pohon: string;
    tahun_pohon: string;
    level_pohon: number;
    sasaran_opd: SasaranOpd[];
    pelaksana: Pelaksana[];
}

interface table {
    tipe: "laporan" | "opd";
    id_periode: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis: string;
    tahun_list: string[];
}

const Table: React.FC<table> = ({
    tipe,
    id_periode,
    tahun_awal,
    tahun_akhir,
    jenis,
    tahun_list,
}) => {
    const [Sasaran, setSasaran] = useState<Sasaran[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);

    const [isOpenNewSasaran, setIsOpenNewSasaran] = useState<boolean>(false);
    const [isOpenEditSasaran, setIsOpenEditSasaran] = useState<boolean>(false);
    const [PelaksanaOption, setPelaksanaOption] = useState<OptionTypeString[]>(
        [],
    );
    const [IdSasaran, setIdSasaran] = useState<string>("");
    const [NamaPohon, setNamaPohon] = useState<string>("");
    const [IdPohon, setIdPohon] = useState<number>(0);
    const [Hidden, setHidden] = useState<number[]>([]);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            };
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            };
            setSelectedOpd(opd);
        }
    }, []);

    const nama_opd =
        User?.roles == "super_admin" ? SelectedOpd?.label : User?.nama_opd;

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let url = "";
        if (User?.roles == "super_admin") {
            url = `sasaran_opd/findall/${SelectedOpd?.value}/${tahun_awal}/${tahun_akhir}/${jenis}`;
        } else {
            url = `sasaran_opd/findall/${User?.kode_opd}/${tahun_awal}/${tahun_akhir}/${jenis}`;
        }
        const fetchSasaranOpd = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (data === null) {
                    setDataNull(true);
                    setSasaran([]);
                } else if (result.code == 500) {
                    setPeriodeNotFound(true);
                    setSasaran([]);
                    console.log(result.data);
                } else if (result.code == 200 || result.code == 201) {
                    setDataNull(false);
                    setSasaran(data);
                    setError(false);
                } else {
                    setDataNull(false);
                    setSasaran([]);
                    setError(true);
                    console.log(result.data);
                }
            } catch (err) {
                setError(true);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (User?.roles !== undefined) {
            fetchSasaranOpd();
        }
    }, [token, User, FetchTrigger, tahun_awal, tahun_akhir, jenis, SelectedOpd]);

    const hapusSasaranOpd = async (id: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL}/sasaran_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                alert("response !ok saat hapus data tujuan pemda");
            }
            AlertNotification(
                "Berhasil",
                "Data Tujuan Pemda Berhasil Dihapus",
                "success",
                1000,
            );
            setFetchTrigger((prev) => !prev);
        } catch (err) {
            AlertNotification(
                "Gagal",
                "cek koneksi internet atau database server",
                "error",
                2000,
            );
            console.error(err);
        }
    };

    const { cetakPdfSasaranOpd } = useCetakSasaranOpd(
        Sasaran,
        nama_opd,
        tahun_awal,
        tahun_akhir,
        tahun_list,
    );

    const fetchOptionPelaksana = (pelaksana: Pelaksana[]) => {
        const data = pelaksana.map((item: Pelaksana) => ({
            value: item.nip,
            label: item.nama_pegawai,
        }));
        setPelaksanaOption(data);
    };

    const handleModalNewSasaran = (tema: number, nama: string) => {
        if (isOpenNewSasaran) {
            setIsOpenNewSasaran(false);
            setIdPohon(0);
            setNamaPohon("");
        } else {
            setIsOpenNewSasaran(true);
            setIdPohon(tema);
            setNamaPohon(nama);
        }
    };
    const handleModalEditSasaran = (id: string, tema: number, nama: string) => {
        if (isOpenEditSasaran) {
            setIsOpenEditSasaran(false);
            setIdSasaran("");
            setIdPohon(0);
            setNamaPohon("");
        } else {
            setIsOpenEditSasaran(true);
            setIdSasaran(id);
            setIdPohon(tema);
            setNamaPohon(nama);
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
                <h1 className="text-red-500 font-bold mx-5 py-5">
                    Error, Periksa koneksi internet atau database server, jika error masih
                    berlanjut hubungi tim developer
                </h1>
            </div>
        );
    } else if (PeriodeNotFound && Tahun?.value != undefined) {
        return (
            <div className="flex flex-col gap-3 border p-5 rounded-xl shadow-xl">
                <h1 className="text-yellow-500 font-base mx-5">
                    Tahun {Tahun?.value} tidak tersedia di data periode / periode dengan
                    tahun {Tahun?.value} belum di buat
                </h1>
                <h1 className="text-yellow-500 font-bold mx-5">
                    Tambahkan periode dengan tahun {Tahun?.value} di halaman Master
                    Periode (Super Admin)
                </h1>
            </div>
        );
    } else if (Tahun?.value == undefined) {
        return <TahunNull />;
    } else if (User?.roles == "super_admin") {
        if (SelectedOpd?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            );
        }
    }

    return (
        <div>
            {tipe === "opd" && (
                <div className="flex items-center justify-between px-5 py-2">
                    <ButtonBlackBorder
                        className="flex items-center gap-1"
                        onClick={cetakPdfSasaranOpd}
                    >
                        <TbPrinter />
                        Cetak
                    </ButtonBlackBorder>
                </div>
            )}
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[50px] text-center"
                            >
                                No
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[300px]"
                            >
                                Strategic OPD
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[300px]"
                            >
                                Pemilik
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[300px]"
                            >
                                Sasaran OPD
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[300px]"
                            >
                                Tujuan OPD
                            </th>
                            {tipe === "opd" && (
                                <th
                                    rowSpan={2}
                                    className="border-r border-b px-6 py-3 min-w-[100px]"
                                >
                                    Aksi
                                </th>
                            )}
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[200px]"
                            >
                                Indikator
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[200px]"
                            >
                                Definisi Operasional
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[200px]"
                            >
                                Rumus Perhitungan
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[200px]"
                            >
                                Sumber Data
                            </th>
                            {tahun_list.map((item: any) => (
                                <th
                                    key={item}
                                    colSpan={2}
                                    className="border-l border-b px-6 py-3 min-w-[100px]"
                                >
                                    {item}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            {tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">
                                        Target
                                    </th>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">
                                        Satuan
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[50px] text-center"
                            >
                                1
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[300px]"
                            >
                                2
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[300px]"
                            >
                                3
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[300px]"
                            >
                                4
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[300px]"
                            >
                                5
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[100px]"
                            >
                                6
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[200px]"
                            >
                                7
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[200px]"
                            >
                                8
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[200px]"
                            >
                                9
                            </th>
                            <th
                                rowSpan={2}
                                className="border-r border-b px-6 py-1 min-w-[200px]"
                            >
                                10
                            </th>
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <React.Fragment>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">11</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">12</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">13</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">14</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">15</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">16</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">17</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">18</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">19</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">20</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">21</th>
                                <th className="border-l border-b px-6 py-1 min-w-[50px]">22</th>
                            </React.Fragment>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data kosong / Strategic OPD Belum di tambahkan
                                </td>
                            </tr>
                        ) : (
                            Sasaran.map((data: Sasaran, index: number) => {
                                // Cek apakah data.tujuan_pemda ada
                                const hasSasaran = data.sasaran_opd.length != 0;
                                const TotalRow =
                                    data.sasaran_opd.reduce(
                                        (total, item) =>
                                            total +
                                            (item.indikator.length == 0 ? 1 : item.indikator.length),
                                        0,
                                    ) +
                                    data.sasaran_opd.length +
                                    1;

                                const toggleHidden = (id: number) => {
                                    setHidden((prev) =>
                                        prev.includes(id)
                                            ? prev.filter((item) => item !== id)
                                            : [...prev, id],
                                    );
                                };

                                const isHidden = Hidden.includes(data.id_pohon);

                                return (
                                    <React.Fragment key={index}>
                                        {/* Baris Utama */}
                                        <tr className={`${isHidden && "bg-red-300"}`}>
                                            <td
                                                className="border-x border-b border-emerald-500 px-6 py-4 text-center"
                                                rowSpan={data.sasaran_opd.length === 0 ? 2 : TotalRow}
                                            >
                                                {index + 1}
                                            </td>
                                            <td
                                                className="border-r border-b border-emerald-500 px-6 py-4"
                                                rowSpan={data.sasaran_opd.length === 0 ? 2 : TotalRow}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    {data.nama_pohon || "-"} - {data.tahun_pohon || ""}
                                                    {tipe === "opd" && (
                                                        <div className="flex items center gap-1 border-t border-emerald-500 pt-3">
                                                            <div className="flex justify-between  gap-2 h-full w-full">
                                                                {isHidden ? (
                                                                    <>
                                                                        <button
                                                                            className="flex justify-between gap-1 rounded-full p-1 bg-blue-400 text-white border border-blue-400 hover:bg-white hover:text-blue-400 hover:border hover:border-blue-400"
                                                                            onClick={() =>
                                                                                toggleHidden(data.id_pohon)
                                                                            }
                                                                        >
                                                                            <div className="flex gap-1">
                                                                                <TbEye />
                                                                                <p className="text-xs">Show</p>
                                                                            </div>
                                                                        </button>
                                                                        <button className="flex w-full justify-between gap-1 rounded-full p-1 border bg-black text-white">
                                                                            <div className="flex gap-1">
                                                                                <TbAlertCircle />
                                                                                <p className="text-xs">Disembunyikan</p>
                                                                            </div>
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            className="flex justify-between gap-1 rounded-full p-1 bg-red-400 text-white border border-red-400 hover:bg-white hover:text-red-400 hover:border hover:border-red-400"
                                                                            onClick={() =>
                                                                                toggleHidden(data.id_pohon)
                                                                            }
                                                                        >
                                                                            <div className="flex gap-1">
                                                                                <TbEyeClosed />
                                                                                <p className="text-xs">Hidden</p>
                                                                            </div>
                                                                        </button>
                                                                        <button
                                                                            className="flex w-full justify-between gap-1 rounded-full p-1 bg-sky-500 text-white border border-sky-500 hover:bg-white hover:text-sky-500 hover:border hover:border-sky-500"
                                                                            onClick={() => {
                                                                                handleModalNewSasaran(
                                                                                    data.id_pohon,
                                                                                    data.nama_pohon,
                                                                                );
                                                                                fetchOptionPelaksana(data.pelaksana);
                                                                            }}
                                                                        >
                                                                            <div className="flex gap-1">
                                                                                <TbCirclePlus />
                                                                                <p className="text-xs">
                                                                                    Tambah Sasaran
                                                                                </p>
                                                                            </div>
                                                                            <TbArrowBadgeDownFilled className="-rotate-90" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td
                                                className="border-r border-b border-emerald-500 px-6 py-4"
                                                rowSpan={data.sasaran_opd.length === 0 ? 2 : TotalRow}
                                            >
                                                {data.pelaksana.length == 0 ? (
                                                    <p className="text-red-500">
                                                        Pelaksana Belum Di Pilih
                                                    </p>
                                                ) : (
                                                    data.pelaksana.map((p: Pelaksana) => (
                                                        <p
                                                            key={p.id}
                                                            className="flex flex-col justify-center gap-1"
                                                        >
                                                            {p.nama_pegawai} ({p.nip})
                                                        </p>
                                                    ))
                                                )}
                                            </td>
                                        </tr>
                                        {hasSasaran ? (
                                            data.sasaran_opd.map((item: SasaranOpd) => (
                                                <React.Fragment key={item.id}>
                                                    <tr>
                                                        <td
                                                            className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]"
                                                            rowSpan={
                                                                item.indikator.length !== 0
                                                                    ? item.indikator.length + 1
                                                                    : 2
                                                            }
                                                        >
                                                            <div className="flex flex-col items-center gap-3">
                                                                {item.nama_sasaran_opd || "-"}
                                                                {/* <div className="flex items-center gap-1 py-1 px-3 rounded-xl bg-red-300 text-red-700">
                                                                    <TbEyeClosed />
                                                                    disembunyikan
                                                                </div> */}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]"
                                                            rowSpan={
                                                                item.indikator.length !== 0
                                                                    ? item.indikator.length + 1
                                                                    : 2
                                                            }
                                                        >
                                                            {item.nama_tujuan_opd ? (
                                                                <p>{item.nama_tujuan_opd || "-"}</p>
                                                            ) : (
                                                                <p className="italic text-red-300 font-thin">
                                                                    tujuan opd belum di pilih
                                                                </p>
                                                            )}
                                                        </td>
                                                        {tipe === "opd" && (
                                                            <td
                                                                className="border-x border-b border-emerald-500 px-6 py-6"
                                                                rowSpan={
                                                                    item.indikator.length !== 0
                                                                        ? item.indikator.length + 1
                                                                        : 2
                                                                }
                                                            >
                                                                <div className="flex flex-col justify-center items-center gap-2">
                                                                    <ButtonGreen
                                                                        className="flex items-center gap-1 w-full"
                                                                        onClick={() => {
                                                                            handleModalEditSasaran(
                                                                                item.id,
                                                                                data.id_pohon,
                                                                                data.nama_pohon,
                                                                            );
                                                                            fetchOptionPelaksana(data.pelaksana);
                                                                        }}
                                                                    >
                                                                        <TbPencil />
                                                                        Edit
                                                                    </ButtonGreen>
                                                                    <ButtonRed
                                                                        className="flex items-center gap-1 w-full"
                                                                        onClick={() => {
                                                                            AlertQuestion(
                                                                                "Hapus?",
                                                                                "Hapus Sasaran Pemda yang dipilih?",
                                                                                "question",
                                                                                "Hapus",
                                                                                "Batal",
                                                                            ).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    hapusSasaranOpd(item.id);
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <TbTrash />
                                                                        Hapus
                                                                    </ButtonRed>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                    {/* INDIKATOR */}
                                                    {item.indikator.length === 0 ? (
                                                        <React.Fragment>
                                                            <tr>
                                                                <td
                                                                    colSpan={30}
                                                                    className="border-x border-b border-emerald-500 px-6 py-6 bg-yellow-500 text-white"
                                                                >
                                                                    indikator sasaran opd belum di tambahkan
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ) : (
                                                        item.indikator.map((i: Indikator) => (
                                                            <tr key={i.id}>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">
                                                                    {i.indikator || "-"}
                                                                </td>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">
                                                                    {i.definisi_operasional || "-"}
                                                                </td>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">
                                                                    {i.rumus_perhitungan || "-"}
                                                                </td>
                                                                <td className="border-x border-b border-emerald-500 px-6 py-6">
                                                                    {i.sumber_data || "-"}
                                                                </td>
                                                                {i.target.length === 0
                                                                    ? [...Array(6)].map((_, em_index: number) => (
                                                                        <React.Fragment key={em_index}>
                                                                            <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">
                                                                                -
                                                                            </td>
                                                                            <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">
                                                                                -
                                                                            </td>
                                                                        </React.Fragment>
                                                                    ))
                                                                    : i.target.map((t: Target) => (
                                                                        <React.Fragment key={t.id}>
                                                                            <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">
                                                                                {t.target || "-"}
                                                                            </td>
                                                                            <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">
                                                                                {t.satuan || "-"}
                                                                            </td>
                                                                        </React.Fragment>
                                                                    ))}
                                                            </tr>
                                                        ))
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    className="border-r border-b border-emerald-500 px-6 py-4 bg-red-400 text-white"
                                                    colSpan={30}
                                                >
                                                    Sasaran OPD belum di buat
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
                {/* MODAL NEW SASARAN */}
                <ModalSasaranOpd
                    metode="baru"
                    id_pohon={IdPohon}
                    nama_pohon={NamaPohon}
                    tahun={Tahun?.value}
                    tahun_list={tahun_list}
                    periode={id_periode}
                    tahun_awal={tahun_awal}
                    tahun_akhir={tahun_akhir}
                    jenis_periode={jenis}
                    kode_opd={
                        User?.roles == "super_admin" ? SelectedOpd?.value : User?.kode_opd
                    }
                    isOpen={isOpenNewSasaran}
                    onClose={() => handleModalNewSasaran(0, "")}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
                {/* MODAL EDIT SASARAN */}
                <ModalSasaranOpd
                    metode="lama"
                    nama_pohon={NamaPohon}
                    id_pohon={IdPohon}
                    id={IdSasaran}
                    tahun={Tahun?.value}
                    tahun_list={tahun_list}
                    periode={id_periode}
                    tahun_awal={tahun_awal}
                    tahun_akhir={tahun_akhir}
                    kode_opd={
                        User?.roles == "super_admin" ? SelectedOpd?.value : User?.kode_opd
                    }
                    jenis_periode={jenis}
                    isOpen={isOpenEditSasaran}
                    onClose={() => handleModalEditSasaran("", 0, "")}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
        </div>
    );
};

export default Table;
