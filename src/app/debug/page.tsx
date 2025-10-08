export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Invoice Management System - Debug Page
        </h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Environment Variables
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="text-green-600">Set</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className="text-green-600">Set</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              API Status
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between">
                <span className="font-medium">/api/health:</span>
                <span className="text-yellow-600">Checking...</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">/api/auth/me:</span>
                <span className="text-yellow-600">Checking...</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">/api/invoices:</span>
                <span className="text-yellow-600">Checking...</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Navigation
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <a
                href="/"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Home
              </a>
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}