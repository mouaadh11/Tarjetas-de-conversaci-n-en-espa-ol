import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
("use client");
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { title } from "process";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });
  //     if (error) alert(error.message);
  //     else window.location.href = "/home";
  //   };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const email = values.email;
      const password = values.password;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error)
        toast({
          title: "wrong credintals",
          variant: "destructive",
        });
      else window.location.href = "/home";
    } catch (error) {
      console.error("Form submission error", error);
      toast({ title: "submiting error", variant: "destructive" });
    }
  }

  return (
    <div className="flex flex-col min-h-screen justify-center gap-5 content-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/logo.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10 sm:mx-auto sm:w-full sm:max-w-sm"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@user.com" type="email" {...field} />
                </FormControl>
                <FormDescription>Identificator</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="***********" {...field} />
                </FormControl>
                <FormDescription>Enter your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error) alert(error.message);
//     else window.location.href = "/home";
//   };

//   return (
//     // <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto">
//     //   <h2 className="text-xl mb-4">Log In</h2>
//     //   <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="w-full mb-2 p-2 border" />
//     //   <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-full mb-4 p-2 border" />
//     //   <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Log In</button>
//     // </form>
//     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         <img
//           alt="Your Company"
//           src="/logo.png"
//           className="mx-auto h-10 w-auto"
//         />
//         <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//           Sign in to your account
//         </h2>
//       </div>

//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         <form action="#" method="POST" className="space-y-6" onSubmit={handleLogin}>
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Email address
//             </label>
//             <div className="mt-2">
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 autoComplete="email"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center justify-between">
//               <label
//                 htmlFor="password"
//                 className="block text-sm/6 font-medium text-gray-900"
//               >
//                 Password
//               </label>
//               <div className="text-sm">
//                 <a
//                   href="#"
//                   className="font-semibold text-indigo-600 hover:text-indigo-500"
//                 >
//                   Forgot password?
//                 </a>
//               </div>
//             </div>
//             <div className="mt-2">
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 autoComplete="current-password"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Sign in
//             </button>
//           </div>
//         </form>

//         <p className="mt-10 text-center text-sm/6 text-gray-500">
//           Not a member?{" "}
//           <a
//             href="#"
//             className="font-semibold text-indigo-600 hover:text-indigo-500"
//           >
//             Start a 14 day free trial
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
