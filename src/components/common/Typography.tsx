import styled, { css } from "styled-components";

type TypographyCategory =
    | "heading.h6"
    | "misc.noti"
    | "misc.label"
    | "misc.plsceholder"
    | "body.medium_r"
    | "body.small_r"
    | "body.xs_r"
    | "body.medium_m"
    | "body.small_m"
    | "body.xs_m"
    | "body.medium_b"
    | "body.small_b"
    | "body.xs_b";

interface TypographyProps {
    variant: TypographyCategory;
    as?: keyof JSX.IntrinsicElements;
    color?: string;
    children: React.ReactNode;
}

export const Typography = styled.span<TypographyProps>`
    ${({ theme, variant, color }) => {
        const [group, style] = variant.split(".") as [string, string];
        const styleSet = theme.typography[group][style];
        if (color) {
            const [group, style] = color.split(".") as [string, string];
            const colorSet = theme[group][style];
            color = colorSet;
        }

        return css`
            font-family: ${theme.fontFamily};
            font-weight: ${styleSet.fontWeight};
            font-size: ${styleSet.fontSize};
            line-height: ${styleSet.lineHeight};
            color: ${color || "inherit"};
        `;
    }}
`;
