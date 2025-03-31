'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import MyImg from './myImg'
import useAuthStore from '@/store/useAuthStore'

export default function ComponentsSetupModal(props) {
  const btnRef = useRef()
  const { OptionalUpload } = useAuthStore()
  const [imageSlots, setImageSlots] = useState(Array(9).fill(null))
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const fm = new FormData(e.target)
    imageSlots.forEach((slot, i) => {
      if (slot && slot.file) {
        fm.append('profilePic[]', slot.file)
      }
    })

    const result = await OptionalUpload(fm)
    if (result.ok) {
      btnRef.current.click()
      router.push('/match')
    }
  }
  return (
    <>
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Profile</h3>
          <MyImg {...{ imageSlots, setImageSlots }} />
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">about me</legend>
              <textarea
                className="textarea h-24"
                placeholder="about me"
                name="about"
              ></textarea>
            </fieldset>
            <div className="w-full flex justify-end">
              <input type="submit" value="go" className="btn " />
            </div>
          </form>

          <div className="modal-action hidden">
            <a href="#" ref={btnRef} className="btn"></a>
          </div>
        </div>
      </div>
    </>
  )
}
