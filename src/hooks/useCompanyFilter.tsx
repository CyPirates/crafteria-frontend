import { Company } from "../types/CompanyType";
import convertMaterialName from "../utils/convertMaterialName";

const useCompanyFilter = (companies: Company[], filter: string[]): Company[] => {
    if (filter.length === 0) return companies;

    const convertFilterTextToEng = (filters: string[]): string[] => {
        return filters.map((e) => convertMaterialName(e)).filter(Boolean); // 빈 문자열 제거
    };

    const convertedFilter = convertFilterTextToEng(filter);

    return companies.filter((company) => convertedFilter.every((filterMaterial) => company.technologies.some((tech) => tech.material === filterMaterial)));
};

export default useCompanyFilter;
