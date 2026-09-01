"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RowInput } from "jspdf-autotable";

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
    id_tujuan_opd: number,
    nama_tujuan_opd: string,
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

export function useCetakSasaranOpd(
    data: Sasaran[],
    nama_opd: string,
    tahun_awal: string,
    tahun_akhir: string,
    tahun_list: string[],
) {
    const cetakPdfSasaranOpd = () => {
        if (!data) return;

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a3",
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);

        doc.text(
            "Sasaran OPD",
            pageWidth / 2,
            12,
            { align: "center" }
        );

        doc.setFontSize(12);
        doc.text(
            nama_opd,
            pageWidth / 2,
            20,
            { align: "center" }
        );
        doc.text(
            `Periode ${tahun_awal} - ${tahun_akhir}`,
            pageWidth / 2,
            28,
            { align: "center" }
        );

        const body: any[] = [];

        data.forEach((item: Sasaran, index: number) => {
            const sasaranList = item.sasaran_opd || [];

            if (sasaranList.length === 0) {
                const row: any[] = [
                    {
                        content: `${index + 1}`,
                        styles: { halign: "center" },
                    },
                    {
                        content: `${item.nama_pohon || "-"} (${item.tahun_pohon || 0})`,
                    },
                    {
                        content: `-`,
                        styles: { halign: "center" },
                    },
                    {
                        content: "-",
                        styles: { halign: "center" },
                    },
                    {
                        content: "-",
                        styles: { halign: "center" },
                    },
                    {
                        content: "-",
                        styles: { halign: "center" },
                    },
                    {
                        content: "-",
                        styles: { halign: "center" },
                    },
                    {
                        content: "-",
                        styles: { halign: "center" },
                    },
                    {
                        content: "-",
                        styles: { halign: "center" },
                    },
                ];

                tahun_list.forEach(() => {
                    row.push(
                        {
                            content: "-",
                            styles: { halign: "center" },
                        },
                        {
                            content: "-",
                            styles: { halign: "center" },
                        }
                    );
                });

                body.push(row);
                return;
            }

            const totalIndikatorRows = sasaranList.reduce((total, tujuan) => {
                return total + Math.max(tujuan.indikator?.length || 0, 1);
            }, 0);

            let isFirstUrusanRow = true;

            sasaranList.forEach((tujuanItem) => {
                const indikatorList = tujuanItem.indikator?.length
                    ? tujuanItem.indikator
                    : [null];

                let isFirstTujuanRow = true;

                indikatorList.forEach((indikatorItem) => {
                    const row: any[] = [];

                    if (isFirstUrusanRow) {
                        row.push(
                            {
                                content: `${index + 1}`,
                                rowSpan: totalIndikatorRows,
                                styles: { halign: "center" },
                            },
                            {
                                content: `${item.nama_pohon || "-"} (${item.tahun_pohon || 0})`,
                                rowSpan: totalIndikatorRows,
                            },
                            {
                                content: item.pelaksana
                                    ?.map((p) =>
                                        `${p.nama_pegawai || "-"}\n(${p.nip || "-"})`
                                    )
                                    .join("\n\n") || "-",
                                rowSpan: totalIndikatorRows,
                                styles: { halign: "center" },
                            }
                        );

                        isFirstUrusanRow = false;
                    }

                    if (isFirstTujuanRow) {
                        row.push(
                            {
                                content: `${tujuanItem.nama_sasaran_opd || "-"}`,
                                rowSpan: indikatorList.length,
                                styles: { halign: "left" },
                            },
                            {
                                content: `${tujuanItem.nama_tujuan_opd || "-"}`,
                                rowSpan: indikatorList.length,
                                styles: { halign: "left" },
                            }
                        );

                        isFirstTujuanRow = false;
                    }

                    row.push(
                        {
                            content: indikatorItem?.indikator || "-",
                            styles: { halign: "left" },
                        },
                        {
                            content: indikatorItem?.definisi_operasional || "-",
                            styles: { halign: "left" },
                        },
                        {
                            content: indikatorItem?.rumus_perhitungan || "-",
                            styles: { halign: "left" },
                        },
                        {
                            content: indikatorItem?.sumber_data || "-",
                            styles: { halign: "left" },
                        }
                    );

                    tahun_list.forEach((tahun) => {
                        const targetItem = indikatorItem?.target?.find(
                            (target) => target.tahun === tahun
                        );

                        row.push(
                            {
                                content: targetItem?.target || "-",
                                styles: { halign: "center" },
                            },
                            {
                                content: targetItem?.satuan || "-",
                                styles: { halign: "center" },
                            }
                        );
                    });

                    body.push(row);
                });
            });
        });

        const headerRow1 = [
            { content: "No", rowSpan: 2, styles: { halign: "center" } },
            { content: "Strategic OPD", rowSpan: 2, styles: { halign: "center" } },
            { content: "Pemilik", rowSpan: 2, styles: { halign: "center" } },
            { content: "Sasaran OPD", rowSpan: 2, styles: { halign: "center" } },
            { content: "Tujuan OPD", rowSpan: 2, styles: { halign: "center" } },
            { content: "Indikator", rowSpan: 2, styles: { halign: "center" } },
            { content: "Definisi Operasional", rowSpan: 2, styles: { halign: "center" } },
            { content: "Rumus Perhitungan", rowSpan: 2, styles: { halign: "center" } },
            { content: "Sumber Data", rowSpan: 2, styles: { halign: "center" } },

            ...tahun_list.map((tahun) => ({
                content: tahun.toString(),
                colSpan: 2,
                styles: { halign: "center" },
            })),
        ];
        const headerRow2 = tahun_list.flatMap(() => [
            "Target",
            "Satuan",
        ]);
        const headerRow3 = Array.from({ length: 21 }, (_, index) => `${index + 1}`);

        autoTable(doc, {
            startY: 38,
            theme: "grid",
            head: [
                headerRow1,
                headerRow2,
                headerRow3
            ] as RowInput[],
            body,
            styles: {
                fontSize: 9,
                valign: "middle",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: '#10B981', // emerald
                textColor: [255, 255, 255], // putih
                fontStyle: "bold",
                overflow: "linebreak",
                halign: "center",
                lineWidth: 0.1,
                lineColor: [0, 0, 0], // hitam
            },
        });

        doc.save(`Sasaran OPD ${nama_opd || "unknown"} Periode ${tahun_awal || "-"}-${tahun_akhir || "-"}`);
    };

    return { cetakPdfSasaranOpd };
}
