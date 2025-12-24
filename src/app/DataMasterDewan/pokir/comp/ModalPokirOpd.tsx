'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import Select from 'react-select';
import { LoadingButtonClip } from "@/components/global/Loading";
import { OptionTypeString, OptionType } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";

interface UsulanPokir {
    id: string;
    usulan: string;
    alamat: string;
    uraian: string;
    tahun: string;
    rencana_kinerja_id: string;
    kode_opd: string;
    nama_opd: string;
    status: string;
    id_kamus_usulan: number;
    nama_kamus_usulan: string;
    nip_pengusul: string;
    jumlah: string;
    satuan: string;
    kecamatan: string;
    kelurahan: string;
    rt: string;
    rw: string;
}
interface FormValue {
    kecamatan: OptionTypeString | null;
    kelurahan: OptionTypeString | null;
    nip_pengusul: string;
    id_kamus_usulan: OptionType | null;
    jumlah: string;
    satuan: string;
    alamat: string;
    uraian: string;
    usulan: string;
    rt: string;
    rw: string;
    tahun: string;
    kode_opd: OptionTypeString | null;
}
interface KamusUsulan {
    id: number,
    nama_kamus_usulan: string;
    kode_kamus_usulan: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: UsulanPokir | null;
}

export const ModalPokirOpd: React.FC<modal> = ({ isOpen, onClose, onSuccess, Data }) => {

    const [Proses, setProses] = useState<boolean>(false);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);

    const [OptionOpd, setOptionOpd] = useState<OptionTypeString[]>([]);

    const { branding } = useBrandingContext();
    const token = getToken();

    const { control, reset, handleSubmit, watch, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            kecamatan: Data?.kecamatan ?
                {
                    value: Data?.kecamatan,
                    label: Data?.kecamatan,
                }
                : null,
            kelurahan: Data?.kelurahan ?
                {
                    value: Data?.kelurahan,
                    label: Data?.kelurahan,
                }
                : null,
            nip_pengusul: Data?.nip_pengusul ?? "",
            id_kamus_usulan: Data?.id_kamus_usulan ?
                {
                    value: Data?.id_kamus_usulan,
                    label: Data?.nama_kamus_usulan,
                }
                : null,
            jumlah: Data?.jumlah,
            satuan: Data?.satuan,
            alamat: Data?.alamat,
            uraian: Data?.uraian,
            usulan: Data?.usulan,
            rt: Data?.rt,
            rw: Data?.rw,
            tahun: String(branding?.tahun?.value),
        }
    });

    const SelectedKecamatan = watch("kecamatan");

    useEffect(() => {
        const fetchOpd = async () => {
            setLoadingOption(true);
            try {
                const response = await fetch(`${branding?.api_perencanaan}/opd/findall`, {
                    method: 'GET',
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('cant fetch data opd');
                }
                const data = await response.json();
                const opd = data.data.map((item: any) => ({
                    value: item.kode_opd,
                    label: item.nama_opd,
                }));
                setOptionOpd(opd);
            } catch (err) {
                console.log('gagal mendapatkan data opd');
            } finally {
                setLoadingOption(false);
            }
        };
        fetchOpd();
    }, [branding, token])

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            kecamatan: data.kecamatan?.label,
            kelurahan: data.kelurahan?.label,
            nip_pengusul: data?.nip_pengusul,
            id_kamus_usulan: data.id_kamus_usulan?.value,
            jumlah: data.jumlah,
            satuan: data.satuan,
            alamat: data.alamat,
            uraian: data.uraian,
            usulan: data.usulan,
            rt: data.rt,
            rw: data.rw,
            tahun: String(branding?.tahun?.value),
            kode_opd: data.kode_opd?.value,
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/usulan_pokok_pikiran/update_opd_terpilih/${Data?.id}/${data?.kode_opd?.value}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan dasar hukum", "success", 1000);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b text-center">
                        <h1 className="text-xl uppercase">Distribusi Pokok Pikiran Dewan ke OPD</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 pb-[200px]"
                    >
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Perangkat Daerah (OPD):
                            </label>
                            <Controller
                                name="kode_opd"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="kode_opd"
                                        placeholder="pilih Perangkat Daerah"
                                        options={OptionOpd}
                                        isLoading={LoadingOption}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            }),
                                            menuPortal: (base) => ({
                                                ...base, zIndex: 9999
                                            })
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ButtonSky className="w-full" type="submit" disabled={Proses}>
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButtonClip />
                                        Menyimpan...
                                    </span>
                                    :
                                    "Simpan"
                                }
                            </ButtonSky>
                            <ButtonRed className="w-full" onClick={handleClose}>
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}