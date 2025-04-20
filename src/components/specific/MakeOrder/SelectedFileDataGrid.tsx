// c:\Users\user\Desktop\새 폴더 (2)\crafteria-frontend\src\components\specific\MakeOrder\SelectedFileDataGrid.tsx
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import getStlModelSize from "../../../utils/getStlModelSize";
import { useState, useCallback } from "react";
import styled from "styled-components";
import SelectDesignPopUp from "./SelectDesignPopUp";
import { Material } from "../../../types/CompanyType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { PrintOrderData } from "../../../types/OrderType";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import getStlModelVolume from "../../../utils/getStlModelVolume";

type Column = {
    id: "fileUrl" | "magnification" | "quantity" | "materialType" | "color" | "delete" | "time" | "price";
    label: string;
    width?: number | string;
    flex?: any;
    align?: "left" | "right" | "center";
};

const columns: Column[] = [
    { id: "fileUrl", label: "도면", width: 120 },
    { id: "magnification", label: "배율", width: 120 },
    { id: "quantity", label: "수량", width: 120 },
    { id: "materialType", label: "재료타입", width: 140 },
    { id: "color", label: "색상", width: 100 },
    { id: "time", label: "예상 출력 시간(시간)", width: 160 },
    { id: "price", label: "가격(원)", width: 120 },
    { id: "delete", label: "", align: "right" },
];

type OwnProps = {
    orderRows: PrintOrderData[];
    setOrderRows: React.Dispatch<React.SetStateAction<PrintOrderData[]>>;
    materials: Record<
        string,
        {
            totalPrice: number; // 이 totalPrice는 material 그룹의 평균 가격 등으로 사용될 수 있으나, 개별 행 가격 계산에는 사용되지 않음
            printSpeed: number;
            materials: Material[];
        }
    >;
};

// 계산 함수 (컴포넌트 외부 또는 useCallback으로 메모이제이션)
const calculateAndRoundPrintTime = (magnification: number, volume: number | undefined, printSpeed: number | undefined): number | string => {
    if (volume === undefined || volume === null || isNaN(volume) || printSpeed === undefined || printSpeed === null || isNaN(printSpeed) || printSpeed === 0) {
        return "계산 불가";
    }
    const calculatedTime = (magnification * volume) / printSpeed; // 분 단위로 가정
    if (isNaN(calculatedTime)) {
        return "계산 불가";
    }
    // 10의 자리에서 반올림 (분 단위)
    return Math.round(calculatedTime / 10) * 10;
};

const calculatePrice = (
    materialPrice: number | undefined,
    time: number | string | undefined, // 분 단위 시간
    quantity: number
): number | string => {
    if (materialPrice && time) {
        const calculatedPrice = quantity * materialPrice * +time;
        return Math.round(calculatedPrice);
    }

    return 0;
};

const SelectedFileDataGrid = ({ orderRows, setOrderRows, materials }: OwnProps) => {
    // 기본값 설정 로직 개선
    const defaultMaterialType = Object.keys(materials)[0] || "";
    const defaultMaterialInfo = materials[defaultMaterialType]?.materials[0];
    const defaultColor = defaultMaterialInfo?.colorValue || "";
    const defaultId = defaultMaterialInfo?.technologyId || "";
    const defaultMaterialPrice = defaultMaterialInfo?.pricePerHour;
    const defaultPrintSpeed = materials[defaultMaterialType]?.printSpeed;
    console.log("십" + defaultMaterialPrice + "ㅁㄴㅇㄹ" + defaultPrintSpeed);

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

            // 초기 time 및 price 계산
            const initialTime = calculateAndRoundPrintTime(1, modelVolume, defaultPrintSpeed);
            const initialPrice = calculatePrice(defaultMaterialPrice ? +defaultMaterialPrice : undefined, initialTime, 1);

            const newRow: PrintOrderData = {
                fileUrl: fileUrl,
                widthSize: modelSize.width.toString(),
                lengthSize: modelSize.length.toString(),
                heightSize: modelSize.height.toString(),
                magnification: 1,
                quantity: 1,
                materialType: defaultMaterialType,
                color: defaultColor,
                technologyId: defaultId,
                volume: modelVolume,
                materialPrice: defaultMaterialPrice ? +defaultMaterialPrice : undefined,
                time: typeof initialTime === "number" ? initialTime : undefined, // 계산 불가 시 undefined 저장
                price: typeof initialPrice === "number" ? initialPrice : undefined, // 계산 불가 시 undefined 저장
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

    // useCallback으로 handleChange 메모이제이션
    const handleChange = useCallback(
        (index: number, field: string, value: any) => {
            setOrderRows((prev) =>
                prev.map((item, i) => {
                    if (i === index) {
                        let updatedItem = { ...item, [field]: value };

                        // 관련된 값 업데이트 (materialType, color 변경 시)
                        if (field === "materialType") {
                            const newMaterialInfo = materials[value]?.materials[0];
                            updatedItem.color = newMaterialInfo?.colorValue || "";
                            updatedItem.technologyId = newMaterialInfo?.technologyId || "";
                            updatedItem.materialPrice = newMaterialInfo?.pricePerHour ? +newMaterialInfo.pricePerHour : undefined;
                        } else if (field === "color") {
                            const selectedMaterial = materials[item.materialType]?.materials.find((material) => material.colorValue === value);
                            if (selectedMaterial) {
                                updatedItem.technologyId = selectedMaterial.technologyId;
                                updatedItem.materialPrice = selectedMaterial.pricePerHour ? +selectedMaterial.pricePerHour : undefined;
                            }
                        }

                        // time과 price 재계산 (magnification, quantity, materialType, color 변경 시 영향)
                        const printSpeed = materials[updatedItem.materialType]?.printSpeed;
                        const newTime = calculateAndRoundPrintTime(updatedItem.magnification, updatedItem.volume, printSpeed);
                        const newPrice = calculatePrice(updatedItem.materialPrice, newTime, updatedItem.quantity);

                        updatedItem.time = typeof newTime === "number" ? newTime : undefined;
                        updatedItem.price = typeof newPrice === "number" ? newPrice : undefined;

                        return updatedItem;
                    }
                    return item;
                })
            );
        },
        [setOrderRows, materials]
    );

    const handleDeleteRow = (index: number) => {
        setOrderRows((prev) => prev.filter((_, i) => i !== index));
    };

    // maxHeight 계산
    const maxHeightForFiveItems = 5 * 140 + 60;

    return (
        <Container>
            <ButtonContainer>
                <SelectFileButton onClick={() => setIsPop(true)}>구매한 도면에서 선택</SelectFileButton>
                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                    <SelectFileButton>파일 직접 업로드</SelectFileButton>
                </label>
                <input type="file" accept=".stl" id="file-upload" style={{ display: "none" }} onChange={handleFileUpload} />
            </ButtonContainer>
            <Paper sx={{ width: "900px", overflow: "hidden" }}>
                <TableContainer sx={{ width: "900px", maxHeight: `${maxHeightForFiveItems}px` }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ width: column.width, fontWeight: "bold" }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderRows.map((row, i) => {
                                // time은 표시용으로 여기서도 계산 (상태값과 다를 수 있음 - 상태값은 반올림 전일 수 있으므로)
                                // 혹은 상태값(row.time)을 그대로 표시해도 무방
                                const displayTime = calculateAndRoundPrintTime(row.magnification, row.volume, materials[row.materialType]?.printSpeed);

                                return (
                                    <TableRow hover key={i} style={{ height: "140px" }}>
                                        {columns.map((column) => {
                                            // 'time' 컬럼 처리: 계산된 값 또는 상태 값 표시
                                            if (column.id === "time") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {/* 상태 값을 표시하거나, 표시용 계산값을 사용 */}
                                                        {row.time ?? displayTime ?? "계산 불가"}
                                                    </TableCell>
                                                );
                                            }

                                            // 'price' 컬럼 처리: 상태에 저장된 값 표시
                                            if (column.id === "price") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {/* 상태에 저장된 price 표시 */}
                                                        {row.price ?? "계산 불가"}
                                                    </TableCell>
                                                );
                                            }

                                            // 'delete' 컬럼 처리
                                            if (column.id === "delete") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <IconButton onClick={() => handleDeleteRow(i)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                );
                                            }

                                            // PrintOrderData 타입에 맞는 키로 접근하도록 타입 단언
                                            const value = row[column.id as keyof Omit<PrintOrderData, "volume" | "time" | "price" | "materialPrice">]; // 상태에 저장되지 않는 필드 제외

                                            // 'fileUrl' 컬럼 처리
                                            if (column.id === "fileUrl") {
                                                return (
                                                    <TableCell key={column.id} align={column.align} style={{ display: "flex", alignItems: "center" }}>
                                                        <StlRenderContainer key={column.id} filePath={value!.toString()} width="120px" height="120px" clickDisabled={true} />
                                                    </TableCell>
                                                );
                                            }

                                            // 'magnification' 또는 'quantity' 컬럼 처리
                                            if (column.id === "magnification" || column.id === "quantity") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <StyledTextField
                                                            type="number"
                                                            size="small"
                                                            sx={{ width: 60 }}
                                                            value={row[column.id]} // 직접 row에서 값 가져오기
                                                            onChange={(e) => handleChange(i, column.id, Number(e.target.value))}
                                                            inputProps={{ style: { fontSize: 12, padding: "4px" } }}
                                                        />
                                                        {column.id === "magnification" ? "배" : "개"}
                                                    </TableCell>
                                                );
                                            }

                                            // 'materialType' 컬럼 처리
                                            if (column.id === "materialType") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <StyledSelect
                                                            value={row.materialType || ""} // 직접 row에서 값 가져오기
                                                            onChange={(e) => handleChange(i, "materialType", e.target.value)}
                                                            sx={{ fontSize: 12, height: "30px" }}
                                                        >
                                                            {Object.keys(materials).map((materialType) => (
                                                                <MenuItem key={materialType} value={materialType} sx={{ fontSize: 12 }}>
                                                                    {materialType}
                                                                </MenuItem>
                                                            ))}
                                                        </StyledSelect>
                                                    </TableCell>
                                                );
                                            }

                                            // 'color' 컬럼 처리
                                            if (column.id === "color") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <StyledSelect
                                                            value={row.color || ""} // 직접 row에서 값 가져오기
                                                            onChange={(e) => {
                                                                const selectedColor = e.target.value;
                                                                handleChange(i, "color", selectedColor);
                                                            }}
                                                            sx={{ fontSize: 12, height: "30px" }}
                                                        >
                                                            {materials[row.materialType]?.materials.map((material) => {
                                                                let color = material.colorValue;
                                                                return (
                                                                    <MenuItem key={material.technologyId} value={color} sx={{ fontSize: 12 }}>
                                                                        <RowGrid>
                                                                            <ColorBox color={color} />
                                                                            {color}
                                                                        </RowGrid>
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </StyledSelect>
                                                    </TableCell>
                                                );
                                            }

                                            // 기본 처리 (렌더링할 필요 없는 컬럼)
                                            return null;
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {isPop ? <SelectDesignPopUp handleOnClick={setIsPop} handleFileUpload={handleFileUpload} /> : null}
        </Container>
    );
};

// Styled-components 정의 (기존 코드 유지)
const Container = styled.div`
    width: 900px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

const SelectFileButton = styled.div`
    width: 200px;
    height: 30px;
    background-color: #000000;
    color: white;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 500;

    &:hover {
        background-color: #4682b4;
    }
`;

const ColorBox = styled.div`
    width: 12px;
    height: 12px;
    background-color: ${(props) => props.color};
    border: 1px solid #919191;
    border-radius: 2px;
    margin-right: 4px;
`;

const RowGrid = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

const StyledTextField = styled(TextField)`
    & .MuiInputBase-root {
        font-size: 12px;
        padding: 4px;
        height: 30px;
    }
`;

const StyledSelect = styled(Select)`
    & .MuiSelect-select {
        font-size: 12px;
        padding: 4px 10px;
        height: 30px;
        display: flex;
        align-items: center;
    }
    min-width: 80px;
`;

export default SelectedFileDataGrid;
