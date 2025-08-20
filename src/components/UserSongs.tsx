import Image from "next/image";
import { supabase } from "../../lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Song } from "../../types/song";
import DeleteButton from "./DeleteButton";
import { useContext } from "react";
import { PlayerContext } from "../../layouts/FrontendLayout";

type UserSongsProps = {
  userId: string | undefined;
};

export default function UserSongs({ userId }: UserSongsProps) {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("El contexto debe estar dentro del proveedor");
  }
  const { setQueue, setCurrentIndex } = context;

  const getUserSongs = async () => {
    const { error, data } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log("fetchUserSongsError:", error.message);
    }

    return data;
  };

  const {
    data: songs,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryFn: getUserSongs,
    queryKey: ["userSongs"],
  });

  const startPlayingSong = (songs: Song[], index: number) => {
    setCurrentIndex(index);
    setQueue(songs);
  };

  if (isLoading)
    return (
      <div>
        {[...Array(10)].map((i, index) => (
          <div key={index} className="flex gap-2 animate-pulse mb-4">
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] rounded-md bg-hover"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <h2 className="text-center text-white text-2xl">{error.message}</h2>;

  if (songs?.length === 0) {
    return (
      <h1 className="text-center text-white text-sm">
        Tú no tienes canciones en tu biblioteca
      </h1>
    );
  }
  return (
    <div>
      {songs?.map((song: Song, index) => {
        return (
          <div
            key={song.id}
            onClick={() => startPlayingSong(songs, index)}
            className="flex relative gap-2 items-center cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover group"
          >
            <DeleteButton
              songId={song.id}
              imagePath={song.cover_image_url}
              audioPath={song.audio_url}
            />
            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={300}
              height={300}
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
