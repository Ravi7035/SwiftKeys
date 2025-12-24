import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { GithubIcon } from "lucide-react";
import  userAuthStore  from "../store/AuthenticationStore";
import toast from "react-hot-toast";

import { Separator } from "./ui/separator";

const LoginForm = () => {
  const {login}=userAuthStore();
  const [FormData,setFormData]=useState({
    email:"",
    password:""
  });
  const validateForm=()=>
    {
      if(!FormData.email){
          return   toast.error("username required")
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
    login(FormData);
  }
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg border-border/50 h-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full gap-2 border-border/50 bg-primary hover hover:bg-secondary cursor cursor-pointer"
          >
            <GithubIcon className="h-5 w-5" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
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
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
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
             Login
          </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
