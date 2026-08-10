"use client";

import { Table } from "./comp/Table";
import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { IsLoadingBranding } from "@/components/global/Loading";

const MasterRB = () => {
  const { LoadingBranding, branding } = useBrandingContext();

  if (branding?.tahun?.value === undefined || branding?.tahun?.value === null) {
    return <TahunNull />;
  } else if (LoadingBranding) {
    return <IsLoadingBranding />;
  } else {
    return (
      <>
        <div className="flex items-center">
          <a href="/" className="mr-1">
            <FiHome />
          </a>
          <p className="mr-1">/ Data Master OPD</p>
          <p>/ Master RB</p>
        </div>
        <Table />
      </>
    );
  }
};

export default MasterRB;
