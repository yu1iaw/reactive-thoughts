import { createContext, useContext, useMemo, useState } from "react";


type RefetchThoughtsContent = {
    action: {
        created: boolean;
        edited: boolean;
        deleted: boolean;
    } | null,
    handleCreate: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
}

const RefetchThoughtsContext = createContext<RefetchThoughtsContent | null>(null);


export const RefetchThoughtsContextProvider = ({ children }: {children: React.ReactNode}) => {
    const [action, setAction] = useState<RefetchThoughtsContent["action"]>(null);

    const handleCreate = () => {
        setAction({ created: true, edited: false, deleted: false });
    }

    const handleEdit = () => {
        setAction({ created: false, edited: true, deleted: false });
    }

    const handleDelete = () => {
        setAction({ created: false, edited: false, deleted: true });
    }
    
    const value = useMemo(() => ({
        action,
        handleCreate,
        handleEdit,
        handleDelete
    }), [action])
    
    return (
        <RefetchThoughtsContext.Provider value={value}>
            {children}
        </RefetchThoughtsContext.Provider>
    );
}

export const useRefetchThoughts = () => {
    const value = useContext(RefetchThoughtsContext);

    if (!value) {
        throw new Error(`useRefetchThoughts must be wrapped inside RefetchThoughtsContextProvider`);
    }

    return value;
}