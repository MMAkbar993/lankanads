"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { loginSuccess } from "@/../redux/features/authSlice";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SINHALA_INTRO =
    "ගිණුමට log වීම සහ ගිණුමක් සාදා ගැනීම යන කාර්‍යයන් දෙකටම මෙම form එක භාවිතා කරන්න.";
const SINHALA_PHONE_HELPER =
    "ඔබගේ දුරකතන අංකය ඇතුලත් කර Send OTP Click කරන්න.";
const SINHALA_AGENT_HELPER = "දැන්වීමක් පලකර ගැනීමට නියෝජිත සහාය.";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [step, setStep] = useState("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        if (!phone) {
            toast.error("Please enter your phone number");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
                phone: `+${phone}`,
            });

            toast.success("OTP has been sent via SMS.");
            setStep("otp");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
                phone: `+${phone}`,
                otp,
            });

            dispatch(
                loginSuccess({
                    token: res.data.token,
                    user: res.data.user,
                })
            );

            toast.success("Login successful");
            router.push("/portal");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex justify-center px-4 py-8">
            <div className="w-full max-w-[600px]">
                {step === "otp" && (
                    <div className="mb-6 rounded-md border border-green-400 bg-green-50 px-4 py-3 text-[14px] font-medium text-green-700">
                        OTP has been sent via SMS.
                    </div>
                )}

                <h1 className="mb-2 text-[24px] font-bold text-slate-900">
                    Login / Registration
                </h1>

                <p className="text-[14px] leading-6 text-slate-500">
                    Use this form both for logging in and posting an advertisement.
                </p>

                <p className="mb-2 text-[14px] leading-6 text-slate-500">
                    {SINHALA_INTRO}
                </p>

                <div className="mb-6 h-1 w-14 rounded-full bg-red-600" />

                {step === "phone" ? (
                    <>
                        <h2 className="mb-2 text-[16px] font-semibold text-slate-900">
                            Enter Phone Number
                        </h2>

                        <p className="text-[14px] leading-6 text-slate-500">
                            Enter your phone number and click{" "}
                            <span className="font-semibold">Send OTP</span>.
                        </p>

                        <p className="mb-5 text-[14px] leading-6 text-slate-500">
                            {SINHALA_PHONE_HELPER}
                        </p>

                        <div className="mb-5">
                            <PhoneInput
                                country="lk"
                                value={phone}
                                onChange={setPhone}
                                enableSearch
                                disableCountryGuess
                                countryCodeEditable={false}
                                placeholder="Enter phone number"
                                containerClass="!w-full"
                                inputClass="!w-full !h-12 !text-[14px] !rounded-md !border !border-slate-300 !pl-14"
                                buttonClass="!border !border-slate-300 !rounded-l-md !bg-white"
                                dropdownClass="!text-[14px]"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full h-12 rounded-md bg-red-700 text-[14px] font-semibold text-white transition hover:bg-red-800 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                        <div className="my-6 border-t border-dashed border-slate-300" />

                        <h3 className="text-[16px] font-semibold text-slate-800">
                            Agent Support for Posting Ads
                        </h3>

                        <p className="mt-2 text-[14px] text-slate-500">
                            Get assistance from an agent to post your advertisement.
                        </p>

                        <p className="mb-4 text-[14px] text-slate-500">
                            {SINHALA_AGENT_HELPER}
                        </p>

                        <Link
                            href="/agents"
                            className="flex w-full h-12 items-center justify-center rounded-md bg-slate-900 text-[14px] font-semibold text-white transition hover:bg-slate-800"
                        >
                            See Agents
                        </Link>
                    </>
                ) : (
                    <>
                        <h2 className="mb-2 text-[16px] font-semibold text-slate-900">
                            Enter Verification Code
                        </h2>

                        <p className="mb-5 text-[14px] leading-6 text-slate-500">
                            Please enter the OTP code received on your mobile phone and click
                            the Verify button.
                        </p>

                        <input
                            type="text"
                            value={otp}
                            maxLength={6}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Verification code"
                            className="mb-5 h-12 w-full rounded-md border border-slate-300 px-4 text-[14px] outline-none focus:border-red-600"
                        />

                        <button
                            type="button"
                            onClick={verifyOtp}
                            disabled={loading}
                            className="mb-4 w-full h-12 rounded-md bg-red-700 text-[14px] font-semibold text-white hover:bg-red-800 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setOtp("");
                                setStep("phone");
                            }}
                            className="w-full h-12 rounded-md bg-slate-900 text-[14px] font-semibold text-white hover:bg-slate-800 cursor-pointer"
                        >
                            Change Number
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}