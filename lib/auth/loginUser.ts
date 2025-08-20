import { supabase } from "../SupabaseClient";

const loginUser = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Error en el inicio de sesión del usuario:", error.message);
      return { error: error.message };
    }
  } catch (err) {
    console.log("Unexpected Error:", err);
    return { error: "Algo esta mal" };
  }
};

export default loginUser;
