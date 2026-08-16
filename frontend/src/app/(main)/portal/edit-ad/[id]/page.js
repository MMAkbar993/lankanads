"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyAds, updateAd } from "@/../redux/features/adSlice";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/getImageUrl";

export default function EditAdPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { ads, loading } = useSelector((state) => state.ads);

  const ad = ads.find((a) => a._id === id);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    type: "",
    title: "",
    category: "",
    location: "",
    price: "",
    description: "",
    phone: "",
    whatsappNumber: "",
    whatsapp: false,
    telegram: false,
    imo: false,
    viber: false,
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (ad && !initialized) {
      setForm({
        type: ad.type || "Normal Ad",
        title: ad.title || "",
        category: ad.category || "",
        location: ad.location || "",
        price: ad.price || "",
        description: ad.description || "",
        phone: ad.phone || user?.phone || "",
        whatsappNumber: ad.whatsappNumber || "",
        whatsapp: ad.whatsapp || false,
        telegram: ad.telegram || false,
        imo: ad.imo || false,
        viber: ad.viber || false,
      });
      setInitialized(true);
    }
  }, [ad, initialized, user]);

  useEffect(() => {
    if (ads.length === 0) {
      dispatch(getMyAds({ page: 1, limit: 20, search: "" }));
    }
  }, [dispatch, ads.length]);

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
          // when turning it on, copy phone into whatsappNumber immediately
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

    const result = await dispatch(updateAd({ id, formData }));

    if (updateAd.fulfilled.match(result)) {
      toast.success("Ad updated successfully");
      dispatch(getMyAds({ page: 1, limit: 20, search: "" }));
      router.push("/portal");
    } else {
      toast.error(result.payload || "Failed to update ad");
    }
  };

  if (initialized && ad && ad.status !== "pending") {
    return (
      <div className="rounded-md bg-white p-6">
        <div className="rounded-md border border-red-400 bg-red-50 p-5 text-center font-semibold text-red-600">
          This ad cannot be edited because it has already been approved.
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/portal"
            className="inline-block rounded-md bg-slate-950 px-5 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
          >
            Back to My Ads
          </Link>
        </div>
      </div>
    );
  }

  if (!ad && ads.length > 0) {
    return (
      <div className="rounded-md bg-white p-6">
        <div className="rounded-md border border-blue-400 bg-blue-50 p-5 text-center font-semibold text-blue-600">
          Ad not found.
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/portal"
            className="inline-block rounded-md bg-slate-950 px-5 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
          >
            Back to My Ads
          </Link>
        </div>
      </div>
    );
  }

  const existingImageUrl = getImageUrl(ad);

  return (
    <div className="rounded-md bg-white p-6">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <InfoCard title="Account ID" value={user?.accountId || "N/A"} />
        <InfoCard title="Account Type" value="User" />
      </div>

      <div className="flex">
        <TabLink label="My Ads" href="/portal" />
        <TabLink
          label="Edit Ad"
          href={`/portal/edit-ad/${id}`}
          active
          className="-ml-px"
        />
      </div>

      <div className="mt-2 rounded-md rounded-tl-none border border-slate-300 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-md border border-yellow-400 bg-yellow-50 p-4 text-[13px] font-medium text-yellow-700">
            You can only edit this ad while it is pending approval. Once
            approved, editing will be disabled.
          </div>

          <div>
            <label className="mb-2 block text-[16px] font-semibold text-slate-800">
              Image
            </label>

            {!imagePreview && existingImageUrl && (
              <div className="mb-3 flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="relative h-20 w-20 overflow-hidden rounded-md border border-slate-300 bg-white">
                  <Image
                    unoptimized
                    src={existingImageUrl}
                    alt="Current image"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[13px] font-semibold text-slate-600">
                  Current image (upload new to replace)
                </p>
              </div>
            )}

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
                <option>Girls Personal</option>
                <option>Live Cam</option>
                <option>Spa & Wellness Services</option>
                <option>Boys Personal</option>
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-950 px-5 py-2 text-[13px] font-semibold text-white disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href="/portal"
              className="rounded-md border border-slate-300 px-5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function TabLink({ label, href, active, className = "" }) {
  return (
    <Link
      href={href}
      className={`border border-slate-300 px-6 py-2 text-[15px] font-semibold ${
        active ? "bg-white" : "bg-slate-100 cursor-pointer"
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
      <p className="mb-1 text-[14px] font-semibold text-slate-500">{title}</p>
      <h3 className="text-[16px] font-bold text-[#424A56]">{value}</h3>
    </div>
  );
}