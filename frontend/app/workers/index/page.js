"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layouts/Layout';


export default function WorkersList() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch('/api/workers');
        const data = await res.json();
        setWorkers(data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  return (
    <Layout title="Find Workers">
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Skilled Workers</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse through our network of professionals
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : workers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {workers.map((worker) => (
                <div 
                  key={worker.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/workers/${worker.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {worker.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{worker.name}</h3>
                        <p className="text-sm text-gray-500">{worker.title}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600 text-sm">{worker.bio?.substring(0, 100)}...</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {worker.skills?.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No workers found</h3>
              <p className="mt-2 text-gray-600">Try again later</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
