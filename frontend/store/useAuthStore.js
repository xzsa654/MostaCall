import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, persist } from 'zustand/middleware'
import { axiosInstance } from '@/lib/axios'
import { io } from 'socket.io-client'
const localKey = 'mostaCallAuth'
// 組合多個中間件，persist 需要在最外層
const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3001' : '/'
const useAuthStore = create(
  immer(
    devtools(
      persist(
        (set, get) => ({
          authUser: null,
          errorMessage: '',
          socket: '',
          onlineUser: [],
          isAuthenticated: false,
          signUp: async (data) => {
            try {
              const res = await axiosInstance.post('auth/signup', data)
              set({
                authUser: res.data,
                isAuthenticated: true,
                errorMessage: '',
              })
              get().getSocket()
              return { ok: true }
            } catch (err) {
              set({ errorMessage: err.response?.data?.message || '註冊失敗' })
              return { ok: false }
            }
          },
          getAuthHeader: () => {
            if (get().authUser) {
              return { Authorization: 'Bearer ' + get().authUser.token }
            } else {
              return {}
            }
          },
          OptionalUpload: async (data) => {
            const res = await axiosInstance.post('/auth/optional', data, {
              headers: get().getAuthHeader(),
            })
            console.log(res)

            if (res.status == 200) {
              set({
                authUser: {
                  ...get().authUser,
                  ...res.data.newUser,
                },
              })
              return { ok: true }
            }
          },
          getSocket: () => {
            if (get().authUser.token) {
              const socket = io(BASE_URL, {
                withCredentials: true,
                query: {
                  user_id: get().authUser.user_id,
                },
              })
              socket.connect()
              set((state) => ({
                ...state,
                socket: socket,
              }))
              socket.on('getOnlineUser', (user_id) => {
                set({ onlineUser: user_id })
              })
            }
          },
          update: async (data) => {
            try {
              const res = await axiosInstance.put('/auth/update', data, {
                headers: get().getAuthHeader(),
              })

              set({
                authUser: res.data.data,
              })
            } catch (error) {
              console.log(error)
            }
          },
          login: async (data) => {
            try {
              const res = await axiosInstance.post('/auth/login', data)

              set({
                authUser: res.data.data,
              })
              get().getSocket()
              return { ok: true }
            } catch (error) {
              console.log(error)

              set({ errorMessage: error.response?.data?.message || '登入失敗' })
              return { ok: false }
            }
          },
          disconnectSocket: () => {
            if (get().socket?.connected) get().socket.disconnect()
          },
          logout: () => {
            set({
              authUser: null,
              isAuthenticated: false,
              errorMessage: '',
            })
            get().disconnectSocket()
          },
          // 初始化檢查 - 可選，用於應用啟動時檢查
          initialize: () => {
            const isAuthenticated = !!get().authUser
            get().getSocket()
            set({ isAuthenticated })
          },
        }),
        {
          name: localKey, // localStorage 的鍵名
          // 只持久化 authUser，其他狀態不需要持久化
          partialize: (state) => ({
            authUser: state.authUser,
            isAuthenticated: (state.isAuthenticated = true),
          }),
        }
      ),
      { enabled: true, name: 'AuthStore' }
    )
  )
)

export default useAuthStore
