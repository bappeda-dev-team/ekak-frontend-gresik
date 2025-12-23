'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { LoadingButtonClip } from "@/components/global/Loading";
import { TbCirclePlus, TbCircleX } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";

interface OptionType {
    value: number,
    label: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    kode_opd: string;
    tahun: string;
    onSuccess: () => void;
}

interface FormValue {
    kode_opd: string;
    id_pokir: OptionType;
}

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
    nip_pengusul: string | null;
    jumlah: number | string | null;
    satuan: string | null;
    kecamatan: string | null;
    kelurahan: string | null;
    rt: string | null;
    rw: string | null;
}

export const ModalSubKegiatanOpd: React.FC<ModalProps> = ({ isOpen, onClose, kode_opd, tahun, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<FormValue>();

    const [OptionUsulan, setOptionUsulan] = useState<UsulanPokir[]>([]);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
    };

    const OptionDummy = [
        { label: "pokir 1", value: 1 },
        { label: "pokir 2", value: 2 },
        { label: "pokir 3", value: 3 },
        { label: "pokir 4", value: 4 },
        { label: "pokir 5", value: 5 },
        { label: "pokir 6", value: 6 },
    ]

    useEffect(() => {
        const fetchOptionPokir = async () => {
            setLoadingOption(true);
            try {
                const response = await fetch(`${branding?.api_perencanaan}/usulan_pokok_pikiran/findall?tahun=${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('error fetch option master sub kegiatan dengan response !ok');
                }
                const result = await response.json();
                if(result.code === 200){
                    const data = result.data.map((item: UsulanPokir) => ({
                        value: item.id,
                        label: item.usulan,
                    }))
                    setOptionUsulan(data);
                } else {
                    setOptionUsulan([]);
                    AlertNotification("Gagal", "Gagal mengambil data dropdown Pokir, cek koneksi internet, jika berlanjut hubungi tim developer", "error", 3000);
                }
            } catch (err) {
                console.log('error saat fetch option Master Sub Kegaitan', err);
                AlertNotification("Gagal", "Gagal mengambil data dropdown Pokir, cek koneksi internet, jika berlanjut hubungi tim developer", "error", 3000);
            } finally {
                setLoadingOption(false);
            }
        }
        fetchOptionPokir();
    }, [])

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // const formData = {
        //     //key : value
        //     kode_opd: kode_opd,
        // };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/usulan_pokok_pikiran/update_opd_terpilih/${data.id_pokir.value}/${kode_opd}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", `${result.data.message || "Berhasil menambahkan Usulan Pokir untuk opd"}`, "success", 1000);
                onClose();
                onSuccess();
            } else {
                console.log(result);
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 max-h-[80%] text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        Tambah Usulan Pokir
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="id_pokir"
                        >
                            Usulan Pokir :
                        </label>
                        <Controller
                            name="id_pokir"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        id="id_pokir"
                                        placeholder="Pilih Usulan Pokir dari Data Master"
                                        options={OptionDummy}
                                        isLoading={LoadingOption}
                                        isSearchable
                                        isClearable
                                        onChange={(option) => {
                                            field.onChange(option);
                                        }}
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
                                </>
                            )}
                        />
                    </div>
                    <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                        {Proses ?
                            <span className="flex items-center gap-1">
                                <LoadingButtonClip />
                                Menambahkan..
                            </span>
                            :
                            <span className="flex items-center gap-1">
                                <TbCirclePlus />
                                Simpan
                            </span>
                        }
                    </ButtonSky>
                    <ButtonRed type="button" className="w-full my-3 flex items-center gap-1" onClick={handleClose} disabled={Proses}>
                        <TbCircleX />
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    );
};
