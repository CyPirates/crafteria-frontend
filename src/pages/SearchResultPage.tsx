import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/axiosWithUrl";
import SearchResultCard from "../components/SearchResult/SearchResultCard";

type ModelResult = {
    type: string;
    id: string;
    description: string;
    additionalInfo: string | null;
};

type ManufacturerResult = {
    type: string;
    id: string;
    title: string;
    description: string;
    additionalInfo: string | null;
};

const SearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [filterText, setFilterText] = useState<string[]>([]);
    const filterTextArray = ["전체", "도면", "제조사"];
    const [modelIdArray, setModelIdArray] = useState<string[]>([]);
    const [manufacturerIdArray, setManufacturerIdArray] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setModelIdArray([]);
            setManufacturerIdArray([]);
            try {
                const modelResponse = (await newAxios.get(`/api/v1/search/models/by-name?keyword=${query}`)).data.data;
                const manufacturerResponse = (await newAxios.get(`/api/v1/search/manufacturers/by-name?keyword=${query}`)).data.data;

                modelResponse.map((e: ModelResult) => {
                    setModelIdArray((prev) => [...prev, e.id]);
                });
                manufacturerResponse.map((e: ManufacturerResult) => {
                    setManufacturerIdArray((prev) => [...prev, e.id]);
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [query]);

    const handleCheckboxChange = (text: string) => {
        if (text === "전체") {
            // "상관없음" 선택 시 다른 체크박스 해제 및 filterText를 빈 배열로 설정
            setFilterText([]);
        } else {
            // "상관없음"이 선택된 상태에서 다른 항목 체크 시 "상관없음" 해제
            setFilterText(
                (prev) =>
                    prev.includes(text)
                        ? prev.filter((item) => item !== text) // 이미 선택된 항목이면 해제
                        : [...prev.filter((item) => item !== "전체"), text] // "상관없음" 제거 후 추가
            );
        }
    };

    return (
        <PageWrapper>
            <Title>"{query}" 에 대한 검색 결과</Title>
            {/* <FilterContainer>
                <FilterCategory>검색 필터</FilterCategory>

                {filterTextArray.map((text) => (
                    <FilterLabel key={text}>
                        <input
                            type="checkbox"
                            checked={
                                text === "전체"
                                    ? filterText.length === 0 // "상관없음"은 filterText가 빈 배열일 때 체크
                                    : filterText.includes(text)
                            }
                            onChange={() => handleCheckboxChange(text)}
                        />
                        {text}
                    </FilterLabel>
                ))}
            </FilterContainer> */}
            {modelIdArray.length === 0 && manufacturerIdArray.length === 0 && <div>검색 결과가 없습니다.</div>}
            {modelIdArray.length > 0 && ( //modelIdArray에 요소가 하나라도 있을 경우에만 렌더링
                <>
                    <Category>도면</Category>
                    <CardContainer>
                        {modelIdArray.map((id) => (
                            <SearchResultCard id={id} resultType="model" key={id} /> //key prop 추가
                        ))}
                    </CardContainer>
                </>
            )}
            {manufacturerIdArray.length > 0 && (
                <>
                    <Category>제조사</Category>
                    <CardContainer>
                        {manufacturerIdArray.map((id) => (
                            <SearchResultCard id={id} resultType="manufacturer" key={id} /> //key prop 추가
                        ))}
                    </CardContainer>
                </>
            )}
        </PageWrapper>
    );
};

export default SearchResultPage;

const PageWrapper = styled.div``;

const Title = styled.div`
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 2px solid #707074;
    margin-top: 60px;
    margin-bottom: 10px;
`;

const Category = styled.div`
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
`;
const CardContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
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
