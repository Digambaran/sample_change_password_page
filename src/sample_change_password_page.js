import React from "react";
import "./assets/css/main.css";
import ChangePasswordForm from "./components/changePasswordForm/changePasswordForm";
// import env from 'env'

export const Sample_change_password_page = () => {
  return (
    <div className="w-full min-h-screen float-left flex sm:block bg-white">
      <div className="w-full flex flex-col min-h-screen items-center sm:justify-center pt-16 sm:p-2">
        <div className="w-full sm:max-w-[420px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-16 sm:shadow-lg min-h-screen">
          <h1 className="text-lg text-light-black font-bold mb-6">Change Password</h1>
          <div>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sample_change_password_page;
