import React from "react";
import { useState } from "react";
import styled from "styled-components";
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
            <SearchInput type="text" placeholder="검색어를 입력하세요" value={searchQuery} onChange={handleSearchChange} />
            <SearchButton type="submit">
                <AiOutlineSearch size={16} />
            </SearchButton>
        </SearchContainer>
    );
};

export default SearchBar;

const SearchContainer = styled.form`
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 5px;
    width: 340px;
    height: 32px;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    flex-grow: 1;
    padding: 5px;
    height: 24px;
    font-size: 16px;
`;

const SearchButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
`;
