import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import Queue from "@/components/Queue";
import Sidebar from "@/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { Song } from "../types/song";

type PlayerContextType = {
  isQueueModalOpen: boolean;
  setIsQueueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentMusic: Song | null;
  setCurrentMusic: React.Dispatch<React.SetStateAction<Song | null>>;
  queue: Song[];
  setQueue: (songs: Song[]) => void;
  playNext: () => void;
  playPrev: () => void;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
};

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
);

export default function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryclient = new QueryClient();
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [queue, setQueue] = useState<Song[]>([]);

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    if (queue.length > 0 && currentIndex >= 0 && currentIndex < queue.length) {
      setCurrentMusic(queue[currentIndex]);
    }
  }, [currentIndex, queue]);

  return (
    <QueryClientProvider client={queryclient}>
      <PlayerContext.Provider
        value={{
          isQueueModalOpen,
          setIsQueueModalOpen,
          currentMusic,
          setCurrentMusic,
          queue,
          setQueue,
          playNext,
          playPrev,
          setCurrentIndex,
          currentIndex,
        }}
      >
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Sidebar />
            <Queue />
            {currentMusic && <MusicPlayer />}
            {children}
          </main>
        </div>
      </PlayerContext.Provider>
    </QueryClientProvider>
  );
}
