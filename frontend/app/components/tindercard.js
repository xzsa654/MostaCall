'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import useMatchStore from '@/store/useMatchStore'
import useAuthStore from '@/store/useAuthStore'
import TinderCard from 'react-tinder-card'
import { PUBLIC } from '@/lib/axios'
export default function Card({ moveTo, hideMatchBtn = () => {} }) {
  useEffect(() => {
    if (moveTo) {
      childRef[currentChildRef.current].current.swipe(moveTo)
      // childRef[currentChildRef.current].current.restoreCard()
    }
  }, [moveTo])

  const currentChildRef = useRef()
  const { getAuthHeader } = useAuthStore()
  const { userList, rightArrow, leftArrow } = useMatchStore()

  const childRef = useMemo(() => {
    const refMap = {}
    for (let i of userList) {
      refMap[i._id] = React.createRef()
    }
    return refMap
  }, [userList])

  useEffect(() => {
    if (userList.length) {
      currentChildRef.current = userList[userList.length - 1]._id
    }
  }, [userList])

  const handleSwiper = (direction, id) => {
    const idx = userList.findIndex((v) => {
      return v._id == id
    })
    if (idx) {
      currentChildRef.current = userList[idx - 1]._id
    } else if (idx == 0) {
      hideMatchBtn()
      currentChildRef.current = null
    }

    if (direction == 'right') {
      rightArrow(getAuthHeader(), id)
    } else {
      leftArrow(getAuthHeader(), id)
    }
  }
  return (
    <>
      {userList.map((user) => {
        return (
          <TinderCard
            ref={childRef[user._id]}
            className="absolute shadow-none inset-0 m-auto w-fit h-fit"
            key={user._id}
            onSwipe={(dir) => handleSwiper(dir, user._id)}
            swipeRequirementType="position"
            preventSwipe={['up', 'down']}
          >
            <div
              className="card bg-white w-[300px] h-[28rem] select-none rounded-lg overflow-hidden border
					 border-gray-200"
            >
              <figure className="px-4 pt-4 h-3/4">
                <img
                  src={`${PUBLIC}/${user.profilePic[0]?.url}`}
                  alt={user.name}
                  className="rounded-lg object-cover h-full pointer-events-none"
                />
              </figure>
              <div className="card-body bg-gradient-to-b from-white to-pink-50">
                <h2 className="card-title text-2xl text-gray-800">
                  {user.nickname}, {user.birthday?.split('-')[0]}
                </h2>
                <p className="text-gray-600">{user.about}</p>
              </div>
            </div>
          </TinderCard>
        )
      })}
    </>
  )
}
