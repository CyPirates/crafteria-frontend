import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import axios from "axios";

const getStlModelSize = async (input: string | File): Promise<{ width: number; height: number; depth: number }> => {
    const loader = new STLLoader();
    let geometry: THREE.BufferGeometry;

    if (typeof input === "string") {
        // input이 URL일 경우
        const response = await axios.get(input, { responseType: "arraybuffer" });
        geometry = loader.parse(response.data);
    } else {
        // input이 File일 경우
        const arrayBuffer = await input.arrayBuffer();
        geometry = loader.parse(arrayBuffer);
    }

    const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));

    const width = +(boundingBox.max.x - boundingBox.min.x).toFixed(2);
    const height = +(boundingBox.max.y - boundingBox.min.y).toFixed(2);
    const depth = +(boundingBox.max.z - boundingBox.min.z).toFixed(2);

    // const width = +Math.round(boundingBox.max.x - boundingBox.min.x);
    // const height = +Math.round(boundingBox.max.y - boundingBox.min.y);
    // const depth = +Math.round(boundingBox.max.z - boundingBox.min.z);

    return { width, height, depth };
};

export default getStlModelSize;
