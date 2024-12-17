import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: {
    username: '',
    password: '',
  },
  loading: false,
  loggedIn: !!sessionStorage.getItem('accessToken'),
  login: async (user) => {
    try {
      set({ loading: true })
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      if (!response.ok) {
        alert('Invalid credentials')
      } else {
        const data = await response.json()
        if (!data) {
          alert('Error logging in')
          throw new Error(data.error)
        } else {
          const accessToken = data.accessToken
          sessionStorage.setItem('accessToken', accessToken)
          const refreshToken = data.refreshToken
          sessionStorage.setItem('refreshToken', refreshToken)



          window.location.href = '/'
        }
      }
    } catch (error) {
      alert(error)
      console.error(error)
    } finally {
      set({ loading: false })
    }
  },
  logout: async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken')
      const response = await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        alert('Error logging out')
      } else {
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    } catch (error) {
      alert('Error logging out')
      console.error(error)
    }
  },
  signup: async (user) => {
    try {
      set({ loading: true })
      const response = await fetch('http://localhost:4000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      if (!response.ok) {
        alert('Error signing up')
      } else {
        const data = await response.json()
        if (!data) {
          alert('Error signing up')
          throw new Error(data.error)
        } else {
          window.location.href = '/login'
          alert('Account created successfully')
        }
      }
    } catch (error) {
      alert(error)
      console.error(error)
    } finally {
      set({ loading: false })
    }
  },
  refresh: async () => {
    try {
      set({ loading: true })
      const refreshToken = sessionStorage.getItem('refreshToken')
      const response = await fetch('http://localhost:4000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      if (!response.ok) {
        alert('Error refreshing token')
        window.location.href = '/login'
      } else {
        const data = await response.json()
        if (!data) {
          alert('Error refreshing token')
          window.location.href = '/login'
          throw new Error(data.error)
        } else {
          const accessToken = data.accessToken
          sessionStorage.setItem('accessToken', accessToken)
        }
      }
    } catch (error) {
      alert('Error refreshing token')
      window.location.href = '/login'
      console.error(error)
    } finally {
      set({ loading: false })
    }
  }
}))