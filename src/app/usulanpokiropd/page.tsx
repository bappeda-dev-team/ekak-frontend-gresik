'use client'

import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";
import { OpdTahunNull } from "@/components/global/OpdTahunNull";
import Table from "./comp/Table";

const MasterUsulanPokirOpd = () => {

    const {LoadingBranding, branding} = useBrandingContext();

    if(LoadingBranding){
        return <IsLoadingBranding />
    } else {
        if(branding?.user?.roles == "super_admin" && branding?.opd?.value === undefined){
            return <OpdTahunNull />
        } else {
            return(
                <>
                    <div className="flex items-center">
                        <a href="/" className="mr-1"><FiHome /></a>
                        <p className="mr-1">/ Data Master OPD</p>
                        <p className="mr-1">/ Usulan Pokir OPD</p>
                    </div>
                    <div className="mt-3 rounded-xl shadow-lg border">
                        <div className="flex items-center justify-between border-b px-5 py-5">
                            <div className="flex flex-col items-end">
                                <h1 className="uppercase font-bold">Master Usulan Pokir OPD</h1>
                            </div>
                        </div>
                        <Table />
                    </div>
                </>
            )
        }
    }
}

export default MasterUsulanPokirOpd;