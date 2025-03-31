'use client'
import React, { useState, useEffect } from 'react'

import useAuthStore from '@/store/useAuthStore'
import useMatchStore from '@/store/useMatchStore'
import Card from '../components/tindercard'
import { FaRegHeart } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

export default function MatchPage() {
  const { getAuthHeader, authUser } = useAuthStore()
  const [lastMatch, setLastMatch] = useState(false)
  const hideMatchBtn = () => {
    setLastMatch(true)
  }
  const [moveTo, setMoveTo] = useState('')
  const {
    getUserList,
    subscribeToNewMatch,
    unsubscribeFromNewMatches,
    userList,
  } = useMatchStore()

  useEffect(() => {
    getUserList(getAuthHeader())
  }, [])
  // 避免連續往同方向不能點擊
  useEffect(() => {
    if (moveTo !== '') {
      setMoveTo('')
    }
  }, [moveTo])

  useEffect(() => {
    authUser && subscribeToNewMatch()
    return () => unsubscribeFromNewMatches()
  }, [authUser])
  return (
    <div className="w-full h-screen  px-5 flex justify-center items-center">
      <div className=" w-full flex flex-col max-w-[500px]  h-[80vh] backdrop-blur-md overflow-hidden bg-white  rounded-3xl">
        <div className="h-11/12">
          <Card moveTo={moveTo} hideMatchBtn={hideMatchBtn} />
        </div>
        {userList.length !== 0 && !lastMatch && (
          <div className="w-full flex justify-center gap-10">
            <button
              type="button"
              onClick={() => {
                setMoveTo('left')
              }}
            >
              <IoClose
                size={22}
                className=" hover:text-red-400 hover:rotate-12 hover:scale-150"
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setMoveTo('right')
              }}
            >
              <FaRegHeart
                size={22}
                className=" hover:text-red-400 hover:rotate-12 hover:scale-150 "
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
