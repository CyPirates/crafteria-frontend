import { Company, Material } from "../types/CompanyType";

const classifyMaterial = (data: Company) => {
    const initialResult: Record<string, { totalPrice: number; printSpeed: number; materials: Material[] }> = {
        FILAMENT: { totalPrice: 0, printSpeed: 0, materials: [] },
        POWDER: { totalPrice: 0, printSpeed: 0, materials: [] },
        LIQUID: { totalPrice: 0, printSpeed: 0, materials: [] },
    };
    const materials = data.technologies;
    // 데이터를 순회하며 해당 타입의 정보를 저장
    materials.forEach((e) => {
        const type = e.material.toUpperCase();
        const typeToCamelcase = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        const printSpeed = data[`printSpeed${typeToCamelcase}`];
        if (initialResult[type]) {
            initialResult[type].materials.push(e);
            initialResult[type].totalPrice += +e.pricePerHour || 0;
            initialResult[type].printSpeed += printSpeed;
        }
    });

    // 값이 없는 항목 제거
    const filteredResult: Record<string, { totalPrice: number; printSpeed: number; materials: Material[] }> = {};

    Object.entries(initialResult).forEach(([key, value]) => {
        if (value.materials.length > 0) {
            filteredResult[key] = value;
        }
    });

    //console.log("앙");
    return filteredResult;
};

export default classifyMaterial;
