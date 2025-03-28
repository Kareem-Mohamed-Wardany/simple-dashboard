"use client";
import { toast } from "react-toastify";
import { loginUser } from "@/store/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    autoComplete: "current-password",
  },
];

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle auth errors from Redux
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      if (result?.success) {
        toast.success("Login successful!");
        const role = result?.data?.user?.role;
        router.push(role === "admin" ? "/dashboard" : "/");
      }
    } catch (error) {
      // Error is already handled by Redux and shown via useEffect
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register here
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {loginFormControls.map((control) => (
            <div key={control.name}>
              <label
                htmlFor={control.name}
                className="block text-sm font-medium text-gray-700"
              >
                {control.label}
              </label>
              <input
                id={control.name}
                name={control.name}
                type={control.type}
                autoComplete={control.autoComplete}
                value={formData[control.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [control.name]: e.target.value })
                }
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors[control.name] ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
                aria-invalid={!!errors[control.name]}
                aria-describedby={`${control.name}-error`}
              />
              {errors[control.name] && (
                <p
                  id={`${control.name}-error`}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors[control.name]}
                </p>
              )}
            </div>
          ))}

          <div>
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-wait"
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthLogin;
