'use client'

import React, { useState, useEffect } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { useRouter, redirect } from 'next/navigation'
import Link from 'next/link'
export default function LoginPage(props) {
  const router = useRouter()
  const { login, authUser } = useAuthStore()
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fm = new FormData(e.target)
    const result = await login(fm)
    if (result.ok) {
      router.push('/match')
      setShowToast(true)
    }
  }

  return (
    <>
      <div>
        {showToast && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-info">
              <span>帳號或密碼錯誤</span>
            </div>
          </div>
        )}

        <div className=" flex-col lg:flex-row-reverse ">
          <div className=" card bg-base-500  w-full max-w-sm shrink-0 shadow-2xl">
            <div>
              <form onSubmit={handleSubmit}>
                <fieldset className="fieldset ">
                  <label className="fieldset-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input validator"
                    required
                    placeholder="Email"
                  />
                  <div className="validator-hint">
                    Enter valid email address
                  </div>
                  <label className="fieldset-label ">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="input validator"
                    placeholder="Password"
                  />
                  <p className="validator-hint">
                    Must be more than 6 characters, including
                  </p>
                  <div>{useAuthStore.getState().errorMessage}</div>
                  <button className="btn btn-neutral mt-4">login</button>
                  <div className="divider">OR</div>
                  <div className="text-center relative ">
                    create an account？
                    <Link href="/signup">register</Link>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
