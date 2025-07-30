import { Brain, Settings, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api";

export function Header() {
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => getCurrentUser(),
  });

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-medea-blue rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Medea Mind</h1>
                <p className="text-sm text-gray-500">Asistente Clínico AI</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || "Cargando..."}</p>
                <p className="text-xs text-gray-500">{user?.specialty || ""}</p>
              </div>
              <div className="w-8 h-8 bg-medea-blue rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
