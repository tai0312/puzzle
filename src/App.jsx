import { useEffect, useState,useRef } from "react";
/*
const pieceSize = 100;
let canField = document.getElementById('can');
let canText = canField.getContext('2d');
let widthCnt = 0;
let lengthCnt = 0;

class Piece {
    constructor(image,outline,x,y){
        this.Image = image;
        this.Outline = outline;
        this.X = x;
        this.Y = y;
        this.OriginalWidth = Math.round(x/pieceSize);
        this.OriginalLength = Math.round(y/pieceSize);
    }
    Draw(){
        canText.drawImage(this.Image,this.X,this.Y);
        canText.drawImage(this.Outline,this.X,this.Y);
    }
}
*/

async function fetchData(){
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const image = await response.json();
    return image.message;
}



export default function App(){
    const [content,setContent] = useState({});
    const canRef = useRef(null);
    useEffect (() => {
        (async () =>{ 
            const newContent = await fetchData();
            setContent(newContent);
        })();
    },[]);
    return(
        <>
        <form onSubmit={(event)=>{
            event.preventDefault();
            const canField = canRef.current.getContext('2d');
            canField.drawImage(content,0,0)
        }}>
            <p>
                <button type="submit" id="shuffle">シャッフル</button>
            </p>
            <canvas ref={canRef}></canvas>
            
        </form>
        <img src={content}/>
        
        </>
    );
}