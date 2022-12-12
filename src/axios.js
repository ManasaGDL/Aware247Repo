import axios from "axios";
import React from "react";

export const baseURL = "http://3.16.49.111:8080";
export const axiosInstance = axios.create(
    {
        baseURL:baseURL,
        timeout:3600000,
        headers: {
            Authorization:localStorage.getItem("access_token")
            ? `Bearer ${localStorage.getItem("access_token")}`
            : null,
            "Content-Type": "application/json",
             accept: "application/json",
        }
    }
)
axiosInstance.interceptors.response.use((response)=>{ 
   
    return response
}, async function (error){
   
    const originalRequest = error.config;
    if(error.response.status === 403) // to get new access token if 403 error returned
    {
    const refreshToken = localStorage.getItem("refresh_token");
    if(refreshToken)
    { const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
    const now = Math.ceil(Date.now() / 1000);
    if(tokenParts.exp > now)
    {
        return axiosInstance.post("/auth/token/refresh",{
            refresh : refreshToken
        }).then(res =>
            {
                localStorage.setItem("access_token",res.data.access);
                axiosInstance.defaults.headers["Authorization"] = "Bearer "+ res.data.access;
                originalRequest.headers["Authorization"] =
                "Bearer " + res.data.access;
                return axiosInstance(originalRequest)
            }).catch(err =>{
                console.log(err)
                throw err 
            })
            
    }
    else {
        console.log("Refresh token is expired", tokenParts.exp, now);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; 
    }
    }else{
        console.log("Refresh token not available.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }
    }
    return Promise.reject(error);
})