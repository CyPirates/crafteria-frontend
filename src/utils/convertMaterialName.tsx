const convertMaterialName = (target: string): string => {
    let engPattern = /[a-zA-Z]/;
    let isEng = engPattern.test(target);

    if (isEng) {
        switch (target) {
            case "FILAMENT":
                return "필라멘트";
            case "LIQUID":
                return "액상";
            case "POWDER":
                return "분말";
            default:
                return "";
        }
    } else {
        switch (target) {
            case "필라멘트":
                return "FILAMENT";
            case "액상":
                return "LIQUID";
            case "분말":
                return "POWDER";
            default:
                return "";
        }
    }
};

export default convertMaterialName;
