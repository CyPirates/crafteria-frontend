import { Material } from "../types/CompanyType";

const classifyMaterial = (data: Material[]) => {
    const initialResult: Record<string, { totalPrice: number; materials: Material[] }> = {
        FILAMENT: { totalPrice: 0, materials: [] },
        POWDER: { totalPrice: 0, materials: [] },
        LIQUID: { totalPrice: 0, materials: [] },
    };

    // 데이터를 순회하며 해당 타입의 정보를 저장
    data.forEach((e) => {
        const type = e.material.toUpperCase();
        if (initialResult[type]) {
            initialResult[type].materials.push(e);
            initialResult[type].totalPrice += +e.pricePerHour || 0;
        }
    });

    // 값이 없는 항목 제거
    const filteredResult: Record<string, { totalPrice: number; materials: Material[] }> = {};

    Object.entries(initialResult).forEach(([key, value]) => {
        if (value.materials.length > 0) {
            filteredResult[key] = value;
        }
    });

    //console.log("앙");
    return filteredResult;
};

export default classifyMaterial;
