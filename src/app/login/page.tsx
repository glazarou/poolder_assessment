'use client';

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login(){
    const router = useRouter();

    const [data, setData] = useState<{
        email:string, 
        password:string
    }>({
        email:'', 
        password:''
    })

    const signup = async() => {
        try {
            let { data, error } = await supabase.auth.signUp({
                email: 'someone@email.com',
                password: 'rFSKcqtdwZfdUoPvJRPY'
              })

            if (data) console.log(data)
        } catch(error){

            console.log(error)
        }
    }

    const login = async() => {
        try {
            

            let { data:dataUser, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password
              })

            if (dataUser) {
                router.refresh();
            }
        } catch(error){

            console.log(error)
        }
    }

    const handleChange = (e:any) =>{
        const {name, value} = e.target;
        setData((prev:any)=> ({
            ...prev, 
            [name]: value,
        }))
    }
    return (
            <div className="bg-black min-h-screen">
              <div className="container mx-auto w-[400px] text-white">
                <div>New User</div>
                <div className="grid">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    value={data?.email}
                    onChange={handleChange}
                    className="text-black"
                  />
                </div>
                <div className="grid">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={data?.password}
                    onChange={handleChange}
                    className="text-black"
                  />
                </div>  
                <div>
                  <button 
                    onClick={signup} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Signup
                  </button>
                </div>

                <div>
                  <button 
                    onClick={login} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Login
                  </button>
                </div>

              </div>
            </div>
          );
}