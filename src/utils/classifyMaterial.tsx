import { Material } from "../types/CompanyType";

const classifyMaterial = (data: Material[]) => {
    const result: Record<string, { totalPrice: number; materials: Material[] }> = {
        FILAMENT: { totalPrice: 0, materials: [] },
        POWDER: { totalPrice: 0, materials: [] },
        LIQUID: { totalPrice: 0, materials: [] },
    };

    data.forEach((e) => {
        const type = e.material.toUpperCase();
        if (result[type]) {
            result[type].materials.push(e);
            result[type].totalPrice += +e.pricePerHour || 0;
        }
    });

    return result;
};

export default classifyMaterial;
