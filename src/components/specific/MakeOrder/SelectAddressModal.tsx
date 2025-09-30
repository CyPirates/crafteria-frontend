import { useEffect, useState } from "react";
import { newAxios } from "../../../utils/axiosWithUrl";
import { Address } from "../../../types/UserType";
import styled from "styled-components";
import AddressSearchModal from "../../common/AddressSearchModal";
import { IoLocationSharp as LocationIcon } from "react-icons/io5";
import { Typography } from "../../common/Typography";

type OwnProps = {
    setZipcode: React.Dispatch<React.SetStateAction<string>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    handleIsOpen: () => void;
};

const SelectAddressModal = ({ setZipcode, setAddress, handleIsOpen }: OwnProps) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const filterText = ["내 주소에서 선택", "직접 입력"];
    const [filterIndex, setFilterIndex] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const fetchAddress = async () => {
            try {
                const response = await newAxios.get("/api/v1/users/me/addresses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const addressArray = response.data.data;
                console.log(addressArray);
                addressArray.length > 0 ? setAddresses(addressArray) : setFilterIndex(1);
            } catch (e) {
                console.log(e);
            }
        };
        fetchAddress();
    }, []);
    return (
        <>
            <ModalOverlay>
                <ModalContainer>
                    <FilterContainer>
                        {filterText.map((filter, i) => {
                            return (
                                <Filter key={i} isActive={filterIndex === i} onClick={() => setFilterIndex(i)}>
                                    {filter}
                                </Filter>
                            );
                        })}
                    </FilterContainer>
                    <ContentsContainer>
                        {filterIndex === 0 && addresses.length === 0 ? (
                            "등록된 주소가 없습니다."
                        ) : (
                            <MyAddressContainer>
                                {addresses.map((address) => (
                                    <AddressCard address={address} setZipcode={setZipcode} setAddress={setAddress} handleIsOpen={handleIsOpen} />
                                ))}
                            </MyAddressContainer>
                        )}
                        {filterIndex === 1 && <AddressSearchModal setZipcode={setZipcode} setAddress={setAddress} handleIsOpen={handleIsOpen} omitBackground />}
                    </ContentsContainer>
                </ModalContainer>
            </ModalOverlay>
        </>
    );
};

type AddressCardProps = {
    address: Address;
    setZipcode: React.Dispatch<React.SetStateAction<string>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    handleIsOpen: () => void;
};

const AddressCard = ({ address, setZipcode, setAddress, handleIsOpen }: AddressCardProps) => {
    const handleSelect = () => {
        setZipcode(address.postalCode);
        setAddress(address.baseAddress);
        handleIsOpen();
    };
    return (
        <AddressContainer>
            <div style={{ display: "flex" }}>
                <Typography variant="heading.h6">
                    <LocationIcon style={{ marginRight: "4px" }} />
                    {address.label}
                </Typography>
                {address.default && (
                    <GrayRoundContainer>
                        <Typography variant="body.xs_m" color="grayScale.400">
                            기본
                        </Typography>
                    </GrayRoundContainer>
                )}
            </div>
            <Typography variant="body.medium_m">{address.postalCode}</Typography>
            <Typography variant="body.medium_m">{address.baseAddress}</Typography>
            <Typography variant="body.medium_m">{address.detailAddress}</Typography>
            <SelectButton onClick={handleSelect}>
                <Typography variant="body.medium_r" color="grayScale.0">
                    선택
                </Typography>
            </SelectButton>
        </AddressContainer>
    );
};

export default SelectAddressModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure the modal is on top of other content */
`;

const ModalContainer = styled.div`
    width: 600px;
    height: 600px;
    background-color: white;
    border-radius: 8px;
`;

const FilterContainer = styled.div`
    width: 600px;
    height: 60px;
    border-bottom: 1px solid #707074;
    margin-bottom: 12px;

    gap: 8px;
    display: flex;
    justify-content: space-evenly;
`;

const Filter = styled.div<{ isActive: boolean }>`
    height: 100%;
    text-align: center;
    color: ${({ isActive, theme }) => (isActive ? theme.grayScale[600] : theme.grayScale[500])};
    font-weight: ${({ isActive }) => (isActive ? "bold" : 300)};
    border-bottom: ${({ isActive }) => (isActive ? "2px solid #111111" : "none")};
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;

    &:hover {
        font-weight: bold;
    }
`;

const ContentsContainer = styled.div`
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MyAddressContainer = styled.div`
    flex: 1;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const AddressContainer = styled.div`
    width: 566px;
    height: 152px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    position: relative;
`;

const GrayRoundContainer = styled.div`
    width: 76px;
    height: 24px;
    margin-left: 12px;
    background-color: ${({ theme }) => theme.grayScale[100]};
    border-radius: 30px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
    }
`;

const SelectButton = styled.div`
    width: 48px;
    height: 24px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: ${({ theme }) => theme.grayScale[600]};
    border-radius: 8px;

    &:hover {
        background-color: ${({ theme }) => theme.text.disabled};
    }
`;
