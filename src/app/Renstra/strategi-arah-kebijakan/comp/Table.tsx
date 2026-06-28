'use client'

import React from "react";
import { ArahKebijakan, SasaranOpd, ArahKebijakanOpd } from "../type";
import { ButtonRedBorder } from "@/components/global/Button";
import { TbEyeClosed } from "react-icons/tb";

interface Table {
    Data: ArahKebijakan[];
}

const Table: React.FC<Table> = ({ Data }) => {

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-r border-b px-6 py-3 text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan OPD</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Sasaran OPD</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Strategic OPD</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Arah Kebijakan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data.length === 0 ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            Data.map((item: ArahKebijakan, index: number) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan={item.sasaran_opds ? item.sasaran_opds.length + 1 : 2} className="border-x border-b border-emerald-500 py-4 px-3 text-center">{index + 1}</td>
                                        <td rowSpan={item.sasaran_opds ? item.sasaran_opds.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4 font-semibold">{item.tujuan_opd || "-"}</td>
                                    </tr>
                                    {item.sasaran_opds ?
                                        item.sasaran_opds.map((s: SasaranOpd, s_index: number) => (
                                            <tr key={s_index}>
                                                <td className="border-r border-b border-emerald-500 px-6 py-4">{s.sasaran_opd || ""}</td>
                                                <td className="border-r border-b border-emerald-500 px-6 py-4">{s.strategi_opd || ""}</td>
                                                {s.arah_kebijakan_opds ?
                                                    <td className="border-r border-b p-2 border-emerald-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            {s.arah_kebijakan_opds.map((ar: ArahKebijakanOpd, ar_index: number) => (
                                                                <p key={ar_index} className="flex flex-col gap-2 p-1 border border-emerald-500 rounded-lg w-full">
                                                                    {ar_index + 1}. {ar.arah_kebijakan_opd || "-"}
                                                                    <ButtonRedBorder className="flex items-center gap-1 text-sm">
                                                                        <TbEyeClosed /> Sembunyikan
                                                                    </ButtonRedBorder>
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    :
                                                    <td className="border-r border-b border-emerald-500 bg-red-400 px-6 py-4 font-semibold">
                                                        Stategic OPD belum di buat
                                                    </td>
                                                }
                                            </tr>
                                        ))
                                        :
                                        <td colSpan={3} className="border-r border-b border-emerald-500 px-6 py-4 font-semibold bg-red-300">sasaran pemda belum di buat</td>
                                    }
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
