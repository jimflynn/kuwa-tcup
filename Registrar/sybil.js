/**
 * @module Sybil
 * @description Implementation of face recognition in NodeJS.
 * @author The Kuwa Foundation / Priyadarshi Rath
 */

const fs       = require('fs');
const path     = require('path');

const cv       = require('opencv4nodejs');
const fr       = require('face-recognition').withCv(cv);
const exiftool = require('node-exiftool');
const ep       = new exiftool.ExiftoolProcess();

const targetSize     = 150;
const faceDetector   = fr.FaceDetector();
const faceRecognizer = fr.FaceRecognizer();

/**
 * @async
 * @function getRotation
 * @description Reads video metadata to find the angle by which the video frames have been rotated by a video capture device.
 * @param  {String} videoPath - The path to the video file.
 * @return {number} theta     - The angle by which the video was rotated by the device.
 */
var getRotation = async function(videoPath) {
	let theta = 0;
	await ep.open();
	metadata = await ep.readMetadata(videoPath);
	await ep.close();
	console.log(typeof metadata);
	data = metadata.data;
	if("Rotation" in data[0]) {
		theta = data[0].Rotation;
	}
	return theta;
}

/**
 * @function getFaceImages
 * @description Reads a video file and saves frames into a path determined by saveDir.
 * @param  {String} videoPath     - The path to the video file that the client uploaded.
 * @param  {String} clientAddress - The ethereum address of the client.
 * @return {void}
 */
var getFaceImages = async function(videoPath, saveDir) {
	theta = await getRotation(videoPath);
	console.log("Reading video...");
	let f = 0;
	let ct = 0;
	// saveDir = allPeopleDir + clientAddress;
	try {
		let vCap = new cv.VideoCapture(videoPath);
		let frame = vCap.read();
		if (!fs.existsSync(saveDir))
			fs.mkdirSync(saveDir);
		while (f < 1) {
			let frame = vCap.read();
			ct = ct + 1;
			if(ct % 10 == 0) {
				f = f + 1;
				centerPoint = cv.Point(frame.cols / 2.0, frame.rows / 2.0);
				rotationMatrix = cv.getRotationMatrix2D(centerPoint, -theta, 0.75);
				let frameRot = frame.warpAffine(rotationMatrix);
				let imgRotFR = fr.CvImage(frameRot);
				let faceRects =  faceDetector.locateFaces(imgRotFR);
				let faceImages = faceRects
					.map(mmodRect => fr.toCvRect(mmodRect.rect))
					.map(cvRect => frameRot.getRegion(cvRect).copy());
				let saveName = saveDir + "/" + `face-${f}.png`;
				faceImages.forEach((faceImage, i) => cv.imwrite(saveName, faceImage.resize(targetSize,targetSize)));
			}
			let key = cv.waitKey(30);
		}
		console.log(`Done! ${f} frame extracted.`);
	}
	catch(error) {
		console.log("ERROR in " + clientAddress + ":" + error.message);
	}
}

/**
 * @function compareFaces
 * @description Compares the face embeddings of two people.
 * @param  {String}  imgDir1    - The directory containing the face image of the first person.
 * @param  {String}  imgDir2    - The directory containing the face image of the second person.
 * @return {Boolean} isSameFace - Either 1 (representing the same person) or 0 (representing different people).
 */
var compareFaces = function (imgDir1, imgDir2) {
	let isSameFace = 0;
	if(imgDir1 === imgDir2)
		return isSameFace;
	let vector1 = getImageDescriptors(imgDir1);
	let vector2 = getImageDescriptors(imgDir2);
	if(typeof vector1 !== "undefined" && typeof vector2 !== "undefined") {
		let diff = getEuclideanDistance(vector1, vector2);
		console.log(`EUCLIDEAN DISTANCE BETWEEN THE PAIR OF FACES = ${diff}`);
		if(diff < 0.55)
			isSameFace = 1;
		else
			isSameFace = 0;
		return isSameFace;
	}
	else {
		console.log("Did not detect a face in at least one video.");
		return undefined;
	}
}

/**
 * @function getImageDescriptors
 * @description Reads the image files in a directory and gets the face embeddings in the image files.
 * @param  {String} imgDir        - The directory containing the face images.
 * @return {Array}  faceEmbedding - A vector representing the face embedding of the person in the image.
 */
var getImageDescriptors = function (imgDir) {
	imgFile = fs.readdirSync(imgDir);
	// console.log(imgDir + "/" + imgFile);
	img = fr.loadImage(imgDir + "/" + imgFile);
	let faceEmbedding = faceRecognizer.getFaceDescriptors(img);
	return faceEmbedding;
}

/**
 * @function getEuclideanDistance
 * @description Computes the Euclidean Distance between two vectors.
 * @param  {Array}   faceEmbedding1    - The face embedding of the first person.
 * @param  {Array}   faceEmbedding2    - The face embedding of the second person.
 * @return {number}  euclideanDistance - The Eudlidean distance between the face embeddings.
 */
var getEuclideanDistance = function(faceEmbedding1, faceEmbedding2) {
	if (faceEmbedding1.length !== faceEmbedding2.length) {
		console.log("Lengths of the vectors are not same! Cannot continue");
		return undefined;
	}
	let euclideanDistance = 0;
	for(let i = 0 ; i < faceEmbedding1.length ; i++) {
		euclideanDistance = euclideanDistance + Math.pow(Math.abs(faceEmbedding1[i]-faceEmbedding2[i]), 2);
	}
	euclideanDistance = Math.sqrt(euclideanDistance);
	return euclideanDistance;
}

module.exports = {
	getFaceImages        : getFaceImages,
	compareFaces         : compareFaces,
	getImageDescriptors  : getImageDescriptors,
	getEuclideanDistance : getEuclideanDistance
};

/* Sample Usage:
const sybil        = require('path/to/sybil.js');
const allPeopleDir = "/home/darshi/Kuwa/people/";
var ClientAddress1 = "0xabc...";
var ClientAddress2 = "0xdef...";
sybil.getFaceImages(videoPath1, allPeopleDir + ClientAddress1, theta1);
sybil.getFaceImages(videoPath2, allPeopleDir + ClientAddress2, theta2);
var isSameFace = sybil.compareFaces(saveDir1, saveDir2);
*/


/*  Sample videos from Darshi - 
	0x128c7e547231e2e163eb5565c14b4eb50b8b4fb1
	0x1ddcd11dfac4f747ad239ab395c7c1c1da033fe6
	0x1e56bef97da6a1c9ab0991bb8bff09d30a9ca116
	0xff537dcb7ffdf8b9872c0e5a9b5bd127fd30d9fa
	0xcf1233ba661aa9185dd051da4d33d6f0513ac47c
	0x7202a44e73711683976c4110cec481d6fdef4fdc (partial occlusion)  */

/*  Sample videos from Carlos - 
	0xebaebde3a19a1a5112c8303317be912de8ce17d0
	0xe6682e6af35bd5f8cd379ebd05da1753f4ebdf32
	0xe7df5bca42a2b14f6c07780884de477e81d367cb
	0xd2b045d4bddb288812818848a1f56350ceb3146b
	0x8d1d89a80bc19b1aa59075cf35fa0e6f90a1261d
	0x6211ac07c1c13b72a74f4e62e2176e62f68d3bac (partial occlusion)
	0x66bd34d0a7e0d99540cfb1205ca1b05911451df9 (partial occlusion)
	0x346ac35dadb1c32862f1cda809a7d6c79c4f0ebd (face turned)  */

/*  Sample videos from Jim - 
	0xddaa1c6b5a7956496838e2ed9c7ca1bfaf7e712d
	0xdc3408b3ea7d706330cab4443916550e15d4bad4
	0x4185226374e7a41b6816e3c58f2d3277cf0f16bc
	0x316d817e1b09b6482e24b8536efa1ed74fb4462c
	0x66bd34d0a7e0d99540cfb1205ca1b05911451df9
	0x8a0a8ac6ce0c96129a8c58a37ed6c0333f04ecf5  */

/*  Sample videos from Rishi - 
	0x015619abe86b6695c6538523bcbdd9372daf435g  */

/*  Sample videos where there is no face(what to do in this case? Vote for Invalid?) - 
	0xd19348d3f9dfed87dcf1b1473db0b90bba3e92dc
	0xc7cfdfc52e3a846fdb84b918e399c998cfc0a9ad
	0xafa47f6a8954dbd99983d8384f93ee2aa09a479c
	0x990d7915ad08b105720fc6968a07236e9aa2b2e7
	0x21f0b03d6bb3a1599a48872ea7e05e7add6206b9  */

/*  Sample video from Gavin - 
	0x896eb7e2801f7c2ca75820fcb5db4004d912b3b0  */

/*  Sample video from Bill - 
	0x98cbe534f8b382c656e41315626dd2cc0df0bacf  */

/*  Sample videos where the face is not in the video for most of the time - 
	0xc42824bcfbaca8ccaeb544374e45d6ea28a237a8  */
