'use client'

import Table from "./comp/Table";
import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";
import { useEffect, useState } from "react";
import { getUser, getOpdTahun } from "@/components/lib/Cookie";

const JabatanOpd = () => {

    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    
    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (data) {
            if (data.tahun) {
                const valueTahun = {
                    value: data.tahun.value,
                    label: data.tahun.label
                }
                setTahun(valueTahun);
            }
            if (data.opd) {
                const valueOpd = {
                    value: data.opd.value,
                    label: data.opd.label
                }
                setSelectedOpd(valueOpd);
            }
        }
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, [])

    const { LoadingBranding, branding } = useBrandingContext();
    const nama_opd = User?.roles == "super_admin" ? SelectedOpd.label : User?.nama_opd;
    const kode_opd = User?.roles == "super_admin" ? SelectedOpd.value : User?.kode_opd;

    if (LoadingBranding) {
        return <IsLoadingBranding />
    } else {
        return (
            <>
                <Table
                    kode_opd={kode_opd}
                    nama_opd={nama_opd}
                    tahun={branding?.tahun?.value ?? 0}
                />
            </>
        )
    }

}

export default JabatanOpd;