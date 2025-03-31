'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { MdOutlineFileUpload } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import Image from 'next/image'

export default function ComponentsMyImg({ imageSlots, setImageSlots }) {
  const handleUpload = (index, event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      // 創建新陣列，只更新指定索引位置的值
      const newImageSlots = [...imageSlots]
      newImageSlots[index] = {
        file: file,
        preview: e.target.result,
      }
      setImageSlots(newImageSlots)
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = (index) => {
    const newImageSlots = [...imageSlots]
    newImageSlots[index] = null
    setImageSlots(newImageSlots)
  }

  return (
    <>
      <Swiper className="h-[100px]" spaceBetween={30} slidesPerView={4}>
        {Array(9)
          .fill(0)
          .map((_, index) => {
            return (
              <SwiperSlide key={index}>
                {!imageSlots[index] ? (
                  // 沒有上傳圖片時顯示上傳按鈕
                  <div className="w-full h-full flex justify-center items-center border border-gray-300 rounded-xl">
                    <label className="cursor-pointer w-full h-full flex justify-center items-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(index, e)}
                      />
                      <MdOutlineFileUpload
                        size={24}
                        className="text-gray-500"
                      />
                    </label>
                  </div>
                ) : (
                  // 已上傳圖片時顯示預覽和刪除按鈕
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-300">
                    <div className="relative w-full h-full">
                      <Image
                        src={imageSlots[index].preview}
                        alt={`Preview ${index}`}
                        fill={true}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="absolute top-1 right-1 bg-white p-1 rounded-full opacity-80 hover:opacity-100"
                    >
                      <RiDeleteBin6Line size={16} className="text-red-500" />
                    </button>
                  </div>
                )}
              </SwiperSlide>
            )
          })}
      </Swiper>
    </>
  )
}
