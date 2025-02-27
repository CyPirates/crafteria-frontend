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
import { useMemo, useState } from "react";
import styled from "styled-components";
import SelectDesignPopUp from "./SelectDesignPopUp";
import { Material } from "../../../types/CompanyType";
import classifyMaterial from "../../../utils/classifyMaterial";
import { SelectChangeEvent } from "@mui/material";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { PrintOrderData } from "../../../types/OrderType";

type Column = {
    id: "fileUrl" | "magnification" | "quantity" | "materialType" | "color";
    label: string;
    width?: number | string;
    flex?: any;
    align?: "left" | "right" | "center"; // align 속성 추가
};

const columns: Column[] = [
    { id: "fileUrl", label: "도면", width: 200 },
    { id: "magnification", label: "배율", width: 140 },
    { id: "quantity", label: "수량", width: 140 },
    { id: "materialType", label: "재료타입", width: 180 },
    { id: "color", label: "색상" },
];

type OwnProps = {
    orderRows: PrintOrderData[];
    setOrderRows: React.Dispatch<React.SetStateAction<PrintOrderData[]>>;
    materials: Record<
        string,
        {
            totalPrice: number;
            materials: Material[];
        }
    >;
};

const SelectedFileDataGrid = ({ orderRows, setOrderRows, materials }: OwnProps) => {
    const defaultMaterialType = Object.keys(materials)[0];
    const defaultColor = materials[defaultMaterialType].materials[0].colorValue;
    const defaultId = materials[defaultMaterialType].materials[0].technologyId;

    const [isPop, setIsPop] = useState<boolean>(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            try {
                const modelSize = await getStlModelSize(fileUrl);
                const newRow: PrintOrderData = {
                    fileUrl: fileUrl,
                    widthSize: modelSize.width.toString(),
                    lengthSize: modelSize.height.toString(),
                    heightSize: modelSize.depth.toString(),
                    magnification: 1,
                    quantity: 1,
                    materialType: defaultMaterialType,
                    color: defaultColor,
                    technologyId: defaultId,
                };
                setOrderRows((prev) => [...prev, newRow]);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleChange = (index: number, field: string, value: any) => {
        setOrderRows((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    return (
        <>
            <ButtonContainer>
                <SelectFileButton onClick={() => setIsPop(true)}>구매한 도면에서 선택</SelectFileButton>
                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                    <SelectFileButton>파일 직접 업로드</SelectFileButton>
                </label>
                <input type="file" id="file-upload" style={{ display: "none" }} onChange={handleFileUpload} />
            </ButtonContainer>
            <Paper sx={{ width: "800px", overflow: "hidden" }}>
                <TableContainer>
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
                            {orderRows.map((row, i) => (
                                <TableRow hover key={i} style={{ height: "140px" }}>
                                    {columns.map((column) => {
                                        const value = row[column.id];

                                        if (column.id === "fileUrl") {
                                            return (
                                                <TableCell key={column.id} align={column.align} style={{ display: "flex", alignItems: "center" }}>
                                                    <StlRenderContainer key={column.id} filePath={value.toString()} width="132px" height="132px" clickDisabled={true} />
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === "magnification" || column.id === "quantity") {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <TextField type="number" size="small" sx={{ width: 80 }} value={value} onChange={(e) => handleChange(i, column.id, Number(e.target.value))} />
                                                    {column.id === "magnification" ? "배" : "개"}
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === "materialType") {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Select<string> value={String(value) || ""} onChange={(e) => handleChange(i, "materialType", e.target.value)}>
                                                        {Object.keys(materials).map((materialType) => (
                                                            <MenuItem key={materialType} value={materialType}>
                                                                {materialType}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                            );
                                        }

                                        if (column.id === "color") {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Select<string>
                                                        value={String(value) || ""}
                                                        onChange={(e) => {
                                                            const selectedColor = e.target.value;
                                                            const selectedMaterial = materials[row.materialType].materials.find((material) => material.colorValue === selectedColor);

                                                            handleChange(i, "color", selectedColor);
                                                            if (selectedMaterial) {
                                                                handleChange(i, "technologyId", selectedMaterial.technologyId);
                                                            }
                                                        }}
                                                    >
                                                        {materials[row.materialType].materials.map((material) => {
                                                            let color = material.colorValue;
                                                            return (
                                                                <MenuItem key={material.technologyId} value={color}>
                                                                    <RowGrid>
                                                                        <ColorBox color={color} />
                                                                        {color}
                                                                    </RowGrid>
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </Select>
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {isPop ? <SelectDesignPopUp defaultType={defaultMaterialType} defaultColor={defaultColor} defaultId={defaultId} handleOnClick={setIsPop} setOrderRows={setOrderRows} /> : null}
        </>
    );
};

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

    &:hover {
        background-color: #4682b4;
    }
`;

const ColorBox = styled.div`
    width: 12px;
    height: 12px;
    background-color: ${(props) => props.color};
    border: 1px solid #919191;
`;

const RowGrid = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

export default SelectedFileDataGrid;
