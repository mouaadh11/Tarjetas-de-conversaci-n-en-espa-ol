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

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const email = values.email;
      const password = values.password;
      const password_conf = values.password_confirmation;
      if (password !== password_conf) {
        toast({
          title: "Password doesn't match",
          variant: "destructive",
        });
        form.setFocus("password_confirmation");
        form.setValue("password_confirmation", "");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:8080/home", // or your production domain
        },
      });
      console.log(error, data);
      if (error)
        toast({
          title: "Something Wrong",
          description: error.message,
          variant: "destructive",
        });
      else alert("Check your email for confirmation");
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        title: "Error",
        description: "Failed to submit the form. Please try again.",
        variant: "destructive",
      });
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

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Passwork</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="***********" {...field} />
                </FormControl>
                <FormDescription>re-enter your password</FormDescription>
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

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: "http://localhost:8080/home", // or your production domain
//       },
//     });
//     if (error) alert(error.message);
//     else alert("Check your email for confirmation");
//   };

//   return (
//     <form onSubmit={handleSignup} className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl mb-4">Sign Up</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full mb-2 p-2 border"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full mb-4 p-2 border"
//       />
//       <button
//         type="submit"
//         className="w-full bg-green-500 text-white p-2 rounded"
//       >
//         Sign Up
//       </button>
//     </form>
//   );
// }
