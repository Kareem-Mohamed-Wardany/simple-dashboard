"use client";
import { toast } from "react-toastify";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const registerFormControls = [
  {
    name: "userName",
    label: "Username",
    placeholder: "Enter your username",
    type: "text",
    autoComplete: "username",
    minLength: 3,
  },
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
    autoComplete: "new-password",
    minLength: 6,
  },
];

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await dispatch(registerUser(formData));

      if (result?.payload?.success) {
        toast.success(result?.payload?.msg || "Registration successful!");
        router.push("/auth/login");
      } else {
        toast.error(
          result?.payload?.msg || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create new account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login here
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {registerFormControls.map((control) => (
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
                minLength={control.minLength}
                value={formData[control.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [control.name]: e.target.value })
                }
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors[control.name] ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
                aria-invalid={!!errors[control.name]}
                aria-describedby={`${control.name}-error`}
                placeholder={control.placeholder}
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
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-wait"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthRegister;
