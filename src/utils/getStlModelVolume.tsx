import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

// Function to calculate the volume of a tetrahedron
function signedVolumeOfTetrahedron(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
    return p1.dot(p2.cross(p3)) / 6.0;
}

// Function to calculate the volume of an STL model
async function getStlModelVolume(fileUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const loader = new STLLoader();
        loader.load(
            fileUrl,
            (geometry) => {
                const vertices = geometry.attributes.position.array;
                let totalVolume = 0;

                for (let i = 0; i < vertices.length; i += 9) {
                    const p1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
                    const p2 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
                    const p3 = new THREE.Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

                    totalVolume += signedVolumeOfTetrahedron(p1, p2, p3);
                }

                resolve(Math.round(Math.abs(totalVolume))); // Volume should be positive
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
}

export default getStlModelVolume;
