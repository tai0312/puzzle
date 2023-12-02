import { useEffect, useState,useRef } from "react";

const pieceSize = 100;
let widthCnt = 0;
let lengthCnt = 0;

class Piece {
    constructor(image,outline,x,y){
        this.Image = image;
        this.Outline = outline;
        this.X = x;
        this.Y = y;
        this.OriginalW = Math.round(x/pieceSize);
        this.OriginalL = Math.round(y/pieceSize);
    }
    Draw(){
        canText.drawImage(this.Image,this.X,this.Y);
        canText.drawImage(this.Outline,this.X,this.Y);
    }
}


async function fetchData(){
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const image = await response.json();
    console.log(image);
    return image.message;
}



export default function App(){
    const [content,setContent] = useState({});
    const canRef = useRef(null);
    const imgRef = useRef(null);
    useEffect (() => {
        (async () =>{ 
            const newContent = await fetchData();
            console.log(newContent);
            setContent(newContent);
        })();
    },[]);
    return(
        <>
        <form onSubmit={(event)=>{
            event.preventDefault();
            const canField = canRef.current;
            const canContent = canField.getContext('2d');
            const imgContent = imgRef.current;

            canField.width = imgContent.width*2;
            canField.height = imgContent.height*2;

            let imgWidth = 600;
            let imgHeight=imgWidth*imgContent.height/imgContent.width;
            
            const myImg = new Image();
            myImg.src = imgContent.src;
            canContent.drawImage(myImg,0,0,imgWidth,imgHeight);
        }}>
            <p>
                <button type="submit" id="shuffle">シャッフル</button>
            </p>
            <canvas ref={canRef}></canvas>
            <div className="bufferImg">
                <img ref={imgRef} src={content}/>
            </div>
            
            
        </form>
        
        
        </>
    );
}