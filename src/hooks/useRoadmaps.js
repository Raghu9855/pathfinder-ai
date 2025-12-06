import { useState, useEffect, useCallback, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

export const useRoadmaps = () => {
    const { user } = useContext(AuthContext);
    const [roadmaps, setRoadmaps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/roadmaps`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setRoadmaps(data);
            } catch (error) {
                toast.error("Could not load roadmaps.");
            } finally {
                setIsLoading(false);
            }
        };
        if (user) fetchRoadmaps();
    }, [user]);

    const deleteRoadmap = useCallback(async (roadmapId) => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${API_URL}/api/roadmaps/${roadmapId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRoadmaps(prev => prev.filter(r => r._id !== roadmapId));
            toast.success("Deleted successfully");
            return true;
        } catch (error) {
            toast.error("Failed to delete");
            return false;
        }
    }, []);

    const shareRoadmap = useCallback(async (roadmapId) => {
        const token = localStorage.getItem("token");
        const toastId = toast.loading("Creating link...");
        try {
            const response = await fetch(`${API_URL}/api/roadmap/${roadmapId}/share`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            await navigator.clipboard.writeText(`${window.location.origin}/roadmap/share/${data.shareableId}`);
            toast.success("Link copied!", { id: toastId });
        } catch (error) {
            toast.error("Share failed", { id: toastId });
        }
    }, []);

    const updateProgress = useCallback(async (roadmapId, concept, isCompleted) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/api/roadmaps/${roadmapId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ concept, completed: isCompleted })
            });
            const updated = await response.json();
            setRoadmaps(prev => prev.map(r => r._id === updated._id ? updated : r));
            return updated;
        } catch (e) {
            console.error(e);
            return null;
        }
    }, []);

    return { roadmaps, isLoading, setRoadmaps, deleteRoadmap, shareRoadmap, updateProgress };
};
