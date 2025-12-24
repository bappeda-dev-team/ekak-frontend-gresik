'use client'

import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";
import Table from "./comp/Table";

const MasterDewanPokir = () => {

    const {LoadingBranding, branding} = useBrandingContext();
    
    if(LoadingBranding){
        return <IsLoadingBranding />
    } else {
        return(
            <>
                <div className="flex items-center">
                    <a href="/" className="mr-1"><FiHome /></a>
                    <p className="mr-1">/ Data Master Dewan</p>
                    <p className="mr-1">/ Master Pokir</p>
                </div>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <div className="flex items-center justify-between border-b px-5 py-5">
                        <div className="flex flex-col items-end">
                            <h1 className="uppercase font-bold">Master Pokir</h1>
                        </div>
                    </div>
                    <Table />
                </div>
            </>
        )
    }
}

export default MasterDewanPokir;