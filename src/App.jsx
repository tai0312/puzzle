import { useEffect, useState,useRef } from "react";
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Layer, Rect,Image, Stage } from "react-konva";

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
    const dogPictures = newContent.dog;
    const catPictures = newContent.cat;

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
    const [dogPictures,setDogPictures] = useState([]);
    const [catPictures,setCatPictures] = useState([]);
    const canRef = useRef(null);
    const imgRef = useRef(null);
    const [img, setImg] = useState(null);
    const [imgSize, setImgSize] = useState({w: 0, h: 0});

    useEffect (() => {
        (async () =>{ 
            const newContent = await fetchData();
            setDogPictures(newContent.dog);
            setCatPictures(newContent.cat);
            const loadImage = async () => {
                const src = newContent.dog[0];
                let loadImg = new window.Image();
                loadImg.src = src;
                loadImg.onload = () => {
                  setImgSize({w: loadImg.width, h: loadImg.height});
                  setImg(loadImg);
                };
            };
            loadImage();
            
            /*
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
            <Stage width={1200} height={800}>
                <Layer>
                    <Rect stroke='black' strokeWidth={1} x={0} y={0} width={imgSize.w} height={imgSize.h}/>
                    {img && <Image image ={img} width={600} height={600*imgSize.h/imgSize.w}/>}
                </Layer>
            </Stage>
            
            <div className="pictrures">
            <ImageList cols={2} gap={30}>
                {dogPictures.map((item) => (
                <ImageListItem key={item}>
                    <img
                    src={`${item}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                    />
                </ImageListItem>
                ))}
            </ImageList>
            </div>
        </form>
        
        
        </>
    );
}