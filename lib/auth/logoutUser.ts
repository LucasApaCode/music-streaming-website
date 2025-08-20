import { supabase } from "../SupabaseClient";

const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("Error al cerrar sesión:", error.message);
    return { error: error.message };
  }
};

export default logoutUser;
