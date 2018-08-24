This is a simple readme for the entire Kuwa Registrar module.

It consists of 3 parts:

1. The Watcher module, which watches a specified folder and performs sybil detection on new additions.
   It may use either of two methods, depending on which one is used for execution:
   a. File Hashing using sha256 - see the readme in the subdirectory fileHash for more info.
   b. Face recognition using face-recognition and opencv4nodejs - see the readme in the subdirectory faceRecognition for more info.

2. The backend module, which fetches data from a MySQL Database.

3. The frontend module, which takes the data served from the backend and displays it in a tabular fashion.

===========
How to run:
===========

First, select a the watcher you want to see in action and go to either `fileHash` or `faceRecognition` to run the respective watcher module.

Second, start the backend from the `backend` module.

Finally, start the frontend react app from the frontend module.

===========
Quickstart:
===========

For the registrar based on file hashing, run ./registrar_hash.sh.
For the registrar based on face recognition, run ./registrar_face.sh.
