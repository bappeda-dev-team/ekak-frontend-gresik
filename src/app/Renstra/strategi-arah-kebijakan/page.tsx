'use client'

import { useBrandingContext } from "@/context/BrandingContext";
import { FiHome } from "react-icons/fi";
import { useEffect, useState } from "react";
import Table from "./comp/Table";
import TableIsu from "./comp/TableIsu";
import TableTujuan from "./comp/TableTujuan";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { StrategicArahKebijakan } from "./type";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter } from "next/navigation";

const StrategiArahKebijakanPage = () => {

    const { branding } = useBrandingContext();
    const kode_opd = (branding?.user?.roles == "super_admin" || branding?.user?.roles == "reviewer") ? branding?.opd?.value : branding?.user?.kode_opd;
    const nama_opd = (branding?.user?.roles == "super_admin" || branding?.user?.roles == "reviewer") ? branding?.opd?.label : branding?.user?.nama_opd;
    const tahun = branding?.tahun?.value || "";
    const router = useRouter();

    const token = getToken();

    const [Data, setData] = useState<StrategicArahKebijakan | null>(null);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const FetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${branding?.api_perencanaan}/strategi_arah_kebijakan_opd/${kode_opd}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setData(result.data);
                } else if (result.code === 401) {
                    AlertNotification("Login Kembali", "", "warning", 2000);
                    router.push('/login');
                } else {
                    AlertNotification("Error", `${result.data || ""}`, "error", 2000);
                }
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        FetchData();
    }, [token, tahun, branding, kode_opd, router])

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error berlanjut silakan hubungi tim developer</h1>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Pemda</p>
                <p className="mr-1">/ Strategi & Arah Kebijakan</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Strategi & Arah Kebijakan</h1>
                        <h1 className="uppercase font-bold ml-1">{tahun}</h1>
                    </div>
                    <h2 className="text-sm max-w-[500px]">{nama_opd || ""}</h2>
                </div>
                <div className="mx-3 mb-3">
                    <TableIsu
                        Data={Data?.isu_strategis_opds || []}
                    />
                    <TableTujuan
                        Data={Data?.tujuan_opd || []}
                    />
                    <Table
                        Data={Data?.strategi_arah_kebijakan_opds || []}
                    />
                </div>
            </div>
        </>
    )
}

export default StrategiArahKebijakanPage;
