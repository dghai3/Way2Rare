import React, { useState, useEffect } from "react";
import Title from "../components/Title";

const InAction = () => {
  const [influencerPosts, setInfluencerPosts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gallery`);
        if (!res.ok) throw new Error('Failed to fetch gallery');
        const data = await res.json();
        setInfluencerPosts(data);
      } catch (error) {
        console.error("Error loading gallery:", error);
      }
    };
    fetchGallery();
  }, [API_URL]);

  return (
    <div className="pt-10 border-t">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <Title text1="Way2Rare" text2="In Action" />
        <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
          Share how you rep Way2Rare and we&apos;ll feature you here alongside your handle.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {influencerPosts.map((post) => (
          <article
            key={post.id}
            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 shadow-sm group"
          >
            <img
              src={post.image}
              alt={`Way2Rare fit from ${post.handle}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0">
              <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-white text-sm sm:text-base font-semibold drop-shadow">
                    {post.handle}
                  </p>
                  <span className="text-[10px] uppercase tracking-wide text-white/90 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                    In the wild
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-7">
        <p className="text-gray-900 font-semibold mb-2">Want to be featured?</p>
        <p className="text-gray-600 text-sm sm:text-base">
          Tag @way2rare or DM us your photo and social handle. We&apos;ll add you
          to the wall so the community can spot your look.
        </p>
      </div>
    </div>
  );
};

export default InAction;
