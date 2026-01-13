'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import Select from 'react-select';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { useBrandingContext } from "@/context/BrandingContext";
import { OptionTypeString } from "@/types";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "tambah" | "edit";
    Data: KamusUsulan | null;
}
interface FormValue {
    nama_usulan: string;
    kode_kamus_usulan: OptionTypeString | null;
    tahun: number,
    keterangan: string;
}
interface KamusUsulan {
    id: number,
    kode_kamus_usulan: string;
    nama_kamus_usulan: string;
    nama_usulan: string;
    keterangan: string;
    last_update_by: string;
    tahun: number;
}

export const ModalUsulanKamus: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_usulan: Data?.nama_usulan,
            kode_kamus_usulan: Data?.kode_kamus_usulan
                ? {
                    value: Data.kode_kamus_usulan,
                    label: Data.nama_kamus_usulan ?? "Pilih Kamus" // Fallback label jika nama_kamus kosong
                }
                : null,
            keterangan: Data?.keterangan,
            tahun: Data?.tahun,
        }
    });
    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    const [OptionKamus, setOptionKamus] = useState<any>([]);

    const { branding } = useBrandingContext();
    const token = getToken();

    useEffect(() => {
        const fetchKamusUsulan = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${branding?.api_perencanaan}/kamus_usulan/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (result.code === 200) {
                    if (data === null) {
                        setOptionKamus([]);
                    } else {
                        const option = data.map((item: any, index: number) => ({
                            label: item.nama_kamus_usulan,
                            value: item.kode_kamus_usulan,
                        }))
                        setOptionKamus(option);
                    }
                } else {
                    AlertNotification("Gagal", "gagal mendapatkan data Kamus Usulan", "error", 3000, true);
                    console.log(result);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchKamusUsulan();
    }, [branding])

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            kode_kamus_usulan: data.kode_kamus_usulan?.value,
            nama_usulan: data.nama_usulan,
            tahun: Number(branding?.tahun?.value),
            keterangan: data.keterangan || "-",
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(jenis === "tambah" ? `${API_URL}/master_usulan_baru` : `${API_URL}/master_usulan_baru/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menyimpan Usulan Kamus", "success", 1000);
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

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={onClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 text-start`}>
                    <div className="w-max-[500px] py-2 border-b text-center">
                        <h1 className="text-xl uppercase">{jenis} Usulan Kamus</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kamus Usulan: {errors.kode_kamus_usulan && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_kamus_usulan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="id_kamus_usulan"
                                        placeholder="pilih kamus usulan"
                                        options={OptionKamus}
                                        isLoading={Loading}
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
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Usulan: {errors.nama_usulan && "wajib diisi"}
                            </label>
                            <Controller
                                name="nama_usulan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_usulan"
                                        type="text"
                                        placeholder="masukkan nama usulan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Keterangan:
                            </label>
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="keterangan"
                                        type="text"
                                        placeholder="masukkan Keterangan"
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky className="w-full my-3" type="submit" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={onClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}