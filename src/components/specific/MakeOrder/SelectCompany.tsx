import { useEffect, useState } from "react";
import { newAxios } from "../../../utils/axiosWithUrl";
import { Company } from "../../../types/CompanyType";
import styled from "styled-components";
import CompanyInfoCard from "./CompanyInfoCard";
import useCompanyFilter from "../../../hooks/useCompanyFilter";

type OwnProps = {
    setSelectedCompany: React.Dispatch<React.SetStateAction<Company | undefined>>;
};

const SelectCompany = (props: OwnProps) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [filterText, setFilterText] = useState<string[]>([]);
    const filterTextArray = ["상관없음", "필라멘트", "분말", "액상"];

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

    return (
        <>
            <Step>
                <StepName>제조사 선택</StepName>
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
                    <CompanyInfoCard key={e.id} data={e} setSelectedCompany={props.setSelectedCompany} />
                ))}
            </Step>
        </>
    );
};

export default SelectCompany;

const Step = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid #707074;
`;

const StepName = styled.div`
    margin-bottom: 4px;
    font-size: 20px;
    font-weight: bold;
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