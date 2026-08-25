"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAd, getMyAds } from "@/../redux/features/adSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const CATEGORIES = [
    "Spa & Wellness Services",
    "Girls Personal",
    "Live Cam",
    "Boys Personal",
    "Shemale Personal",
    "Marriage Proposals",
    "Rooms",
    "Real Estate",
    "Electronics",
    "Vehicles",
    "Professional Services",
];

// Reads the logged-in user's phone straight from the `user` cookie (the
// same one authSlice.js writes on login), synchronously, at mount time —
// avoids depending on the AuthLoader -> loadUserFromStorage -> redux
// dispatch cycle having already completed on a fresh page load.
const getStoredPhone = () => {
    if (typeof document === "undefined") return "";

    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="));

    if (!match) return "";

    try {
        const storedUser = JSON.parse(decodeURIComponent(match.split("=")[1]));
        return storedUser?.phone || "";
    } catch {
        return "";
    }
};

export default function NewAdPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.ads);

    const isAgent = user?.role === "agent";

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Verifying a different contact number for THIS ad only — never touches
    // the account's login phone number.
    const [phoneChangeStep, setPhoneChangeStep] = useState("idle"); // idle | editing | otp
    const [newPhoneValue, setNewPhoneValue] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);

    const [form, setForm] = useState(() => {
        const storedPhone = getStoredPhone();

        return {
            type: "Super Ad",
            title: "",
            category: "",
            location: "",
            price: "",
            description: "",
            phone: user?.phone || storedPhone,
            whatsappNumber: user?.whatsappNumber || "",
            whatsapp: false,
            telegram: false,
            imo: false,
            viber: false,
        };
    });

    // `user` isn't hydrated from the auth cookie until just after the first
    // render, so the useState initializer above often runs while it's still
    // null on a hard reload. Fill phone/whatsapp in once it arrives, but
    // never overwrite a number already set via the Change Phone flow.
    useEffect(() => {
        if (!user?.phone) return;

        setForm((prev) => {
            if (prev.phone) return prev;

            return {
                ...prev,
                phone: user.phone,
                whatsappNumber: prev.whatsapp ? user.phone : prev.whatsappNumber,
            };
        });
    }, [user]);

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

    const startPhoneChange = () => {
        setNewPhoneValue("");
        setPhoneOtp("");
        setPhoneChangeStep("editing");
    };

    const cancelPhoneChange = () => {
        setNewPhoneValue("");
        setPhoneOtp("");
        setPhoneChangeStep("idle");
    };

    const sendPhoneOtp = async () => {
        if (!newPhoneValue) {
            toast.error("Please enter the new phone number");
            return;
        }

        setPhoneOtpLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
                phone: `+${newPhoneValue}`,
            });

            toast.success("OTP has been sent via SMS.");
            setPhoneChangeStep("otp");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setPhoneOtpLoading(false);
        }
    };

    const verifyPhoneOtp = async () => {
        if (!phoneOtp) {
            toast.error("Please enter the OTP");
            return;
        }

        setPhoneOtpLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/auth/verify-otp-only`, {
                phone: `+${newPhoneValue}`,
                otp: phoneOtp,
            });

            const verifiedPhone = `+${newPhoneValue}`;

            setForm((prev) => ({
                ...prev,
                phone: verifiedPhone,
                whatsappNumber: prev.whatsapp ? verifiedPhone : prev.whatsappNumber,
            }));

            toast.success("Phone number verified");
            setPhoneChangeStep("idle");
            setNewPhoneValue("");
            setPhoneOtp("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setPhoneOtpLoading(false);
        }
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
            !form.category ||
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
                <InfoCard title="Account Type" value={user?.role === "agent" ? "Agent" : "User"} />
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

                        <div>
                            <label className="mb-1 block text-[16px] font-semibold text-slate-800">
                                Category
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="h-10 w-full rounded border border-slate-300 px-3 text-[16px] outline-none"
                            >
                                <option value="">Select Category</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                            {isAgent ? (
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Phone number"
                                    className="h-10 w-full rounded border border-slate-300 px-3 text-[16px] text-slate-600 placeholder:text-[16px] outline-none focus:border-slate-500"
                                />
                            ) : (
                                <>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        readOnly
                                        placeholder="Phone number"
                                        className="h-10 w-full cursor-not-allowed rounded border border-slate-300 bg-slate-100 px-3 text-[16px] text-slate-600 placeholder:text-[16px] outline-none"
                                    />

                                    {phoneChangeStep === "idle" && (
                                        <button
                                            type="button"
                                            onClick={startPhoneChange}
                                            className="mt-2 h-10 w-full cursor-pointer rounded border border-red-600 text-[14px] font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            Change Phone
                                        </button>
                                    )}

                                    {phoneChangeStep === "editing" && (
                                        <div className="mt-2 space-y-2 rounded border border-slate-200 bg-slate-50 p-3">
                                            <PhoneInput
                                                country="lk"
                                                value={newPhoneValue}
                                                onChange={setNewPhoneValue}
                                                enableSearch
                                                disableCountryGuess
                                                countryCodeEditable={false}
                                                placeholder="Enter new phone number"
                                                containerClass="!w-full"
                                                inputClass="!w-full !h-10 !text-[14px] !rounded !border !border-slate-300 !pl-14"
                                                buttonClass="!border !border-slate-300 !rounded-l !bg-white"
                                            />

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={sendPhoneOtp}
                                                    disabled={phoneOtpLoading}
                                                    className="h-9 flex-1 cursor-pointer rounded bg-slate-950 text-[13px] font-semibold text-white disabled:opacity-50"
                                                >
                                                    {phoneOtpLoading ? "Sending..." : "Send OTP"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={cancelPhoneChange}
                                                    className="h-9 cursor-pointer rounded border border-slate-300 px-4 text-[13px] font-semibold text-slate-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {phoneChangeStep === "otp" && (
                                        <div className="mt-2 space-y-2 rounded border border-slate-200 bg-slate-50 p-3">
                                            <input
                                                type="text"
                                                value={phoneOtp}
                                                maxLength={6}
                                                onChange={(e) => setPhoneOtp(e.target.value)}
                                                placeholder="Verification code"
                                                className="h-10 w-full rounded border border-slate-300 px-3 text-[14px] outline-none"
                                            />

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={verifyPhoneOtp}
                                                    disabled={phoneOtpLoading}
                                                    className="h-9 flex-1 cursor-pointer rounded bg-slate-950 text-[13px] font-semibold text-white disabled:opacity-50"
                                                >
                                                    {phoneOtpLoading ? "Verifying..." : "Verify & Update"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={cancelPhoneChange}
                                                    className="h-9 cursor-pointer rounded border border-slate-300 px-4 text-[13px] font-semibold text-slate-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
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
