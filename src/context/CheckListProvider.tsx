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

type CheckListType = {
  id: string;
  weekNumber: number;
  content: string;
  checked: boolean;
};

interface CheckListContextProps {
  weekList: number[];
  checkListMap: Map<number, CheckListType[]>;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  currentWeek: number;
  setCurrentWeek: Dispatch<SetStateAction<number>>;
  completeCheckList: (id: string, checked: boolean) => void;
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
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  const completeCheckList = useCallback(
    (id: string, checked: boolean) => {
      setCheckListMap((prevCheckListMap) => {
        const updatedMap = new Map(prevCheckListMap);
        const existingCheckList = updatedMap.get(currentWeek) || [];
        const itemIndex = existingCheckList.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          existingCheckList[itemIndex] = {
            ...existingCheckList[itemIndex],
            checked,
          };
        }

        updatedMap.set(currentWeek, existingCheckList);

        return updatedMap;
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
        id: uuid.v4(),
        checked: false,
      };

      if (newCheckListMap.has(weekNumber)) {
        newCheckListMap.set(weekNumber, [...newCheckListMap.get(weekNumber), checkItem]);
      } else {
        newCheckListMap.set(weekNumber, [checkItem]);

        //weekNumber순으로 저장
        setWeekList((prevWeek) => [...prevWeek, weekNumber]);
      }
    });

    setCheckListMap(newCheckListMap);
  };

  useEffect(() => {
    initCheckListMap();
  }, []);

  return (
    <CheckListContext.Provider
      value={{ isEdit, setIsEdit, checkListMap, weekList, currentWeek, setCurrentWeek, completeCheckList }}
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
