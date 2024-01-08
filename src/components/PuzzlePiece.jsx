import { useState,useEffect } from "react";
import { Layer, Rect,Image, Stage } from "react-konva";

export default function PuzzlePiece({ image, piece }){
    const [position, setPosition] = useState({ x: piece.x, y: piece.y });

    useEffect(() => {
        ( ()=>{
            console.log(image);
        })();
    },[]);

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
            onMouseDown={handleDragEnd}
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
}