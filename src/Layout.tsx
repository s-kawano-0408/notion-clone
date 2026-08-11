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

export default function Layout() {
  const currentUser = useAtomValue(currentUserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const noteStore = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(false);
    const notes = await noteRepository.find();
    noteStore.set(notes);
    setIsLoading(false);
  };

  if (!currentUser) return <Navigate to="/signin" replace />;
  return (
    <div className="layout-container">
      {!isLoading && <SideBar />}
      <main className="layout-main">
        <Outlet />
      </main>
      <SearchModal />
    </div>
  );
}
