'use client'

import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";

const Table = () => {

    // const [Data, setData] = useState<Pokin[]>([]);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const { branding } = useBrandingContext();

    // useEffect(() => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     const fetchIkuOpd = async () => {
    //         setLoading(true);
    //         setError(false);
    //         try {
    //             const response = await fetch(`${API_URL}/pohon_kinerja_opd/leaderboard_pokin_opd/${tahun}`, {
    //                 headers: {
    //                     Authorization: `${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });
    //             const result = await response.json();
    //             if (result.code === 200) {
    //                 setData(result.data);
    //             } else if (result.code === 401) {
    //                 window.location.href = "/login";
    //             } else {
    //                 setData([]);
    //                 setError(true);
    //             }
    //         } catch (err) {
    //             setError(true);
    //             console.error(err)
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     if (tahun != undefined) {
    //         fetchIkuOpd();
    //     }
    // }, [token, tahun]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
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
                                <th rowSpan={2} className="border-r border-b px-6 py-3 w-[350px]">Dewan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pokir</th>
                                <th colSpan={4} className="border-r border-b px-6 py-3 min-w-[500px]">Lokasi</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 w-[100px]">OPD</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 w-[100px]">Sub Kegiatan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 w-[100px]">Nama Pelaksana</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 w-[100px]">Pagu Sub Kegiatan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 w-[100px]">Rekin</th>
                            </tr>
                            <tr className="bg-blue-700 text-white">
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">Kecamatan</th>
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">Kelurahan</th>
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">Alamat</th>
                                <th className="border-r border-b px-2 py-1 w-[150px] text-center">Keterangan</th>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-x border-b border-blue-500 py-4 px-3 text-center">1</td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                                <td className="border-x border-b border-blue-500 py-4 px-3"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Table;
