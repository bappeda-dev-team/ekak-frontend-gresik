import { FiHome } from 'react-icons/fi';
import { TahunNull } from '@/components/global/OpdTahunNull';
import { Table } from './Table';
import { cookies } from "next/headers";

async function getTahun() {
    const cookieStore = await cookies();

    const tahunCookie = cookieStore.get("tahun")?.value;

    const tahun = tahunCookie
        ? JSON.parse(tahunCookie).value
        : null;

    return { tahun };
}

export default async function Page() {

    const { tahun } = await getTahun()

    if (!tahun) {
        return <TahunNull />;
    }

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Laporan</p>
                <p>/ Tagging Pohon</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">Rekap Pohon dengan Tagging di Tahun {tahun || ''}</h1>
                </div>
                <div className="flex m-2">
                    <Table tahun={tahun} />
                </div>
            </div>
        </>
    )
}
