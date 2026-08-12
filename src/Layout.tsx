import SideBar from "./components/SideBar";
import SearchModal from "./components/SearchModal";
import "./styles/layout.css";
import { Outlet } from "react-router-dom";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "./modules/auth/current-user.state";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNoteStore } from "./modules/notes/note.state";
import { noteRepository } from "./modules/notes/note.repository";
import type { Note } from "./modules/notes/note.entity";

export default function Layout() {
  const currentUser = useAtomValue(currentUserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const noteStore = useNoteStore();
  const [isShowModal, setIsShowModal] = useState(false);
  const [searchResult, setSearchResult] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(false);
    const notes = await noteRepository.find();
    noteStore.set(notes);
    setIsLoading(false);
  };

  const searchNotes = async (keyword: string) => {
    const notes = await noteRepository.find({ keyword });
    noteStore.set(notes);
    setSearchResult(notes ?? []);
  };

  if (!currentUser) return <Navigate to="/signin" replace />;
  return (
    <div className="layout-container">
      {!isLoading && (
        <SideBar onSearchButtonClick={() => setIsShowModal(true)} />
      )}
      <main className="layout-main">
        <Outlet />
      </main>
      <SearchModal
        isOpen={isShowModal}
        onClose={() => setIsShowModal(false)}
        notes={searchResult}
        onKeywordChange={searchNotes}
      />
    </div>
  );
}
