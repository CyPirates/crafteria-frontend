import { useEffect, useState, useRef, useCallback } from "react";
import { newAxios } from "../../utils/axiosWithUrl";
import styled from "styled-components";

import { Design } from "../../types/DesignType";
import categoryKeys from "../../types/Category";
import DesignCard from "./DesignCard";
import { Typography } from "../common/Typography";
import { designTabImages } from "../../utils/designTabImages";

const WholeDesignCardContainer = () => {
    const [designList, setDesignList] = useState<Design[]>([]);
    const [filteredDesignList, setFilteredDesignList] = useState<Design[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [isActiveTab, setIsActiveTab] = useState<number>(0);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);

    // 데이터 fetch
    const fetchData = async (currentPage: number) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const response = await newAxios.get(`/api/v1/model/user/list/popular?page=${currentPage}`);
            const data = response.data.data;
            console.log(data);

            if (data.length === 0) setHasMore(false);
            else {
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

    // 무한 스크롤
    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoading) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
            });

            if (node) observerRef.current.observe(node);
        },
        [isLoading, hasMore]
    );

    return (
        <Container>
            <Typography variant="heading.h6">도면장터</Typography>

            <FilterTabContainer>
                {Object.entries(categoryKeys).map(([key, value], i) => {
                    const imgSrc = designTabImages[i];

                    return (
                        <TabBox
                            key={key}
                            bgImage={imgSrc}
                            onClick={() => {
                                setCategoryFilter(key === "ALL" ? "" : key);
                                setIsActiveTab(i);
                            }}
                        >
                            <Test isActive={i === isActiveTab}>
                                <FilterText variant="body.small_b">{value}</FilterText>
                            </Test>
                        </TabBox>
                    );
                })}
                <div style={{ borderLeft: "1px solid #B3B3B3", marginRight: "20px" }} />
            </FilterTabContainer>

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
    );
};

export default WholeDesignCardContainer;

const Container = styled.div`
    padding-top: 32px;
`;

const FilterTabContainer = styled.div`
    margin: 16px 0;
    display: flex;
    gap: 4px;
`;

const TabBox = styled.div<{ bgImage: string }>`
    height: 40px;
    border-radius: 8px;

    background-image: url("${({ bgImage }) => bgImage}");
    background-size: cover;
    background-position: center;

    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const Test = styled.div<{ isActive: boolean }>`
    width: 100%;
    height: 100%;
    padding: 0 20px;
    border-radius: 8px;
    background-color: ${({ isActive }) => (isActive ? "rgba(23, 84, 206, 0.8)" : "rgba(0, 0, 0, 0.7)")};

    display: flex;
    align-items: center;
    justify-content: center;
`;

const FilterText = styled(Typography)`
    color: ${({ theme }) => theme.grayScale[100]};
`;

const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
`;

const Loading = styled.div`
    text-align: center;
    padding: 20px;
    color: #999;
`;
