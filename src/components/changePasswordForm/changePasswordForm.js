import React, { useState } from "react";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import classnames from "classnames";
import ClosedEye from "../closedeye";
import OpenEye from "../openeye";

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

const ChangePasswordForm = () => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const {
    register,
    setError,
    handleSubmit,
    getValues,
    getFieldState,
    formState: { isValidating, errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (values) => {
    const data = {
      ...queryString.parse(window.location.search),
      ...values,
    };
    try {
      const _j = await fetch(
        `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/sample_password_recovery_fn`,
        {
          body: JSON.stringify(data),
          method: "POST",
        }
      );
      if (_j.status === 500) {
        setError("password", { type: "serverError" }, { shouldFocus: true });
        return;
      }
      const d = await _j.json();
      if (_j.status === 200 && d.err && d.msg === "token expired") {
        setError("password", { type: "tokenExpired" }, { shouldFocus: true });
        return;
      }
      if (_j.status === 200 && d.err && d.msg === "password mismatch") {
        setError("confirmPassword", { type: "mismatch" }, { shouldFocus: true });
        return;
      }

      window.location = "http://localhost:4008";
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <label className="text-black font-almost-bold text-sm">New Password*</label>
        <div className="relative">
          <input
            className={classnames(
              "w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
              {
                "border-light-gray": !errors.password,
                "focus:border-primary": !errors.password,
              },
              {
                "border-error": errors.password,
                "focus:border-error": errors.password,
              }
            )}
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: true,
              validate: {
                length: (value) => value.length >= 8,
                capitalLetters: (value) => /[A-Z]/.test(value),
                smallLetters: (value) => /[a-z]/.test(value),
                numbers: (value) => /[0-9]/.test(value),
                specialChars: (value) => specialChars.test(value),
                serverError: (_) => {},
                tokenExpired: (_) => {},
              },
            })}
          />
          <div
            className={`absolute w-8 h-full right-1 cursor-pointer ${showPassword ? "top-7" : "top-8"}`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <OpenEye /> : <ClosedEye />}
          </div>
          {errors.password && errors.password.type === "length" && (
            <ErrorMsg msg="password needs to be atlest 8 chars" />
          )}
          {errors.password && errors.password.type === "capitalLetters" && (
            <ErrorMsg msg="password needs to include atleast one capital letter" />
          )}
          {errors.password && errors.password.type === "smallLetters" && (
            <ErrorMsg msg="password needs to include atleast one small letter" />
          )}
          {errors.password && errors.password.type === "numbers" && (
            <ErrorMsg msg="password needs to include atleast one number" />
          )}
          {errors.password && errors.password.type === "specialChars" && (
            <ErrorMsg msg="password needs to include atleast one special char" />
          )}
          {errors.password && errors.password.type === "tokenExpired" && (
            <ErrorMsg msg="Link has expired, request new" />
          )}
          {errors.password && errors.password.type === "serverError" && (
            <ErrorMsg msg="something went wrong at our end, try later" />
          )}
        </div>
      </div>
      <div className="mb-6">
        <label className="text-black font-almost-bold text-sm">Confirm New Password*</label>
        <div className="relative">
          <input
            className={classnames(
              "w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
              {
                "border-light-gray": !errors.confirmPassword,
                "focus:border-primary": !errors.confirmPassword,
              },
              {
                "border-error": errors.confirmPassword,
                "focus:border-error": errors.confirmPassword,
              }
            )}
            type={showConfirmedPassword ? "text" : "password"}
            disabled={!getValues("password") || getFieldState("password").error}
            {...register("confirmPassword", {
              required: true,
              validate: {
                mismatch: (value) => {
                  console.log(value);
                  console.log(getValues("password"));
                  return getValues("password") === value;
                },
              },
            })}
          />
          <div
            className={`absolute w-8 h-full right-1 cursor-pointer ${showConfirmedPassword ? "top-7" : "top-8"}`}
            onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
          >
            {showConfirmedPassword ? <OpenEye /> : <ClosedEye />}
          </div>
          {errors.confirmPassword && errors.confirmPassword.type === "mismatch" && <ErrorMsg msg="password mismatch" />}
        </div>
      </div>
      <button
        className="w-full rounded-sm py-3 focus:outline-none mb-6 font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all"
        disabled={!isValid}
        type="submit"
      >
        Change Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;
