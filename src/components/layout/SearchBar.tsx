import React from "react";
import { useState } from "react";
import styled from "styled-components";
import SearchIcon from "../../assets/images/topNavBar/search.svg";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate("/search?query=" + searchQuery);
        setSearchQuery("");
    };

    return (
        <SearchContainer onSubmit={handleSearchSubmit}>
            <SearchButton type="submit">
                <img src={SearchIcon} alt="검색 아이콘" />
            </SearchButton>
            <SearchInput type="text" placeholder="검색어를 입력하세요" value={searchQuery} onChange={handleSearchChange} />
        </SearchContainer>
    );
};

export default SearchBar;

const SearchContainer = styled.div`
    width: 192px;
    height: 40px;
    padding: 0 12px;
    gap: 8px;
    border: 1px solid #ccc;
    border-radius: 20px;

    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    width: 136px;
    height: 20px;
    padding: 0;
    font-size: 13px;
    box-sizing: border-box;
`;

const SearchButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
`;
