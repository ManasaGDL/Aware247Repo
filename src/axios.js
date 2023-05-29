import axios from "axios";
import React from "react";
import api from "./Api";

// export const baseURL = "http://18.118.80.163:29170";
// export const baseURL = "http://127.0.0.1:8000";
export const baseURL = "";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 3600000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? `Bearer ${localStorage.getItem("access_token")}`
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
axiosInstance.interceptors.request.use(async config=>{
  try{
     const accessToken = localStorage.getItem("access_token");
    
      if(accessToken)
      {
        const tokenParts = JSON.parse(atob(accessToken.split(".")[1]));
        const now =  Math.ceil(Date.now() / 1000);
        if(tokenParts.exp > now)
        {
      
          if((tokenParts.exp - now) < (10*60) && (tokenParts.exp - now >0))
          {
        
          await axios.post(`${baseURL}/jwt_refresh`,{token:localStorage.getItem("access_token")}
          ).then(res=>{
              localStorage.setItem("access_token",res?.data?.token)
              config.headers  ={'Authorization': `Bearer ${res?.data.token}`, "Content-Type": "application/json",
              accept: "application/json",'bussinessunit':localStorage.getItem('BU')}        
               }).catch((error) => {
               if(error.response.status === 401||error.response.status === 400)
               {
               alert("Token expired")
                localStorage.removeItem("access_token");
                window.location.href = "/admin/login/";
                 return Promise.reject(error);
               }
            
            });
            
          }
        }
      }
    }catch(e)
    {
      console.log(e.response)
    }

return config
})
axiosInstance.interceptors.response.use(
 async (response) => {
  
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
   
    if (typeof error.response === "undefined") {
      console.log("A server/network/CORS error occurred.");
      return Promise.reject(error);
    }
    if (
      error.response.status === 401
      //&&
      // originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/admin/login/";
      return Promise.reject(error);
    }
    // if (
    //   (error.response.data.code === "token_not_valid" ||
    //     error.response.data.constructor === Blob) &&
    //   error.response.status === 401
    // ) {
    //   // to get new access token if 403 error returned
    //   const refreshToken = localStorage.getItem("refresh_token");
    //   if (refreshToken) {
    //     const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
    //     const now = Math.ceil(Date.now() / 1000);
    //     if (tokenParts.exp > now) {
    //       return axiosInstance
    //         .post("/auth/token/refresh/", {
    //           refresh: refreshToken,
    //         })
    //         .then((res) => {
    //           localStorage.setItem("access_token", res.data.access);
    //           axiosInstance.defaults.headers["Authorization"] =
    //             "Bearer " + res.data.access;
    //           originalRequest.headers["Authorization"] =
    //             "Bearer " + res.data.access;
    //           return axiosInstance(originalRequest);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //           throw err;
    //         });
    //     } else {
    //       ("Refresh token is expired", tokenParts.exp, now);
    //       alert("Token expired");
    //       localStorage.removeItem("access_token");
    //       localStorage.removeItem("refresh_token");
    //       window.location.href = "/login";
    //     }
    //   } else {
    //     alert("Token not available");
    //     console.log("Refresh token not available.");
    //     localStorage.removeItem("access_token");
    //     window.location.href = "/login";
    //   }
    // }
    return Promise.reject(error);
  }
);