import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { axiosInstance } from '@/lib/axios'
import useAuthStore from './useAuthStore'
import toast from 'react-hot-toast'
const useMatchStore = create(
  devtools(
    (set) => ({
      match: [],
      userList: [],
      getUserList: async (header) => {
        try {
          const res = await axiosInstance.get('/match', { headers: header })
          set({
            userList: res.data.users,
          })
        } catch (err) {
          console.error(err)
        }
      },
      rightArrow: async (header, id) => {
        try {
          const res = await axiosInstance.get(`/match/swiper-right/${id}`, {
            headers: header,
          })
          if (res.data.message) {
            toast.success('配對成功！')
          }
        } catch (err) {
          console.log(err)
        }
      },
      leftArrow: async (header, id) => {
        try {
          const res = await axiosInstance.get(`/match/swiperLeft/${id}`, {
            headers: header,
          })
        } catch (err) {
          console.log(err)
        }
      },
      subscribeToNewMatch: async () => {
        try {
          const socket = useAuthStore.getState().socket
          socket.on('newMatch', (matchData) => {
            set((state) => ({
              match: [...state.match, matchData],
            }))
            toast.success('有一個成功配對')
          })
        } catch (error) {
          console.log(error)
        }
      },
      unsubscribeFromNewMatches: () => {
        try {
          const socket = useAuthStore.getState().socket
          socket.off('newMatch')
        } catch (error) {
          console.log(error)
        }
      },
    }),
    { name: 'matchStore', enabled: true }
  )
)

export default useMatchStore
