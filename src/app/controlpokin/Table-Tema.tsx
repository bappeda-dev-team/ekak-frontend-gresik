'use client'

import React from "react";

interface Tema {
    nama: string;
    child: Tema[];
}

interface TableTema {
    Data: Tema[];
}

const TableTema: React.FC<TableTema> = ({ Data }) => {
    return (
        <div className="flex flex-col w-full items-center">
            <div className="overflow-auto m-2 rounded-t-xl border w-full">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-r border-b px-6 py-3 w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Tema</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Sub Tema</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Sub Sub Tema</th>
                        </tr>
                        <tr className="bg-emerald-700 text-white">
                            <th className="border-r border-b px-2 py-1 text-center">1</th>
                            <th className="border-r border-b px-2 py-1 text-center">2</th>
                            <th className="border-r border-b px-2 py-1 text-center">3</th>
                            <th className="border-r border-b px-2 py-1 text-center">4</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data?.length === 0 ?
                            <tr>
                                <td colSpan={4} className="border-r border-b border-emerald-500 px-6 py-4">
                                    Tidak terlibat di tematik manapun
                                </td>
                            </tr>
                            :
                            Data?.map((tema: Tema, index: number) => {

                                const panjangSubTema = tema.child.length === 0 ? 1 : tema.child.length
                                const panjangSubSubTema = tema.child.reduce((acc: number, st: Tema) => {
                                    const subSubTemaLength = st.child.length === 0 ? 1 : st.child.length
                                    return acc + subSubTemaLength
                                }, 0)
                                const Total = panjangSubTema + panjangSubSubTema + 1;
                                console.log(`${tema.nama} sub sub tema: `, panjangSubSubTema)


                                return (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td rowSpan={Total} className="border-r border-b border-emerald-500 px-6 py-4 text-center">{index + 1}</td>
                                            <td rowSpan={Total} className="border-r border-b border-emerald-500 px-6 py-4 font-bold">{tema.nama || "-"}</td>
                                        </tr>
                                        {tema.child.length === 0 ?
                                            <tr>
                                                <td className="border-b border-r border-emerald-500 px-6 py-4">-</td>
                                                <td className="border-b border-emerald-500 px-6 py-4">-</td>
                                            </tr>
                                            :
                                            tema.child.map((s: Tema, s_index: number) => {

                                                const subLength = s.child.length === 0 ? 1 : s.child.length;

                                                return (
                                                    (
                                                        <React.Fragment key={s_index}>
                                                            <tr>
                                                                <td rowSpan={subLength + 1} className="border-r border-b border-emerald-500 px-6 py-4">{s.nama || "-"}</td>
                                                            </tr>
                                                            {s.child.length === 0 ?
                                                                <tr>
                                                                    <td className="border-b border-emerald-500 px-6 py-4">-</td>
                                                                </tr>
                                                                :
                                                                s.child.map((ss: Tema, ss_index: number) => (
                                                                    <tr key={ss_index}>
                                                                        <td className="border-b border-emerald-500 px-6 py-4">{ss.nama || "-"}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </React.Fragment>
                                                    )
                                                )
                                            })
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableTema;
