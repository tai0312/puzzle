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
                console.log(image);
                const newPieces = [];
                if (image) {
                    setPuzzleSize({
                        cols: Math.floor(image.width / PIECE_SIZE),
                        rows: Math.floor(image.height / PIECE_SIZE),
                    });
                }
                
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
            }
        })();
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
}