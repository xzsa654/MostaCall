'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'
import useMessageStore from '@/store/useMessageStore'
import { PUBLIC } from '@/lib/axios'
export default function ListLayout({ children }) {
  const { membersList, chatWith, getMatchMembers, setChat } = useMessageStore()
  const { getAuthHeader } = useAuthStore()

  useEffect(() => {
    getMatchMembers(getAuthHeader())
  }, [])
  const router = useRouter()
  return (
    <>
      <div className="container mx-auto bg-white  w-full h-[93vh]  lg:h-[80.58vh] mt-16 lg:mt-20  lg:rounded-3xl  flex ">
        <div
          className={`${
            chatWith ? 'hidden' : 'w-full'
          }  lg:w-1/2   lg:block lg:p-5 px-3 pt-2  lg:border-r-1  `}
        >
          {membersList.map((v) => {
            return (
              <button
                key={v._id}
                onClick={() => {
                  setChat(v._id)
                  router.push(`/list/${v._id}`)
                }}
                className="flex gap-2 cursor-pointer w-full mb-3 hover:bg-gray-200 rounded-lg"
              >
                <div className="avatar avatar-online ">
                  <div className="w-12 rounded-full">
                    <img src={`${PUBLIC}/${v.profilePic[0].url}`} />
                  </div>
                </div>
                <div>
                  <div>{v.nickname}</div>
                  <div></div>
                </div>
              </button>
            )
          })}
        </div>
        <div
          className={`w-full  lg:w-1/2 h-full  lg:flex ${
            !chatWith && 'hidden '
          }  justify-center items-center`}
        >
          {chatWith ? (
            <>{children}</>
          ) : (
            <div className="text-4xl">
              Chat with somebody
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
