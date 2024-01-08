import { useState,useEffect } from "react";
import { Layer, Rect,Image, Group } from "react-konva";

const PIECE_SIZE = 80;

export default function PuzzlePiece({ image, piece }){
    const [position, setPosition] = useState({ x: piece.x, y: piece.y });

    useEffect(() => {
        ( ()=>{
            console.log("pieces"+image);
            console.log("hello");
        })();
    },[]);

    const handleDragEnd = (e) => {
        const newPosition = e.target.getStage().getPointerPosition();
        console.log(newPosition.x,newPosition.y);
        setPosition({ x: newPosition.x - PIECE_SIZE / 2, y: newPosition.y - PIECE_SIZE / 2 });
    };

    
    return (
        <>
        <Group
        x={position.x}
        y={position.y}
        draggable
        onMouseDown={handleDragEnd}
        >
        <Image
            image={image}
            width={PIECE_SIZE}
            height={PIECE_SIZE}
            crop={{
                x: piece.cropX,
                y: piece.cropY,
                width: piece.cropW,
                height: piece.cropH,
            }}
        />
        <Rect
            width={PIECE_SIZE}
            height={PIECE_SIZE}
            stroke="black"
            strokeWidth={1}
        />
    </Group>
        </>
    );
}