"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import api from "@/lib/axios"
// import { useAuthStore } from "@/store/auth/authStore"
import { useOTPStore } from "@/store/otp/otpStore"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

const OTPModal = () => {
  const router = useRouter()
  const { isOTPModalOpen, email, setOTPModalOpen, resetOTPStore } = useOTPStore()
  // const { setUser, setIsAuthenticated } = useAuthStore()
  const [otp, setOTP] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/verify-email", {
        email,
        code: otp,
      })

      if (response.status === 201) {
        resetOTPStore()
        router.push("/sign-in")
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "OTP растау сәтсіз аяқталды")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/resend-verification", { email })
    } catch (error: any) {
      setError(error.response?.data?.message || "OTP қайта жіберу сәтсіз аяқталды")
    }
  }

  return (
    <AlertDialog open={isOTPModalOpen} onOpenChange={setOTPModalOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Email растаңыз
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-500">
            Біз кодты <span className="font-medium text-emerald-600">{email}</span> мекенжайына жібердік
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={4} value={otp} onChange={setOTP}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              // className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              className="shad-submit-btn h-12"
              disabled={otp.length !== 4 || isLoading}
            >
              {isLoading ? "Тексерілуде..." : "Растау"}
            </AlertDialogAction>

            <div className="text-sm text-center text-gray-500">
              Код алмадыңыз ба?
              <Button
                type="button"
                variant="link"
                className="text-emerald-600 hover:text-emerald-700"
                onClick={handleResendOtp}
              >
                Қайта жіберу
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal
