import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import axios from "axios";

const getStlModelSize = async (fileUrl: string): Promise<{ width: number; height: number; depth: number }> => {
    const loader = new STLLoader();
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const geometry = loader.parse(response.data);

    const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));

    const width = +(boundingBox.max.x - boundingBox.min.x).toFixed(2);
    const height = +(boundingBox.max.y - boundingBox.min.y).toFixed(2);
    const depth = +(boundingBox.max.z - boundingBox.min.z).toFixed(2);

    return { width, height, depth };
};

export default getStlModelSize;
