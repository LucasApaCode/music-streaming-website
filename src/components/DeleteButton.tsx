import { FaTrash } from "react-icons/fa";
import { supabase } from "../../lib/SupabaseClient";
import { useQueryClient } from "@tanstack/react-query";

type DeleteButtonProps = {
  songId: number;
  imagePath: string;
  audioPath: string;
};

export default function DeleteButton({
  songId,
  imagePath,
  audioPath,
}: DeleteButtonProps) {
  const queryClient = useQueryClient();

  const deleteSong = async () => {
    // Eliminar la imagen
    const { error: imgError } = await supabase.storage
      .from("cover-images")
      .remove([imagePath]);

    if (imgError) {
      console.log("deleteImageError:", imgError.message);
      return;
    }

    // Eliminar el audio
    const { error: audioError } = await supabase.storage
      .from("songs")
      .remove([audioPath]);

    if (audioError) {
      console.log("deleteAudioError:", audioError.message);
      return;
    }

    // Eliminar la canción de la base de datos
    const { error: deleteError } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (deleteError) {
      console.log("deleteSongError:", deleteError.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["allSongs"] });
    queryClient.invalidateQueries({ queryKey: ["userSongs"] });
  };
  return (
    <button
      onClick={deleteSong}
      className="text-secondary-text absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hidden group-hover:block"
    >
      <FaTrash />
    </button>
  );
}
