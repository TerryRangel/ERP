
import { createContext, useState, useContext } from 'react';

const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
  const [latestLogs, setLatestLogs] = useState([]);
  return (
    <AuditContext.Provider value={{ latestLogs, setLatestLogs }}>
      {children}
    </AuditContext.Provider>
  );
};
export const useAudit = () => useContext(AuditContext);