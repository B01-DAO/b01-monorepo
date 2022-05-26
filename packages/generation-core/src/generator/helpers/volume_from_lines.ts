import * as THREE from 'three';

export function buildVolumePtsFromLine(
    startPt: THREE.Vector3,
    endPt: THREE.Vector3,
    width: number,
    height: number,
    pitchedRoof = false,
) {
    const lineNormal = new THREE.Vector3().subVectors(endPt, startPt);
    const vertVec = new THREE.Vector3(0, 1, 0);

    lineNormal.cross(vertVec);
    lineNormal.normalize();
    lineNormal.multiplyScalar(width);

    const planeNormal = new THREE.Vector3().subVectors(endPt, startPt);
    planeNormal.cross(lineNormal);
    planeNormal.normalize();
    planeNormal.multiplyScalar(height);

    const planePoints = offsetVectors([startPt, endPt], lineNormal);

    const vectorList = offsetVectors(planePoints, planeNormal);

    if (pitchedRoof) {
        const yVector = new THREE.Vector3(0, height / 2, 0);
        const roofPoints = offsetVectors(
            [
                new THREE.Vector3().addVectors(startPt, yVector),
                new THREE.Vector3().addVectors(endPt, yVector),
            ],
            planeNormal,
        );
        roofPoints.forEach(roofPoint => {
            vectorList.push(roofPoint);
        });
    }

    return vectorList;
}

export function offsetVectors(
    vectors: THREE.Vector3[],
    offsetVector: THREE.Vector3,
    bothSides = true,
) {
    const newVectors: THREE.Vector3[] = [];

    let offsetOpposite = new THREE.Vector3();
    if (bothSides) {
        offsetVector.multiplyScalar(0.5);
        offsetOpposite = offsetVector.clone().negate();
    }

    vectors.forEach(vector => {
        newVectors.push(new THREE.Vector3().addVectors(vector, offsetVector));
        newVectors.push(new THREE.Vector3().addVectors(vector, offsetOpposite));
    });

    return newVectors;
}
