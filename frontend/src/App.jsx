import React, { useState, useEffect } from 'react';
import api from './api';
import { Trash2, Edit3, PlusCircle, X, AlertTriangle, LogOut } from 'lucide-react';

function App() {
  // État d'authentification
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [isLoginView, setIsLoginView] = useState(true);
  const [authData, setAuthData] = useState({ email: '', password: '' });
  
  // État du blog
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ titre: '', contenu: '' });
  const [viewingArticle, setViewingArticle] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deletingArticle, setDeletingArticle] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { 
    if (token) fetchArticles(); 
  }, [token]);

  // === AUTHENTIFICATION ===
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLoginView) {
        const res = await api.post('auth/login/', authData);
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        setToken(res.data.access);
        setAuthData({ email: '', password: '' });
      } else {
        await api.post('auth/register/', authData);
        setIsLoginView(true);
        setAuthData({ email: '', password: '' });
        setError('✓ Inscription réussie, connectez-vous !');
      }
    } catch (err) { 
      setError(err.response?.data?.detail || err.response?.data?.email?.[0] || "Erreur d'authentification");
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setArticles([]);
    setFormData({ titre: '', contenu: '' });
  };

  // === BLOG OPERATIONS ===
  const fetchArticles = async () => {
    try {
      const res = await api.get('articles/');
      setArticles(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des articles', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingArticle) {
        await api.put(`articles/${editingArticle.id}/`, formData);
      } else {
        await api.post('articles/', formData);
      }
      closeAllModals();
      fetchArticles();
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (deletingArticle) {
      setLoading(true);
      try {
        await api.delete(`articles/${deletingArticle.id}/`);
        closeAllModals();
        fetchArticles();
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
      setLoading(false);
    }
  };

  const closeAllModals = () => {
    setViewingArticle(null);
    setEditingArticle(null);
    setDeletingArticle(null);
    setIsAdding(false);
    setFormData({ titre: '', contenu: '' });
  };

  // === VUE LOGIN/REGISTER ===
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {isLoginView ? '🔐 Connexion' : '📝 Inscription'}
          </h2>
          
          {error && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${error.startsWith('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={authData.email}
            onChange={e => setAuthData({...authData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={authData.password}
            onChange={e => setAuthData({...authData, password: e.target.value})}
            required
          />
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold mb-4 disabled:opacity-50"
          >
            {loading ? '⏳ Chargement...' : (isLoginView ? 'Se connecter' : "S'inscrire")}
          </button>
          <p className="text-center text-sm cursor-pointer text-blue-600 hover:underline" 
             onClick={() => { setIsLoginView(!isLoginView); setError(''); }}>
            {isLoginView ? "Créer un compte" : "Déjà un compte ?"}
          </p>
        </form>
      </div>
    );
  }

  // === VUE BLOG ===
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header avec logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">📝 Mini Blog Dashboard</h1>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </div>

        {/* Bouton ajouter article */}
        <button 
          onClick={() => setIsAdding(true)}
          className="mb-8 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          <PlusCircle size={20} /> Ajouter l'article
        </button>

        {/* Grille des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 cursor-pointer" onClick={() => setViewingArticle(article)}>
              <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{article.titre}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.contenu}</p>
              <p className="text-xs text-gray-500">📅 {new Date(article.date_creation).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>

        {/* Modal - Voir l'article */}
        {viewingArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
              <button onClick={closeAllModals} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{viewingArticle.titre}</h2>
              <p className="text-gray-600 mb-6 whitespace-pre-wrap">{viewingArticle.contenu}</p>
              <p className="text-xs text-gray-500 mb-6">📅 Créé: {new Date(viewingArticle.date_creation).toLocaleDateString('fr-FR')}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setEditingArticle(viewingArticle); setFormData(viewingArticle); }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex-1"
                >
                  <Edit3 size={18} /> Modifier
                </button>
                <button 
                  onClick={() => setDeletingArticle(viewingArticle)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex-1"
                >
                  <Trash2 size={18} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal - Ajouter/Modifier l'article */}
        {(isAdding || editingArticle) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
              <button onClick={closeAllModals} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingArticle ? 'Modifier' : 'Ajouter'} l'article</h2>
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  placeholder="Titre" 
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.titre}
                  onChange={e => setFormData({...formData, titre: e.target.value})}
                  required
                />
                <textarea 
                  placeholder="Contenu" 
                  rows="6"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.contenu}
                  onChange={e => setFormData({...formData, contenu: e.target.value})}
                  required
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold disabled:opacity-50"
                >
                  {loading ? '⏳ Chargement...' : (editingArticle ? 'Mettre à jour' : 'Créer')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal - Confirmer suppression */}
        {deletingArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertTriangle size={24} />
                <h2 className="text-xl font-bold">Confirmer la suppression</h2>
              </div>
              <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cet article ?</p>
              <div className="flex gap-3">
                <button 
                  onClick={closeAllModals}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? '⏳ Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
