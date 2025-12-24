import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import  userAuthStore  from "../store/AuthenticationStore";

const RegisterForm = () => {

  const {signup}=userAuthStore();
  const [FormData,setFormData]=useState({
    username:"",
    email:"",
    password:""
  });
  const validateForm=()=>
    {
      if(!FormData.username){
          return   toast.error("username required")
      }
      if(!FormData.email){
          return   toast.error("email required!")
      }
      if(!FormData.password){
        return   toast.error("password required!")
    }

      return true
    }
  const handleSubmit=async(e)=>{
    const success=validateForm();
    if(!success) return;
    e.preventDefault();
    signup(FormData);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg border-border/50 h-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="register-name">Username</Label>
            <Input
              id="register-name"
              type="text"
              placeholder="username"
              value={FormData.username}
              onChange={(e)=>
              {
                setFormData({...FormData,username:e.target.value})
              }
            }
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={FormData.email}
              onChange={(e)=>
                {
                  setFormData({...FormData,email:e.target.value})
                }
              }
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={FormData.password}
              onChange={(e)=>
                {
                  setFormData({...FormData,password:e.target.value})
                }
              }
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" className="w-full mt-6 shadow-md hover:shadow-lg transition-all cursor-pointer">
            Register
          </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
