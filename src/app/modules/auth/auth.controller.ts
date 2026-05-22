import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signup =async (req:Request,res:Response)=>{
    try {
        const result =await authService.userInDB(req.body);
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result,
        })
    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

const login =async(req:Request,res:Response)=>{
    try {
        const result =await authService.loginUser(req.body);
        res.status(200).json({
            success:true,
            message:"You logged in!",
            data:result
        })
    } catch (error:any) {
        res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
    }
}


export const authController ={
    signup,
    login
}