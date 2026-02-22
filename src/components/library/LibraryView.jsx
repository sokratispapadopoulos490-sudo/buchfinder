import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Plus, Trash2, CheckCircle, BookOpen, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import BookCover from '@/components/books/BookCover';

// Mini book card used inside folders
function BookItem({ saved, onToggleComplete, onDelete, onProgressClick, onFolderAssign, folders }) {
  const [showFolderMenu, setShowFolderMenu] = useState(false);

  const toggleFolder = async (folderId) => {
    const current = saved.folder_ids || [];
    const updated = current.includes(folderId)
      ? current.filter(id => id !== folderId)
      : [...current, folderId];
    await base44.entities.SavedBook.update(saved.id, { folder_ids: updated });
    onFolderAssign();
  };

  return (
    <div className="flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-[#1a1a1a] hover:border-stone-300 transition-colors">
      <div className={`w-10 h-14 rounded flex-shrink-0 ${saved.book_data.coverColor || 'bg-stone-100'} flex items-center justify-center`}>
        <span className="text-sm font-serif text-stone-400">{saved.book_data.title?.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{saved.book_data.title}</p>
        <p className="text-xs text-stone-500 truncate">{saved.book_data.author}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Folder assign button */}
        <div className="relative">
          <button
            onClick={() => setShowFolderMenu(v => !v)}
            className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-600 transition-colors"
            title="Ordner zuweisen"
          >
            <Folder className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {showFolderMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 z-50 bg-white dark:bg-[#2a2a2a] border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl p-3 min-w-[200px]"
              >
                <p className="text-xs font-medium text-stone-500 mb-2">In Ordner speichern:</p>
                {folders.length === 0 ? (
                  <p className="text-xs text-stone-400">Noch keine Ordner erstellt</p>
                ) : (
                  folders.map(folder => {
                    const isIn = (saved.folder_ids || []).includes(folder.id);
                    return (
                      <button
                        key={folder.id}
                        onClick={() => { toggleFolder(folder.id); setShowFolderMenu(false); }}
                        className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-stone-50 dark:hover:bg-stone-800 text-sm"
                      >
                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${isIn ? 'bg-amber-600 border-amber-600' : 'border-stone-300'}`}>
                          {isIn && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-stone-700 dark:text-stone-300 truncate">{folder.name}</span>
                      </button>
                    );
                  })
                )}
                <button onClick={() => setShowFolderMenu(false)} className="absolute top-2 right-2 text-stone-400 hover:text-stone-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!saved.is_completed && (
          <button
            onClick={() => onProgressClick(saved)}
            className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-stone-400 hover:text-blue-600 transition-colors"
            title="Fortschritt"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onToggleComplete(saved)}
          className={`p-1.5 rounded transition-colors ${saved.is_completed ? 'text-green-500 hover:bg-red-50 hover:text-red-500' : 'text-stone-400 hover:bg-green-50 hover:text-green-600'}`}
          title={saved.is_completed ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
        >
          <CheckCircle className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(saved.id)}
          className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-400 hover:text-red-500 transition-colors"
          title="Entfernen"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Collapsible folder component
function FolderSection({ folder, books, allFolders, onToggleComplete, onDelete, onProgressClick, onFolderAssign, onRenameFolder, onDeleteFolder }) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const handleRename = async () => {
    if (newName.trim()) {
      await onRenameFolder(folder.id, newName.trim());
    }
    setRenaming(false);
  };

  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-[#222] cursor-pointer hover:bg-stone-100 dark:hover:bg-[#2a2a2a] transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        {open ? <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />}
        {open ? <FolderOpen className="w-4 h-4 text-amber-500 flex-shrink-0" /> : <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />}
        {renaming ? (
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
            onClick={e => e.stopPropagation()}
            className="flex-1 text-sm bg-white dark:bg-[#333] border border-amber-400 rounded px-2 py-0.5 outline-none"
          />
        ) : (
          <span className="flex-1 text-sm font-medium text-stone-700 dark:text-stone-300">{folder.name}</span>
        )}
        <span className="text-xs text-stone-400 ml-auto mr-2">{books.length}</span>
        <button
          onClick={e => { e.stopPropagation(); setRenaming(true); setNewName(folder.name); }}
          className="p-1 hover:text-amber-600 text-stone-400 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDeleteFolder(folder.id); }}
          className="p-1 hover:text-red-500 text-stone-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2">
              {books.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-4">Noch keine Bücher in diesem Ordner</p>
              ) : (
                books.map(saved => (
                  <BookItem
                    key={saved.id}
                    saved={saved}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onProgressClick={onProgressClick}
                    onFolderAssign={onFolderAssign}
                    folders={allFolders}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main category (Noch nicht gelesen / Schon gelesen)
function CategorySection({ title, icon, books, folders, allFolders, parentKey, onToggleComplete, onDelete, onProgressClick, onFolderAssign, onCreateFolder, onRenameFolder, onDeleteFolder }) {
  const [open, setOpen] = useState(true);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await onCreateFolder(newFolderName.trim(), parentKey);
      setNewFolderName('');
      setCreatingFolder(false);
    }
  };

  // Books not in any folder within this category
  const categoryFolderIds = folders.map(f => f.id);
  const unfiledBooks = books.filter(b => {
    const bookFolders = b.folder_ids || [];
    return !bookFolders.some(id => categoryFolderIds.includes(id));
  });

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
      {/* Category header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-[#222] transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        {open ? <ChevronDown className="w-5 h-5 text-stone-400" /> : <ChevronRight className="w-5 h-5 text-stone-400" />}
        <span className="text-xl">{icon}</span>
        <span className="font-medium text-stone-800 dark:text-stone-200">{title}</span>
        <span className="text-sm text-stone-400 ml-1">({books.length})</span>
        <button
          onClick={e => { e.stopPropagation(); setCreatingFolder(true); setOpen(true); }}
          className="ml-auto flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg transition-colors"
        >
          <Plus className="w-3 h-3" /> Ordner
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* New folder input */}
              {creatingFolder && (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setCreatingFolder(false); }}
                    placeholder="Ordnername z.B. Geschenke..."
                    className="flex-1 text-sm border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 bg-white dark:bg-[#222] outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Button size="sm" onClick={handleCreateFolder} className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setCreatingFolder(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Sub-folders */}
              {folders.map(folder => (
                <FolderSection
                  key={folder.id}
                  folder={folder}
                  books={books.filter(b => (b.folder_ids || []).includes(folder.id))}
                  allFolders={allFolders}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onProgressClick={onProgressClick}
                  onFolderAssign={onFolderAssign}
                  onRenameFolder={onRenameFolder}
                  onDeleteFolder={onDeleteFolder}
                />
              ))}

              {/* Unfiled books in this category */}
              {unfiledBooks.length > 0 && (
                <div className="space-y-2">
                  {folders.length > 0 && (
                    <p className="text-xs text-stone-400 px-1">Ohne Ordner</p>
                  )}
                  {unfiledBooks.map(saved => (
                    <BookItem
                      key={saved.id}
                      saved={saved}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      onProgressClick={onProgressClick}
                      onFolderAssign={onFolderAssign}
                      folders={allFolders}
                    />
                  ))}
                </div>
              )}

              {books.length === 0 && (
                <p className="text-sm text-stone-400 text-center py-6">Noch keine Bücher hier</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LibraryView({ savedBooks, onToggleComplete, onDelete, onProgressClick, onRefresh }) {
  const [folders, setFolders] = useState([]);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [customCategories, setCustomCategories] = useState([]);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    const f = await base44.entities.BookFolder.list('-created_date');
    setFolders(f);
    setCustomCategories(f.filter(fold => fold.parent_category === 'custom'));
  };

  const handleCreateFolder = async (name, parentKey) => {
    await base44.entities.BookFolder.create({ name, parent_category: parentKey });
    await loadFolders();
  };

  const handleRenameFolder = async (id, name) => {
    await base44.entities.BookFolder.update(id, { name });
    await loadFolders();
  };

  const handleDeleteFolder = async (id) => {
    if (confirm('Ordner wirklich löschen? Bücher bleiben erhalten.')) {
      const booksInFolder = savedBooks.filter(b => (b.folder_ids || []).includes(id));
      await Promise.all(booksInFolder.map(b =>
        base44.entities.SavedBook.update(b.id, { folder_ids: (b.folder_ids || []).filter(fid => fid !== id) })
      ));
      await base44.entities.BookFolder.delete(id);
      await loadFolders();
      onRefresh();
    }
  };

  const handleFolderAssign = async () => {
    onRefresh();
  };

  const handleCreateCategory = async () => {
    if (newCategoryName.trim()) {
      await base44.entities.BookFolder.create({ name: newCategoryName.trim(), parent_category: 'custom' });
      setNewCategoryName('');
      setCreatingCategory(false);
      await loadFolders();
    }
  };

  const inProgressBooks = savedBooks.filter(b => !b.is_completed);
  const completedBooks = savedBooks.filter(b => b.is_completed);

  const readingFolders = folders.filter(f => f.parent_category === 'reading');
  const completedFolders = folders.filter(f => f.parent_category === 'completed');

  const sharedProps = {
    allFolders: folders,
    onToggleComplete,
    onDelete,
    onProgressClick,
    onFolderAssign: handleFolderAssign,
    onCreateFolder: handleCreateFolder,
    onRenameFolder: handleRenameFolder,
    onDeleteFolder: handleDeleteFolder,
  };

  return (
    <div className="space-y-4">
      {/* Header row with + Ordner and + Kategorie */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => { setCreatingCategory(true); }}
          className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:text-amber-700 border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3 h-3" /> Kategorie
        </button>
      </div>

      {/* New category input */}
      <AnimatePresence>
        {creatingCategory && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex gap-2">
            <input
              autoFocus
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateCategory(); if (e.key === 'Escape') setCreatingCategory(false); }}
              placeholder="Kategoriename z.B. Geschenkliste..."
              className="flex-1 text-sm border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 bg-white dark:bg-[#222] outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button size="sm" onClick={handleCreateCategory} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Check className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCreatingCategory(false)}>
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <CategorySection
        title="Noch nicht gelesen"
        icon="📖"
        books={inProgressBooks}
        folders={readingFolders}
        parentKey="reading"
        {...sharedProps}
      />
      <CategorySection
        title="Schon gelesen"
        icon="✅"
        books={completedBooks}
        folders={completedFolders}
        parentKey="completed"
        {...sharedProps}
      />

      {/* Custom categories */}
      {customCategories.map(cat => (
        <CategorySection
          key={cat.id}
          title={cat.name}
          icon="📁"
          books={savedBooks.filter(b => (b.folder_ids || []).includes(cat.id))}
          folders={[]}
          parentKey="custom"
          {...sharedProps}
        />
      ))}
    </div>
  );
}