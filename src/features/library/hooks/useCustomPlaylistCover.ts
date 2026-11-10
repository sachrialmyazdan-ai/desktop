import { useCallback, useEffect, useState } from "react";

export interface CustomPlaylistCover {
  dataUrl: string;
  x: number;
  y: number;
}

const DB_NAME = "liner-custom-playlist-covers";
const STORE_NAME = "covers";
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/gif"]);

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readCover(id: string): Promise<CustomPlaylistCover | null> {
  const db = await openDatabase();
  return new Promise<CustomPlaylistCover | null>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve((request.result as CustomPlaylistCover | undefined) ?? null);
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

async function writeCover(id: string, cover: CustomPlaylistCover | null) {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    if (cover) store.put(cover, id);
    else store.delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  }).finally(() => db.close());
}

export function useCustomPlaylistCover(playlistId: string | null) {
  const [cover, setCover] = useState<CustomPlaylistCover | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setCover(null);
    setError("");
    if (!playlistId || typeof indexedDB === "undefined") return;
    void readCover(playlistId).then((value) => {
      if (active) setCover(value);
    }).catch(() => {
      if (active) setError("Could not load the saved custom cover.");
    });
    return () => { active = false; };
  }, [playlistId]);

  const chooseFile = useCallback(async (file: File) => {
    if (!playlistId) return;
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Choose a JPG, PNG, or GIF image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("The image must be 8 MB or smaller.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const next = { dataUrl, x: 50, y: 50 };
    await writeCover(playlistId, next);
    setCover(next);
    setError("");
  }, [playlistId]);

  const setPosition = useCallback(async (x: number, y: number) => {
    if (!playlistId || !cover) return;
    const next = { ...cover, x, y };
    setCover(next);
    await writeCover(playlistId, next);
  }, [playlistId, cover]);

  const remove = useCallback(async () => {
    if (!playlistId) return;
    await writeCover(playlistId, null);
    setCover(null);
    setError("");
  }, [playlistId]);

  return { cover, error, chooseFile, setPosition, remove };
}
