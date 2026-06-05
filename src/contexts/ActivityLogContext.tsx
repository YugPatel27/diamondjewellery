import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { activityAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  userName?: string;
  userPhone?: string;
  ip?: string;
  entityType?: string;
  entityId?: string;
}

interface ActivityLogContextType {
  logs: ActivityEntry[];
  addLog: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
  fetchLogs: () => Promise<void>;
  loading: boolean;
}

const ActivityLogContext = createContext<ActivityLogContextType | null>(null);

export const useActivityLog = () => {
  const ctx = useContext(ActivityLogContext);
  if (!ctx) throw new Error("useActivityLog must be within ActivityLogProvider");
  return ctx;
};

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const mapLogEntry = (log: any): ActivityEntry => ({
    id: log._id,
    timestamp: log.createdAt,
    action: log.action,
    description: log.description || '',
    userName: log.userId?.name || log.userName || log.phoneNumber || 'Guest',
    userPhone: log.userId?.phone || log.phoneNumber,
    ip: log.ipAddress || log.ip || undefined,
    entityType: log.entityType || undefined,
    entityId: log.entityId?.toString?.() || undefined,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        setLogs([]);
        return;
      }

      const response = isAdmin ? await activityAPI.getAllLogs() : await activityAPI.getLogs();
      if (response.success) {
        setLogs(
          response.logs.map(mapLogEntry)
        );
      }
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (user) {
      fetchLogs();
    } else {
      setLogs([]);
    }
  }, [fetchLogs, user]);

  const addLog = useCallback(async (entry: Omit<ActivityEntry, "id" | "timestamp">) => {
    const newLog: ActivityEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev]);

    try {
      await activityAPI.createLog({
        action: entry.action,
        description: entry.description,
        entityType: entry.entityType,
        entityId: entry.entityId,
      });
    } catch (error) {
      console.error('Failed to persist activity log:', error);
    }
  }, []);

  return (
    <ActivityLogContext.Provider value={{ logs, addLog, fetchLogs, loading }}>
      {children}
    </ActivityLogContext.Provider>
  );
};
