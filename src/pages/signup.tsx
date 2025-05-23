import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:8080/home", // or your production domain
      },
    });
    if (error) alert(error.message);
    else alert("Check your email for confirmation");
  };

  return (
    <form onSubmit={handleSignup} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded"
      >
        Sign Up
      </button>
    </form>
  );
}
