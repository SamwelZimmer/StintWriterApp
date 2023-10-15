import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userIdAtom } from '../atoms/userIdAtom'; 
import { userDataAtom } from '../atoms/userDataAtom';
import { getFromLocalStorage } from '../lib/helpers';

export const useFetchUserDataFromLocalStorage = () => {
    const setUserId = useSetRecoilState(userIdAtom);
    const setUserData = useSetRecoilState(userDataAtom);

    useEffect(() => {
        let fromStore = getFromLocalStorage("userData");
        if (fromStore) {
            let parsedData = JSON.parse(fromStore);
            if (parsedData && parsedData.uid) {
                setUserId(parsedData.uid);
                setUserData(parsedData);
            }
        }
    }, [setUserId]);
};
