export const lightTheme = {
    bgColor: "#D0D4D9",
    textColor: "#0f0f0f",
    border: "1px solid #D0D4D9",

    primaryColor: {
        blue1: "#1754CE",
        blue2: "#B9CCF0",
        blue3: "#F7FAFF",
    },

    text: {
        heading: "#14181F",
        body: "#414750",
        placeholder: "#8B939F",
        disabled: "#B2B9C4",
        error: "#AB2816",
        informative: "#1C51A4",
    },

    grayScale: {
        0: "#FFFFFF",
        100: "#F3F4F5",
        200: "#D0D4D9",
        300: "#AEB3BC",
        400: "#7B8493",
        500: "#4D545E",
        600: "#2A2E34",
    },
    typography: {
        heading: {
            h6: {
                fontWeight: 700, // Bold
                fontSize: "18px",
                lineHeight: "auto",
            },
        },
        misc: {
            noti: {
                fontWeight: 500, // Medium
                fontSize: "11px",
                lineHeight: "12px",
            },
            label: {
                fontWeight: 400, // Regular
                fontSize: "14px",
                lineHeight: "16px",
            },
            placeholder: {
                fontWeight: 400, // Regular
                fontSize: "13px",
                lineHeight: "16px",
            },
        },
        body: {
            medium_r: { fontWeight: 400, fontSize: "15px", lineHeight: "auto" },
            small_r: { fontWeight: 400, fontSize: "13px", lineHeight: "16px" },
            xs_r: { fontWeight: 400, fontSize: "11px", lineHeight: "16px" },
            medium_m: { fontWeight: 500, fontSize: "15px", lineHeight: "auto" },
            small_m: { fontWeight: 500, fontSize: "13px", lineHeight: "16px" },
            xs_m: { fontWeight: 500, fontSize: "11px", lineHeight: "16px" },
            medium_b: { fontWeight: 700, fontSize: "15px", lineHeight: "auto" },
            small_b: { fontWeight: 700, fontSize: "13px", lineHeight: "16px" },
            xs_b: { fontWeight: 700, fontSize: "11px", lineHeight: "16px" },
        },
    },
};

export const darkTheme = {
    bgColor: "#39393C",
    textColor: "#FAFAFA",
    border: "5px solid #464649",

    colors: {
        primary: "#FF4D4D",
        secondary: "#4D79FF",
        tertiary: "#4DFF88",
    },
};

export const theme = {
    lightTheme,
    darkTheme,
};
