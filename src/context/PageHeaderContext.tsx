import { createContext, useContext, useState, type ReactNode } from 'react';

interface PageHeaderState {
  title: string;
  onBack?: () => void;
  extra?: ReactNode;
}

interface PageHeaderContextType {
  header: PageHeaderState;
  setHeader: (state: PageHeaderState) => void;
  resetHeader: () => void;
}

const defaultHeader: PageHeaderState = { title: 'Product Management' };

const PageHeaderContext = createContext<PageHeaderContextType>({
  header: defaultHeader,
  setHeader: () => {},
  resetHeader: () => {},
});

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeaderState] = useState<PageHeaderState>(defaultHeader);

  function setHeader(state: PageHeaderState) {
    setHeaderState(state);
  }

  function resetHeader() {
    setHeaderState(defaultHeader);
  }

  return (
    <PageHeaderContext.Provider value={{ header, setHeader, resetHeader }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  return useContext(PageHeaderContext);
}
