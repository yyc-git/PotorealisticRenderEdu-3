type localToWorldMatrix = Float32Array

type transform = number

type nullable<Value extends any> = Value | null | undefined

// let computeLocalToWorldMatrix = (getParentLocalToWorldMatrixFunc:(transform) => localToWorldMatrix,  localToWorldMatrix:localToWorldMatrix): localToWorldMatrix => {
//     //TODO implement
//     return {} as any
// }
let computeLocalToWorldMatrix = (getLocalToWorldMatrixFunc:(transform) => localToWorldMatrix,  getParentTransformFunc:(transform) => nullable<number>, transform:transform): localToWorldMatrix => {
    //TODO implement
    return {} as any
}



// set TRS to m?


localPosition:Vector(3f)

localRotation:Vector(4f)


localScale:Vector(3f)


localToWorldMatrix:Matrix(16)


x 10

localPosition:(10,0,0)

localRotation:Vector(4f)


localScale:Vector(3f)


let localToWorldMatrix = from(
    localPosition,
    localRotation,
    localScale
)



let localToWorldMatrix =  localToWorldMatrix * parent * parent 