import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import CheckListJson from '@/assets/json/checklist_seeds.json';
import uuid from 'react-native-uuid';

export type CheckListType = {
  id: string;
  weekNumber: number;
  content: string;
  checked: boolean;
};

interface CheckListContextProps {
  checkListMap: Map<number, CheckListType[]>;
  currentWeek?: number;
  setCurrentWeek: Dispatch<SetStateAction<number | undefined>>;
  completeCheckList: (id: string, checked: boolean) => void;
  deleteCheckList: (ids: string[]) => void;
  createCheckList: (content: string) => void;
}

const CheckListContext = createContext<CheckListContextProps | undefined>(undefined);

interface CheckListProviderProps {
  children: ReactNode;
}

const CheckListProvider: React.FC<CheckListProviderProps> = ({ children }) => {
  //check list data
  const [checkListMap, setCheckListMap] = useState<Map<number, CheckListType[]>>(new Map());
  const [currentWeek, setCurrentWeek] = useState<number>();

  const createCheckList = useCallback(
    (content: string) => {
      setCheckListMap((prevCheckListMap) => {
        const updatedMap = new Map(prevCheckListMap);
        const existingCheckList = updatedMap.get(currentWeek || 0) || [];
        const newCheckList: CheckListType = {
          id: uuid.v4().toString(),
          weekNumber: currentWeek || 0,
          checked: false,
          content,
        };

        existingCheckList.unshift(newCheckList);

        updatedMap.set(currentWeek || 0, existingCheckList);

        return updatedMap;
      });
    },
    [currentWeek],
  );

  const completeCheckList = useCallback(
    (id: string, checked: boolean) => {
      setCheckListMap((prevCheckListMap) => {
        const updatedMap = new Map(prevCheckListMap);
        const existingCheckList = updatedMap.get(currentWeek || 0) || [];
        const itemIndex = existingCheckList.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          existingCheckList[itemIndex] = {
            ...existingCheckList[itemIndex],
            checked,
          };
        }

        updatedMap.set(currentWeek || 0, existingCheckList);

        return updatedMap;
      });
    },
    [currentWeek, setCheckListMap],
  );

  const deleteCheckList = useCallback(
    (ids: string[]) => {
      setCheckListMap((prevCheckListMap) => {
        const currentWeekCheckList = prevCheckListMap.get(currentWeek || 0) || [];

        // 업데이트된 checkListMap 반환
        return new Map(prevCheckListMap).set(
          currentWeek || 0,
          currentWeekCheckList.filter((item) => !ids.includes(item.id)),
        );
      });
    },
    [currentWeek, setCheckListMap],
  );

  //initial check list set
  const initCheckListMap = () => {
    const newCheckListMap = new Map();

    CheckListJson.forEach((item) => {
      const { weekNumber } = item;
      const checkItem = {
        ...item,
        id: uuid.v4().toString(),
        checked: false,
      };

      if (newCheckListMap.has(weekNumber)) {
        newCheckListMap.set(weekNumber, [...newCheckListMap.get(weekNumber), checkItem]);
      } else {
        newCheckListMap.set(weekNumber, [checkItem]);
      }
    });

    setCheckListMap(newCheckListMap);
  };

  useEffect(() => {
    initCheckListMap();
  }, []);

  return (
    <CheckListContext.Provider
      value={{ checkListMap, currentWeek, setCurrentWeek, completeCheckList, deleteCheckList, createCheckList }}
    >
      {children}
    </CheckListContext.Provider>
  );
};

const useCheckListStore = () => {
  const context = useContext(CheckListContext);

  if (!context) {
    throw new Error('useCheckListStore은 CheckListProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

export { CheckListProvider, useCheckListStore };
