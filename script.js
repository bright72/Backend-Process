
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
    const printname = []
    for (let i = 1; i <= 4; i++) { //
        const container = document.createElement('div')
        container.style.position = 'relative'
        document.body.append(container)
        document.getElementById("text1").innerText = 'กำลัง Process'
        const labeledFaceDescriptors = await loadLabeledImages()
        document.getElementById("text1").innerText = 'Process เสร็จแล้ว'
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
        let image, canvas
        if (image) image.remove()
        if (canvas) canvas.remove()
        //image = await faceapi.bufferToImage(imageUpload.files[0])
        image = await faceapi.fetchImage(`./eventpicture/test${i}.jpg`) //ไฟล์ที่เอาไปเช็ค
        console.log(image)

        const admin = require('./firebase/index');

    

        container.append(image) //ปริ้นรูป
        canvas = faceapi.createCanvasFromMedia(image)
        container.append(canvas)
        const displaySize = { width: image.width, height: image.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            console.log(result._label)
            if (result._label != "unknown") {
                document.body.append(" \n " + result._label + " \n ") //ปริ้นชื่อคนในภาพ
                printname.push({ name: result._label })
                console.log('work')
            } else {
                console.log('not do anything')
            }
            drawBox.draw(canvas)
        })
        console.log(printname)
        var output = document.getElementById('output');
        // "el" is the parameter that references the "this" argument that was passed
     output.innerHTML = printname.value; // set its content to the value of the "el"
    }
    return Promise.all(printname)

}

function loadLabeledImages() {
    const labels = ['bright@gmail.com', 'earn@gmail.com', 'earth@gmail.com']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`./trainfacemodel/${label}/${i}.jpg`) //ไฟล์ที่เอาไป Process 
                console.log(img)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}


