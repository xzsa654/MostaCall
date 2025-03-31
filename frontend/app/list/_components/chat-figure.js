'use client'

import React, { useState, useEffect } from 'react'
import useAuthStore from '@/store/useAuthStore'
import useMessageStore from '@/store/useMessageStore'
import { useRef } from 'react'
import { PUBLIC } from '@/lib/axios'
export default function ChatFigure({ id }) {
  const scrollRef = useRef()

  const {
    getMessageById,
    toRender,
    messages,
    chatWith,
    clearMessage,
    isLoading,
    subscribeNewMessage,
    unsubscribeNewMessage,
  } = useMessageStore()
  const { getAuthHeader, authUser } = useAuthStore()
  const [prevId, setPrevId] = useState()
  useEffect(() => {
    if (id === chatWith) {
      getMessageById(getAuthHeader(), id)
      setPrevId(id)
      return () => {
        if (prevId !== id) {
          clearMessage()
        }
      }
    }
  }, [id, chatWith])

  useEffect(() => {
    authUser && subscribeNewMessage()
    return () => unsubscribeNewMessage()
  }, [authUser])

  useEffect(() => {
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages])

  // if (isLoading) {
  //   if (isLoading)
  //     return <div className="flex-1 overflow-y-scroll">Loading!!</div>
  // }
  return (
    <>
      {messages?.map((v) => {
        return (
          <div
            key={v._id}
            className={`chat ${
              v.senderId !== chatWith ? 'chat-start ' : 'chat-end '
            } `}
          >
            <div className="chat-image avatar">
              {!v.senderId == chatWith && (
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={`${PUBLIC}/${v.profilePic[0].url}`}
                  />
                </div>
              )}
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">{v.createdAt}</time>
            </div>
            <div
              className={`chat-bubble chat ${
                v.senderId !== chatWith
                  ? 'bg-background'
                  : 'bg-primary text-black '
              } `}
            >
              {v.text}
            </div>
          </div>
        )
      })}
      <div className="h-1" ref={scrollRef}></div>
    </>
  )
}
