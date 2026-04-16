import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit3, PlusCircle } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api/articles/';

function App() {
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ titre: '', contenu: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    const res = await axios.get(API_URL); // 
    setArticles(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}${editingId}/`, formData);
    } else {
      await axios.post(API_URL, formData);
    }
    setFormData({ titre: '', contenu: '' });
    setEditingId(null);
    fetchArticles(); 
  };

  const deleteArticle = async (id) => {
    if (confirm("Supprimer cet article ?")) {
      await axios.delete(`${API_URL}${id}/`);
      fetchArticles();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mini Blog Dashboard</h1>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid gap-4">
            <input 
              className="border p-2 rounded" 
              placeholder="Titre" 
              value={formData.titre}
              onChange={(e) => setFormData({...formData, titre: e.target.value})}
              required 
            />
            <textarea 
              className="border p-2 rounded" 
              placeholder="Contenu" 
              value={formData.contenu}
              onChange={(e) => setFormData({...formData, contenu: e.target.value})}
              required 
            />
            <button className="bg-blue-600 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700">
              {editingId ? <Edit3 size={18}/> : <PlusCircle size={18}/>}
              {editingId ? "Modifier" : "Ajouter l'article"}
            </button>
          </div>
        </form>

        {/* Liste */}
        <div className="grid gap-4">
          {articles.map(art => (
            <div key={art.id} className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{art.titre}</h2>
                <p className="text-gray-600 mt-2">{art.contenu.substring(0, 100)}...</p>
                <span className="text-xs text-gray-400 block mt-4">
                  Créé le : {new Date(art.date_creation).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {setEditingId(art.id); setFormData(art)}} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                  <Edit3 size={20} />
                </button>
                <button onClick={() => deleteArticle(art.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;