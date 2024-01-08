import { useEffect, useState } from "react";
import { Layer, Rect,Image, Stage } from "react-konva";
import useImage from 'use-image';
import PuzzlePiece from "./PuzzlePiece";

const PIECE_SIZE = 80;

export default function Puzzle({ imageUrl, imageSize }){
    const [image] = useImage(imageUrl);
    const [pieces, setPieces] = useState([]);
    const [puzzleSize, setPuzzleSize] = useState({ cols: 0, rows: 0 });

    useEffect(() => {
        ( () =>{
            if(image){   
                setPuzzleSize({
                    cols: 8,
                    rows: Math.floor(8 * image.height /image.width),
                });
                //setPieces(newPieces.sort(() => Math.random() - 0.5));
                
                console.log(image.width,image.height);
            }
        })();
    }, [image]);

    useEffect(() => {
        ( () => {
            const newPieces = [];
            for (let i = 0; i < puzzleSize.rows; i++) {
                for (let j = 0; j < puzzleSize.cols; j++) {
                    newPieces.push({
                    x: 10+j * image.width / puzzleSize.cols,
                    y: 10+i * image.height / puzzleSize.rows,
                    order: i * puzzleSize.cols + j,
                    originX: 10+j * image.width / puzzleSize.cols,
                    originY: 10+i * image.height / puzzleSize.rows,
                    cropX: j * image.width / puzzleSize.cols,
                    cropY: i * image.height / puzzleSize.rows,
                    cropW: image.width / puzzleSize.cols,
                    cropH: image.height / puzzleSize.rows,
                    });
                }
            }
            setPieces(newPieces);
            console.log(puzzleSize);
            console.log(newPieces);
        })();
    },[puzzleSize,image]);

    useEffect(() => {
        if(pieces.length >0){
        ( () => {
            console.log(pieces);
        })();
    }
    },[pieces]);


    return (
        <Stage width={puzzleSize.cols * PIECE_SIZE*2} height={puzzleSize.rows * PIECE_SIZE*1.5}>
            <Layer>
                <Rect stroke='black' strokeWidth={3} x={0} y={0} width={puzzleSize.cols * PIECE_SIZE*2} height={puzzleSize.rows * PIECE_SIZE*1.5}/>
                <Rect stroke='black' strokeWidth={3} x={7} y={7} width={puzzleSize.cols * PIECE_SIZE+3} height={puzzleSize.rows * PIECE_SIZE+3}/>
                {pieces.length > 0 && pieces.map((piece, index) => (
                    <PuzzlePiece key={index} image={image} piece={piece} />
                ))}
            </Layer>
        </Stage>
    );
}