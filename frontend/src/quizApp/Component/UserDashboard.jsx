import React from 'react'
import { Link } from 'react-router-dom';
export const UserDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
    {/* Header */}
    <header className="bg-blue-500 p-4 text-white">
      <h1 className="text-2xl font-semibold">User Dashboard</h1>
    </header>

    {/* Main content */}
    <main className="p-4">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-gray-600">Quiz</p>
          <Link to="/quiz">Attempt Quiz</Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-gray-600">View your order history</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Messages</h2>
          <p className="text-gray-600">Read and send messages</p>
        </div>
      </div>
    </main>
  </div>
  )
}
