import React, { useEffect } from "react";
import { useForumContext } from "./ForumContext";
import ForumStats from "./ForumStats";
import ForumSearch from "./ForumSearch";
import ForumFilters from "./ForumFilters";
import CreateThreadButton from "./CreateThreadButton";
import CreateThreadForm from "./CreateThreadForm";
import ThreadCard from "./ThreadCard";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

const ForumContent: React.FC = () => {
  const {
    threads,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    showCreateForm,
    setShowCreateForm,
    handleCreateThread,
    handleJoinThread,
    isMemberOfThread,
    openThread,
    isAuthenticated,
  } = useForumContext();

  const threadsPerPage = 3;

  // Filtrar hilos según búsqueda y filtros
  const filteredThreads = threads.filter((thread) => {
    // Filtro por búsqueda
    const matchesSearch =
      searchTerm === "" ||
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por participación
    const matchesFilter =
      filterType === "all" ||
      (filterType === "participating" && isMemberOfThread(thread)) ||
      (filterType === "not-participating" && !isMemberOfThread(thread));

    return matchesSearch && matchesFilter;
  });

  // Calcular hilos para la página actual
  const indexOfLastThread = currentPage * threadsPerPage;
  const indexOfFirstThread = indexOfLastThread - threadsPerPage;
  const currentThreads = filteredThreads.slice(
    indexOfFirstThread,
    indexOfLastThread
  );
  const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);

  // Resetear página cuando cambian los filtros o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm, setCurrentPage]);

  const participatingThreads = threads.filter((t) =>
    isMemberOfThread(t)
  ).length;

  return (
    <>
      {/* Estadísticas */}
      <ForumStats
        totalThreads={threads.length}
        participatingThreads={participatingThreads}
        filteredThreads={filteredThreads.length}
        hasSearchTerm={searchTerm !== ""}
      />

      {/* Búsqueda */}
      <div className="mb-6">
        <ForumSearch onSearch={setSearchTerm} />
      </div>

      {/* Filtros */}
      <ForumFilters filterType={filterType} onFilterChange={setFilterType} />

      {/* Botón para crear nuevo hilo */}
      {isAuthenticated && (
        <CreateThreadButton onCreateClick={() => setShowCreateForm(true)} />
      )}

      {/* Formulario para crear hilo */}
      {showCreateForm && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <CreateThreadForm
            onSubmit={handleCreateThread}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Lista de hilos */}
      <div className="space-y-4">
        {currentThreads.length === 0 ? (
          <EmptyState
            filterType={filterType}
            isAuthenticated={isAuthenticated}
            hasSearchTerm={searchTerm !== ""}
          />
        ) : (
          currentThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              isMember={isMemberOfThread(thread)}
              isAuthenticated={isAuthenticated}
              onJoinThread={handleJoinThread}
              onOpenThread={openThread}
            />
          ))
        )}
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ForumContent;
