// ===== THIẾT LẬP MODULE =====

// ------ Khai báo const user key ------
const USER_KEY = 'kienshoes_users'

// ===== EXPORTS =====

// ------ Hàm lấy users ------
export const getUsers = () => {
  return JSON.parse(localStorage.getItem(USER_KEY)) || []
}

// ------ Hàm/Component saveUsers ------
export const saveUsers = (users) => {
  localStorage.setItem(USER_KEY, JSON.stringify(users))
}

// ------ Hàm/Component findUserByUsername ------
export const findUserByUsername = (username) => {
  return getUsers().find((user) => user.username === username)
}

// ------ Hàm/Component findUserByEmail ------
export const findUserByEmail = (email) => {
  return getUsers().find((user) => user.email === email)
}

// ------ Hàm/Component findUserByPhone ------
export const findUserByPhone = (phone) => {
  return getUsers().find((user) => user.phone === phone)
}

// ------ Hàm/Component addUser ------
export const addUser = (user) => {

  // ------ Khai báo const users ------
  const users = getUsers()

  // ------ Khai báo const new users ------
  const newUsers = [...users, user]
  saveUsers(newUsers)
}

// ------ Hàm cập nhật user password ------
export const updateUserPassword = (username, newPassword) => {

  // ------ Khai báo const users ------
  const users = getUsers()

  // ------ Khai báo const new users ------
  const newUsers = users.map((user) =>
    user.username === username
      ? { ...user, password: newPassword }
      : user
  )

  saveUsers(newUsers)
}