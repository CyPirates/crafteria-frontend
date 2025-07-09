const convertMaterialName = (target: string) => {
    let engPattern = /[a-zA-Z]/;
    let isEng = engPattern.test(target);

    if (isEng) {
        switch (target) {
            case "FILAMENT":
                return "필라멘트";
            case "LIQUID":
                return "액상 레진";
            case "NYLONPOWDER":
                return "나일론 분말";
            case "METALPOWDER":
                return "금속 분말";
            default:
                return "";
        }
    } else {
        switch (target) {
            case "필라멘트":
                return "FILAMENT";
            case "액상 레진":
                return "LIQUID";
            case "나일론 분말":
                return "NYLONPOWDER";
            case "금속 분말":
                return "METALPOWDER";
            default:
                return "";
        }
    }
};

export default convertMaterialName;
