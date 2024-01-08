import { useEffect, useState } from "react";
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Puzzle from "./components/Puzzle";

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



export default function App(){
    const [dogPictures,setDogPictures] = useState([]);
    const [catPictures,setCatPictures] = useState([]);
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
                  setImgSize({w: 640, h: 640*loadImg.height/loadImg.width});
                  setImg(loadImg);
                };
            };
            loadImage();
            console.log(newContent.dog[0]);
        })();
    },[]);
    return(
        <>
        <form onSubmit={async (event)=>{
            event.preventDefault();
            
        }}>
            <p>
                <button type="submit" id="shuffle">シャッフル</button>
            </p>

            <Puzzle imageUrl={dogPictures[0]} imageSize={imgSize}/>
            
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