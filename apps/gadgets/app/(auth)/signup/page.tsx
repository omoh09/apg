/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  // const [form, setForm] = useState({
  //   email_or_phone: "",
  //   password: "",
  //   confirm: "",
  // });

  // const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [loading, setLoading] = useState(false);
  // const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErrors({});
  //   if (form.password !== form.confirm)
  //     return setErrors({ confirm: "Passwords do not match" });

  //   setLoading(true);
  //   try {
  //     await apiFetch("/api/register", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email_or_phone: form.email_or_phone,
  //         password: form.password,
  //         password_confirmation: form.confirm,
  //       }),
  //     });
  //     toast.success("Account created successfully!");
  //     router.push(`/verify?email=${form.email_or_phone}`);
  //   } catch (err: any) {
  //     if (err?.message?.includes("422")) {
  //       setErrors({
  //         general: "Invalid input. Please check your details and try again.",
  //       });
  //     } else {
  //       setErrors({
  //         general: err instanceof Error ? err.message : "Something went wrong",
  //       });
  //     }
  //     toast.error(errors.general || "Signup failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [form, setForm] = useState({
    login: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side password check
    if (form.password !== form.confirm) {
      return setErrors({ confirm: "Passwords do not match" });
    }

    setLoading(true);

    try {
      const res = await fetch(`https://api.apgbusinesshub.com/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          login: form.login,
          password: form.password,
          password_confirmation: form.confirm,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Signup failed:", errorData);
        throw new Error(errorData?.message || "Signup failed");
      }

      toast.success("Account created successfully!");
      router.push(`/verify?email=${form.login}&redirect=${redirectTo}`);
      // router.push(`/verify?email=${form.login}`);
    } catch (err: any) {
      console.error("Error:", err);
      setErrors({
        general: err.message || "Something went wrong. Please try again.",
      });
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-black pb-8">
      <form onSubmit={handleSubmit} className="px-2 w-full space-y-4 max-w-sm">
        <h3 className="text-[32px] font-bold text-center leading-5 tracking-[-0.6px]">
          Welcome
        </h3>
        <p className="tracking-[-0.16px] text-center">
          We promise this won’t take long,
          <br />
          you just need to fill in some details.
        </p>

        {/* General Error */}
        {errors.general && (
          <p className="text-red-500 text-sm text-center">{errors.general}</p>
        )}

        <div className="w-full mt-5">
          <label className="font-light">Email address / Phone Number</label>
          <input
            type="text"
            placeholder="yourId@email.com or 08123456789"
            className={`w-full py-2 mt-2 px-5 h-[52px] focus:outline-primary rounded-lg bg-[#F2F2F2] text-sm placeholder:text-[#A0A3BD] mb-1 ${
              errors.login ? "border border-red-400" : ""
            }`}
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
          />
          {errors.login && (
            <p className="text-red-500 text-xs">{errors.login}</p>
          )}
        </div>

        <div className="w-full">
          <label className="font-light">Password</label>
          <input
            type="password"
            placeholder="Pass1234#"
            className={`w-full py-2 px-5 mt-2 h-[52px] focus:outline-primary rounded-lg bg-[#F2F2F2] text-sm placeholder:text-[#A0A3BD] mb-1 ${
              errors.password ? "border border-red-400" : ""
            }`}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        <div className="w-full">
          <label className="font-light">Confirm Password</label>
          <input
            type="password"
            placeholder="Pass1234#"
            className={`w-full py-2 px-5 mt-2 h-[52px] focus:outline-primary rounded-lg bg-[#F2F2F2] text-sm placeholder:text-[#A0A3BD] mb-1 ${
              errors.confirm ? "border border-red-400" : ""
            }`}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          {errors.confirm && (
            <p className="text-red-500 text-xs">{errors.confirm}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black h-12 flex items-center justify-center text-center rounded-lg font-medium capitalize text-lg disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>

      <div className="flex px-2 items-center my-6 max-w-sm w-full">
        <div className="flex-grow h-px bg-[#CECECE]" />
        <span className="px-2.5 text-greyText text-sm font-light">OR</span>
        <div className="flex-grow h-px bg-[#CECECE]" />
      </div>

      <Link
        href="/login"
        className="hover:bg-grey/40 rounded-xl gap-3 h-12 bg-[#F4F1FF] font-light flex items-center justify-center max-w-sm w-full text-xs text-center"
      >
        <FcGoogle size={24} /> <span>Continue with Google</span>
      </Link>

      <div className="max-w-sm w-full text-center mt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-apgRed font-medium"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
