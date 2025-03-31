'use client'

import React, { useState, useEffect } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import useMessageStore from '@/store/useMessageStore'
import { PUBLIC } from '@/lib/axios'
export default function ChatHeader(props) {
  const { memberDetails, clear } = useMessageStore()
  return (
    <div className="flex gap-3 items-center ">
      <button className=" cursor-pointer" onClick={clear}>
        <IoMdArrowRoundBack size={25} />
      </button>
      <div className="avatar avatar-online ">
        <div className="w-12 rounded-full">
          <img src={`${PUBLIC}/${memberDetails.profilePic[0].url}`} />
        </div>
      </div>
      <div>{memberDetails.nickname}</div>
    </div>
  )
}
