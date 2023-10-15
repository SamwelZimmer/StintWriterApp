import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userStintsAtom } from '../atoms/userStintsAtom';
import { getFromLocalStorage } from '../lib/helpers';

export const useFetchUserStintsFromLocalStorage = () => {
    const setUserStints = useSetRecoilState(userStintsAtom);

    useEffect(() => {
        let fromStore = getFromLocalStorage("userStints");
        if (fromStore) {
            let parsedData = JSON.parse(fromStore);
            if (parsedData) {
                setUserStints(parsedData);
            }
        }
    }, [setUserStints]);
};
