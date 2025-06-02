import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PoliciesPage = () => {
    const { type } = useParams();
    const htmlFile = `/policies/${type}.html`;

    return (
        <>
            <iframe src={htmlFile} title="개인정보처리방침" width="100%" height="1000px" style={{ border: "none" }} />
        </>
    );
};

export default PoliciesPage;
