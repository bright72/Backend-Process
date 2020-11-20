
const canvas = require('canvas')
const { Canvas, Image, ImageData } = canvas;
const faceapi = require('face-api.js')
const express = require('express')
const cors = require('cors')
var request = require('request')
const app = express();
const port = 9000;
const path = require('path')
const admin = require("firebase-admin");
const serviceAccount = require("./test-file-store-d0505-firebase-adminsdk-ughbe-38a613249a.json");
const { count } = require('console');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-file-store-d0505.firebaseio.com"
});
app.use(cors())
const firebase = admin.database()
const viewsDir = path.join(__dirname, './')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(viewsDir))

app.get('/', (req, res) => res.sendFile(path.join(viewsDir, 'index.html')))

app.post('/test_api', (req, res) => {

  const obj = req.body;
  const img = []

  const itemRefImg = firebase.ref(`user/${obj.user_id}/event/${obj.event_id}/images`)
  itemRefImg.on("value", (snapshot) => {
    const num = snapshot.numChildren()

    const itemRefPar = firebase.ref(`user/${obj.user_id}/event/${obj.event_id}/participant`)
    //console.log(itemRefPar)
    itemRefPar.on("value", (snapshot) => {
      snapshot.forEach(par => {

        const labeledFaceDescriptors = loadLabeledImages()

        function loadLabeledImages() {
          const labels = par.val().email
          console.log(labels)
          return Promise.all(
            labels.map(async label => {
              const descriptions = []
              // for (let i = 1; i <= 3; i++) {
              //   const img = await faceapi.fetchImage(`./trainfacemodel/${label}/${i}.jpg`) //ไฟล์ที่เอาไป Process 
              //   console.log(img)
              //   const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
              //   descriptions.push(detections.descriptor)
              // }

              return new faceapi.LabeledFaceDescriptors(label, descriptions)
            })
          )
        }


        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
        console.log(faceMatcher)
        let image
        //image = await faceapi.fetchImage(`./eventpicture/test${i}.jpg`) //ไฟล์ที่เอาไปเช็ค
        console.log(image)
        // const displaySize = { width: image.width, height: image.height }
        // const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        // results.forEach((result, i) => {
        //     console.log(result._label)
        //     if (result._label != "unknown") {
        //         printname.push({ name: result._label })
        //         console.log('work')
        //     } else {
        //         console.log('not do anything')
        //     }
        // })
        // console.log(printname)



      })
    })



    snapshot.forEach((doc) => {

      const labeledFaceDescriptors = loadLabeledImages()

      function loadLabeledImages() {

        // const labels = ['bright@gmail.com', 'earn@gmail.com', 'earth@gmail.com']

      }

      //const images = doc.val().metadataFile.downloadURLs
      //console.log(processimg)
      //console.log(images)
      //img.push(images)
    });



  });


  // const itemRefPar = firebase.ref(`user/${obj.user_id}/event/${obj.event_id}/participant`)
  // //console.log(itemRefPar)
  // itemRefPar.on("value", (snapshot) => {
  //   snapshot.forEach(par => {
  //     const par_id = par.key
  //     console.log(par_id)
  //     //const img = faceapi.fetchImage(`./trainfacemodel/bright@gmail.com/1.jpg`) //ไฟล์ที่เอาไป Process 
  //     //console.log(img)
  //     //console.log(image)
  //     //const itemRefTest = firebase.ref(`user/${obj.user_id}/event/${obj.event_id}/participant/${par_id}`)

  //     //itemRefTest.push(item)
  //     const parimage = par.val().headshot_url //รอดึงรูป
  //     console.log(parimage)

  //     //itemRefPar.child(this.state.event_id).update()
  //     //console.log(images2);
  //     let test = {
  //       email :'teafsgregdsvdsvdv'
  //     }
  //     //itemRefPar.child(images2.email).update(test);
  //   });
  // });




  // console.log(img)

  //const itemRefImg = firebase.ref(`user/${obj.user_id}/event/${obj.event_id}/participant/`)


  //console.log(items)
  // let temp = []
  // for (const property in items) {
  //     temp.push({
  //         email: "test",
  //     })
  //     console.log(temp)
  // }

  // })

  // const item = {
  //   id : 'dfsdfsdfdf',
  //   is_select_image: false,
  //   panticipant_picture_confirm: false
  // }
  // itemRef.push(item)
})

// app.get("/api", (req, res) => {
//   let keypath = ""
//   const itemsRef = firebase.database().ref(`user/$gfegefg/event/bgregerg/participant`)
//   const item = {
//     email: this.state.email,
//     is_select_image: false,
//     panticipant_picture_confirm: false
//   }
//   //itemsRef.push(item)
//   request(res.send(itemsRef.push(item))
//   )
// });

// app.get('/test_api', (req, res) => {
//   console.log(req.headers)
//   const itemRef = firebase.ref(`user/${req.headers}`)
//   itemRef.on('value', function(snap) {
//     console.log("Snap: " + snap.val())
//     res.json(snap.val())
//   })
// })


// app.post('/fetch_external_image', async (req, res) => {
//   const { imageUrl } = req.body
//   if (!imageUrl) {
//     return res.status(400).send('imageUrl param required')
//   }
//   try {
//     const externalResponse = await request(imageUrl)
//     res.set('content-type', externalResponse.headers['content-type'])
//     return res.status(202).send(Buffer.from(externalResponse.body))
//   } catch (err) {
//     return res.status(404).send(err.toString())
//   }
// })

app.listen(port, () => console.log(`Listening on port ${port}!`))

// function request(url, returnBuffer = true, timeout = 10000) {
//   return new Promise(function (resolve, reject) {
//     const options = Object.assign(
//       {},
//       {
//         url,
//         isBuffer: true,
//         timeout,
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
//         }
//       },
//       returnBuffer ? { encoding: null } : {}
//     )

//     get(options, function (err, res) {
//       if (err) return reject(err)
//       return resolve(res)
//     })
//   })
// }


app.post('/test_api2', (req, res) => {
  const printname = []
  console.log('tesdssfsdf')
  // for (let i = 1; i <= 4; i++) {
  //     const labeledFaceDescriptors = await loadLabeledImages()
  //     function loadLabeledImages() {
  //         const labels = ['bright@gmail.com', 'earn@gmail.com', 'earth@gmail.com']
  //         return Promise.all(
  //             labels.map(async label => {
  //                 const descriptions = []
  //                 for (let i = 1; i <= 3; i++) {
  //                     const img = await faceapi.fetchImage(`./trainfacemodel/${label}/${i}.jpg`) //ไฟล์ที่เอาไป Process 
  //                     console.log(img)
  //                     const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
  //                     descriptions.push(detections.descriptor)
  //                 }
  //                 return new faceapi.LabeledFaceDescriptors(label, descriptions)
  //             })
  //         )
  //     }
  //     const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)
  //     let image, canvas
  //     image = await faceapi.fetchImage(`./eventpicture/test${i}.jpg`) //ไฟล์ที่เอาไปเช็ค
  //     console.log(image)
  //     const displaySize = { width: image.width, height: image.height }
  //     const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
  //     const resizedDetections = faceapi.resizeResults(detections, displaySize)
  //     const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
  //     results.forEach((result, i) => {
  //         console.log(result._label)
  //         if (result._label != "unknown") {
  //             printname.push({ name: result._label })
  //             console.log('work')
  //         } else {
  //             console.log('not do anything')
  //         }
  //     })
  //     console.log(printname)

  // }

})