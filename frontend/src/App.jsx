import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit3, PlusCircle, X, AlertTriangle } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api/articles/';

function App() {
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ titre: '', contenu: '' });
  const [viewingArticle, setViewingArticle] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deletingArticle, setDeletingArticle] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    const res = await axios.get(API_URL);
    setArticles(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingArticle) {
      await axios.put(`${API_URL}${editingArticle.id}/`, formData);
    } else {
      await axios.post(API_URL, formData);
    }
    closeAllModals();
    fetchArticles();
  };

  const confirmDelete = async () => {
    if (deletingArticle) {
      await axios.delete(`${API_URL}${deletingArticle.id}/`);
      closeAllModals();
      fetchArticles();
    }
  };

  const closeAllModals = () => {
    setViewingArticle(null);
    setEditingArticle(null);
    setDeletingArticle(null);
    setIsAdding(false);
    setFormData({ titre: '', contenu: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Mon Journal Blog</h1>
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> Écrire un article
          </button>
        </div>

        {/* LISTE DES ARTICLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(art => (
            <div key={art.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
              <div className="cursor-pointer" onClick={() => setViewingArticle(art)}>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{art.titre}</h2>
                <p className="text-gray-500 line-clamp-3 mb-6">{art.contenu}</p>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <span className="text-xs text-gray-400">
                  {new Date(art.date_creation).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => {setEditingArticle(art); setFormData({titre: art.titre, contenu: art.contenu})}} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                  <button onClick={() => setDeletingArticle(art)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DETAIL (Directement dans le JSX) --- */}
      {viewingArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative">
            <button onClick={closeAllModals} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X /></button>
            <h2 className="text-3xl font-bold mb-4">{viewingArticle.titre}</h2>
            <div className="text-gray-700 whitespace-pre-wrap h-64 overflow-y-auto">{viewingArticle.contenu}</div>
          </div>
        </div>
      )}

      {/* --- MODAL FORMULAIRE (ADD/EDIT) --- */}
      {(editingArticle || isAdding) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative">
            <button onClick={closeAllModals} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X /></button>
            <h2 className="text-2xl font-bold mb-6">{editingArticle ? "Modifier" : "Nouveau"}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input 
                className="border-2 p-3 rounded-xl focus:border-blue-500 outline-none" 
                placeholder="Titre" 
                value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                autoFocus
                required 
              />
              <textarea 
                className="border-2 p-3 rounded-xl h-40 focus:border-blue-500 outline-none" 
                placeholder="Contenu..." 
                value={formData.contenu}
                onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                required 
              />
              <button className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700">
                {editingArticle ? "Enregistrer" : "Publier"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL SUPPRESSION --- */}
      {deletingArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Supprimer ?</h2>
            <p className="text-gray-500 mb-6 font-semibold">"{deletingArticle.titre}"</p>
            <div className="flex gap-3">
              <button onClick={closeAllModals} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;