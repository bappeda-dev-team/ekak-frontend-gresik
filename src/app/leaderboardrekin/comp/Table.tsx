'use client'

import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { ButtonRedBorder, ButtonSkyBorder, ButtonBlackBorder } from "@/components/global/Button";
import { TbEye, TbEyeClosed, TbFileDatabase, TbPrinter } from "react-icons/tb";
import { Pokin, Pohon } from "../type";
import ModalCetakLeaderboardRekin from "./ModalCetakLeaderboardRekin";

interface Table {
    tahun: number;
}

export const Table: React.FC<Table> = ({ tahun }) => {

    const [Data, setData] = useState<Pokin[]>([]);
    const [DataCetak, setDataCetak] = useState<Pokin[]>([]);
    const [Error, setError] = useState<boolean | null>(null);

    const [Cetak, setCetak] = useState<boolean>(false);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const token = getToken();
    const { branding } = useBrandingContext();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIkuOpd = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/leaderboard_pokin_opd/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setData(result.data);
                    const DataFilter = result.data.filter((item: Pokin) => item.is_hidden === false);
                    setDataCetak(DataFilter);
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
        if (tahun != undefined) {
            fetchIkuOpd();
        }
    }, [token, tahun]);

    const handleUpdate = (dataUpdate: Pokin) => {
        setData(prev => {
            const updated = prev.map(p =>
                p.kode_opd === dataUpdate.kode_opd
                    ? { ...p, ...dataUpdate }
                    : p
            );

            const DataFilter = updated.filter(item => item.is_hidden === false);
            setDataCetak(DataFilter);

            return updated;
        });
    };

    const handleModalCetak = () => {
        if (Cetak) {
            setCetak(false);
        } else {
            setCetak(true);
        }
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
            <div className="flex flex-col w-full items-center">
                <div className="flex justify-start w-full">
                    <ButtonSkyBorder
                        className="w-full flex items-center gap-1"
                        onClick={handleModalCetak}
                    >
                        <TbPrinter />
                        Cetak
                    </ButtonSkyBorder>
                </div>
                <div className="overflow-auto m-2 rounded-t-xl border w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-orange-500 text-white">
                                <th className="border-r border-b px-6 py-3 text-center">No</th>
                                <th className="border-r border-b px-6 py-3 w-[350px]">Perangkat Daerah</th>
                                <th className="border-r border-b px-6 py-3 w-[100px]">Persentase Cascading</th>
                                <th className="border-r border-b px-6 py-3 w-[100px]">Aksi</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Tema</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Sub Tema</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Sub Sub Tema</th>
                            </tr>
                            <tr className="bg-orange-700 text-white">
                                <th className="border-r border-b px-2 py-1 text-center">1</th>
                                <th className="border-r border-b px-2 py-1 text-center">2</th>
                                <th className="border-r border-b px-2 py-1 text-center">3</th>
                                <th className="border-r border-b px-2 py-1 text-center">4</th>
                                <th className="border-r border-b px-2 py-1 text-center">5</th>
                                <th className="border-r border-b px-2 py-1 text-center">6</th>
                                <th className="border-r border-b px-2 py-1 text-center">7</th>
                            </tr>
                        </thead>
                        <Body
                            Data={Data || []}
                            tahun={tahun}
                            token={token || ""}
                            onUpdate={handleUpdate}
                        />
                    </table>
                </div>
                {Cetak &&
                    <ModalCetakLeaderboardRekin
                        onClose={handleModalCetak}
                        isOpen={Cetak}
                        Data={DataCetak}
                        tahun={tahun}
                    />
                }
            </div>
        )
    }
}

interface Body {
    Data: Pokin[];
    tahun: number;
    token: string;
    onUpdate: (data: Pokin) => void;
}

export const Body: React.FC<Body> = ({ Data, tahun, token, onUpdate }) => {

    const { branding } = useBrandingContext();
    const [LoadingHidden, setLoadingHidden] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);

    const hitungTotalBaris = (pohon: Pohon[] | undefined): number => {
        if (!pohon || pohon.length === 0) return 1; // Minimal 1 baris untuk teks "Tidak ada..."

        let total = 0;
        pohon.forEach(item => {
            // Jika punya subsubtematik, hitung jumlahnya. 
            // Jika tidak, cek subtematik. Jika tidak ada keduanya, hitung 1 baris.
            const childCount = Math.max(
                hitungTotalBaris(item.child),
                hitungTotalBaris(item.child)
            );

            // Dalam kasus Anda, sepertinya strukturnya adalah Tematik -> Sub -> SubSub.
            // Jika ini adalah hierarki murni, kita harus menjumlahkan semua leaf nodes.
            total += hitungJumlahLeaf(item);
        });
        return total;
    };
    const hitungTotalBarisOPD = (tematik: Pohon[] | null | undefined): number => {
        if (!tematik || tematik.length === 0) return 1;

        return tematik.reduce((acc, t) => {
            // Hitung baris untuk subtematik, jika null anggap 1 baris
            const jumlahSub = (t?.child || []).reduce((accSub, st) => {
                // Hitung baris untuk subsubtematik, jika null anggap 1 baris
                const jumlahSubSub = st?.child?.length || 1;
                return accSub + jumlahSubSub;
            }, 0) || 1; // Jika subtematik kosong/null, tetap butuh 1 baris untuk nama tematik

            return acc + jumlahSub;
        }, 0);
    };

    // Fungsi spesifik untuk menghitung total baris paling ujung (leaf)
    const hitungJumlahLeaf = (item: Pohon): number => {
        let count = 0;
        if (item.child && item.child.length > 0) {
            item.child.forEach(sub => {
                if (sub.child && sub.child.length > 0) {
                    count += sub.child.length;
                } else {
                    count += 1; // baris untuk subtematik itu sendiri
                }
            });
        } else {
            count = 1; // baris untuk tematik itu sendiri
        }
        return count;
    };

    const hiddenLeader = async (is_hidden: boolean, kode: string, onSuccess: () => void) => {
        let url = `${branding?.api_perencanaan}/leaderboard_rekin_hidden/upsert`
        const formValue = {
            kode_opd: kode,
            tahun: String(tahun),
            is_hidden: is_hidden,
        }
        console.log(formValue);
        try {
            setLoadingHidden(true);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValue),
            })
            const result = await response.json();
            if (result.code === 200) {
                AlertNotification("Berhasil", "", "success", 2000);
                onSuccess();
                onUpdate(result.data)
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            console.log(err);
            AlertNotification("Gagal", `${err}`, "error", 2000);
        } finally {
            setLoadingHidden(false);
        }
    }
    const clonePokinRekin = async (kode_opd: string) => {
        const payload = {
            //key : value
            kode_opd: kode_opd,
            tahun_sumber: String(tahun),
            tahun_tujuan: String(tahun + 1),
        };
        console.log(payload);
        AlertNotification("Dalam Pengembangan", "", "info", 3000);
        // try {
        //     setProses(true);
        //     const response = await fetch(`${branding?.api_perencanaan}/clone`, {
        //         method: "POST",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(payload),
        //     });
        //     const result = await response.json();
        //     if (result.code === 200 || result.code === 201) {
        //         AlertNotification("Berhasil", "Berhasil Clone Pokin", "success", 1000);
        //     } else {
        //         AlertNotification(`Gagal`, `${result.data}`, "error", 2000);
        //         console.log(result);
        //     }
        // } catch (err) {
        //     AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        // } finally {
        //     setProses(false);
        // }
    }

    return (
        <tbody>
            {(!Data || Data.length === 0) ?
                <tr>
                    <td className="px-6 py-3" colSpan={30}>
                        Data Kosong / Belum Ditambahkan
                    </td>
                </tr>
                :
                Data.map((item: Pokin, index: number) => {
                    // Pastikan tematik adalah array agar reduce tidak error
                    const daftarTematik = item.tematik || [];
                    const totalBarisOPD = hitungTotalBarisOPD(daftarTematik);

                    const [Hidden, setHidden] = useState<boolean>(item.is_hidden);
                    const handleHidden = () => { setHidden((prev) => !prev) }

                    return (
                        <React.Fragment key={index}>
                            {daftarTematik.length === 0 ? (
                                <tr className={`${Hidden && "bg-red-300"}`}>
                                    <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b border-orange-500 px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            {item.nama_opd}
                                            {Hidden &&
                                                <h1 className="flex items-center justify-center gap-1 text-sm bg-red-500 text-white p-1 rounded-lg ">
                                                    Disembunyikan
                                                </h1>
                                            }
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.persentase_cascading}</td>
                                    <td rowSpan={totalBarisOPD} className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {item.persentase_cascading === "100%" &&
                                                <ButtonBlackBorder
                                                    className="flex items-center gap-1 w-full"
                                                    disabled={Proses}
                                                    onClick={() => AlertQuestion("Clone Pokin", `Clone Pokin ke ${branding?.tahun?.value}?`, "question", "Clone", "Batal").then((resp) => {
                                                        if (resp.isConfirmed) {
                                                            clonePokinRekin(item.kode_opd);
                                                        }
                                                    })}
                                                >
                                                    <TbFileDatabase />
                                                    Clone
                                                </ButtonBlackBorder>
                                            }
                                            {Hidden ?
                                                <ButtonSkyBorder
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => hiddenLeader(!item.is_hidden, item.kode_opd, handleHidden)}
                                                >
                                                    <TbEye />
                                                    Show
                                                </ButtonSkyBorder>
                                                :
                                                <ButtonRedBorder
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => hiddenLeader(!item.is_hidden, item.kode_opd, handleHidden)}
                                                >
                                                    <TbEyeClosed />
                                                    Hidden
                                                </ButtonRedBorder>
                                            }
                                        </div>
                                    </td>
                                    <td colSpan={3} className="border-b border-orange-500 text-white bg-orange-300 px-6 py-4">
                                        Tidak terlibat di tematik manapun
                                    </td>
                                </tr>
                            ) : (
                                /* Jika Tematik Ada */
                                daftarTematik.map((t, tIdx) => {
                                    const daftarSub = t?.child || [];
                                    const rowSpanTematik = daftarSub.reduce((acc, st) =>
                                        acc + (st?.child?.length || 1), 0) || 1;

                                    return (
                                        <React.Fragment key={tIdx}>
                                            {(daftarSub.length ? daftarSub : [null]).map((st, stIdx) => {
                                                const daftarSubSub = st?.child || [];
                                                const subsubList = daftarSubSub.length ? daftarSubSub : [null];

                                                return subsubList.map((sst, sstIdx) => {
                                                    const isFirstRowInOPD = tIdx === 0 && stIdx === 0 && sstIdx === 0;
                                                    const isFirstRowInTematik = stIdx === 0 && sstIdx === 0;
                                                    const isFirstRowInSub = sstIdx === 0;

                                                    return (
                                                        <tr key={`${tIdx}-${stIdx}-${sstIdx}`}>
                                                            {isFirstRowInOPD && (
                                                                <>
                                                                    <td rowSpan={totalBarisOPD} className="border-r border-b border-orange-500 px-6 py-4 text-center">{index + 1}</td>
                                                                    <td rowSpan={totalBarisOPD} className="border-r border-b border-orange-500 px-6 py-4">
                                                                        <div className="flex flex-col gap-2">
                                                                            {item.nama_opd}
                                                                            {Hidden &&
                                                                                <h1 className="flex items-center justify-center gap-1 text-sm bg-red-500 text-white p-1 rounded-lg ">
                                                                                    Disembunyikan
                                                                                </h1>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td rowSpan={totalBarisOPD} className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.persentase_cascading}</td>
                                                                    <td rowSpan={totalBarisOPD} className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                                        <div className="flex flex-col items-center gap-1">
                                                                            {item.persentase_cascading === "100%" &&
                                                                                <ButtonBlackBorder
                                                                                    className="flex items-center gap-1 w-full"
                                                                                    disabled={Proses}
                                                                                    onClick={() => AlertQuestion("Clone Pokin", `Clone Pokin ke ${branding?.tahun?.value}?`, "question", "Clone", "Batal").then((resp) => {
                                                                                        if (resp.isConfirmed) {
                                                                                            clonePokinRekin(item.kode_opd);
                                                                                        }
                                                                                    })}
                                                                                >
                                                                                    <TbFileDatabase />
                                                                                    Clone
                                                                                </ButtonBlackBorder>
                                                                            }
                                                                            <ButtonRedBorder
                                                                                className="flex items-center gap-1 w-full"
                                                                                onClick={() => AlertNotification("Dalam Pengembangan", "", "info", 2000)}
                                                                            >
                                                                                <TbEyeClosed />
                                                                                Hidden
                                                                            </ButtonRedBorder>
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            )}
                                                            {isFirstRowInTematik && (
                                                                <td rowSpan={rowSpanTematik} className="border-r border-b border-orange-500 px-6 py-4">
                                                                    {t?.nama || "-"}
                                                                </td>
                                                            )}
                                                            {isFirstRowInSub && (
                                                                <td rowSpan={subsubList.length} className="border-r border-b border-orange-500 px-6 py-4">
                                                                    {st?.nama || "-"}
                                                                </td>
                                                            )}
                                                            <td className="border-b border-orange-500 px-6 py-4">
                                                                {sst?.nama || "-"}
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                            })}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </React.Fragment>
                    );
                })
            }
        </tbody>
    )
}