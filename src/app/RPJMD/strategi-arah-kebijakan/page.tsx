"use client";

import { useBrandingContext } from "@/context/BrandingContext";
import { FiHome } from "react-icons/fi";
import { useEffect, useState } from "react";
import Table from "./comp/Table";
import { LoadingClip } from "@/components/global/Loading";
import { getToken, getPeriode, setCookie } from "@/components/lib/Cookie";
import { ArahKebijakan } from "./type";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter } from "next/navigation";

import Select from "react-select";

interface Periode {
  value: number;
  label: string;
  id: number;
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
  tahun_list: string[];
}

const StrategiArahKebijakanPage = () => {
  const { branding } = useBrandingContext();
  const kode_opd = branding?.opd?.value || "";
  const nama_opd = branding?.opd?.label || "";
  const tahun = branding?.tahun?.value || 0;
  const router = useRouter();

  const token = getToken();

  const [Periode, setPeriode] = useState<Periode | null>(null);
  const [PeriodeOption, setPeriodeOption] = useState<Periode[]>([]);
  const [LoadingPeriode, setLoadingPeriode] = useState<boolean>(false);

  const [Data, setData] = useState<ArahKebijakan[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<boolean>(false);
  const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

  useEffect(() => {
    const fetchPeriode = getPeriode();

    if (fetchPeriode.periode) {
      const data = {
        value: fetchPeriode.periode.value,
        label: fetchPeriode.periode.label,
        id: fetchPeriode.periode.value,
        tahun_awal: fetchPeriode.periode.tahun_awal,
        tahun_akhir: fetchPeriode.periode.tahun_akhir,
        jenis_periode: fetchPeriode.periode.jenis_periode,
        tahun_list: fetchPeriode.periode.tahun_list,
      };

      setPeriode(data);
    }
  }, []);

  const fetchPeriode = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      setLoadingPeriode(true);

      const response = await fetch(`${API_URL}/periode/findall`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      const data = result.data.map((item: any) => ({
        value: item.id,
        label: `${item.tahun_awal} - ${item.tahun_akhir} (${item.jenis_periode})`,
        tahun_awal: item.tahun_awal,
        tahun_akhir: item.tahun_akhir,
        jenis_periode: item.jenis_periode,
        tahun_list: item.tahun_list,
      }));

      setPeriodeOption(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPeriode(false);
    }
  };

  useEffect(() => {
    if (!Periode) return;

    const FetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${branding?.api_perencanaan}/strategi_arah_kebijakan_pemda/${Periode.tahun_awal}/${Periode.tahun_akhir}`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const result = await response.json();
        if (result.code === 200) {
          setData(result.data || []);
        } else if (result.code === 401) {
          AlertNotification("Login Kembali", "", "warning", 2000);
          router.push("/login");
        } else {
          AlertNotification("Error", `${result.data || ""}`, "error", 2000);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    FetchData();
  }, [Periode, token, branding?.api_perencanaan, router]);

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
          Error, Periksa koneksi internet atau database server, jika error
          berlanjut silakan hubungi tim developer
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <a href="/" className="mr-1">
          <FiHome />
        </a>
        <p className="mr-1">/ Perencanaan Pemda</p>
        <p className="mr-1">/ Strategi & Arah Kebijakan</p>
      </div>
      <div className="mt-3 rounded-xl shadow-lg border">
        <div className="flex items-center justify-between border-b px-5 py-5">
          <div className="flex flex-wrap items-end">
            <h1 className="uppercase font-bold">Strategi & Arah Kebijakan</h1>
            <h1 className="uppercase font-bold ml-1">
              (Periode {Periode?.tahun_awal} - {Periode?.tahun_akhir})
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* <h2 className="text-sm max-w-[500px]">{nama_opd || ""}</h2> */}

            <Select
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: "8px",
                  minWidth: "220px",
                  minHeight: "38px",
                }),
              }}
              onChange={(option) => {
                setPeriode(option as Periode);
                setCookie("periode", JSON.stringify(option));
              }}
              options={PeriodeOption}
              isLoading={LoadingPeriode}
              isClearable
              placeholder="Pilih Periode ..."
              value={Periode}
              isSearchable
              onMenuOpen={() => {
                fetchPeriode();
              }}
            />
          </div>
        </div>
        <div className="mx-3 mb-3">
          {/* <TableIsu
                        Data={Data?.isu_strategis_opds || []}
                    />
                    <TableTujuan
                        Data={Data?.tujuan_opd || []}
                    />
          <Table Data={Data?.strategi_arah_kebijakan_pemdas || []} /> */}
          {Periode ? (
            <Table Data={Data} />
          ) : (
            <div className="m-5">
              <h1>Pilih Periode terlebih dahulu</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StrategiArahKebijakanPage;
