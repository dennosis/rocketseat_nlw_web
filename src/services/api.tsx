import axios from 'axios'
  
 const api = axios.create({
    baseURL: "http://localhost:3001/"
})


// let header = {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json, text/plain, */*'
//     "Authorization":"Bearer "
// }


// export const login = (authenticate) => api.post('/authenticate/signin', authenticate)
// export const register = (user) => api.post('/user/register', user)

// const apis = {
//     login,
//     register,
// }

export default api