import { supabase } from "@/integrations/supabase/client";

export const session = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user;
};

