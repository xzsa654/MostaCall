'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ChatHeader from '../_components/chat-header'
import ChatFigure from '../_components/chat-figure'
import ChatFooter from '../_components/chat-footer'
import useMessageStore from '@/store/useMessageStore'
export default function MessageIdPage(props) {
  const { isLoading, clearMessage } = useMessageStore()
  const { id } = useParams()
  useEffect(() => {
    clearMessage()
  }, [clearMessage])
  return (
    <>
      <div className="w-full flex flex-col h-full p-5 lg:bg-white bg-base-100">
        <ChatHeader />
        <div className="divider"></div>
        <div className="flex-1 overflow-y-scroll">
          <ChatFigure id={id} />
        </div>
        <div>
          <div className="divider"></div>
          <ChatFooter />
        </div>
      </div>
    </>
  )
}
