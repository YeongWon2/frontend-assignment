import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import CheckListJson from '@/assets/json/checklist_seeds.json';

type CheckListType = {
  weekNumber: number;
  content: string;
};

interface CheckListContextProps {
  weekList: number[];
  checkListMap: Map<number, CheckListType[]>;
}

const CheckListContext = createContext<CheckListContextProps | undefined>(undefined);

interface CheckListProviderProps {
  children: ReactNode;
}

const CheckListProvider: React.FC<CheckListProviderProps> = ({ children }) => {
  //week list data
  const [weekList, setWeekList] = useState<number[]>([]);
  //check list data
  const [checkListMap, setCheckListMap] = useState<Map<number, CheckListType[]>>(new Map());

  //initial check list set
  const initCheckListMap = useCallback(() => {
    const newCheckListMap = new Map();

    CheckListJson.forEach((item) => {
      const { weekNumber } = item;

      if (newCheckListMap.has(weekNumber)) {
        newCheckListMap.set(weekNumber, [item, ...newCheckListMap.get(weekNumber)]);
      } else {
        newCheckListMap.set(weekNumber, [item]);

        //weekNumber순으로 저장
        setWeekList((prevWeek) => [...prevWeek, weekNumber]);
      }
    });

    setCheckListMap(newCheckListMap);
  }, []);

  useEffect(() => {
    initCheckListMap();
  }, []);

  return <CheckListContext.Provider value={{ checkListMap, weekList }}>{children}</CheckListContext.Provider>;
};

const useCheckStore = () => {
  const context = useContext(CheckListContext);

  if (!context) {
    throw new Error('useCheckStore은 CheckListProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

export { CheckListProvider, useCheckStore };
