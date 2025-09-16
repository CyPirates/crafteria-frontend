import * as React from "react";
import getStlModelSize from "../../../utils/getStlModelSize";
import { useState, useCallback } from "react";
import styled from "styled-components";
import SelectDesignPopUp from "./SelectDesignPopUp";
import { Material } from "../../../types/CompanyType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { PrintOrderData } from "../../../types/OrderType";
import getStlModelVolume from "../../../utils/getStlModelVolume";
import convertHoursToDHM from "../../../utils/convertHoursToDHM";
import convertMaterialName from "../../../utils/convertMaterialName";
import DeleteIcon from "../../../assets/images/icons/deleteBg.png";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";

type Column = {
    id: "fileUrl" | "magnification" | "quantity" | "materialType" | "color" | "delete" | "time" | "price";
    label: string;
    width: number | string;
};

type OwnProps = {
    orderRows: PrintOrderData[];
    setOrderRows: React.Dispatch<React.SetStateAction<PrintOrderData[]>>;
    materials: Record<
        string,
        {
            totalPrice: number;
            printSpeed: number;
            materials: Material[];
        }
    >;
};

const calculateAndRoundPrintTime = (magnification: number, volume: number | undefined, printSpeed: number | undefined): number | string => {
    if (volume === undefined || volume === null || isNaN(volume) || printSpeed === undefined || printSpeed === null || isNaN(printSpeed) || printSpeed === 0) {
        return "계산 불가";
    }
    const calculatedTime = (magnification * volume) / 10000 / printSpeed; // hour 단위
    if (isNaN(calculatedTime)) {
        return "계산 불가";
    }
    // 10의 자리에서 반올림
    return Math.round(calculatedTime * 10) / 10;
};

const calculatePrice = (materialPrice: number | undefined, volume: number | undefined, magnification: number, quantity: number): number | string => {
    if (materialPrice && volume) {
        const calculatedPrice = ((volume * magnification) / 10000) * materialPrice * quantity;
        return Math.round(calculatedPrice);
    }
    return 0;
};

const SelectedFileDataGrid = ({ orderRows, setOrderRows, materials }: OwnProps) => {
    const defaultMaterialType = Object.keys(materials)[0] || "";
    const defaultMaterialInfo = materials[defaultMaterialType]?.materials[0];
    const defaultColor = defaultMaterialInfo?.colorValue || "";
    const defaultId = defaultMaterialInfo?.technologyId || "";
    const defaultMaterialPrice = defaultMaterialInfo?.pricePerHour;
    const defaultPrintSpeed = materials[defaultMaterialType]?.printSpeed;

    const [isPop, setIsPop] = useState<boolean>(false);

    const handleFileUpload = async (event?: React.ChangeEvent<HTMLInputElement>, url?: string) => {
        let fileUrl = "";
        if (event) {
            const file = event.target.files?.[0];
            if (file) {
                if (!file.name.toLowerCase().endsWith(".stl")) {
                    alert("stl 파일만 업로드 가능합니다.");
                    event.target.value = "";
                    return;
                }
                fileUrl = URL.createObjectURL(file);
            }
        }
        if (url) {
            fileUrl = url;
        }

        try {
            const modelSize = await getStlModelSize(fileUrl);
            const modelVolume = await getStlModelVolume(fileUrl);

            const newRow: PrintOrderData = {
                fileUrl: fileUrl,
                widthSize: modelSize.width.toString(),
                lengthSize: modelSize.length.toString(),
                heightSize: modelSize.height.toString(),
                magnification: 1,
                quantity: 1,
                materialType: defaultMaterialType,
                materialPrice: +defaultMaterialPrice,
                color: defaultColor,
                technologyId: defaultId,
                volume: modelVolume,
                price: undefined, // 계산 불가 시 undefined 저장
            };
            console.log("ㅁㄴㅇㄹ");
            console.log(newRow);
            setOrderRows((prev) => [...prev, newRow]);
        } catch (e) {
            console.error("파일 처리 중 오류:", e);
            alert("파일 처리 중 오류가 발생했습니다.");
        } finally {
            if (event) {
                event!.target.value = "";
            }
        }
    };

    return (
        <Container>
            <ButtonContainer>
                <SelectFileButton onClick={() => setIsPop(true)}>구매한 도면에서 선택</SelectFileButton>
                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                    <SelectFileButton>파일 직접 업로드</SelectFileButton>
                </label>
                <input type="file" accept=".stl" id="file-upload" style={{ display: "none" }} onChange={handleFileUpload} />
            </ButtonContainer>
            {isPop ? <SelectDesignPopUp handleOnClick={setIsPop} handleFileUpload={handleFileUpload} /> : null}
            {orderRows.map((row, i) => (
                <DesignRow key={i} row={row} materials={materials} setOrderRows={setOrderRows} index={i} />
            ))}
        </Container>
    );
};

type DesignRowProps = Omit<OwnProps, "orderRows"> & {
    index: number;
    row: PrintOrderData;
};

const DesignRow = ({ row, materials, setOrderRows, index }: DesignRowProps) => {
    const time = calculateAndRoundPrintTime(row.magnification, row.volume, materials[row.materialType]?.printSpeed);

    const Columns: Column[] = [
        { id: "fileUrl", label: "도면", width: "150px" },
        { id: "magnification", label: "배율", width: "90.25px" },
        { id: "quantity", label: "수량", width: "90.25px" },
        { id: "materialType", label: "재료타입", width: "138px" },
        { id: "color", label: "색상", width: "155px" },
        //{ id: "time", label: "예상 출력 시간", width: "90.25px" },
        { id: "price", label: "가격(원)", width: "90.25px" },
        { id: "delete", label: "", width: "36px" },
    ];

    const handleChange = (field: string, value: any) => {
        setOrderRows((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;

                let updatedItem = { ...item, [field]: value };

                if (field === "materialType") {
                    const newMaterialTypeDefault = materials[value]?.materials[0];
                    updatedItem.color = newMaterialTypeDefault.colorValue;
                    updatedItem.technologyId = newMaterialTypeDefault.technologyId;
                    updatedItem.materialPrice = +newMaterialTypeDefault.pricePerHour;
                } else if (field === "color") {
                    const selectedMaterial = materials[item.materialType]?.materials.find((m) => m.colorValue === value);
                    if (selectedMaterial) {
                        updatedItem.technologyId = selectedMaterial.technologyId;
                        updatedItem.materialPrice = selectedMaterial.pricePerHour ? +selectedMaterial.pricePerHour : undefined;
                    }
                }

                // 시간과 가격 재계산
                const printSpeed = materials[updatedItem.materialType]?.printSpeed;
                updatedItem.time = calculateAndRoundPrintTime(updatedItem.magnification, updatedItem.volume, printSpeed) as number;
                updatedItem.price = +calculatePrice(updatedItem.materialPrice, updatedItem.volume, updatedItem.magnification, updatedItem.quantity);

                return updatedItem;
            })
        );
    };

    const handleDelete = () => {
        setOrderRows((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <TableWrapper>
            <colgroup>
                {Columns.map((col, i) => (
                    <col key={i} width={col.width} />
                ))}
            </colgroup>
            <TableHead>
                {Columns.map((col, i) => (
                    <Th key={i}>{col.label}</Th>
                ))}
            </TableHead>
            <tbody>
                <Tr>
                    <Td>
                        <CellContent>{row.fileUrl && <StlRenderContainer filePath={row.fileUrl} width="120px" height="96px" clickDisabled />}</CellContent>
                    </Td>
                    <Td>
                        <StyledInput type="number" value={row.magnification} onChange={(e) => handleChange("magnification", +e.target.value)} />배
                    </Td>
                    <Td>
                        <StyledInput type="number" value={row.quantity} onChange={(e) => handleChange("quantity", +e.target.value)} />개
                    </Td>
                    <Td>
                        <StyledSelect value={row.materialType} onChange={(e) => handleChange("materialType", e.target.value)} sx={{ ".MuiOutlinedInput-notchedOutline": { border: "0" } }}>
                            {Object.keys(materials).map((mt) => (
                                <MenuItem key={mt} value={mt}>
                                    {convertMaterialName(mt)}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    </Td>
                    <Td>
                        <StyledSelect value={row.color} onChange={(e) => handleChange("color", e.target.value)} sx={{ ".MuiOutlinedInput-notchedOutline": { border: "0" } }}>
                            {materials[row.materialType].materials.map((m) => (
                                <MenuItem key={m.colorValue} value={m.colorValue}>
                                    <ColorBox color={m.colorValue} /> {m.colorValue}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    </Td>
                    {/* <Td>{convertHoursToDHM(+time)}</Td> */}
                    <Td>{row.price ?? "-"}</Td>
                    <Td>
                        <div onClick={handleDelete}>
                            <img src={DeleteIcon} alt="x" />
                        </div>
                    </Td>
                </Tr>
            </tbody>
        </TableWrapper>
    );
};

// Styled-components 정의 (기존 코드 유지)
const Container = styled.div`
    width: 960px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 8px;
    margin: 16px 0;
`;

const SelectFileButton = styled.div`
    width: 416px;
    height: 40px;
    background-color: ${({ theme }) => theme.grayScale[600]};
    color: ${({ theme }) => theme.grayScale[0]};
    font-weight: ${({ theme }) => theme.typography.body.small_m.fontWeight};
    font-size: ${({ theme }) => theme.typography.body.small_m.fontSize};
    line-height: ${({ theme }) => theme.typography.body.small_m.lineHeight};
    border-radius: 8px;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: ${({ theme }) => theme.primaryColor.blue1};
    }
`;

const TableWrapper = styled.table`
    width: 804px;
    height: 160px;
    margin-bottom: 16px;
`;

const TableHead = styled.thead`
    background-color: ${({ theme }) => theme.grayScale[100]};

    th {
        &:last-child {
            display: none;
        }
    }
`;

const Th = styled.th`
    height: 40px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    text-align: center;

    color: ${({ theme }) => theme.text.body};
    font-size: ${({ theme }) => theme.typography.body.small_b.fontSize};
    font-weight: ${({ theme }) => theme.typography.body.small_b.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.small_b.lineHeight};
`;

const Tr = styled.tr`
    td {
        &:last-child {
            border: none;
        }
    }
`;
const Td = styled.td`
    height: 120px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    text-align: center;
`;
const CellContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const StyledInput = styled.input`
    width: 46.25px;
    height: 32px;
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;
    text-align: center;
    outline: none;
`;

const StyledSelect = styled(Select)`
    & .MuiSelect-select {
        color: ${({ theme }) => theme.text.placeholder};
        font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
        font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
        line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};
        padding-left: 12px;

        display: flex;
        align-items: center;
        border: none;
    }
    min-width: 114px;
    height: 32px;
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;

    outline: none;
`;

const ColorBox = styled.div`
    width: 16px;
    height: 16px;
    background-color: ${(props) => props.color};
    border: 1px solid #919191;
    border-radius: 50%;
    margin-right: 4px;
`;

export default SelectedFileDataGrid;
