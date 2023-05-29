import React, { useEffect, useState } from "react";
const electron = window.require("electron");
const { ipcRenderer } = electron;

const { COPIED_TEXT } = require("../utils/constants");

const ClipB = () => {

    //array of all the clipboard element that are copied
    const [copiedArr, setCopiedArr] = useState([]);

    //reacts event listener that detects change in setCopiedArr
    useEffect(() => {
        console.log(copiedArr)
    }, [copiedArr]);

    //recieves message from the main process
    ipcRenderer.on(COPIED_TEXT, (evt, message) => {

        setCopiedArr((prevVal) => {
            //checks if the last element is same as the message to prevent duplicacy
            if (prevVal[prevVal.length - 1] !== message) {
                return [...prevVal, message];
            }

            //return previous array if the message already pushed in the copiedArr
            return prevVal;
        });
    });


    return (<>
        <h1>hello</h1>
        <button type="submit">Start Service</button>
    </>)
}

export default ClipB;



// import React, { useEffect, useState } from "react";

// const { COPIED_TEXT } = require("../utils/constants");
// const electron = window.require("electron");
// const { ipcRenderer } = electron;

// const ClipB = () => {
//     const [copiedArr, setCopiedArr] = useState([]);

//     useEffect(() => {
//         const handleCopiedText = (evt, message) => {
//             if (copiedArr[copiedArr.length - 1] !== message) {
//                 setCopiedArr((prevVal) => [...prevVal, message]);
//                 console.log("hello");
//             }
//         };

//         ipcRenderer.on(COPIED_TEXT, handleCopiedText);

//         return () => {
//             ipcRenderer.removeListener(COPIED_TEXT, handleCopiedText);
//         };
//     }, [copiedArr]);

//     useEffect(() => {
//         console.log(copiedArr);
//     }, [copiedArr]);

//     return (
//         <>
//             <h1>hello</h1>
//             <button type="submit">Start Service</button>
//         </>
//     );
// };

// export default ClipB;
