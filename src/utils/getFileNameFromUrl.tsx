export const getFilenameFromUrl = async (url: string) => {
    const response = await fetch(url); // 파일 내용을 안 받아옴 (헤더만)
    const blob = await response.blob();
    console.log(blob);
    // const disposition = response.headers.get("Content-Disposition");

    // if (disposition && disposition.includes("filename=")) {
    //     const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    //     if (filenameMatch != null && filenameMatch[1]) {
    //         return filenameMatch[1].replace(/['"]/g, "");
    //     }
    // }
    // return url.split("/").pop() || "download";
};
