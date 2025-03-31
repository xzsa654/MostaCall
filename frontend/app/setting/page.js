'use client'

import React, { useState, useEffect, useRef } from 'react'
import useAuthStore from '@/store/useAuthStore'
import Image from 'next/image'
import { PUBLIC } from '@/lib/axios'
export default function SettingPage(props) {
  const inputRef = useRef()
  const formRef = useRef()
  const { authUser, update } = useAuthStore()
  useEffect(() => {
    if (authUser) {
      setImg(`${PUBLIC}/${authUser.profilePic}`)
    }
  }, [authUser])

  const [Img, setImg] = useState({})
  const previewAvatar = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImg(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    update(formData)
  }
  return (
    <div className="w-full h-full flex justify-center items-center mt-16">
      <div className="card w-full max-w-3xl shrink-0 shadow-2xl">
        <div className="flex justify-center  items-center flex-col gap-5 py-3  backdrop-blur-md">
          <button
            className="avatar"
            onClick={() => {
              inputRef.current.click()
            }}
          >
            <div className=" relative ring-primary overflow-auto ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
              <img src={Img} alt="avatar"></img>
            </div>
          </button>

          <form ref={formRef} onSubmit={handleSubmit}>
            <input
              type="file"
              name="updateImg"
              className="hidden"
              ref={inputRef}
              onChange={previewAvatar}
            />
          </form>
          <div className=" flex gap-3 flex-col w-full items-center px-4">
            <div className="w-full">
              <label htmlFor="email" className=" fieldset-label">
                Email
              </label>
              <input
                readOnly
                type="text"
                className="input w-full "
                defaultValue={authUser?.email}
              />
            </div>
            <div className="w-full">
              <label htmlFor="nickname" className="fieldset-label ">
                nickname
              </label>
              <input
                readOnly
                type="text"
                className="input w-full "
                defaultValue={authUser?.nickname}
              />
            </div>
            <div className="divider"></div>
            <div className="text-xl flex flex-col gap-2 text-left w-full">
              Account Information
              <div className="flex justify-between">
                <div className="text-sm">Member Since</div>
                <div className="text-sm">
                  {authUser?.updatedAt?.split('T')[0]}
                </div>
              </div>
              <div className="divider  my-1"></div>
              <div className="flex justify-between">
                <div className="text-sm">Account status</div>
                <div className="text-sm text-green-500">Active</div>
              </div>
            </div>
          </div>
          <button
            className="btn bg-black text-white w-2/3"
            onClick={() => {
              formRef.current.requestSubmit()
            }}
          >
            更新
          </button>
        </div>
      </div>
    </div>
  )
}
