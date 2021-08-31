export function invert(data: Uint8Array) {
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
};

export function grayscale(data: Uint8Array) {
    for (var i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
}

export function sepia(data: Uint8Array) {
    for (var i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = avg + 100;
        data[i + 1] = avg + 50;
        data[i + 2] = avg;
    }
}

function addConvolveValue(pos: number, i: number, data: Uint8Array, length: number) {
    return pos >= 0 && pos < length ? data[pos] : data[i];
}

export function convolve(data: Uint8Array, w: number, offset: any, v00: number, v01: number, v02: number, v10: number, v11: number, v12: number, v20: number, v21: number, v22: number) {
    console.log(w, offset, v00, v01, v02, v10, v11, v12, v20, v21, v22)
    const divisor = (v00 + v01 + v02 + v10 + v11 + v12 + v20 + v21 + v22) || 1;
    const length = data.length;
    let res = 0;
    let newData = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
        if ((i + 1) % 4 === 0) {
            newData[i] = data[i];
            continue;
        }
        let res = v00 * addConvolveValue(i - w * 4 - 4, i, data, length) +
            v01 * addConvolveValue(i - w * 4, i, data, length) +
            v02 * addConvolveValue(i - w * 4 + 4, i, data, length) +
            v10 * addConvolveValue(i - 4, i, data, length) +
            v11 * data[i] +
            v12 * addConvolveValue(i + 4, i, data, length) +
            v20 * addConvolveValue(i + w * 4 - 4, i, data, length) +
            v21 * addConvolveValue(i + w * 4, i, data, length) +
            v22 * addConvolveValue(i + w * 4 + 4, i, data, length);
        res /= divisor;
        res += offset;
        newData[i] = res;
    }
    data = newData
}