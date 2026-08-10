"use client";

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { OpdNull, TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import {
  ButtonSkyBorder,
  ButtonBlackBorder,
  ButtonGreenBorder,
  ButtonRedBorder,
} from "@/components/global/Button";
import { TbCirclePlus, TbRefresh } from "react-icons/tb";
import { ModalIkk } from "./ModalIkk";
import { PotensiFindall } from "../type";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbTrash, TbPencil } from "react-icons/tb";

interface Table {
  kode_opd: string;
  Tahun: {
    value: number;
    label: string;
  } | null;
}

const Table: React.FC<Table> = ({ kode_opd, Tahun }) => {
  const [Data, setData] = useState<PotensiFindall[]>([]);
  const [Error, setError] = useState<boolean | null>(null);

  const [DataModal, setDataModal] = useState<PotensiFindall | null>(null);
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
  const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

  const [Loading, setLoading] = useState<boolean | null>(null);
  const token = getToken();
  const { branding } = useBrandingContext();

  const tahun = Number(Tahun?.value ?? new Date().getFullYear());

  const filteredData = Data.filter(
    (item) => Number(item.tahun) === Number(tahun),
  );

  useEffect(() => {
    const fetchOpd = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(
          `${branding?.api_perencanaan}/ppd/findall/${kode_opd}`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const result = await response.json();
        if (result.code === 200) {
          if (result.data === null) {
            setData([]);
          } else {
            setData(result.data.ppds);
          }
        } else {
          setError(true);
          setData([]);
        }
      } catch (err) {
        setError(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (kode_opd != undefined) {
      fetchOpd();
    }
  }, [branding, token, kode_opd, FetchTrigger]);

  const handleClose = () => {
    setModalOpen(false);
  };
  const refresh = () => {
    setFetchTrigger((prev) => !prev);
  };
  const handleModalOpen = (
    jenis: "tambah" | "edit",
    data: PotensiFindall | null,
  ) => {
    if (ModalOpen) {
      setModalOpen(false);
      setJenisModal(jenis);
      setDataModal(null);
    } else {
      setModalOpen(true);
      setJenisModal(jenis);
      setDataModal(data);
    }
  };

  const hapusData = async (id: number) => {
    try {
      const response = await fetch(
        `${branding?.api_perencanaan}/ppd/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const result = await response.json();
      if (result.code === 200) {
        setData(Data.filter((data: any) => data.id !== id));
        AlertNotification(
          "Berhasil",
          "Data Potensi Perangkat Daerah Berhasil Dihapus",
          "success",
          1000,
        );
      } else {
        AlertNotification("Gagal", `${result.data}`, "error", 2000);
      }
    } catch (err) {
      AlertNotification(
        "Gagal",
        "cek koneksi internet atau database server",
        "error",
        2000,
      );
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
          Periksa koneksi internet atau database server
        </h1>
      </div>
    );
  } else if (branding?.tahun?.value === undefined) {
    return <TahunNull />;
  } else if (
    branding?.user?.roles == "super_admin" &&
    (branding?.opd?.value === null || branding?.opd?.value === undefined)
  ) {
    return <OpdNull />;
  } else {
    return (
      <>
        <div className="flex flex-wrap justify-end items-center gap-1 px-1">
          <ButtonBlackBorder
            className="flex items-center gap-1"
            onClick={refresh}
          >
            <TbRefresh />
            Refresh
          </ButtonBlackBorder>
          <ButtonSkyBorder
            className="flex items-center gap-1"
            onClick={() => handleModalOpen("tambah", null)}
          >
            <TbCirclePlus />
            Tambah Data
          </ButtonSkyBorder>
        </div>
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="overflow-auto m-2 rounded-t-xl border w-full">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-500 text-white">
                  <th className="border-r border-b px-6 py-3 text-center">
                    No
                  </th>
                  <th className="border-r border-b px-6 py-3 min-w-[250px]">
                    Bidang Urusan
                  </th>
                  <th className="border-r border-b px-6 py-3 min-w-[250px]">
                    Potensi
                  </th>
                  <th className="border-l border-b px-6 py-3 w-[100px]">
                    Aksi
                  </th>
                </tr>
                <tr className="bg-emerald-700 text-white">
                  <th className="border-r border-b px-2 py-1 text-center">1</th>
                  <th className="border-r border-b px-2 py-1 text-center">2</th>
                  <th className="border-r border-b px-2 py-1 text-center">3</th>
                  <th className="border-r border-b px-2 py-1 text-center">4</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-emerald-500 px-6 py-4 text-center"
                    >
                      Data Kosong / Belum Ditambahkan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item: PotensiFindall, index: number) => (
                    <tr key={item.id}>
                      {/* No */}
                      <td className="border border-emerald-500 px-4 py-4 text-center">
                        {index + 1}
                      </td>

                      {/* Bidang Urusan */}
                      <td className="border border-emerald-500 px-6 py-4">
                        ({item.kode_bidang_urusan}) {item.nama_bidang_urusan}
                      </td>

                      {/* Isu */}
                      <td className="border border-emerald-500 px-6 py-4">
                        {item.potensi}
                      </td>

                      {/* Aksi */}
                      <td className="border border-emerald-500 px-6 py-4">
                        <div className="flex gap-2">
                          <ButtonGreenBorder
                            className="flex items-center gap-1"
                            onClick={() => handleModalOpen("edit", item)}
                          >
                            <TbPencil />
                            Edit
                          </ButtonGreenBorder>

                          <ButtonRedBorder
                            className="flex items-center gap-1"
                            onClick={() => {
                              AlertQuestion(
                                "Hapus?",
                                "Hapus Potensi yang dipilih?",
                                "question",
                                "Hapus",
                                "Batal",
                              ).then((result) => {
                                if (result.isConfirmed) {
                                  hapusData(item.id);
                                }
                              });
                            }}
                          >
                            <TbTrash />
                            Hapus
                          </ButtonRedBorder>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {ModalOpen && (
          <ModalIkk
            isOpen={ModalOpen}
            onClose={handleClose}
            Data={DataModal}
            jenis={JenisModal}
            kode_opd={kode_opd}
            tahun={branding?.tahun?.value}
            onSuccess={refresh}
          />
        )}
      </>
    );
  }
};

export default Table;
