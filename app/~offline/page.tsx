"use client";


export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          You are Offline
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          It looks like you've lost your internet connection. Please check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
