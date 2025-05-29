import { useEffect, useState } from "react";
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

    const fetchData = async () => {
        try {
            const response = await newAxios.get("/api/v1/model/user/list/popular");
            let data = response.data.data;
            console.log(data);
            setDesignList(data);
            setFilteredDesignList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const filterDesignList = (filter: string): Design[] => {
        const temp = [...designList];
        if (filter == "") return temp;
        return temp.filter((e) => e.category == filter);
    };

    useEffect(() => {
        setFilteredDesignList(filterDesignList(categoryFilter));
    }, [categoryFilter]);

    const sortDefault = () => {
        setIsActive(0);
        setFilteredDesignList(filterDesignList(categoryFilter));
    };

    const sortDesignList = () => {
        const temp = [...filteredDesignList];
        temp.sort((a, b) => {
            return +b.downloadCount - +a.downloadCount;
        });
        setFilteredDesignList(temp);
        setIsActive(1);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Container>
                <Title>도면 장터</Title>
                <FilterTextContainer>
                    <FilterText isActive={categoryFilter == ""} onClick={() => setCategoryFilter("")}>
                        전체
                    </FilterText>
                    {Object.entries(categoryKeys).map(([key, value]) => (
                        <FilterText isActive={categoryFilter == key} onClick={() => setCategoryFilter(key)}>
                            {value}
                        </FilterText>
                    ))}

                    <div style={{ borderLeft: "1px solid #B3B3B3", marginRight: "20px" }} />
                    <FilterText onClick={() => sortDefault()} isActive={isActive == 0}>
                        기본순
                    </FilterText>
                    <FilterText onClick={() => sortDesignList()} isActive={isActive == 1}>
                        판매량순
                    </FilterText>
                </FilterTextContainer>
                <CardContainer>
                    {filteredDesignList.map((e, i) => {
                        return <DesignCard designData={e} key={i} />;
                    })}
                </CardContainer>
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
`;
