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
    //const response = await fetch("https://dog.ceo/api/breeds/image/random");
    //const response = await fetch("https://api.thecatapi.com/v1/images/search");
    //const image = await response.json();
    //const image = await response.json();
    //console.log(image.message);
    //return image.message;
    const response = await fetch("https://splendorous-malabi-4516db.netlify.app/.netlify/functions/data");
    var data;
    if (response.ok) {
        data = await response.json();
        console.log(data);
    } else {
        console.error("Error: ", response.statusText);
    }
    return data;
}

async function getPicture(){
    const newContent = await fetchData();
    const myImg = new Image();
    myImg.src = newContent;
    myImg.onload = ()=>{
        const orgWidth = myImg.width;
        const orgHeight = myImg.height;
        console.log(myImg.Width,myImg.Height);
        myImg.width = 600;
        myImg.height = orgHeight * (myImg.width / orgWidth);
    } 
    return myImg;
}



export default function App(){
    const [content,setContent] = useState({});
    const canRef = useRef(null);
    const imgRef = useRef(null);

    useEffect (() => {
        (async () =>{ 
            const newContent = await fetchData();
            setContent(newContent);
            /*const myImg = await getPicture();
            setContent(myImg);
            const canField = canRef.current;
            const canContent = canField.getContext('2d');

            canField.width = myImg.width*2;
            canField.height = myImg.height*2;
            
            canContent.drawImage(myImg,0,0,myImg.Width,myImg.Height);*/
        })();
    },[]);
    return(
        <>
        <form onSubmit={async (event)=>{
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
            /*const myImg = await getPicture();
            const canField = canRef.current;
            const canContent = canField.getContext('2d');

            canField.width = myImg.width*2;
            canField.height = myImg.height*2;
            
            canContent.drawImage(myImg,0,0,myImg.Width,myImg.Height);*/
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