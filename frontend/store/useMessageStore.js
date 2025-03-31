import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { axiosInstance } from '@/lib/axios'
import useAuthStore from './useAuthStore'
const useMessageStore = create(
  devtools(
    (set, get) => ({
      membersList: [],
      chatWith: null,
      toRender: false,
      isLoading: false,
      memberDetails: [],
      messages: [],
      clear: () => {
        set({ chatWith: null })
      },
      setChat: (id) => {
        set({ chatWith: id })
        const filter = get().membersList.filter((v) => get().chatWith == v._id)
        const obj = Object.assign({}, filter[0])
        set({ memberDetails: obj })
      },
      getMatchMembers: async (headers) => {
        try {
          const res = await axiosInstance.get('/message', { headers: headers })
          set({ membersList: res.data })
        } catch (ex) {
          console.log(ex)
        }
      },
      getMessageById: async (headers, id) => {
        try {
          set({ isLoading: true })
          const res = await axiosInstance.get(`/message/${id}`, {
            headers: headers,
          })
          set({ messages: res.data.data })
        } catch (error) {
          console.log(error)
        } finally {
          set({ isLoading: false })
        }
      },
      clearMessage: () => {
        set({ messages: [] })
      },
      sendMessage: async (headers, senderId, data) => {
        try {
          set((state) => ({
            messages: [
              ...state.messages,
              {
                _id: Date.now(),
                receiverId: useAuthStore.getState().authUser.user_id,
                senderId: state.chatWith,
                text: Object.fromEntries(data).text,
              },
            ],
          }))
          const res = await axiosInstance.post(
            `/message/send/${senderId}`,
            data,
            { headers: headers }
          )
          return { ok: true }
        } catch (error) {
          console.log(error)
        }
      },
      subscribeNewMessage: () => {
        const socket = useAuthStore.getState().socket
        socket.on('newMessage', (data) => {
          set((state) => ({
            messages: [...state.messages, data],
          }))
        })
      },
      unsubscribeNewMessage: () => {
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
      },
    }),
    { enabled: true, name: 'MessageStore' }
  )
)

export default useMessageStore
