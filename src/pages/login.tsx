import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) alert(error.message);
    else window.location.href = "/home";
  };

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Log In</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="w-full mb-2 p-2 border" />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-full mb-4 p-2 border" />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Log In</button>
    </form>
  );
}
