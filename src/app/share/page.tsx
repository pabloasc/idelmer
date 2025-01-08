"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const GameScores = ({ gameData }: { gameData: { score: number, attempts: number, timeTaken: number } }) => (
  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
    <div id="shareable-image" className="bg-white p-4 font-forum text-center rounded-lg border-4 border-gray-300">
      <img src="/logo.png" alt="Idelmer Logo" className="mx-auto mb-2 h-12 w-auto" />
      <h1 className="text-xl font-bold mb-4">Game Results</h1>
      <p className="text-lg">Score: {gameData.score}</p>
      <p className="text-lg">Attempts: {gameData.attempts}</p>
      <p className="text-lg">Time Taken: {gameData.timeTaken} seconds</p>
      <div className="mt-4 text-sm text-gray-500">idelmer.com</div>
    </div>
  </div>
);

const SharePage = () => {
  const [gameData, setGameData] = useState<{ score: number, attempts: number, timeTaken: number } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(null); // Clear previous image URL on mount
    const storedGameData = localStorage.getItem('gameData');
    if (storedGameData) {
      const parsedData = JSON.parse(storedGameData);
      setGameData(parsedData);
    }
  }, []);

  useEffect(() => {
    if (gameData) {
      const node = document.getElementById('shareable-image');
      if (node) {
        toJpeg(node)
          .then((dataUrl) => {
            uploadImage(dataUrl);
          })
          .catch((error) => {
            console.error('Error generating image:', error);
          });
      }
    }
  }, [gameData]);

  const getUserId = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
    return user?.id;
  };

  const uploadImage = async (dataUrl: string) => {
    const userId = await getUserId();
    if (!userId) {
      console.error('User ID not available. Cannot upload image.');
      return;
    }
    const blob = await (await fetch(dataUrl)).blob();
    const { data, error } = await supabase.storage
      .from('share-images')
      .upload(`${userId}.jpeg`, blob, { upsert: true });

    if (error) {
      console.error('Error uploading image:', error.message);
    } else {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/share-images/${data.path}?t=${new Date().getTime()}`;
      setImageUrl(publicUrl);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      {imageUrl ? (
        <>
          <img src={imageUrl} alt="Shareable Game Results" className="max-w-xs mb-4" />
          <div className="flex justify-center space-x-4">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`} target="_blank" className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
            </a>
            <a href={`https://www.instagram.com/`} target="_blank" className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.585-.07 4.851c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.851.07s-3.585-.012-4.851-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.585 2.163 15.205 2.163 12s.012-3.585.07-4.851c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.415 2.175 8.795 2.163 12 2.163m0-2.163C8.741 0 8.332.015 7.052.072 5.771.129 4.533.396 3.515 1.414 2.497 2.431 2.23 3.67 2.173 4.948.015 8.332 0 8.741 0 12s.015 3.668.072 4.948c.057 1.278.324 2.517 1.342 3.535 1.017 1.017 2.256 1.284 3.535 1.341C8.332 23.985 8.741 24 12 24s3.668-.015 4.948-.072c1.278-.057 2.517-.324 3.535-1.342 1.017-1.017 1.284-2.256 1.341-3.535C23.985 15.668 24 15.259 24 12s-.015-3.668-.072-4.948c-.057-1.278-.324-2.517-1.342-3.535-1.017-1.017-2.256-1.284-3.535-1.341C15.668.015 15.259 0 12 0z" /><path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zM18.406 4.594a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg>
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}`} target="_blank" className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.633 7.997c.013.18.013.36.013.54 0 5.486-4.176 11.81-11.81 11.81-2.345 0-4.523-.684-6.35-1.864.33.038.644.051.987.051 1.944 0 3.732-.66 5.15-1.764-1.818-.038-3.354-1.23-3.882-2.872.253.038.506.064.772.064.372 0 .746-.051 1.094-.139-1.894-.38-3.322-2.054-3.322-4.066v-.051c.556.31 1.18.497 1.852.523-1.1-.735-1.818-1.99-1.818-3.41 0-.746.198-1.442.556-2.042 2.03 2.5 5.067 4.145 8.48 4.32-.064-.31-.102-.635-.102-.96 0-2.347 1.9-4.248 4.248-4.248 1.224 0 2.33.51 3.104 1.33.97-.198 1.852-.548 2.66-1.03-.31.97-.97 1.764-1.83 2.272.87-.102 1.7-.335 2.474-.67-.58.86-1.3 1.612-2.14 2.22z" /></svg>
            </a>
            <a href={`https://api.whatsapp.com/send?text=Check%20out%20my%20game%20results!%20${encodeURIComponent(imageUrl)}`} target="_blank" className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.76-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.297.298-.496.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.208-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.793.372-.273.297-1.04 1.016-1.04 2.48 0 1.463 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.073 4.487.709.306 1.262.489 1.693.625.711.226 1.357.194 1.868.118.57-.085 1.758-.719 2.007-1.413.248-.694.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347m-5.421 7.618h-.002C6.403 22 2 17.598 2 12.001 2 6.403 6.403 2 11.999 2 17.598 2 22 6.403 22 12c0 1.939-.504 3.838-1.463 5.501l-.976 1.636-1.732-.453c-.947-.248-1.79-.579-2.512-.988l-.342-.195-1.672.443z" /></svg>
            </a>
          </div>
        </>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          {gameData && <GameScores gameData={gameData} />}
        </Suspense>
      )}
    </div>
  );
};

export default SharePage;
