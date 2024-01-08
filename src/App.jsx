import { useEffect, useState,useRef } from "react";
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Layer, Rect,Image, Stage ,Path} from "react-konva";
import useImage from 'use-image';

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


const PIECE_SIZE = 80;

const PuzzlePiece = ({ image, piece }) => {
  const [position, setPosition] = useState({ x: piece.x, y: piece.y });

  const handleDragEnd = (e) => {
    const newPosition = e.target.getStage().getPointerPosition();
    console.log(newPosition.x,newPosition.y);
    setPosition({ x: newPosition.x - PIECE_SIZE / 2, y: newPosition.y - PIECE_SIZE / 2 });
  };
  

  return (
    <>
      <Image
        x={position.x}
        y={position.y}
        image={image}
        width={PIECE_SIZE}
        height={PIECE_SIZE}
        draggable
        onDragEnd={handleDragEnd}
      />
      <Rect
        x={position.x}
        y={position.y}
        width={PIECE_SIZE}
        height={PIECE_SIZE}
        stroke="black"
        strokeWidth={2}
      />
    </>
  );
};

const Puzzle = ({ imageUrl, imageSize }) => {
  const [image] = useImage(imageUrl);
  const [pieces, setPieces] = useState([]);
  const [puzzleSize, setPuzzleSize] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const newPieces = [];

    for (let i = 0; i < puzzleSize.rows; i++) {
      for (let j = 0; j < puzzleSize.cols; j++) {
        newPieces.push({
          x: 10+j * PIECE_SIZE,
          y: 10+i * PIECE_SIZE,
          order: i * puzzleSize.cols + j,
        });
      }
    }

    setPieces(newPieces.sort(() => Math.random() - 0.5));
  }, [imageUrl, puzzleSize]);

  useEffect(() => {
    if (image) {
      setPuzzleSize({
        cols: Math.floor(image.width / PIECE_SIZE),
        rows: Math.floor(image.height / PIECE_SIZE),
      });
    }
  }, [image]);

  return (
    <Stage width={puzzleSize.cols * PIECE_SIZE*2} height={puzzleSize.rows * PIECE_SIZE*1.5}>
      <Layer>
        <Rect stroke='black' strokeWidth={3} x={0} y={0} width={puzzleSize.cols * PIECE_SIZE*2} height={puzzleSize.rows * PIECE_SIZE*1.5}/>
        <Rect stroke='black' strokeWidth={3} x={10} y={10} width={puzzleSize.cols * PIECE_SIZE} height={puzzleSize.rows * PIECE_SIZE}/>
        {pieces.map((piece, index) => (
          <PuzzlePiece key={index} image={image} piece={piece} />
        ))}
      </Layer>
    </Stage>
  );
};


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
                  setImgSize({w: 640, h: 640*loadImg.height/loadImg.width});
                  setImg(loadImg);
                };
            };
            loadImage();
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