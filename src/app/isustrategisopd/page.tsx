'use client'

import TableIsuStrategis from './TableIsuStrategis';
import TablePermasalahan from './TablePermasalahan';
import TableBidangUrusan from './TableBidangUrusan';
import { useBrandingContext } from '@/context/BrandingContext';
import { FiHome } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';
import { getUser, getPeriode, getToken, setCookie } from '@/components/lib/Cookie';

interface Periode {
    value: number;
    label: string;
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    tahun_list: string[];
}

const IsuStrategis = () => {

    const { branding } = useBrandingContext()
    const tahun = branding?.tahun ? branding?.tahun.value : 0;
    const [User, setUser] = useState<any>(null);
    const [Periode, setPeriode] = useState<Periode | null>(null);
    const [PeriodeOption, setPeriodeOption] = useState<Periode[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        const fetchPeriode = getPeriode();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (fetchPeriode.periode) {
            const data = {
                value: fetchPeriode.periode.value,
                label: fetchPeriode.periode.label,
                id: fetchPeriode.periode.value,
                tahun_awal: fetchPeriode.periode.tahun_awal,
                tahun_akhir: fetchPeriode.periode.tahun_akhir,
                jenis_periode: fetchPeriode.periode.jenis_periode,
                tahun_list: fetchPeriode.periode.tahun_list
            }
            setPeriode(data);
        }
    }, []);

    const fetchPeriode = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/periode/findall`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const hasil = result.data;
            const data = hasil.map((item: any) => ({
                value: item.id,
                label: `${item.tahun_awal} - ${item.tahun_akhir} (${item.jenis_periode})`,
                tahun_awal: item.tahun_awal,
                tahun_akhir: item.tahun_akhir,
                jenis_periode: item.jenis_periode,
                tahun_list: item.tahun_list,
            }));
            setPeriodeOption(data);
        } catch (err) {
            console.error("error fetch periode", err);
        } finally {
            setLoading(false);
        }
    };

    if (User?.roles == "super_admin") {
        if (branding?.opd?.value === undefined || branding?.tahun?.value === undefined) {
            return (
                <OpdTahunNull />
            )
        }
    } else if (User?.roles != "super_admin") {
        if (branding?.tahun?.value == undefined) {
            return (
                <TahunNull />
            )
        }
    } else if (User?.roles != "super_admin" || User?.roles != "admin_opd" || User?.roles != 'reviewer') {
        return (
            <h1>403 Forbidden Access for {User?.roles || "this role"}</h1>
        )
    }

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Renstra</p>
                <p className="mr-1">/ Isu Strategis</p>
                <p>/ Isu Strategis</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Isu Strategis</h1>
                        <h1 className="uppercase font-bold ml-1 text-emerald-500">(Periode {Periode?.tahun_awal} - {Periode?.tahun_akhir})</h1>
                    </div>
                    <Select
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                minWidth: '200.562px',
                                minHeight: '38px'
                            })
                        }}
                        onChange={(option) => {
                            setPeriode(option);
                            setCookie("periode", JSON.stringify(option));
                        }}
                        options={PeriodeOption}
                        isLoading={Loading}
                        isClearable
                        placeholder="Pilih Periode ..."
                        value={Periode}
                        isSearchable
                        onMenuOpen={() => {
                            fetchPeriode();
                        }}
                    />
                </div>
                {Periode ?
                    <>
                        <p className='text-sm italic text-gray-400 ml-3 mt-2'>*data permasalahan per tahun {tahun} (header)</p>
                        <TablePermasalahan
                            roles={User?.roles}
                            tahun={tahun}
                            kode_opd={User?.roles == 'super_admin' ? branding?.opd?.value : User?.kode_opd}
                        />
                        {/* <TableBidangUrusan /> */}
                        <TableIsuStrategis
                            roles={User?.roles}
                            id_periode={Periode?.value}
                            tahun_awal={Periode?.tahun_awal ? Periode?.tahun_awal : ""}
                            tahun_akhir={Periode?.tahun_akhir ? Periode?.tahun_akhir : ""}
                            jenis={Periode?.jenis_periode ? Periode?.jenis_periode : ""}
                            tahun_list={Periode?.tahun_list ? Periode?.tahun_list : []}
                        />
                    </>
                    :
                    <div className="m-5">
                        <h1>Pilih Periode terlebih dahulu</h1>
                    </div>
                }
            </div>
        </>
    )
}

export default IsuStrategis;