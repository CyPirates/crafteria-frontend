import { useEffect, useState } from "react";
import { newAxios } from "../../../utils/axiosWithUrl";
import { Company } from "../../../types/CompanyType";
import styled from "styled-components";
import CompanyInfoCard from "./CompanyInfoCard";
import useCompanyFilter from "../../../hooks/useCompanyFilter";
import { IoIosSearch } from "react-icons/io";
import { Typography } from "../../common/Typography";

type SearchResult = {
    type: string;
    id: string;
    title: string;
    description: string;
    additionalInfo: string | null;
};

const SelectCompany = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [filterText, setFilterText] = useState<string[]>([]);
    const filterTextArray = ["상관없음", "필라멘트", "액상 레진", "나일론 분말", "금속 분말"];

    const fetchCompanies = async () => {
        try {
            const response = await newAxios.get("/api/v1/manufacturers");
            console.log(response.data.data);
            setCompanies(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        setFilteredCompanies(useCompanyFilter(companies, filterText));
    }, [filterText, companies]);

    const handleCheckboxChange = (text: string) => {
        if (text === "상관없음") {
            // "상관없음" 선택 시 다른 체크박스 해제 및 filterText를 빈 배열로 설정
            setFilterText([]);
        } else {
            // "상관없음"이 선택된 상태에서 다른 항목 체크 시 "상관없음" 해제
            setFilterText(
                (prev) =>
                    prev.includes(text)
                        ? prev.filter((item) => item !== text) // 이미 선택된 항목이면 해제
                        : [...prev.filter((item) => item !== "상관없음"), text] // "상관없음" 제거 후 추가
            );
        }
    };

    const searchCompanies = async (keyword: string) => {
        try {
            const response = await newAxios.get(`/api/v1/search/manufacturers/by-name-description?keyword=${encodeURIComponent(keyword)}`);
            const searchResult: SearchResult[] = response.data.data;

            const searchedCompanies = await Promise.all(
                searchResult.map(async (e) => {
                    try {
                        const companyResponse = await newAxios.get(`/api/v1/manufacturers/${e.id}`);
                        return companyResponse.data.data;
                    } catch (e) {
                        console.log(e);
                        return null;
                    }
                })
            );

            setCompanies(searchedCompanies.filter(Boolean));
        } catch (e) {
            console.log(e);
        }
    };

    const handleSearchSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const searchKeyword = e.currentTarget.value.trim();
            if (!searchKeyword) {
                fetchCompanies();
                return;
            }
            searchCompanies(searchKeyword);
        }
    };

    return (
        <>
            <PageWrapper>
                <div style={{ display: "flex" }}>
                    <Typography variant="heading.h6" color="text.heading">
                        제조사 선택
                    </Typography>
                    <SearchBar onSearchSubmit={handleSearchSubmit} />
                </div>
                <FilterContainer>
                    <FilterCategory>보유 재료</FilterCategory>

                    {filterTextArray.map((text) => (
                        <FilterLabel key={text}>
                            <input
                                type="checkbox"
                                checked={
                                    text === "상관없음"
                                        ? filterText.length === 0 // "상관없음"은 filterText가 빈 배열일 때 체크
                                        : filterText.includes(text)
                                }
                                onChange={() => handleCheckboxChange(text)}
                            />
                            {text}
                        </FilterLabel>
                    ))}
                </FilterContainer>
                {filteredCompanies.map((e) => (
                    <CompanyInfoCard key={e.id} data={e} renderMaterial={true} selectMode={true} />
                ))}
            </PageWrapper>
        </>
    );
};

const SearchBar: React.FC<{
    onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({ onSearchSubmit }) => {
    return (
        <SearchContainer>
            <SearchInput
                onKeyUp={onSearchSubmit} // Enter 키 입력 시 검색 처리
            />
            <IoIosSearch />
        </SearchContainer>
    );
};

export default SelectCompany;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 1280px;
    //padding: 10px;
`;

const FilterCategory = styled.div`
    padding-right: 8px;
    border-right: 1.5px solid black;
`;

const FilterContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
`;

const FilterLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
`;

const SearchContainer = styled.div`
    width: 300px;
    height: 34px;
    margin: 0px 16px;
    padding-left: 10px;
    border-radius: 30px;
    border: 1px solid #919191;

    display: flex;
    justify-content: start;
    align-items: center;
`;

const SearchInput = styled.input`
    width: 240px;
    margin-left: 10px;
    border: none;
    outline: none;
    font-size: 12px;
`;
