import { useEffect, useState, useRef, useCallback } from "react";
import { newAxios } from "../../utils/axiosWithUrl";
import styled from "styled-components";

import { Design } from "../../types/DesignType";
import categoryKeys from "../../types/Category";
import DesignCard from "./DesignCard";

const WholeDesignCardContainer = () => {
    const [designList, setDesignList] = useState<Design[]>([]);
    const [filteredDesignList, setFilteredDesignList] = useState<Design[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [isActive, setIsActive] = useState<number>(0);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);

    const fetchData = async (currentPage: number) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const response = await newAxios.get(`/api/v1/model/user/list/popular?page=${currentPage}`);
            const data = response.data.data;

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setDesignList((prev) => [...prev, ...data]);
                setFilteredDesignList((prev) => {
                    const newList = [...prev, ...data];
                    return categoryFilter ? newList.filter((e) => e.category === categoryFilter) : newList;
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    useEffect(() => {
        const filtered = categoryFilter ? designList.filter((e) => e.category === categoryFilter) : designList;
        setFilteredDesignList(filtered);
    }, [categoryFilter, designList]);

    const sortDefault = () => {
        setIsActive(0);
        const sorted = categoryFilter ? designList.filter((e) => e.category === categoryFilter) : [...designList];
        setFilteredDesignList(sorted);
    };

    const sortDesignList = () => {
        setIsActive(1);
        const sorted = [...filteredDesignList].sort((a, b) => +b.downloadCount - +a.downloadCount);
        setFilteredDesignList(sorted);
    };

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoading) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [isLoading, hasMore]
    );

    return (
        <>
            <Container>
                <Title>도면 장터</Title>
                <FilterTextContainer>
                    <FilterText isActive={categoryFilter === ""} onClick={() => setCategoryFilter("")}>
                        전체
                    </FilterText>
                    {Object.entries(categoryKeys).map(([key, value]) => (
                        <FilterText key={key} isActive={categoryFilter === key} onClick={() => setCategoryFilter(key)}>
                            {value}
                        </FilterText>
                    ))}
                    <div style={{ borderLeft: "1px solid #B3B3B3", marginRight: "20px" }} />
                    <FilterText onClick={sortDefault} isActive={isActive === 0}>
                        기본순
                    </FilterText>
                    <FilterText onClick={sortDesignList} isActive={isActive === 1}>
                        판매량순
                    </FilterText>
                </FilterTextContainer>

                <CardContainer>
                    {filteredDesignList.map((e, i) => {
                        const isLast = i === filteredDesignList.length - 1;
                        return (
                            <div key={i} ref={isLast ? lastElementRef : null}>
                                <DesignCard designData={e} />
                            </div>
                        );
                    })}
                </CardContainer>

                {isLoading && <Loading>불러오는 중...</Loading>}
                {!hasMore && <Loading>모든 데이터를 불러왔습니다.</Loading>}
            </Container>
        </>
    );
};

export default WholeDesignCardContainer;

const Container = styled.div`
    margin-top: 50px;
`;
const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 1px solid #707074;
    margin-bottom: 12px;
`;

const FilterTextContainer = styled.div`
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
`;

const FilterText = styled.div<{ isActive: boolean }>`
    font-size: 15px;
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#B3B3B3")};
    margin-right: 20px;
    cursor: pointer;
`;

const CardContainer = styled.div`
    margin: 0px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
`;

const Loading = styled.div`
    text-align: center;
    padding: 20px;
    color: #999;
`;
