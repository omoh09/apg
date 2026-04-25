"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { apiFetch } from "@/lib/api/api";
import { getGuestSessionId } from "@/lib/cart/session";

export default function VerifyForm() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const params = useSearchParams();
  const login = params.get("email");
  const router = useRouter();
  const redirectTo = params.get("redirect") || "/";
  const isGuestCheckout = !!params.get("redirect");  

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      // Move focus to next input
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const verification_code = otp.join("");
    const guestSessionId = getGuestSessionId();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isGuestCheckout && guestSessionId) {
      headers["X-SESSION-ID"] = guestSessionId;
    }

    try {
      const res = await apiFetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({ login, verification_code }),
        headers: {
          "Content-Type": "application/json",
          ...(guestSessionId && { "X-SESSION-ID": guestSessionId }),
        },
      });

      // add token
      if (res?.token) {
        Cookies.set("apg_token", res.token, {
          expires: 7, // days
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        toast.success("Account verified & logged in!");
        router.push(redirectTo);
      } else {
        toast.success("Account verified! Please login.");
        router.push("/login");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-black pb-8">
      <form onSubmit={handleVerify} className="px-2 w-full space-y-6 max-w-sm">
        <h3 className="text-[32px] font-bold text-center leading-5 tracking-[-0.6px]">
          Verification
        </h3>
        <p className="tracking-[-0.16px] text-center">
          We sent an OTP to your email,
          <br />
          kindly check and enter below.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mt-12">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-12 h-12 bg-[#F2F2F2] rounded-lg text-center text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-black h-12 flex items-center justify-center text-center rounded-lg font-medium text-lg"
        >
          Verify email
        </button>
      </form>
    </div>
  );
}
