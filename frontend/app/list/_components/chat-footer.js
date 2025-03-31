'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FiSmile } from 'react-icons/fi'
import { IoIosSend } from 'react-icons/io'
import useMessageStore from '@/store/useMessageStore'
import EmojiPicker from 'emoji-picker-react'
import useAuthStore from '@/store/useAuthStore'
export default function ChatFooter(props) {
  const emojiRef = useRef()
  const { getAuthHeader } = useAuthStore()
  const { chatWith, sendMessage, addMessage } = useMessageStore()
  // 可控元件
  const [message, setMessage] = useState('')

  const [picker, setPicker] = useState(false)

  const submitHandle = async (e) => {
    e.preventDefault()
    if (message) {
      const fm = new FormData(e.target)
      const result = await sendMessage(getAuthHeader(), chatWith, fm)
      if (result) {
        setMessage('')
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <form onSubmit={submitHandle}>
        <div className="flex justify-between gap-2">
          <div className="flex gap-3 items-center flex-1 relative ">
            {picker && (
              <div ref={emojiRef} className="absolute bottom-12 left-1">
                <EmojiPicker
                  disableKeyboardShortcuts={true}
                  onEmojiClick={(emojiObject) => {
                    setMessage((prev) => {
                      return prev + emojiObject.emoji
                    })
                  }}
                />
              </div>
            )}
            <button
              className=" cursor-pointer "
              onClick={() => {
                setPicker(!picker)
              }}
            >
              <FiSmile size={25} className="text-primary" />
            </button>
            <input
              type="text"
              autoComplete="off"
              name="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
              }}
              className="input w-full "
            />
          </div>
          <div className="flex items-center">
            <button type="submit" className=" cursor-pointer">
              <IoIosSend size={25} className="text-primary" />
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
