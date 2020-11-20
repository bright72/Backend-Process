Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(begin)


async function start() {
    const printname = []
    for (let i = 1; i <= 4; i++) { //
        //const container = document.createElement('div')
        //container.style.position = 'relative'
        //document.body.append(container)
        //document.getElementById("text1").innerText = 'กำลัง Process'
        const labeledFaceDescriptors = await loadLabeledImages()

        function loadLabeledImages() {
            const labels = ['bright@gmail.com', 'earn@gmail.com', 'earth@gmail.com']
            
            return Promise.all(
                labels.map(async label => {
                    const descriptions = []
                    for (let i = 1; i <= 3; i++) {
                        const img = await faceapi.fetchImage(`./trainfacemodel/${label}/${i}.jpg`) //ไฟล์ที่เอาไป Process 
                        console.log(img)
                        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                        descriptions.push(detections.descriptor)
                    }
                    return new faceapi.LabeledFaceDescriptors(label, descriptions)
                })
            )
        }

        document.getElementById("text1").innerText = 'Process เสร็จแล้ว'
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
        let image, canvas
        //if (image) image.remove()
        //if (canvas) canvas.remove()
        //image = await faceapi.bufferToImage(imageUpload.files[0])
        image = await faceapi.fetchImage(`./eventpicture/test${i}.jpg`) //ไฟล์ที่เอาไปเช็ค
        console.log(image)

        //container.append(image) //ปริ้นรูป
        //canvas = faceapi.createCanvasFromMedia(image)
        //container.append(canvas)
        const displaySize = { width: image.width, height: image.height }
        //faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

        results.forEach((result, i) => {
            //const box = resizedDetections[i].detection.box
            //const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            console.log(result._label)
            if (result._label != "unknown") {
                //document.body.append(" \n " + result._label + " \n ") //ปริ้นชื่อคนในภาพ
                printname.push({ name: result._label })
                console.log('work')
            } else {
                console.log('not do anything')
            }
            //drawBox.draw(canvas)
        })
        console.log(printname)
        //var output = document.getElementById('output');
        // "el" is the parameter that references the "this" argument that was passed
     //output.innerHTML = printname.value; // set its content to the value of the "el"
    }
}

async function begin() {
    const printname = []
    const cors = require('cors')
    for (let i = 1; i <= 1; i++) {
        const labeledFaceDescriptors = await loadLabeledImages()
        function loadLabeledImages() {
            const labels = ['bright@gmail.com', 'earn@gmail.com', 'earth@gmail.com']
            return Promise.all(
                labels.map(async label => {
                    const descriptions = []
                    for (let i = 1; i <= 3; i++) {
                        const img = await faceapi.fetchImage(`./trainfacemodel/${label}/${i}.jpg`) //ไฟล์ที่เอาไป Process 
                        console.log(img)
                        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                        descriptions.push(detections.descriptor)
                    }
                    return new faceapi.LabeledFaceDescriptors(label, descriptions)
                })
            )
        }
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
        let image
        image = await faceapi.fetchImage(`https://firebasestorage.googleapis.com/v0/b/test-file-store-d0505.appspot.com/o/images%2FIMG_25630328_171911.jpg?alt=media&token=61c73e10-013a-44c3-a06e-51ab98182a90`) //ไฟล์ที่เอาไปเช็ค
        console.log(image)
        const displaySize = { width: image.width, height: image.height }
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
            console.log(result._label)
            if (result._label != "unknown") {
                printname.push({ name: result._label })
                console.log('work')
            } else {
                console.log('not do anything')
            }
        })
        console.log(printname)
        
    }
    }
