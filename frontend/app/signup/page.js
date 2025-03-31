'use client'

import React, { useState, useEffect, useRef } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
export default function SignupPage(props) {
  const btnRef = useRef()

  const [closeReg, setCloseReg] = useState(false)
  const { signUp, errorMessage } = useAuthStore()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const result = await signUp(data)
    if (result.ok) {
      setCloseReg(true)
      btnRef.current.click()
    }
  }
  return (
    <>
      <div>
        <div className="w-full flex justify-center items-center h-screen">
          <div
            className={`card bg-base-100  w-full max-w-sm shrink-0 shadow-2xl ${
              closeReg && 'hidden'
            }`}
          >
            <div className="card-body">
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
                  <div className="text-red-600">{errorMessage}</div>
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
                  <label className="fieldset-label">gender</label>
                  <select
                    className="select validator"
                    defaultValue={3}
                    required
                    name="gender"
                  >
                    <option disabled value={3}>
                      Choose:
                    </option>
                    <option value={0}>male</option>
                    <option value={1}>female</option>
                  </select>
                  <p className="validator-hint">Required</p>

                  <label className="fieldset-label">nickname</label>
                  <input
                    name="nickname"
                    type="text"
                    className="input validator"
                    required={true}
                    placeholder="nickname"
                  />
                  <p className="validator-hint">is required</p>
                  <label className="fieldset-label">birthday</label>
                  <input
                    type="date"
                    required={true}
                    name="birthday"
                    className="input"
                    max={`${new Date().getFullYear() - 18}-0${
                      new Date().getMonth() + 1
                    }-${new Date().getDate()}`}
                  />

                  <button className="btn btn-neutral mt-4">register</button>
                  <div className="divider">OR</div>
                  <div className="text-center relative ">
                    already has an account？
                    <Link href="/login">login</Link>
                  </div>
                </fieldset>
              </form>
            </div>
            <a href="#my_modal_8" className="btn hidden" ref={btnRef}>
              open modal
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
