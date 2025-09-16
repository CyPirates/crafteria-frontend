import { useEffect, useState } from "react";
import getStlModelVolume from "../utils/getStlModelVolume";

export const useStlModelVolume = (fileUrl: string) => {
    const [volume, setVolume] = useState<number | undefined>(undefined);

    useEffect(() => {
        const fetchVolume = async () => {
            try {
                const result = await getStlModelVolume(fileUrl);
                setVolume(result);
            } catch (err) {
                console.error("STL 부피 계산 실패:", err);
            }
        };

        if (fileUrl) fetchVolume();
    }, [fileUrl]);

    return volume;
};
