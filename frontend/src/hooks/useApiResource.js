import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/client";

export default function useApiResource(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get(`/${endpoint}/`);
      setItems(data.results ?? data);
    } catch {
      setError("No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function createItem(payload) {
    await apiClient.post(`/${endpoint}/`, payload);
    await reload();
  }

  async function updateItem(id, payload) {
    await apiClient.patch(`/${endpoint}/${id}/`, payload);
    await reload();
  }

  async function deleteItem(id) {
    await apiClient.delete(`/${endpoint}/${id}/`);
    await reload();
  }

  return { items, loading, error, reload, createItem, updateItem, deleteItem };
}
