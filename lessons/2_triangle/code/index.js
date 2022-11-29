import WebGPU from "wonder-webgpu";
import fs from "fs";
import path from "path";

let _render = ([device, window, swapChain, queue], [vertexBuffer, indexBuffer, triangleIndices, pipeline]) => {
    let backBufferView = swapChain.getCurrentTextureView();
    // 操作buffer，通过Encoder
    let commandEncoder = device.createCommandEncoder({});
    let renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            clearColor: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },//背景色
            loadOp: "clear",// 渲染这一帧前，存储或者删除
            storeOp: "store",// 渲染完这一帧后，存储或者删除
            attachment: backBufferView // view
        }]
    });
    renderPass.setPipeline(pipeline); // 用哪个管线
    // 设置顶点和索引buffer
    renderPass.setVertexBuffer(0, vertexBuffer, 0);
    renderPass.setIndexBuffer(indexBuffer);
    // 绘制3次  triangleIndices.length三角形顶点数   1是绘制的实例数量
    renderPass.drawIndexed(triangleIndices.length, 1, 0, 0, 0);
    // 结束绘制
    renderPass.endPass();
    // 提交绘制结果
    let commandBuffer = commandEncoder.finish();
    queue.submit([commandBuffer]);
    swapChain.present();
    window.pollEvents();
};

let _main = async () => {
    // webgpu 对象初始化
    let window = new WebGPU.WebGPUWindow({
        width: 640,
        height: 480,
        title: "Wonder-Potorealistic-Render-Edu",
        resizable: false
    });

    let context = window.getContext("webgpu");

    let adapter = await WebGPU.GPU.requestAdapter({ window, preferredBackend: "Vulkan" });

    let device = await adapter.requestDevice({});

    let queue = device.getQueue();

    let swapChainFormat = await context.getSwapChainPreferredFormat(device);

    let swapChain = context.configureSwapChain({
        device: device,
        format: swapChainFormat
    });
    // 顶点，索引
    let triangleVertices = new Float32Array([
        0.0, 0.5, 
        -0.5, -0.5,
        0.5, -0.5
    ]);
    // 申请内存
    let vertexBuffer = device.createBuffer({
        size: triangleVertices.byteLength,
        usage: WebGPU.GPUBufferUsage.VERTEX | WebGPU.GPUBufferUsage.COPY_DST
    });
    // 数据写入buffer
    vertexBuffer.setSubData(0, triangleVertices);
    // 顶点索引
    let triangleIndices = new Uint32Array([
        0, 1, 2
    ]);
    let indexBuffer = device.createBuffer({
        size: triangleIndices.byteLength,
        usage: WebGPU.GPUBufferUsage.INDEX | WebGPU.GPUBufferUsage.COPY_DST
    });
    // 索引写入
    indexBuffer.setSubData(0, triangleIndices);
    // layout定义数据的布局关系
    let layout = device.createPipelineLayout({
        bindGroupLayouts: []
    });
    // 创建顶点shader和片元shader
    let vertexShaderModule = device.createShaderModule({ code: fs.readFileSync(path.join(process.cwd(), "lessons/2_triangle/code/scene.vert"), "utf-8") });
    let fragmentShaderModule = device.createShaderModule({ code: fs.readFileSync(path.join(process.cwd(), "lessons/2_triangle/code/scene.frag"), "utf-8") });
    // 创建渲染管线
    let pipeline = device.createRenderPipeline({
        layout,
        vertexStage: {
            module: vertexShaderModule,
            entryPoint: "main"
        },
        fragmentStage: {
            module: fragmentShaderModule,
            entryPoint: "main"
        },
        primitiveTopology: "triangle-list", // 三角面绘制
        vertexState: {
            indexFormat: "uint32", 
            // 
            vertexBuffers: [{
                arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
                stepMode: "vertex",
                attributes: [{
                    shaderLocation: 0,
                    offset: 0, // 数据移位
                    format: "float2"
                }]
            }]
        },
        colorStates: [{
            format: swapChainFormat,
            alphaBlend: {},
            colorBlend: {}
        }]
    });

    while (true) {
        // 渲染
        _render([device, window, swapChain, queue], [vertexBuffer, indexBuffer, triangleIndices, pipeline]);
    }
};

_main().then(() => {
    console.log("finish main");
});