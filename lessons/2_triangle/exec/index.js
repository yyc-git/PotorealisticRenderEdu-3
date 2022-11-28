let _main = async () => {
    //TODO init

    let triangleVertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);


    let triangleIndices = new Uint32Array([
        0, 1, 2
    ]);

    while (true) {
        // TODO render
    }
};

_main().then(() => {
    console.log("finish main");
});