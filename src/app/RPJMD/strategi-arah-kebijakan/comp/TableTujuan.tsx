'use client'

import React, { useEffect, useState } from "react";
import { TujuanOpd } from "../type";

interface Table {
    Data: TujuanOpd[];
}

const TableTujuan: React.FC<Table> = ({ Data }) => {

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border-r border-b px-6 py-3 w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Tujuan OPD</th>
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
                            Data.map((data: TujuanOpd, index: number) => (
                                <tr key={data.id || index}>
                                    <td className="border-r border-b px-6 py-2 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-2">{data.tujuan || "-"}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TableTujuan;