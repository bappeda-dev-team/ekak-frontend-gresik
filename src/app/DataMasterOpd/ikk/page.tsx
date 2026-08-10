"use client";

import { useState, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import Table from "./comp/Table";
import { getOpdTahun, getUser } from "@/components/lib/Cookie";
import { OpdNull } from "@/components/global/OpdTahunNull";

const IkuOpd = () => {
  const [Tahun, setTahun] = useState<any>(null);
  const [User, setUser] = useState<any>(null);
  const [SelectedOpd, setSelectedOpd] = useState<any>(null);

  useEffect(() => {
    const data = getOpdTahun();
    const user = getUser();
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
    if (user) {
      setUser(user.user);
    }
  }, []);

  const nama_opd =
    User?.roles == "super_admin" || User?.roles == "reviewer"
      ? SelectedOpd?.label
      : User?.nama_opd;
  const kode_opd =
    User?.roles == "super_admin" || User?.roles == "reviewer"
      ? SelectedOpd?.value
      : User?.kode_opd;

  if (kode_opd === undefined) {
    return <OpdNull />;
  }

  return (
    <>
      <div className="flex items-center">
        <a href="/" className="mr-1">
          <FiHome />
        </a>
        <p className="mr-1">/ Data Master OPD</p>
        <p className="mr-1">/ Master IKK</p>
      </div>
      <div className="mt-3 rounded-xl shadow-lg border">
        <div className="flex flex-col justify-between border-b px-5 py-5">
          <div className="flex flex-wrap items-end">
            <h1 className="uppercase font-bold">Indikator Kinerja Kunci</h1>
            <h1 className="uppercase font-bold ml-1">
              {Tahun ? Tahun?.label : ""}
            </h1>
          </div>
          <div className="flex flex-wrap items-end">
            <h1 className="uppercase text-sm">{nama_opd || "-"}</h1>
          </div>
        </div>
        <div className="p-1">
          <Table kode_opd={kode_opd} Tahun={Tahun} />
        </div>
      </div>
    </>
  );
};

export default IkuOpd;
