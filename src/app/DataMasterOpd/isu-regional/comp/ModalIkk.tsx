"use client";

import React, { useState } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import {
  ButtonSky,
  ButtonRed,
  ButtonSkyBorder,
} from "@/components/global/Button";
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from "react-select";
import { OptionTypeString } from "@/types";
import { IsuFindall, FormValue } from "../type";
import { useBrandingContext } from "@/context/BrandingContext";

interface modal {
  isOpen: boolean;
  onClose: () => void;
  Data: IsuFindall | null;
  jenis: "tambah" | "edit";
  kode_opd: string;
  tahun: number;
  onSuccess: () => void;
}

export const ModalIkk: React.FC<modal> = ({
  isOpen,
  onClose,
  jenis,
  tahun,
  kode_opd,
  Data,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      kode_bidang_urusan: Data?.kode_bidang_urusan
        ? {
            value: Data?.kode_bidang_urusan,
            label: `(${Data?.kode_bidang_urusan}) ${Data?.nama_bidang_urusan}`,
          }
        : null,
      isu: Data?.isu || "",
    },
  });
  const { branding } = useBrandingContext();

  const [Proses, setProses] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const token = getToken();

  const [OptionBidangUrusan, setOptionBidangUrusan] = useState<
    OptionTypeString[]
  >([]);

  const fetchOptionBidangUrusan = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/bidang_urusan_opd/findall/${kode_opd}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const result = await response.json();
      const data = result.data;
      const hasil = data.map((item: any) => ({
        value: item.kode_bidang_urusan,
        label: `${item.kode_bidang_urusan} - ${item.nama_bidang_urusan}`,
      }));
      setOptionBidangUrusan(hasil);
    } catch (err) {
      console.error(err, "gagal fetch option bidang urusan");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    const formData = {
      //key : value
      kode_bidang_urusan: data.kode_bidang_urusan?.value,
      isu: data.isu,
      kode_opd: kode_opd,
      tahun: tahun,
    };
    // console.log(formData);
    try {
      setProses(true);
      let url = "";
      if (jenis === "tambah") {
        url = "isu-regional/create";
      } else if (jenis === "edit") {
        url = `isu-regional/update/${Data?.id}`;
      } else {
        url = "";
      }
      const response = await fetch(`${branding?.api_perencanaan}/${url}`, {
        method: jenis === "tambah" ? "POST" : "PUT",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.code === 201 || result.code === 200) {
        AlertNotification(
          "Berhasil",
          `Berhasil ${jenis === "edit" ? "mengubah" : "menambah"} Isu Regional`,
          "success",
          1000,
        );
        onSuccess();
        onClose();
      } else {
        AlertNotification("Gagal", `${result.data}`, "error", 2000);
      }
    } catch (err) {
      AlertNotification(
        "Gagal",
        "cek koneksi internet/terdapat kesalahan pada database server",
        "error",
        2000,
      );
    } finally {
      setProses(false);
    }
  };

  if (!isOpen) {
    return null;
  } else {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className={`fixed inset-0 bg-black opacity-30`}
          onClick={onClose}
        ></div>
        <div
          className={`bg-white rounded-lg p-8 z-10 w-4/5 text-start h-[90%] overflow-auto`}
        >
          <div className="w-max-[500px] py-2 border-b text-center">
            <h1 className="text-xl uppercase">{jenis} Isu Regional</h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col mx-5 py-5"
          >
            <div className="flex flex-col py-3">
              <label
                className="uppercase text-xs font-bold text-gray-700 my-2"
                htmlFor="kode_bidang_urusan"
              >
                Bidang Urusan:
              </label>
              <Controller
                name="kode_bidang_urusan"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="kode_bidang_urusan"
                    placeholder="Pilih Bidang Urusan"
                    options={OptionBidangUrusan}
                    isLoading={Loading}
                    onMenuOpen={() => {
                      fetchOptionBidangUrusan();
                    }}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: "8px",
                        borderColor: "black", // Warna default border menjadi merah
                        "&:hover": {
                          borderColor: "#3673CA", // Warna border tetap merah saat hover
                        },
                      }),
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-col py-3">
              <label
                className="uppercase text-xs font-bold text-gray-700 my-2"
                htmlFor="jenis"
              >
                Isu:
              </label>
              <Controller
                name="isu"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="border px-4 py-2 rounded-lg"
                    placeholder={`Masukkan nama isu`}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <ButtonSky className="w-full" type="submit" disabled={Proses}>
                {Proses ? (
                  <span className="flex">
                    <LoadingButtonClip />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan"
                )}
              </ButtonSky>
              <ButtonRed className="w-full" onClick={onClose}>
                Batal
              </ButtonRed>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
