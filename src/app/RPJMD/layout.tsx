'use client'

import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";
import { TahunNull, OpdTahunNull } from "@/components/global/OpdTahunNull";
import ForbiddenPage from "@/app/forbidden";

interface RPJMDLayoutProps {
    children: React.ReactNode;
}

export default function RenjaLayout({
    children
}: RPJMDLayoutProps) {

    const { LoadingBranding, branding } = useBrandingContext();

    const allowedRoles = ["super_admin", "reviewer"];

    const user: string[] = branding?.user?.roles || [];
    const isAuthorized = user.some(role => allowedRoles.includes(role));

    if (LoadingBranding) {
        return <IsLoadingBranding />;
    } else {
        if (branding?.tahun?.value == undefined) {
            return <TahunNull />
        } else if (branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') {
            if (branding?.opd?.value == undefined) {
                return (
                    <>
                        <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                            <OpdTahunNull />
                        </div>
                    </>
                )
            }
        } else if (!isAuthorized) {
            return <ForbiddenPage />
        }
        return <>{children}</>
    }
}