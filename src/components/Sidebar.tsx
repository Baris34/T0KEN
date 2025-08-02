import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  MapPin, 
  PieChart, 
  DollarSign,
  Settings,
  LogOut,
  User,
  Home,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { User as UserType } from '../types/index.ts';

interface SidebarProps {
  currentUser: UserType;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  activeSection, 
  onSectionChange, 
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Ana Dashboard', icon: Home, color: 'text-blue-600' },
    { id: 'satis-oranlari', label: 'Satış Oranları', icon: PieChart, color: 'text-green-600' },
    { id: 'aylik-tahminler', label: 'Aylık Tahminler', icon: TrendingUp, color: 'text-purple-600' },
    { id: 'kategorik-gidisat', label: 'Kategorik Gidişat', icon: BarChart3, color: 'text-orange-600' },
    { id: 'stok-tahmin', label: 'Stok Tahmin', icon: Package, color: 'text-red-600' },
    { id: 'ciro-analizi', label: 'Ciro Analizi', icon: DollarSign, color: 'text-emerald-600' },
    { id: 'cografi-analiz', label: 'Coğrafi Analiz', icon: MapPin, color: 'text-indigo-600' },
    { id: 'urun-yonetimi', label: 'Ürün Yönetimi', icon: Monitor, color: 'text-cyan-600' }
  ];

  const productCategories = [
    { id: 'laptop', label: 'Laptop', icon: Monitor, count: 15 },
    { id: 'telefon', label: 'Telefon', icon: Smartphone, count: 23 },
    { id: 'tablet', label: 'Tablet', icon: Tablet, count: 8 },
    { id: 'aksesuar', label: 'Aksesuar', icon: Package, count: 45 }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Teknoloji Dashboard</h1>
            <p className="text-xs text-gray-500">Satış & Stok Yönetimi</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Ana Menü
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${item.color}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Ürün Kategorileri
            </h3>
            <div className="space-y-2">
              {productCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-3 text-gray-400" />
                      {category.label}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="h-4 w-4 mr-3 text-gray-400" />
            Ayarlar
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 