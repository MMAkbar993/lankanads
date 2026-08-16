"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAd, getMyAds } from "@/../redux/features/adSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewAdPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.ads);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [form, setForm] = useState({
        type: "Super Ad",
        title: "",
        category: "General",
        location: "",
        price: "",
        description: "",
        phone: user?.phone || "",
        whatsappNumber: user?.whatsappNumber || "",
        whatsapp: false,
        telegram: false,
        imo: false,
        viber: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "whatsappNumber") return;

        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "phone" && prev.whatsapp ? { whatsappNumber: value } : {}),
        }));
    };

    const handleCheckboxChange = (name) => {
        setForm((prev) => {
            const nextChecked = !prev[name];

            if (name === "whatsapp") {
                return {
                    ...prev,
                    whatsapp: nextChecked,
                    whatsappNumber: nextChecked ? prev.phone : prev.whatsappNumber,
                };
            }

            return {
                ...prev,
                [name]: nextChecked,
            };
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.title ||
            !form.location ||
            !form.price ||
            !form.description
        ) {
            toast.error("Please fill all required fields");
            return;
        }

        const formData = new FormData();

        if (imageFile) {
            formData.append("image", imageFile);
        }

        formData.append("type", form.type);
        formData.append("title", form.title);
        formData.append("category", form.category);
        formData.append("location", form.location);
        formData.append("price", form.price);
        formData.append("description", form.description);
        formData.append("phone", form.phone);
        formData.append("whatsappNumber", form.whatsappNumber);
        formData.append("whatsapp", form.whatsapp);
        formData.append("telegram", form.telegram);
        formData.append("imo", form.imo);
        formData.append("viber", form.viber);

        const result = await dispatch(createAd(formData));

        if (createAd.fulfilled.match(result)) {
            toast.success("Ad created successfully");

            dispatch(
                getMyAds({
                    page: 1,
                    limit: 20,
                    search: "",
                })
            );

            router.push("/portal/top-up");
        } else {
            toast.error(result.payload || "Failed to create ad");
        }
    };

    return (
        <div className="rounded-md bg-white p-6">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                <InfoCard title="Account ID" value={user?.accountId || "N/A"} />
                <InfoCard title="Account Type" value="User" />
            </div>

            <div className="flex">
                <TabLink label="My Ads" href="/portal" />

                <TabLink
                    label="New Ad"
                    href="/portal/new-ad"
                    active
                    className="-ml-px"
                />
                <TabLink label="Top up"  href="/portal/top-up"  />
            </div>

            <div className="mt-2 rounded-md rounded-tl-none border border-slate-300 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="rounded-md border border-blue-400 bg-blue-50 p-4 text-[13px] font-medium text-blue-600">
                        Ads cannot be edited after the approval. Fill everything
                        correctly and submit.
                        <p>දැන්වීම approve වීමෙන් පසුව නැවත edit කල නොහැක. සියලු දේ නිවැරදිව සම්පූර්ණ කර submit කරන්න.</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-[16px] font-semibold text-slate-800">
                            Image
                        </label>

                        <label className="group flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-red-500 hover:bg-red-50">
                            <p className="text-[16px] font-semibold text-slate-800">
                                Click to upload image
                            </p>

                            <p className="mt-1 text-[12px] text-slate-500">
                                PNG, JPG or WEBP up to 5MB
                            </p>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>

                        {imagePreview && (
                            <div className="mt-3 flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-2">
                                <div className="relative h-20 w-20 overflow-hidden rounded-md border border-slate-300 bg-white">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[11px] text-white hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="min-w-0">
                                    <p className="max-w-[220px] truncate text-[13px] font-semibold text-slate-800">
                                        {imageFile?.name}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-[16px] font-semibold text-slate-800">
                            Type
                        </label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="h-10 w-full rounded border border-slate-300 px-3 text-[16px] outline-none"
                        >
                            <option>Super Ad</option>
                            <option>Normal Ad</option>
                            <option>VIP Ad</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                            label="Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Title"
                        />

                        <Input
                            label="Location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Location"
                        />

                        <Input
                            label="Price"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price"
                            type="number"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-[16px] font-semibold text-slate-800">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            rows={10}
                            className="w-full resize-y rounded border border-slate-300 px-3 py-2 text-[16px] placeholder:text-[16px] outline-none focus:border-slate-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-[16px] font-semibold text-slate-800">
                                Phone
                            </label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                className="h-10 w-full rounded border border-slate-300 px-3 text-[16px] text-slate-600 placeholder:text-[16px] outline-none focus:border-slate-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[16px] font-semibold text-slate-800">
                                WhatsApp
                            </label>
                            <input
                                name="whatsappNumber"
                                value={form.whatsappNumber}
                                onChange={handleChange}
                                readOnly
                                placeholder="WhatsApp number"
                                className="h-10 w-full cursor-not-allowed rounded border border-slate-300 bg-slate-100 px-3 text-[16px] text-slate-500 placeholder:text-[16px] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <CheckBox
                            label="Phone Number Available on Whatsapp"
                            checked={form.whatsapp}
                            onChange={() => handleCheckboxChange("whatsapp")}
                        />
                        <CheckBox
                            label="Phone Number Available on Telegram"
                            checked={form.telegram}
                            onChange={() => handleCheckboxChange("telegram")}
                        />
                        <CheckBox
                            label="Phone Number Available on IMO"
                            checked={form.imo}
                            onChange={() => handleCheckboxChange("imo")}
                        />
                        <CheckBox
                            label="Phone Number Available on Viber"
                            checked={form.viber}
                            onChange={() => handleCheckboxChange("viber")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-slate-950 px-5 py-2 text-[13px] font-semibold text-white disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function TabLink({ label, href, active, className = "" }) {
    return (
        <Link
            href={href}
            className={`border border-slate-300 px-6 py-2 text-[15px] font-semibold ${active ? "bg-white" : "bg-slate-100 cursor-pointer"
                } ${className}`}
        >
            {label}
        </Link>
    );
}

function Input({ label, name, value, onChange, placeholder, type = "text" }) {
    return (
        <div>
            <label className="mb-1 block text-[16px] font-semibold text-slate-800">
                {label}
            </label>
            <input
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className="h-10 w-full rounded border border-slate-300 px-3 text-[16px] placeholder:text-[16px] outline-none focus:border-slate-500"
            />
        </div>
    );
}

function CheckBox({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 text-[13px] font-medium text-slate-800">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4"
            />
            {label}
        </label>
    );
}

function InfoCard({ title, value }) {
    return (
        <div className="rounded-md border border-dashed border-slate-300 px-5 py-1">
            <p className="mb-1 text-[14px] font-semibold text-slate-500">
                {title}
            </p>
            <h3 className="text-[16px] font-bold text-[#424A56]">{value}</h3>
        </div>
    );
}
