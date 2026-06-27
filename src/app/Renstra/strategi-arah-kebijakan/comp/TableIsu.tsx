'use client'

import React, { useEffect, useState } from "react";
import { IsuStrategisOpd } from "../type";

interface Table {
    Data: IsuStrategisOpd[];
}

const TableIsu: React.FC<Table> = ({ Data }) => {

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-amber-500 text-white">
                            <th className="border-r border-b px-6 py-3 w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Isu Strategis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data.length === 0 ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Data.map((data: IsuStrategisOpd, index: number) => (
                                <tr key={index}>
                                    <td className="border-r border-b px-6 py-2 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-2">{data.nama_isu_strategis || "-"}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TableIsu;