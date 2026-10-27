import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  AlertCircle,
  Plus,
  Send,
  ShieldCheck,
  Check,
  Dumbbell,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { Product, ProductCategory, UserProfile } from '../../types';

interface ProductCatalogProps {
  onOpenRecommendModal?: (product: Product) => void;
}

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'all', label: 'All Products' },
  { key: 'protein_powder', label: 'Protein Powders' },
  { key: 'protein_food', label: 'Protein Foods' },
  { key: 'sports_nutrition', label: 'Sports Nutrition' },
  { key: 'mass_gainer', label: 'Mass Gainers' },
  { key: 'fitness_accessory', label: 'Accessories' },
  { key: 'gym_equipment', label: 'Equipment & Shakers' },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onOpenRecommendModal }) => {
  const { currentUser, refreshState } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Recommendation modal state (for trainers)
  const [recModalProduct, setRecModalProduct] = useState<Product | null>(null);
  const [recMemberId, setRecMemberId] = useState<string>('');
  const [recReason, setRecReason] = useState('');
  const [recDosage, setRecDosage] = useState('');
  const [recSuccess, setRecSuccess] = useState(false);

  // Add Product modal state (for owners)
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('protein_powder');
  const [newPrice, setNewPrice] = useState<number>(39.99);
  const [newStock, setNewStock] = useState<number>(25);
  const [newDescription, setNewDescription] = useState('');
  const [newIntendedUse, setNewIntendedUse] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('Apex Certified Nutrition');
  const [newIngredients, setNewIngredients] = useState('');
  const [newPrecautions, setNewPrecautions] = useState('');
  const [newIsSupplement, setNewIsSupplement] = useState(true);

  const products = storage.getProducts();
  const users = storage.getUsers();
  const members = users.filter((u) => u.role === 'member');
  const isTrainerOrOwner = currentUser?.role === 'trainer' || currentUser?.role === 'owner';

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.intendedUse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recModalProduct || !recMemberId || !currentUser) return;
    const targetMember = users.find((u) => u.id === recMemberId);
    if (!targetMember) return;

    storage.addRecommendation({
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      trainerId: currentUser.id,
      trainerName: currentUser.fullName,
      productId: recModalProduct.id,
      productName: recModalProduct.name,
      productCategory: recModalProduct.category,
      productImage: recModalProduct.image,
      recommendedDate: new Date().toISOString().split('T')[0],
      reason: recReason || 'Aligned with your athletic progress goals.',
      precautions: recModalProduct.precautions || 'Consult a healthcare provider before starting supplementation.',
      dosageOrUsage: recDosage || 'Use as directed on packaging label.',
      acknowledgedByMember: false,
    });

    setRecSuccess(true);
    refreshState();
    setTimeout(() => {
      setRecSuccess(false);
      setRecModalProduct(null);
      setRecReason('');
      setRecDosage('');
    }, 1500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    storage.saveProduct({
      id: 'prod-' + Date.now(),
      name: newProductName,
      category: newCategory,
      image: '/src/assets/images/product_whey_isolate_1793118416422.jpg',
      description: newDescription,
      price: Number(newPrice),
      inStock: newStock > 0,
      stockQuantity: Number(newStock),
      intendedUse: newIntendedUse || 'Supports fitness and training goals.',
      manufacturer: newManufacturer,
      ingredients: newIngredients,
      precautions: newPrecautions || 'Consult a healthcare professional prior to use.',
      isSupplement: newIsSupplement,
    });

    setShowAddProductModal(false);
    refreshState();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Nutrition & Fitness Catalog
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              Verified Stock
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Evidence-grounded sports nutrition, wholesome protein foods & professional equipment.
          </p>
        </div>

        {currentUser?.role === 'owner' && (
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory Item</span>
          </button>
        )}
      </div>

      {/* Clinical Disclaimer Notice */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-medium">Clear Distinction & Medical Guidance: </strong>
          Sports supplements are formulated strictly to complement regular balanced dietary meals and are not intended to diagnose, treat, cure, or prevent any illness. Always consult a qualified medical physician or registered dietitian before initiating supplementation.
        </div>
      </div>

      {/* Category Pills & Search Bar (Single-line whitespace-nowrap controls) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                selectedCategory === cat.key
                  ? 'bg-slate-800 border-emerald-500/80 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supplements, accessories..."
            className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              {/* Image Frame */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Clean inline unboxed category indicator */}
                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
                  {product.isSupplement ? 'Sports Supplement' : 'Food / Equipment'}
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 px-2 py-0.5 rounded text-xs font-mono font-bold text-emerald-400 border border-slate-800">
                  ${product.price.toFixed(2)}
                </div>
              </div>

              {/* Title & Metadata */}
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Purpose & Manufacturer */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1 text-[11px]">
                <p className="text-slate-300">
                  <span className="text-slate-400">Intended Use: </span>
                  {product.intendedUse}
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-400">Manufacturer: </span>
                  {product.manufacturer}
                </p>
                {product.precautions && (
                  <p className="text-amber-400/90 text-[10px] pt-1 leading-snug">
                    <span className="font-semibold">Precaution: </span>
                    {product.precautions}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className={`text-[11px] font-mono ${product.stockQuantity > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </span>

              {isTrainerOrOwner && (
                <button
                  onClick={() => {
                    setRecModalProduct(product);
                    setRecMemberId(members[0]?.id || '');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Recommend to Trainee</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trainer Recommendation Modal */}
      {recModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white font-['Outfit'] mb-1">
              Recommend Product to Member
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Providing goal-oriented nutrition guidance for: <strong className="text-emerald-300">{recModalProduct.name}</strong>
            </p>

            {recSuccess ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-700 rounded-xl text-center text-xs text-emerald-300 space-y-1">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-semibold">Recommendation sent to trainee!</p>
              </div>
            ) : (
              <form onSubmit={handleSendRecommendation} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Select Member *
                  </label>
                  <select
                    value={recMemberId}
                    onChange={(e) => setRecMemberId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.fitnessGoal.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Recommendation Reason & Goal Alignment *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={recReason}
                    onChange={(e) => setRecReason(e.target.value)}
                    placeholder="e.g. To support recovery and reach your 150g daily protein target post-training."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Dosage / Usage Guidance
                  </label>
                  <input
                    type="text"
                    value={recDosage}
                    onChange={(e) => setRecDosage(e.target.value)}
                    placeholder="e.g. 1 scoop (30g) mixed into 300ml cold water within 45m after workout."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {recModalProduct.precautions && (
                  <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-amber-300 text-[11px] leading-relaxed">
                    <strong>Precaution Included:</strong> {recModalProduct.precautions}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRecModalProduct(null)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Recommendation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal (Owner) */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-white font-['Outfit'] mb-1">
              Add Catalog Product
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Expand gym inventory with sports nutrition or training accessories.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Pure Electrolyte Hydration Powder"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="protein_powder">Protein Powder</option>
                    <option value="protein_food">Protein Food</option>
                    <option value="sports_nutrition">Sports Nutrition</option>
                    <option value="mass_gainer">Mass Gainer</option>
                    <option value="fitness_accessory">Fitness Accessory</option>
                    <option value="gym_equipment">Gym Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Product summary and key benefits..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Intended Use</label>
                <input
                  type="text"
                  value={newIntendedUse}
                  onChange={(e) => setNewIntendedUse(e.target.value)}
                  placeholder="e.g. Muscle recovery, endurance hydration..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Precautions & Disclaimers</label>
                <input
                  type="text"
                  value={newPrecautions}
                  onChange={(e) => setNewPrecautions(e.target.value)}
                  placeholder="e.g. Drink adequate water. Not intended for children under 18."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
