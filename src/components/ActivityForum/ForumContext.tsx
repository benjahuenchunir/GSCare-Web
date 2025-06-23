import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Thread,
  subscribeToThreads,
  createThread,
  joinThread,
} from "../../firebase/activityThreads";

// Contexto aislado para el foro
interface ForumContextType {
  threads: Thread[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: "all" | "participating" | "not-participating";
  setFilterType: (value: "all" | "participating" | "not-participating") => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  showCreateForm: boolean;
  setShowCreateForm: (value: boolean) => void;
  selectedThread: Thread | null;
  setSelectedThread: (value: Thread | null) => void;
  handleCreateThread: (title: string, description: string) => Promise<void>;
  handleJoinThread: (threadId: string) => Promise<void>;
  isMemberOfThread: (thread: Thread) => boolean;
  openThread: (thread: Thread) => void;
  closeThread: () => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  isAuthenticated: boolean;
  user: unknown; // Auth0User type
}

const ForumContext = createContext<ForumContextType | null>(null);

// Hook para usar el contexto del foro
export const useForumContext = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error("useForumContext must be used within a ForumProvider");
  }
  return context;
};

// Provider del contexto del foro
export const ForumProvider: React.FC<{
  children: React.ReactNode;
  activityId: number;
}> = ({ children, activityId }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "participating" | "not-participating"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const unsubscribe = subscribeToThreads(activityId, (updatedThreads) => {
      setThreads(updatedThreads);
    });

    return () => unsubscribe();
  }, [activityId]);

  const handleCreateThread = async (title: string, description: string) => {
    if (!user?.email) return;
    try {
      await createThread(activityId, title, description, user.email);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error al crear hilo:", error);
    }
  };

  const handleJoinThread = async (threadId: string) => {
    if (!user?.email) return;
    try {
      await joinThread(threadId, user.email);
    } catch (error) {
      console.error("Error al unirse al hilo:", error);
    }
  };

  const isMemberOfThread = (thread: Thread): boolean => {
    return !!(user?.email && thread.members.includes(user.email));
  };

  const openThread = (thread: Thread) => {
    setSelectedThread(thread);
  };

  const closeThread = () => {
    setSelectedThread(null);
  };

  const value: ForumContextType = {
    threads,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    showCreateForm,
    setShowCreateForm,
    selectedThread,
    setSelectedThread,
    handleCreateThread,
    handleJoinThread,
    isMemberOfThread,
    openThread,
    closeThread,
    showModal,
    setShowModal,
    isAuthenticated,
    user,
  };

  return (
    <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
  );
};
