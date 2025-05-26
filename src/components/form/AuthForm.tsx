"use client"

import { AuthFormType } from "@/lib/validation/auth"
import OTPModal from "../modal/OTPModal"
import { SignInForm } from "./SignInForm"
import { SignUpForm } from "./SignUpForm"

interface AuthFormProps {
  type: AuthFormType
}

const AuthForm = ({ type }: AuthFormProps) => {
  const renderForm = () => {
    switch (type) {
      case "signIn":
        return <SignInForm />
      case "signUp":
        return <SignUpForm defaultTab="student" />
      case "signUpTeacher":
        return <SignUpForm defaultTab="teacher" />
      default:
        return <SignInForm />
    }
  }

  return (
    <>
      {renderForm()}
      <OTPModal />
    </>
  )
}

export default AuthForm
